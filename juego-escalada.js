/* ============================================================================
   juego-escalada.js · Juego de plataformas del escalador
   ----------------------------------------------------------------------------
   · Fase 3.4: cofres + esqueletos + cráneos + monedas + petróleo
   · Fase 3.5: sistema de pantallas + tipos + procedural al azar
   · Fase 3.6: menú inicio + instrucciones + game over con resumen + botones
   · Fase 3.6.1: murciélagos por tipo + águilas + ESC confirmar salida + altura acumulada
   · Caída: quita 1 vida SOLO al tocar suelo, si la caída > 90 m
   ============================================================================ */

(function juegoEscalada() {
  "use strict";

  if (window.__juegoEscaladaCargado) return;
  window.__juegoEscaladaCargado = true;

  // ---------- Configuración ----------
  const ANCHO = 600;
  const ALTO = 800;
  const GRAVEDAD = 0.6;
  const VELOCIDAD_SALTO = -14;
  const IMPULSO_DOBLE = -10;
  const FRICCION = 0.78;
  const ACELERACION = 1.4;
  const VELOCIDAD_MAX_X = 6;
  const VELOCIDAD_MAX_Y = 22;
  const PX_POR_METRO = 20;

  const STEVE_ANCHO = 26;
  const STEVE_ALTO = 42;

  const SUELO_Y = -40;
  const SUELO_ALTO = 40;
  const Y_SUELO_JUGABLE = SUELO_Y - STEVE_ALTO;
  const CAMARA_INICIAL = -ALTO + SUELO_ALTO;

  const VIDAS_INICIALES = 3;
  const VIDAS_MAX = 5;
  const FRAGMENTOS_POR_PANTALLA = 3;

  const UMBRAL_CAIDA_PX = 1800; // 90 m
  const METROS_FIN_PANTALLA = 220;

  const DECO_RANGO = 4600;
  const DECO_RANGO_OBJETO = 4200;
  const DECO_RANGO_PEQUENO = 4000;

  // ---------- Tipos de pantalla ----------
  const TIPOS_PANTALLA = {
    cueva: {
      id: 1, nombre: "Cueva",
      fondo: "#1a1410",
      fondo2: "#2e2620",
      suelo: "#4a3a30",
      sueloLuz: "#6a5545",
      presa: "#5a4a3e",
      presaLuz: "#8a7565",
      decoraciones: ["estalactita", "estalagmita", "musgo", "roca", "gota", "cofre", "esqueleto", "craneo", "moneda", "petroleo"],
      murcielagos: 25,
    },
    grieta: {
      id: 2, nombre: "Grieta",
      fondo: "#2a1f18",
      fondo2: "#3a2e26",
      suelo: "#5a4a3e",
      sueloLuz: "#8a7565",
      presa: "#6a5a4e",
      presaLuz: "#9a8575",
      decoraciones: ["estalactita", "musgo", "roca", "gota", "cristal", "grieta-luz", "craneo"],
      murcielagos: 15,
    },
    aire: {
      id: 3, nombre: "Aire libre",
      fondo: "#87CEEB",
      fondo2: "#5a9ec9",
      suelo: "#6a8a4a",
      sueloLuz: "#8aaa6a",
      presa: "#7a6a5a",
      presaLuz: "#aa9a8a",
      decoraciones: ["nube", "montana", "arbol", "pajaro", "aguila"],
      murcielagos: 0,
    },
    infinito: {
      id: 4, nombre: "Infinito",
      fondo: "#1a1410",
      fondo2: "#2e2620",
      suelo: "#4a3a30",
      sueloLuz: "#6a5545",
      presa: "#5a4a3e",
      presaLuz: "#8a7565",
      decoraciones: ["estalactita", "estalagmita", "musgo", "roca", "gota", "cofre", "esqueleto", "craneo", "moneda", "petroleo"],
      murcielagos: 25,
    },
  };

  const SECUENCIA_PANTALLAS = [
    "cueva",
    "cueva",
    "grieta",
    "grieta",
    "aire",
  ];

  function tipoDePantalla(numero) {
    if (numero <= SECUENCIA_PANTALLAS.length) {
      return SECUENCIA_PANTALLAS[numero - 1];
    }
    const tipos = ["cueva", "grieta", "aire", "infinito"];
    return tipos[Math.floor(Math.random() * tipos.length)];
  }

  function tipoActual() {
    return TIPOS_PANTALLA[estado.tipoPantalla] || TIPOS_PANTALLA.cueva;
  }

  // ---------- Conjuntos temáticos ----------
  const CONJUNTOS = [
    {
      nombre: "Python",
      trozos: ['def escalar():', '    subir_presa()', '    return "cima"'],
      resultado: "🏔 CIMA 🏔",
    },
    {
      nombre: "JavaScript",
      trozos: ['const subir = () => {', '  saltarPresa();', '};'],
      resultado: "🚀 ¡SALTADO! 🚀",
    },
    {
      nombre: "Git",
      trozos: ['git add .', 'git commit -m "vía"', 'git push'],
      resultado: "✅ COMMIT ✓",
    },
    {
      nombre: "SQL",
      trozos: ['SELECT * FROM', '  presas', 'WHERE altura > 100;'],
      resultado: "📊 10 RESULTADOS",
    },
    {
      nombre: "HTML",
      trozos: ['<div class="vía">', '  <presa/>', '</div>'],
      resultado: "🎨 VISTA ✓",
    },
  ];

  // ---------- Estado ----------
  const estado = {
    modo: "menu",              // "menu" | "instrucciones" | "jugando" | "gameover" | "confirmar-salida"
    modoAnterior: null,
    personaje: {
      x: ANCHO / 2 - STEVE_ANCHO / 2,
      y: Y_SUELO_JUGABLE,
      ancho: STEVE_ANCHO,
      alto: STEVE_ALTO,
      velX: 0,
      velY: 0,
      enSuelo: false,
      saltando: false,
      dobleSaltoDisponible: true,
      saltoSuelto: true,
      frame: "parado",
      mirandoDerecha: true,
      ultimaPlataforma: null,
      alturaMaximaVuelo: Y_SUELO_JUGABLE,
      dañoTiempo: 0,
    },
    plataformas: [],
    decoraciones: [],
    murcielagos: [],
    fragmentos: [],
    popups: [],
    popupGrande: null,
    conjuntoActual: null,
    teclas: { izquierda: false, derecha: false, salto: false },
    camara: {
      y: CAMARA_INICIAL,
      alturaMaxima: 0,
      record: 0,
    },
    vidas: VIDAS_INICIALES,
    fragmentosRecogidos: 0,
    fragmentosTotales: 0,
    pantalla: 1,
    tipoPantalla: "cueva",
    transicion: null,
    gameOver: false,
    bonusVidaDado: false,
  };

  // ---------- Plataformas ----------
  function crearPlataformas() {
    estado.tipoPantalla = tipoDePantalla(estado.pantalla);
    const plats = [];

    plats.push({ x: 0, y: SUELO_Y, ancho: ANCHO, alto: SUELO_ALTO, tipo: "suelo" });

    let y = -180;
    let xActual = 200;
    const TOTAL = 30;

    for (let i = 0; i < TOTAL; i++) {
      const progreso = i / TOTAL;
      const separacionY = 100 + Math.round(progreso * 80);
      const ancho = 200 - Math.round(progreso * 100);
      const alto = 24;

      const minX = 40;
      const maxX = ANCHO - ancho - 40;
      let nuevoX;
      if (xActual < ANCHO / 2) nuevoX = maxX - Math.random() * 100;
      else nuevoX = minX + Math.random() * 100;
      xActual = nuevoX;

      plats.push({ x: nuevoX, y, ancho, alto, tipo: "presa", tieneFragmento: false });
      y -= separacionY;
    }

    const candidatas = plats.filter((p) => p.tipo === "presa");
    const indicesElegidos = [];
    while (indicesElegidos.length < FRAGMENTOS_POR_PANTALLA && indicesElegidos.length < candidatas.length) {
      const idx = Math.floor(Math.random() * candidatas.length);
      if (!indicesElegidos.includes(idx)) indicesElegidos.push(idx);
    }

    estado.conjuntoActual = CONJUNTOS[Math.floor(Math.random() * CONJUNTOS.length)];

    indicesElegidos.forEach((idx, i) => {
      candidatas[idx].tieneFragmento = true;
      candidatas[idx].fraseCodigo = estado.conjuntoActual.trozos[i];
      candidatas[idx].indiceTrozo = i;
    });

    estado.plataformas = plats;

    estado.fragmentos = [];
    candidatas.forEach((plat) => {
      if (plat.tieneFragmento) {
        estado.fragmentos.push({
          x: plat.x + plat.ancho / 2,
          y: plat.y - 30,
          frase: plat.fraseCodigo,
          indiceTrozo: plat.indiceTrozo,
          plataforma: plat,
          recogido: false,
          tiempo: Math.random() * 6.28,
        });
      }
    });

    estado.fragmentosTotales = estado.fragmentos.length;
    estado.fragmentosRecogidos = 0;
    estado.bonusVidaDado = false;
  }

  // ---------- Decoraciones ----------
  function crearDecoraciones() {
    const tipo = tipoActual();
    const permitidas = tipo.decoraciones;
    const decor = [];

    function permitido(t) { return permitidas.indexOf(t) !== -1; }

    if (permitido("estalactita")) {
      for (let i = 0; i < 55; i++) {
        decor.push({
          tipo: "estalactita",
          x: Math.random() * ANCHO,
          y: -Math.random() * DECO_RANGO - 100,
          largo: 25 + Math.random() * 60,
          ancho: 10 + Math.random() * 14,
        });
      }
    }
    if (permitido("estalagmita")) {
      for (let i = 0; i < 30; i++) {
        decor.push({
          tipo: "estalagmita",
          x: Math.random() * ANCHO,
          y: -Math.random() * DECO_RANGO - 100,
          largo: 20 + Math.random() * 40,
          ancho: 8 + Math.random() * 12,
        });
      }
    }
    if (permitido("musgo")) {
      for (let i = 0; i < 45; i++) {
        decor.push({
          tipo: "musgo",
          x: Math.random() * ANCHO,
          y: -Math.random() * DECO_RANGO - 100,
          ancho: 40 + Math.random() * 60,
          alto: 20 + Math.random() * 30,
        });
      }
    }
    if (permitido("roca")) {
      for (let i = 0; i < 60; i++) {
        decor.push({
          tipo: "roca",
          x: Math.random() * ANCHO,
          y: -Math.random() * DECO_RANGO - 100,
          ancho: 12 + Math.random() * 20,
          alto: 10 + Math.random() * 16,
        });
      }
    }
    if (permitido("gota")) {
      for (let i = 0; i < 40; i++) {
        decor.push({
          tipo: "gota",
          x: Math.random() * ANCHO,
          y: -Math.random() * DECO_RANGO - 100,
          ancho: 3,
          alto: 6,
        });
      }
    }
    if (permitido("cofre")) {
      for (let i = 0; i < 14; i++) {
        decor.push({
          tipo: "cofre",
          x: 60 + Math.random() * (ANCHO - 120),
          y: -300 - Math.random() * DECO_RANGO_OBJETO,
          ancho: 34,
          alto: 22,
          abierto: Math.random() > 0.5,
          tiempo: Math.random() * 6.28,
        });
      }
    }
    if (permitido("esqueleto")) {
      for (let i = 0; i < 8; i++) {
        decor.push({
          tipo: "esqueleto",
          x: 80 + Math.random() * (ANCHO - 200),
          y: -400 - Math.random() * DECO_RANGO_PEQUENO,
          ancho: 90 + Math.random() * 40,
          alto: 50 + Math.random() * 20,
        });
      }
    }
    if (permitido("craneo")) {
      for (let i = 0; i < 18; i++) {
        decor.push({
          tipo: "craneo",
          x: 40 + Math.random() * (ANCHO - 80),
          y: -350 - Math.random() * DECO_RANGO_OBJETO,
          tam: 10 + Math.random() * 6,
        });
      }
    }
    if (permitido("moneda")) {
      for (let i = 0; i < 24; i++) {
        decor.push({
          tipo: "moneda",
          x: 40 + Math.random() * (ANCHO - 80),
          y: -300 - Math.random() * DECO_RANGO_OBJETO,
          tam: 6 + Math.random() * 4,
          tiempo: Math.random() * 6.28,
        });
      }
    }
    if (permitido("petroleo")) {
      for (let i = 0; i < 10; i++) {
        decor.push({
          tipo: "petroleo",
          x: 80 + Math.random() * (ANCHO - 160),
          y: -350 - Math.random() * DECO_RANGO_OBJETO,
          ancho: 60 + Math.random() * 80,
          alto: 14 + Math.random() * 10,
        });
      }
    }

    if (permitido("cristal")) {
      for (let i = 0; i < 32; i++) {
        decor.push({
          tipo: "cristal",
          x: Math.random() * ANCHO,
          y: -Math.random() * DECO_RANGO - 100,
          tam: 8 + Math.random() * 14,
          tiempo: Math.random() * 6.28,
        });
      }
    }
    if (permitido("grieta-luz")) {
      for (let i = 0; i < 22; i++) {
        decor.push({
          tipo: "grieta-luz",
          x: Math.random() * ANCHO,
          y: -Math.random() * DECO_RANGO - 100,
          largo: 40 + Math.random() * 80,
          ancho: 3 + Math.random() * 4,
        });
      }
    }

    if (permitido("nube")) {
      for (let i = 0; i < 28; i++) {
        decor.push({
          tipo: "nube",
          x: Math.random() * ANCHO,
          y: -Math.random() * DECO_RANGO - 100,
          ancho: 60 + Math.random() * 80,
          alto: 20 + Math.random() * 20,
          vel: 0.2 + Math.random() * 0.4,
        });
      }
    }
    if (permitido("montana")) {
      for (let i = 0; i < 16; i++) {
        decor.push({
          tipo: "montana",
          x: Math.random() * ANCHO,
          y: -Math.random() * DECO_RANGO - 100,
          ancho: 120 + Math.random() * 100,
          alto: 80 + Math.random() * 60,
        });
      }
    }
    if (permitido("arbol")) {
      for (let i = 0; i < 36; i++) {
        decor.push({
          tipo: "arbol",
          x: 20 + Math.random() * (ANCHO - 40),
          y: -Math.random() * DECO_RANGO - 100,
          alto: 40 + Math.random() * 40,
        });
      }
    }
    if (permitido("pajaro")) {
      for (let i = 0; i < 24; i++) {
        decor.push({
          tipo: "pajaro",
          x: Math.random() * ANCHO,
          y: -Math.random() * DECO_RANGO - 100,
          tiempo: Math.random() * 10,
        });
      }
    }
    if (permitido("aguila")) {
      for (let i = 0; i < 6; i++) {
        decor.push({
          tipo: "aguila",
          x: Math.random() * ANCHO,
          y: -Math.random() * DECO_RANGO - 100,
          tam: 22 + Math.random() * 8,
          vel: 0.15 + Math.random() * 0.2,
          tiempo: Math.random() * 10,
        });
      }
    }

    estado.decoraciones = decor;
  }

  // ---------- Murciélagos (solo si el tipo los permite) ----------
  function crearMurcielagos() {
    const tipo = tipoActual();
    const cantidad = tipo.murcielagos || 0;
    const bats = [];
    for (let i = 0; i < cantidad; i++) {
      bats.push({
        x: 40 + Math.random() * (ANCHO - 80),
        y: -200 - i * 90 - Math.random() * 60,
        despierto: 0,
        mirandoDerecha: Math.random() > 0.5,
        tiempo: Math.random() * 10,
      });
    }
    estado.murcielagos = bats;
  }

  // ---------- Récord ----------
  function cargarRecord() {
    try {
      const g = localStorage.getItem("je-record");
      if (g) estado.camara.record = parseInt(g, 10) || 0;
    } catch (e) {}
  }
  function guardarRecord() {
    try { localStorage.setItem("je-record", estado.camara.record); } catch (e) {}
  }

  // ---------- DOM ----------
  const contenedor = document.createElement("div");
  contenedor.className = "juego-escalada";
  contenedor.innerHTML = `
    <div class="juego-escalada__info">
      <span>Altura: <strong id="je-altura">0</strong> m</span>
      <span>Fragmentos: <strong id="je-frags">0/0</strong></span>
      <span>Vidas: <strong id="je-vidas">♥♥♥</strong></span>
      <span>Récord: <strong id="je-record">0</strong> m</span>
    </div>
    <canvas class="juego-escalada__canvas" width="${ANCHO}" height="${ALTO}"></canvas>
    <div class="juego-escalada__controles">
      <button class="juego-escalada__btn" data-accion="izquierda" aria-label="Izquierda">←</button>
      <button class="juego-escalada__btn" data-accion="salto" aria-label="Saltar">↑</button>
      <button class="juego-escalada__btn" data-accion="derecha" aria-label="Derecha">→</button>
    </div>
  `;
  document.body.appendChild(contenedor);

  const canvas = contenedor.querySelector(".juego-escalada__canvas");
  const ctx = canvas.getContext("2d");
  const elAltura = contenedor.querySelector("#je-altura");
  const elFrags = contenedor.querySelector("#je-frags");
  const elVidas = contenedor.querySelector("#je-vidas");
  const elRecord = contenedor.querySelector("#je-record");

  // ---------- Teclado ----------
  document.addEventListener("keydown", (e) => {
    // Menú
    if (estado.modo === "menu") {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        iniciarPartidaDesdeMenu();
      } else if (e.key === "i" || e.key === "I") {
        e.preventDefault();
        estado.modo = "instrucciones";
      }
      return;
    }
    // Instrucciones
    if (estado.modo === "instrucciones") {
      if (e.key === "Enter" || e.key === " " || e.key === "Escape") {
        e.preventDefault();
        estado.modo = "menu";
      }
      return;
    }
    // Game Over
    if (estado.modo === "gameover") {
      if (e.key === "Enter") {
        e.preventDefault();
        iniciarPartidaDesdeMenu();
      } else if (e.key === "Escape") {
        e.preventDefault();
        estado.modo = "menu";
      }
      return;
    }
    // Confirmar salida
    if (estado.modo === "confirmar-salida") {
      if (e.key === "Enter" || e.key === "s" || e.key === "S" || e.key === "y" || e.key === "Y") {
        e.preventDefault();
        salirAlMenu();
      } else if (e.key === "Escape" || e.key === "n" || e.key === "N") {
        e.preventDefault();
        cancelarSalida();
      }
      return;
    }
    // Jugando
    if (e.key === "Escape") {
      e.preventDefault();
      pedirConfirmacionSalida();
      return;
    }
    if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") { estado.teclas.izquierda = true; e.preventDefault(); }
    if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") { estado.teclas.derecha = true; e.preventDefault(); }
    if (e.key === " " || e.key === "ArrowUp" || e.key === "w" || e.key === "W") { estado.teclas.salto = true; e.preventDefault(); }
  });
  document.addEventListener("keyup", (e) => {
    if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") estado.teclas.izquierda = false;
    if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") estado.teclas.derecha = false;
    if (e.key === " " || e.key === "ArrowUp" || e.key === "w" || e.key === "W") {
      estado.teclas.salto = false;
      estado.personaje.saltoSuelto = true;
    }
  });

  // ---------- Botones táctiles ----------
  contenedor.querySelectorAll(".juego-escalada__btn").forEach((btn) => {
    const accion = btn.dataset.accion;
    const activar = (e) => {
      e.preventDefault();
      if (accion === "izquierda") estado.teclas.izquierda = true;
      if (accion === "derecha") estado.teclas.derecha = true;
      if (accion === "salto") estado.teclas.salto = true;
    };
    const desactivar = (e) => {
      e.preventDefault();
      if (accion === "izquierda") estado.teclas.izquierda = false;
      if (accion === "derecha") estado.teclas.derecha = false;
      if (accion === "salto") { estado.teclas.salto = false; estado.personaje.saltoSuelto = true; }
    };
    btn.addEventListener("pointerdown", activar);
    btn.addEventListener("pointerup", desactivar);
    btn.addEventListener("pointerleave", desactivar);
    btn.addEventListener("pointercancel", desactivar);
  });

  // ---------- Clicks en canvas ----------
  canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const escalaX = ANCHO / rect.width;
    const escalaY = ALTO / rect.height;
    const mx = (e.clientX - rect.left) * escalaX;
    const my = (e.clientY - rect.top) * escalaY;

    function dentro(btn) {
      if (!btn) return false;
      return mx >= btn.x && mx <= btn.x + btn.w &&
             my >= btn.y && my <= btn.y + btn.h;
    }

    if (estado.modo === "menu") {
      if (dentro(estado._btnEmpezar)) {
        iniciarPartidaDesdeMenu();
      } else if (dentro(estado._btnInstrucciones)) {
        estado.modo = "instrucciones";
      }
    } else if (estado.modo === "gameover") {
      if (dentro(estado._btnReintentar)) {
        iniciarPartidaDesdeMenu();
      } else if (dentro(estado._btnMenu)) {
        estado.modo = "menu";
      }
    } else if (estado.modo === "confirmar-salida") {
      if (dentro(estado._btnSiSalir)) {
        salirAlMenu();
      } else if (dentro(estado._btnNoSalir)) {
        cancelarSalida();
      }
    }
  });

  // ---------- Confirmar salida ----------
  function pedirConfirmacionSalida() {
    if (estado.modo !== "jugando") return;
    estado.modoAnterior = estado.modo;
    estado.modo = "confirmar-salida";
    // soltar teclas para que no se quede corriendo al volver
    estado.teclas.izquierda = false;
    estado.teclas.derecha = false;
    estado.teclas.salto = false;
  }

  function cancelarSalida() {
    estado.modo = estado.modoAnterior || "jugando";
    estado.modoAnterior = null;
  }

  function salirAlMenu() {
    estado.modo = "menu";
    estado.modoAnterior = null;
    estado.gameOver = false;
    // Reset del personaje para que la próxima partida empiece limpia
    const p = estado.personaje;
    p.x = ANCHO / 2 - STEVE_ANCHO / 2;
    p.y = Y_SUELO_JUGABLE;
    p.velX = 0;
    p.velY = 0;
    p.enSuelo = false;
    p.saltando = false;
    p.dobleSaltoDisponible = true;
    p.saltoSuelto = true;
    p.frame = "parado";
    p.alturaMaximaVuelo = Y_SUELO_JUGABLE;
    p.dañoTiempo = 0;
    estado.camara.y = CAMARA_INICIAL;
  }

  // ---------- Respawn ----------
  function respawn() {
    const p = estado.personaje;

    if (estado.vidas <= 0) {
      estado.gameOver = true;
      estado.modo = "gameover";
      return;
    }

    let respawnPlat = null;
    let mejorDist = Infinity;
    for (const plat of estado.plataformas) {
      if (plat.tipo !== "presa") continue;
      if (plat.y >= p.y) continue;
      const dist = p.y - plat.y;
      if (dist < mejorDist) { mejorDist = dist; respawnPlat = plat; }
    }

    if (respawnPlat) {
      p.x = respawnPlat.x + respawnPlat.ancho / 2 - p.ancho / 2;
      p.y = respawnPlat.y - p.alto - 2;
    } else {
      p.x = ANCHO / 2 - p.ancho / 2;
      p.y = Y_SUELO_JUGABLE;
    }

    p.velX = 0;
    p.velY = 0;
    p.saltando = false;
    p.dobleSaltoDisponible = true;
    p.saltoSuelto = true;
    p.frame = "parado";
    p.alturaMaximaVuelo = p.y;
  }

  // ---------- Transición de pantalla ----------
  function iniciarTransicion() {
    estado.transicion = {
      tiempo: 0,
      duracion: 120,
      tipo: estado.tipoPantalla,
    };

    estado.pantalla++;
    estado.tipoPantalla = tipoDePantalla(estado.pantalla);

    crearPlataformas();
    crearDecoraciones();
    crearMurcielagos();

    const p = estado.personaje;
    p.x = ANCHO / 2 - STEVE_ANCHO / 2;
    p.y = Y_SUELO_JUGABLE;
    p.velX = 0;
    p.velY = 0;
    p.alturaMaximaVuelo = p.y;
    p.enSuelo = false;
    p.saltando = false;
    p.dobleSaltoDisponible = true;
    p.saltoSuelto = true;

    estado.camara.y = CAMARA_INICIAL;
  }

  function actualizarTransicion() {
    if (estado.modo !== "jugando") return false;
    if (!estado.transicion) return false;
    estado.transicion.tiempo++;
    if (estado.transicion.tiempo > estado.transicion.duracion) {
      estado.transicion = null;
      return false;
    }
    return true;
  }

  function dibujarTransicion() {
    const tr = estado.transicion;
    if (!tr) return;

    const mitad = tr.duracion / 2;
    let alpha;
    if (tr.tiempo < mitad) {
      alpha = tr.tiempo / mitad;
    } else {
      alpha = (tr.duracion - tr.tiempo) / mitad;
    }

    ctx.fillStyle = "rgba(0, 0, 0, " + alpha + ")";
    ctx.fillRect(0, 0, ANCHO, ALTO);

    ctx.fillStyle = "rgba(255, 255, 255, " + alpha + ")";
    ctx.font = "bold 36px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const tipo = TIPOS_PANTALLA[estado.tipoPantalla] || TIPOS_PANTALLA.cueva;
    ctx.fillText("PANTALLA " + estado.pantalla + " · " + tipo.nombre, ANCHO / 2, ALTO / 2);
    ctx.textAlign = "start";
    ctx.textBaseline = "alphabetic";
  }

  // ---------- Iniciar partida desde menú ----------
  function iniciarPartidaDesdeMenu() {
    estado.modo = "jugando";
    reiniciarPartida();
  }

  // ---------- Reiniciar partida ----------
  function reiniciarPartida() {
    estado.modo = "jugando";
    estado.vidas = VIDAS_INICIALES;
    estado.fragmentosRecogidos = 0;
    estado.gameOver = false;
    estado.bonusVidaDado = false;
    estado.camara.y = CAMARA_INICIAL;
    estado.camara.alturaMaxima = 0;
    estado.pantalla = 1;
    estado.tipoPantalla = "cueva";
    estado.transicion = null;
    estado.popups = [];
    estado.popupGrande = null;

    const p = estado.personaje;
    p.x = ANCHO / 2 - STEVE_ANCHO / 2;
    p.y = Y_SUELO_JUGABLE;
    p.velX = 0;
    p.velY = 0;
    p.enSuelo = false;
    p.saltando = false;
    p.dobleSaltoDisponible = true;
    p.saltoSuelto = true;
    p.frame = "parado";
    p.alturaMaximaVuelo = Y_SUELO_JUGABLE;
    p.dañoTiempo = 0;

    crearPlataformas();
    crearDecoraciones();
    crearMurcielagos();
  }

  // ---------- Colisiones ----------
  function colisiona(a, b) {
    return (
      a.x + a.ancho > b.x &&
      a.x < b.x + b.ancho &&
      a.y + a.alto > b.y &&
      a.y < b.y + b.alto
    );
  }

  function moverConColisiones(p, dx, dy) {
    p.x += dx;
    for (const plat of estado.plataformas) {
      if (colisiona(p, plat)) {
        if (dx > 0) p.x = plat.x - p.ancho;
        else if (dx < 0) p.x = plat.x + plat.ancho;
        p.velX = 0;
      }
    }

    p.y += dy;
    let aterrizo = false;
    let plataformaTocada = null;
    for (const plat of estado.plataformas) {
      if (colisiona(p, plat)) {
        if (dy > 0) {
          p.y = plat.y - p.alto;
          aterrizo = true;
          plataformaTocada = plat;
        } else if (dy < 0) {
          p.y = plat.y + plat.alto;
        }
        p.velY = 0;
      }
    }

    if (plataformaTocada) p.ultimaPlataforma = plataformaTocada;

    return aterrizo;
  }

  // ---------- Recoger fragmentos ----------
  function comprobarFragmentos() {
    const p = estado.personaje;
    for (const frag of estado.fragmentos) {
      if (frag.recogido) continue;
      const dx = Math.abs((p.x + p.ancho / 2) - frag.x);
      const dy = Math.abs((p.y + p.alto / 2) - frag.y);
      if (dx < 30 && dy < 30) {
        frag.recogido = true;
        estado.fragmentosRecogidos++;

        estado.popups.push({
          x: frag.x,
          y: frag.y,
          texto: frag.frase,
          tiempo: 0,
          duracion: 80,
          tipo: "fragmento",
        });

        if (estado.fragmentosRecogidos >= estado.fragmentosTotales) {
          estado.popupGrande = {
            tiempo: 0,
            duracion: 180,
            conjunto: estado.conjuntoActual,
          };
        }
      }
    }

    if (estado.fragmentosRecogidos >= estado.fragmentosTotales && !estado.bonusVidaDado) {
      estado.bonusVidaDado = true;
      if (estado.vidas < VIDAS_MAX) {
        estado.vidas++;
        estado.popups.push({
          x: p.x + p.ancho / 2,
          y: p.y,
          texto: "+1 VIDA",
          tiempo: 0,
          duracion: 220,
          tipo: "vida",
        });
      }
    }
  }

  // ---------- Detección de caída ----------
  function comprobarCaida() {
    const p = estado.personaje;

    if (!p.enSuelo) {
      if (p.velY <= 0 && p.y < p.alturaMaximaVuelo) {
        p.alturaMaximaVuelo = p.y;
      }
      return;
    }

    const caida = p.y - p.alturaMaximaVuelo;

    if (caida > UMBRAL_CAIDA_PX && estado.vidas > 0) {
      estado.vidas--;
      p.dañoTiempo = 30;

      if (estado.vidas <= 0) {
        estado.gameOver = true;
        estado.modo = "gameover";
        return;
      }
    }

    p.alturaMaximaVuelo = p.y;
  }

  // ---------- Física ----------
  function actualizarFisica() {
    const p = estado.personaje;
    if (estado.modo !== "jugando") return;
    if (estado.gameOver) return;
    if (actualizarTransicion()) return;

    if (p.dañoTiempo > 0) p.dañoTiempo--;

    if (estado.teclas.izquierda) { p.velX -= ACELERACION; p.mirandoDerecha = false; }
    if (estado.teclas.derecha)   { p.velX += ACELERACION; p.mirandoDerecha = true; }
    if (!estado.teclas.izquierda && !estado.teclas.derecha) p.velX *= FRICCION;
    p.velX = Math.max(-VELOCIDAD_MAX_X, Math.min(VELOCIDAD_MAX_X, p.velX));

    if (estado.teclas.salto && p.saltoSuelto && p.enSuelo) {
      p.velY = VELOCIDAD_SALTO;
      p.enSuelo = false;
      p.saltando = true;
      p.saltoSuelto = false;
      p.dobleSaltoDisponible = true;
      p.alturaMaximaVuelo = p.y;
    } else if (estado.teclas.salto && p.saltoSuelto && !p.enSuelo && p.dobleSaltoDisponible) {
      p.velY = Math.min(p.velY, 0) + IMPULSO_DOBLE;
      p.saltando = true;
      p.saltoSuelto = false;
      p.dobleSaltoDisponible = false;
      p.alturaMaximaVuelo = p.y;
    }

    p.velY += GRAVEDAD;
    p.velY = Math.max(-VELOCIDAD_MAX_Y, Math.min(VELOCIDAD_MAX_Y, p.velY));

    const pasos = Math.max(1, Math.ceil(Math.max(Math.abs(p.velX), Math.abs(p.velY)) / 2));
    let aterrizo = false;
    for (let i = 0; i < pasos; i++) {
      if (moverConColisiones(p, p.velX / pasos, p.velY / pasos)) aterrizo = true;
      if (p.velX === 0 && p.velY === 0) break;
    }
    p.enSuelo = aterrizo;
    if (aterrizo) { p.saltando = false; p.dobleSaltoDisponible = true; }

    if (p.saltando || !p.enSuelo) p.frame = "saltando";
    else if (Math.abs(p.velX) > 0.5) p.frame = "corriendo";
    else p.frame = "parado";

    if (p.x < 0) { p.x = 0; p.velX = 0; }
    if (p.x + p.ancho > ANCHO) { p.x = ANCHO - p.ancho; p.velX = 0; }

    comprobarFragmentos();
    comprobarCaida();

    const objetivo = p.y - ALTO * 0.4;
    estado.camara.y += (objetivo - estado.camara.y) * 0.15;
    if (estado.camara.y > CAMARA_INICIAL) estado.camara.y = CAMARA_INICIAL;

    // Altura en pantalla actual (para saber cuándo pasar)
    const alturaEnPantalla = Math.max(0, Math.round((Y_SUELO_JUGABLE - p.y) / PX_POR_METRO));
    if (alturaEnPantalla >= METROS_FIN_PANTALLA) {
      iniciarTransicion();
      return;
    }

    // Altura ACUMULADA (para el HUD y el récord)
    const altura = (estado.pantalla - 1) * METROS_FIN_PANTALLA + alturaEnPantalla;
    if (altura > estado.camara.alturaMaxima) estado.camara.alturaMaxima = altura;
    if (altura > estado.camara.record) { estado.camara.record = altura; guardarRecord(); }

    for (const bat of estado.murcielagos) {
      const dist = Math.abs(bat.y - p.y) + Math.abs(bat.x - p.x) * 0.5;
      if (dist < 120) bat.despierto = Math.min(1, bat.despierto + 0.15);
      else bat.despierto = Math.max(0, bat.despierto - 0.05);
      bat.tiempo += 0.1;
    }

    elAltura.textContent = altura + " m · P" + estado.pantalla;
    elFrags.textContent = estado.fragmentosRecogidos + "/" + estado.fragmentosTotales;
    let corazones = "";
    for (let i = 0; i < estado.vidas; i++) {
      if (estado.vidas === 1) corazones += "❤";
      else corazones += "♥";
    }
    elVidas.innerHTML = estado.vidas === 1
      ? '<span style="color:#ff4444">' + corazones + '</span>'
      : corazones;
    elRecord.textContent = estado.camara.record;
  }

  // ---------- Steve ----------
  function dibujarSteve(x, y, frame, mirando, daño) {
    const piel = daño > 0 && Math.floor(daño / 4) % 2 === 0 ? "#ff8888" : "#C9A27E";
    const pelo = "#5A3A1E";
    const camiseta = daño > 0 && Math.floor(daño / 4) % 2 === 0 ? "#ff6666" : "#24A0A0";
    const pantalon = "#3A4A7A";
    const bota = "#3A2E1E";
    const ojo = "#1a1a1a";
    const cont = "#1a1a1a";

    ctx.save();
    if (!mirando) {
      ctx.translate(x + 26, y);
      ctx.scale(-1, 1);
      x = 0; y = 0;
    }

    ctx.fillStyle = cont;
    ctx.fillRect(x - 1, y - 1, 28, 44);

    ctx.fillStyle = piel;
    ctx.fillRect(x, y, 26, 16);
    ctx.fillStyle = pelo;
    ctx.fillRect(x, y, 26, 5);
    ctx.fillRect(x, y + 5, 3, 4);
    ctx.fillRect(x + 23, y + 5, 3, 4);
    ctx.fillStyle = ojo;
    ctx.fillRect(x + 6, y + 8, 3, 3);
    ctx.fillRect(x + 17, y + 8, 3, 3);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(x + 7, y + 9, 1, 1);
    ctx.fillRect(x + 18, y + 9, 1, 1);
    ctx.fillStyle = ojo;
    ctx.fillRect(x + 10, y + 12, 6, 1);

    ctx.fillStyle = cont;
    ctx.fillRect(x + 4, y + 16, 18, 14);
    ctx.fillStyle = camiseta;
    ctx.fillRect(x + 5, y + 16, 16, 13);

    ctx.fillStyle = cont;
    if (frame === "parado") {
      ctx.fillRect(x + 1, y + 17, 3, 11);
      ctx.fillRect(x + 22, y + 17, 3, 11);
      ctx.fillStyle = piel;
      ctx.fillRect(x + 1, y + 17, 3, 9);
      ctx.fillRect(x + 22, y + 17, 3, 9);
    } else if (frame === "corriendo") {
      ctx.fillRect(x + 1, y + 14, 3, 11);
      ctx.fillRect(x + 22, y + 20, 3, 11);
      ctx.fillStyle = piel;
      ctx.fillRect(x + 1, y + 14, 3, 9);
      ctx.fillRect(x + 22, y + 20, 3, 9);
    } else {
      ctx.fillRect(x - 1, y + 8, 3, 13);
      ctx.fillRect(x + 24, y + 8, 3, 13);
      ctx.fillStyle = piel;
      ctx.fillRect(x - 1, y + 8, 3, 11);
      ctx.fillRect(x + 24, y + 8, 3, 11);
    }

    ctx.fillStyle = cont;
    if (frame === "parado") {
      ctx.fillRect(x + 5, y + 30, 7, 11);
      ctx.fillRect(x + 14, y + 30, 7, 11);
      ctx.fillStyle = pantalon;
      ctx.fillRect(x + 6, y + 30, 5, 9);
      ctx.fillRect(x + 15, y + 30, 5, 9);
      ctx.fillStyle = bota;
      ctx.fillRect(x + 6, y + 39, 6, 2);
      ctx.fillRect(x + 14, y + 39, 6, 2);
    } else if (frame === "corriendo") {
      ctx.fillRect(x + 4, y + 30, 7, 11);
      ctx.fillRect(x + 15, y + 30, 7, 11);
      ctx.fillStyle = pantalon;
      ctx.fillRect(x + 5, y + 30, 5, 9);
      ctx.fillRect(x + 16, y + 30, 5, 9);
      ctx.fillStyle = bota;
      ctx.fillRect(x + 4, y + 39, 6, 2);
      ctx.fillRect(x + 16, y + 39, 6, 2);
    } else {
      ctx.fillRect(x + 6, y + 30, 6, 11);
      ctx.fillRect(x + 14, y + 30, 6, 11);
      ctx.fillStyle = pantalon;
      ctx.fillRect(x + 7, y + 30, 4, 9);
      ctx.fillRect(x + 15, y + 30, 4, 9);
      ctx.fillStyle = bota;
      ctx.fillRect(x + 7, y + 39, 5, 2);
      ctx.fillRect(x + 15, y + 39, 5, 2);
    }

    ctx.restore();
  }

  // ---------- Murciélago ----------
  function dibujarMurcielago(bat, x, y) {
    const cuerpo = "#1a1a1a";
    const ala = "#0a0a0a";
    const brillo = bat.despierto;
    const aleteo = bat.despierto > 0.5 ? Math.sin(bat.tiempo * 4) * 1.5 : 0;

    ctx.fillStyle = ala;
    ctx.fillRect(x - 3, y + 8 + aleteo, 8, 10);
    ctx.fillRect(x + 15, y + 8 - aleteo, 8, 10);

    ctx.fillStyle = cuerpo;
    ctx.fillRect(x + 5, y + 6, 10, 12);
    ctx.fillRect(x + 3, y + 3, 4, 5);
    ctx.fillRect(x + 13, y + 3, 4, 5);

    const ojoColor = bat.despierto > 0.1
      ? "rgba(255, " + (100 + Math.round(80 * brillo)) + ", 50, " + (0.3 + brillo * 0.7) + ")"
      : "#3a1a1a";
    ctx.fillStyle = ojoColor;
    ctx.fillRect(x + 7, y + 9, 2, 2);
    ctx.fillRect(x + 11, y + 9, 2, 2);

    if (brillo > 0.5) {
      ctx.fillStyle = "rgba(255, 150, 50, " + ((brillo - 0.5) * 0.6) + ")";
      ctx.fillRect(x + 6, y + 8, 4, 4);
      ctx.fillRect(x + 10, y + 8, 4, 4);
    }

    ctx.fillStyle = cuerpo;
    ctx.fillRect(x + 9, y + 18, 2, 3);
  }

  // ---------- Fragmento ----------
  function dibujarFragmento(frag) {
    if (frag.recogido) return;
    const fx = frag.x;
    const fy = frag.y - estado.camara.y;

    const flote = Math.sin(frag.tiempo) * 3;
    const y = fy + flote;

    ctx.fillStyle = "rgba(120, 200, 255, " + (0.3 + Math.sin(frag.tiempo * 2) * 0.1) + ")";
    ctx.beginPath();
    ctx.arc(fx, y, 22, 0, Math.PI * 2);
    ctx.fill();

    const ancho = 16;
    const alto = 16;
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(fx - ancho / 2 - 1, y - alto / 2 - 1, ancho + 2, alto + 2);
    ctx.fillStyle = "#3a6ea5";
    ctx.fillRect(fx - ancho / 2, y - alto / 2, ancho, alto);
    ctx.fillStyle = "#5a8ec5";
    ctx.fillRect(fx - ancho / 2 + 1, y - alto / 2 + 1, ancho - 2, 2);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 10px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("</>", fx, y + 1);
    ctx.textAlign = "start";
    ctx.textBaseline = "alphabetic";
  }

  // ---------- Popups pequeños ----------
  function dibujarPopups() {
    for (let i = estado.popups.length - 1; i >= 0; i--) {
      const pop = estado.popups[i];
      pop.tiempo++;
      pop.y -= 0.4;

      if (pop.tiempo > pop.duracion) {
        estado.popups.splice(i, 1);
        continue;
      }

      const restante = pop.duracion - pop.tiempo;
      let alpha = 1;
      if (restante < 30) alpha = Math.sin(pop.tiempo * 0.5) * 0.5 + 0.5;
      if (pop.tiempo < 10) alpha = pop.tiempo / 10;

      const py = pop.y - estado.camara.y;
      const px = pop.x;

      const color = pop.tipo === "vida" ? "rgba(102,255,102," : "rgba(120,200,255,";

      ctx.fillStyle = "rgba(10, 20, 40, " + (alpha * 0.9) + ")";
      ctx.fillRect(px - 70, py - 14, 140, 28);
      ctx.strokeStyle = color + alpha + ")";
      ctx.lineWidth = 2;
      ctx.strokeRect(px - 70, py - 14, 140, 28);

      ctx.fillStyle = pop.tipo === "vida"
        ? "rgba(102, 255, 102, " + alpha + ")"
        : "rgba(180, 220, 255, " + alpha + ")";
      ctx.font = "bold 13px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(pop.texto, px, py + 1);
      ctx.textAlign = "start";
      ctx.textBaseline = "alphabetic";
    }
  }

  // ---------- Popup GRANDE ----------
  function dibujarPopupGrande() {
    const pg = estado.popupGrande;
    if (!pg) return;

    pg.tiempo++;
    if (pg.tiempo > pg.duracion) {
      estado.popupGrande = null;
      return;
    }

    const duracion = pg.duracion;
    const t = pg.tiempo;

    let alpha = 1;
    if (t < 20) alpha = t / 20;
    if (t > duracion - 30) alpha = (duracion - t) / 30;

    const anchoPanel = 520;
    const altoPanel = 280;
    const px = (ANCHO - anchoPanel) / 2;
    const py = (ALTO - altoPanel) / 2;

    ctx.fillStyle = "rgba(0, 0, 0, " + (alpha * 0.9) + ")";
    ctx.fillRect(0, 0, ANCHO, ALTO);

    ctx.fillStyle = "rgba(20, 30, 50, " + alpha + ")";
    ctx.fillRect(px, py, anchoPanel, altoPanel);
    ctx.strokeStyle = "rgba(120, 200, 255, " + alpha + ")";
    ctx.lineWidth = 4;
    ctx.strokeRect(px, py, anchoPanel, altoPanel);

    ctx.fillStyle = "rgba(255, 230, 100, " + alpha + ")";
    ctx.font = "bold 22px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("¡FRAGMENTOS COMPLETOS!", ANCHO / 2, py + 40);

    ctx.fillStyle = "rgba(180, 220, 255, " + alpha + ")";
    ctx.font = "16px monospace";
    for (let i = 0; i < pg.conjunto.trozos.length; i++) {
      ctx.fillText(pg.conjunto.trozos[i], ANCHO / 2, py + 100 + i * 26);
    }

    const parpadeo = Math.sin(t * 0.3) * 0.5 + 0.5;
    ctx.fillStyle = "rgba(255, 255, 100, " + (alpha * (0.5 + parpadeo * 0.5)) + ")";
    ctx.font = "bold 26px monospace";
    ctx.fillText(pg.conjunto.resultado, ANCHO / 2, py + altoPanel - 40);

    ctx.textAlign = "start";
    ctx.textBaseline = "alphabetic";
  }

  // ---------- Fondo ----------
  function dibujarFondo() {
    const tipo = tipoActual();

    ctx.fillStyle = tipo.fondo;
    ctx.fillRect(0, 0, ANCHO, ALTO);

    const camY = estado.camara.y;

    if (estado.tipoPantalla !== "aire") {
      for (let i = 0; i < 25; i++) {
        const x = (i * 37) % ANCHO;
        const yBase = ((i * 91) % 400) - 400;
        ctx.fillStyle = "rgba(90, 70, 55, 0.35)";
        ctx.fillRect(x, yBase - camY, 2, ALTO + 400);
      }
      for (let i = 0; i < 40; i++) {
        const x = (i * 173) % ANCHO;
        const y = ((i * 213) % 2400) - 2400 - camY;
        if (y > -80 && y < ALTO + 80) {
          ctx.fillStyle = "rgba(60, 45, 35, 0.5)";
          ctx.fillRect(x, y, 5, 5);
        }
      }
    }

    for (const d of estado.decoraciones) {
      const dy = d.y - camY;
      if (dy + 200 < 0 || dy - 200 > ALTO) continue;

      if (d.tipo === "estalactita") {
        ctx.fillStyle = "#2e2620";
        ctx.beginPath();
        ctx.moveTo(d.x, dy);
        ctx.lineTo(d.x + d.ancho / 2, dy + d.largo);
        ctx.lineTo(d.x + d.ancho, dy);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = "rgba(90, 70, 55, 0.4)";
        ctx.beginPath();
        ctx.moveTo(d.x + 1, dy);
        ctx.lineTo(d.x + d.ancho / 2, dy + d.largo * 0.8);
        ctx.lineTo(d.x + d.ancho / 2, dy);
        ctx.closePath();
        ctx.fill();
      } else if (d.tipo === "estalagmita") {
        ctx.fillStyle = "#2e2620";
        ctx.beginPath();
        ctx.moveTo(d.x, dy + d.largo);
        ctx.lineTo(d.x + d.ancho / 2, dy);
        ctx.lineTo(d.x + d.ancho, dy + d.largo);
        ctx.closePath();
        ctx.fill();
      } else if (d.tipo === "musgo") {
        ctx.fillStyle = "rgba(55, 85, 45, 0.55)";
        ctx.beginPath();
        ctx.ellipse(d.x, dy, d.ancho / 2, d.alto / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "rgba(80, 120, 65, 0.3)";
        ctx.beginPath();
        ctx.ellipse(d.x, dy - 3, d.ancho / 3, d.alto / 4, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (d.tipo === "roca") {
        ctx.fillStyle = "#2a221c";
        ctx.fillRect(d.x, dy, d.ancho, d.alto);
        ctx.fillStyle = "#3a2e26";
        ctx.fillRect(d.x, dy, d.ancho, 3);
      } else if (d.tipo === "gota") {
        ctx.fillStyle = "rgba(120, 150, 200, 0.5)";
        ctx.beginPath();
        ctx.ellipse(d.x, dy, 2, 4, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (d.tipo === "cofre") {
        ctx.fillStyle = "#3a2418";
        ctx.fillRect(d.x, dy, d.ancho, d.alto);
        ctx.fillStyle = "#5a3a22";
        ctx.fillRect(d.x, dy, d.ancho, 3);
        ctx.fillStyle = "#2a1a10";
        ctx.fillRect(d.x, dy + d.alto - 4, d.ancho, 4);

        ctx.fillStyle = "#4a2e1a";
        if (d.abierto) {
          ctx.fillRect(d.x - 2, dy - 10, d.ancho + 4, 6);
          const brillo = 0.6 + Math.sin(Date.now() / 300 + d.tiempo) * 0.4;
          ctx.fillStyle = "rgba(255, 215, 0, " + brillo + ")";
          ctx.fillRect(d.x + 4, dy - 4, d.ancho - 8, 4);
          ctx.fillStyle = "rgba(255, 240, 150, " + (brillo * 0.7) + ")";
          ctx.fillRect(d.x + 8, dy - 8, d.ancho - 16, 3);
        } else {
          ctx.fillRect(d.x, dy - 6, d.ancho, 6);
        }

        ctx.fillStyle = "#c9a227";
        ctx.fillRect(d.x + d.ancho / 2 - 3, dy + 8, 6, 6);
        ctx.fillStyle = "#1a1008";
        ctx.fillRect(d.x + d.ancho / 2 - 1, dy + 10, 2, 3);

      } else if (d.tipo === "esqueleto") {
        const hueso = "#d8d0b8";
        const huesoSombra = "#a89f88";

        ctx.fillStyle = hueso;
        ctx.beginPath();
        ctx.ellipse(d.x + 12, dy + 12, 14, 10, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#2a2218";
        ctx.beginPath();
        ctx.arc(d.x + 10, dy + 10, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = hueso;
        ctx.fillRect(d.x + 2, dy + 18, 22, 4);

        ctx.fillStyle = huesoSombra;
        for (let k = 0; k < 5; k++) {
          const bx = d.x + 30 + k * 12;
          ctx.fillRect(bx, dy + 14, 6, 6);
        }

        ctx.strokeStyle = hueso;
        ctx.lineWidth = 3;
        for (let k = 0; k < 4; k++) {
          const bx = d.x + 34 + k * 12;
          ctx.beginPath();
          ctx.arc(bx, dy + 14, 8, Math.PI, 0);
          ctx.stroke();
        }

        ctx.fillStyle = hueso;
        ctx.save();
        ctx.translate(d.x + d.ancho - 12, dy + 30);
        ctx.rotate(-0.4);
        ctx.fillRect(-3, -10, 6, 20);
        ctx.beginPath();
        ctx.arc(0, -10, 4, 0, Math.PI * 2);
        ctx.arc(0, 10, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

      } else if (d.tipo === "craneo") {
        const t = d.tam;
        ctx.fillStyle = "#d8d0b8";
        ctx.beginPath();
        ctx.ellipse(d.x, dy, t, t * 0.85, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#2a2218";
        ctx.beginPath();
        ctx.arc(d.x - t * 0.35, dy - t * 0.1, t * 0.22, 0, Math.PI * 2);
        ctx.arc(d.x + t * 0.35, dy - t * 0.1, t * 0.22, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#c8c0a8";
        ctx.fillRect(d.x - t * 0.5, dy + t * 0.5, t, t * 0.3);
        ctx.fillStyle = "#2a2218";
        for (let k = 0; k < 3; k++) {
          ctx.fillRect(d.x - t * 0.4 + k * t * 0.3, dy + t * 0.5, 1.5, t * 0.3);
        }

      } else if (d.tipo === "moneda") {
        const giro = Math.abs(Math.cos(Date.now() / 400 + d.tiempo));
        const anchoVisible = d.tam * giro;
        ctx.fillStyle = "#c9a227";
        ctx.beginPath();
        ctx.ellipse(d.x, dy, anchoVisible, d.tam, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#f0d060";
        ctx.beginPath();
        ctx.ellipse(d.x, dy, anchoVisible * 0.6, d.tam * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#8a6a10";
        ctx.fillRect(d.x - anchoVisible * 0.3, dy - 1, anchoVisible * 0.6, 2);

      } else if (d.tipo === "petroleo") {
        ctx.fillStyle = "rgba(10, 8, 6, 0.85)";
        ctx.beginPath();
        ctx.ellipse(d.x, dy, d.ancho / 2, d.alto / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "rgba(60, 120, 80, 0.25)";
        ctx.beginPath();
        ctx.ellipse(d.x - d.ancho * 0.15, dy - 2, d.ancho * 0.25, d.alto * 0.25, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "rgba(120, 60, 140, 0.2)";
        ctx.beginPath();
        ctx.ellipse(d.x + d.ancho * 0.2, dy + 2, d.ancho * 0.2, d.alto * 0.2, 0, 0, Math.PI * 2);
        ctx.fill();

      } else if (d.tipo === "cristal") {
        const brillo = 0.5 + Math.sin(Date.now() / 400 + d.tiempo) * 0.5;
        ctx.fillStyle = "rgba(180, 220, 255, " + (0.6 + brillo * 0.4) + ")";
        ctx.beginPath();
        ctx.moveTo(d.x, dy - d.tam);
        ctx.lineTo(d.x + d.tam * 0.6, dy);
        ctx.lineTo(d.x, dy + d.tam);
        ctx.lineTo(d.x - d.tam * 0.6, dy);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = "rgba(255, 255, 255, " + (brillo * 0.6) + ")";
        ctx.beginPath();
        ctx.moveTo(d.x, dy - d.tam * 0.6);
        ctx.lineTo(d.x + d.tam * 0.25, dy - d.tam * 0.1);
        ctx.lineTo(d.x, dy + d.tam * 0.2);
        ctx.closePath();
        ctx.fill();

      } else if (d.tipo === "grieta-luz") {
        const pulso = 0.5 + Math.sin(Date.now() / 500 + d.x) * 0.5;
        ctx.fillStyle = "rgba(255, 230, 150, " + (0.2 + pulso * 0.3) + ")";
        ctx.fillRect(d.x, dy, d.ancho, d.largo);
        ctx.fillStyle = "rgba(255, 250, 200, " + (0.4 + pulso * 0.4) + ")";
        ctx.fillRect(d.x, dy, d.ancho, d.largo * 0.4);
        ctx.fillStyle = "rgba(255, 255, 255, " + (0.6 + pulso * 0.4) + ")";
        ctx.fillRect(d.x + 1, dy + d.largo * 0.1, 1, d.largo * 0.2);

      } else if (d.tipo === "nube") {
        d.x += d.vel * 0.3;
        if (d.x > ANCHO + 100) d.x = -100;
        ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
        ctx.beginPath();
        ctx.ellipse(d.x, dy, d.ancho / 2, d.alto / 2, 0, 0, Math.PI * 2);
        ctx.ellipse(d.x + d.ancho * 0.25, dy - d.alto * 0.15, d.ancho * 0.35, d.alto * 0.4, 0, 0, Math.PI * 2);
        ctx.ellipse(d.x - d.ancho * 0.25, dy - d.alto * 0.1, d.ancho * 0.3, d.alto * 0.35, 0, 0, Math.PI * 2);
        ctx.fill();

      } else if (d.tipo === "montana") {
        ctx.fillStyle = "rgba(90, 110, 130, 0.7)";
        ctx.beginPath();
        ctx.moveTo(d.x - d.ancho / 2, dy + d.alto / 2);
        ctx.lineTo(d.x, dy - d.alto / 2);
        ctx.lineTo(d.x + d.ancho / 2, dy + d.alto / 2);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.beginPath();
        ctx.moveTo(d.x - d.ancho * 0.12, dy - d.alto * 0.15);
        ctx.lineTo(d.x, dy - d.alto / 2);
        ctx.lineTo(d.x + d.ancho * 0.12, dy - d.alto * 0.15);
        ctx.closePath();
        ctx.fill();

      } else if (d.tipo === "arbol") {
        ctx.fillStyle = "#5a3a1a";
        ctx.fillRect(d.x - 2, dy, 4, d.alto * 0.4);
        ctx.fillStyle = "#2a6a2a";
        ctx.beginPath();
        ctx.arc(d.x, dy, d.alto * 0.35, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#3a8a3a";
        ctx.beginPath();
        ctx.arc(d.x - d.alto * 0.1, dy - d.alto * 0.1, d.alto * 0.25, 0, Math.PI * 2);
        ctx.fill();

      } else if (d.tipo === "pajaro") {
        d.tiempo += 0.15;
        const aleteo = Math.sin(d.tiempo * 3) * 3;
        ctx.strokeStyle = "rgba(30, 30, 30, 0.8)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(d.x - 6, dy + aleteo, 6, Math.PI, 0);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(d.x + 6, dy - aleteo, 6, Math.PI, 0);
        ctx.stroke();

      } else if (d.tipo === "aguila") {
        d.x += d.vel * 0.4;
        if (d.x > ANCHO + 80) d.x = -80;
        d.tiempo += 0.04;
        const planeo = Math.sin(d.tiempo) * 2;
        const t = d.tam;
        // Cuerpo
        ctx.fillStyle = "#3a2a1a";
        ctx.beginPath();
        ctx.ellipse(d.x, dy + planeo, t * 0.4, t * 0.18, 0, 0, Math.PI * 2);
        ctx.fill();
        // Cola
        ctx.beginPath();
        ctx.moveTo(d.x - t * 0.4, dy + planeo);
        ctx.lineTo(d.x - t * 0.7, dy + planeo - t * 0.1);
        ctx.lineTo(d.x - t * 0.7, dy + planeo + t * 0.1);
        ctx.closePath();
        ctx.fill();
        // Cabeza
        ctx.fillStyle = "#e0d0a0";
        ctx.beginPath();
        ctx.arc(d.x + t * 0.4, dy + planeo, t * 0.15, 0, Math.PI * 2);
        ctx.fill();
        // Pico
        ctx.fillStyle = "#d4a017";
        ctx.beginPath();
        ctx.moveTo(d.x + t * 0.55, dy + planeo);
        ctx.lineTo(d.x + t * 0.72, dy + planeo + t * 0.03);
        ctx.lineTo(d.x + t * 0.55, dy + planeo + t * 0.06);
        ctx.closePath();
        ctx.fill();
        // Ojo
        ctx.fillStyle = "#1a1a1a";
        ctx.fillRect(d.x + t * 0.4, dy + planeo - t * 0.05, 1.5, 1.5);
        // Alas extendidas
        ctx.fillStyle = "#2a1e12";
        ctx.beginPath();
        ctx.moveTo(d.x - t * 0.05, dy + planeo - t * 0.05);
        ctx.lineTo(d.x - t * 0.9, dy + planeo - t * 0.25);
        ctx.lineTo(d.x - t * 0.5, dy + planeo + t * 0.05);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(d.x - t * 0.05, dy + planeo - t * 0.05);
        ctx.lineTo(d.x + t * 0.7, dy + planeo - t * 0.25);
        ctx.lineTo(d.x + t * 0.4, dy + planeo + t * 0.05);
        ctx.closePath();
        ctx.fill();
      }
    }

    if (estado.tipoPantalla !== "aire") {
      const grad = ctx.createRadialGradient(ANCHO / 2, ALTO / 2, 150, ANCHO / 2, ALTO / 2, ANCHO);
      grad.addColorStop(0, "rgba(0,0,0,0)");
      grad.addColorStop(1, "rgba(0,0,0,0.5)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, ANCHO, ALTO);
    }
  }

  // ---------- Render ----------
  function render() {
    dibujarFondo();

    const p = estado.personaje;
    const tipo = tipoActual();

    let siguientePresa = null;
    let distMin = Infinity;
    for (const plat of estado.plataformas) {
      if (plat.tipo !== "presa") continue;
      if (plat.y >= p.y) continue;
      const dist = Math.abs(plat.y - p.y) + Math.abs(plat.x - p.x) * 0.3;
      if (dist < distMin) { distMin = dist; siguientePresa = plat; }
    }

    for (const plat of estado.plataformas) {
      const py = plat.y - estado.camara.y;
      if (py + plat.alto < 0 || py > ALTO) continue;

      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.fillRect(plat.x + 4, py + 4, plat.ancho, plat.alto);

      if (plat.tipo === "suelo") {
        ctx.fillStyle = tipo.suelo;
        ctx.fillRect(plat.x, py, plat.ancho, plat.alto);
        ctx.fillStyle = tipo.sueloLuz;
        ctx.fillRect(plat.x, py, plat.ancho, 4);
      } else {
        const radio = 10;
        ctx.fillStyle = tipo.presa;
        ctx.beginPath();
        ctx.moveTo(plat.x + radio, py);
        ctx.lineTo(plat.x + plat.ancho - radio, py);
        ctx.quadraticCurveTo(plat.x + plat.ancho, py, plat.x + plat.ancho, py + radio);
        ctx.lineTo(plat.x + plat.ancho, py + plat.alto - radio);
        ctx.quadraticCurveTo(plat.x + plat.ancho, py + plat.alto, plat.x + plat.ancho - radio, py + plat.alto);
        ctx.lineTo(plat.x + radio, py + plat.alto);
        ctx.quadraticCurveTo(plat.x, py + plat.alto, plat.x, py + plat.alto - radio);
        ctx.lineTo(plat.x, py + radio);
        ctx.quadraticCurveTo(plat.x, py, plat.x + radio, py);
        ctx.fill();

        ctx.fillStyle = tipo.presaLuz;
        ctx.fillRect(plat.x + radio, py, plat.ancho - radio * 2, 3);

        if ((plat.x + plat.y) % 3 === 0) {
          ctx.fillStyle = "rgba(70, 100, 60, 0.5)";
          ctx.fillRect(plat.x + 4, py + plat.alto - 4, plat.ancho - 8, 4);
        }

        if (plat === siguientePresa) {
          const brillo = 0.6 + Math.sin(Date.now() / 200) * 0.4;
          ctx.strokeStyle = "rgba(255, 230, 100, " + brillo + ")";
          ctx.lineWidth = 4;
          ctx.strokeRect(plat.x - 3, py - 3, plat.ancho + 6, plat.alto + 6);
          ctx.strokeStyle = "rgba(255, 200, 80, " + (brillo * 0.4) + ")";
          ctx.lineWidth = 8;
          ctx.strokeRect(plat.x - 6, py - 6, plat.ancho + 12, plat.alto + 12);
        }
      }
    }

    for (const frag of estado.fragmentos) {
      const fy = frag.y - estado.camara.y;
      if (fy + 50 < 0 || fy - 50 > ALTO) continue;
      dibujarFragmento(frag);
    }

    for (const bat of estado.murcielagos) {
      const by = bat.y - estado.camara.y;
      if (by + 40 < 0 || by - 40 > ALTO) continue;
      dibujarMurcielago(bat, bat.x, by);
    }

    if (estado.modo === "jugando" || estado.modo === "confirmar-salida") {
      const px = p.x;
      const py = p.y - estado.camara.y;
      dibujarSteve(px, py, p.frame, p.mirandoDerecha, p.dañoTiempo);

      if (!p.enSuelo && p.dobleSaltoDisponible) {
        ctx.fillStyle = "#FFD700";
        ctx.beginPath();
        ctx.arc(px + p.ancho / 2, py - 8, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    dibujarPopups();
    dibujarPopupGrande();
    dibujarTransicion();

    // ---- Menú de inicio ----
    if (estado.modo === "menu") {
      ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
      ctx.fillRect(0, 0, ANCHO, ALTO);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 56px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("VÍA AL CIELO", ANCHO / 2, ALTO / 2 - 180);

      ctx.fillStyle = "#a0c0e0";
      ctx.font = "18px monospace";
      ctx.fillText("Un juego de escalada vertical", ANCHO / 2, ALTO / 2 - 130);

      ctx.fillStyle = "#ffd700";
      ctx.font = "16px monospace";
      ctx.fillText("Récord: " + estado.camara.record + " m", ANCHO / 2, ALTO / 2 - 90);

      const btnW = 260;
      const btnH = 60;
      const btnY1 = ALTO / 2 - 10;
      const brilloBtn1 = 0.7 + Math.sin(Date.now() / 300) * 0.3;

      ctx.fillStyle = "rgba(80, 180, 255, " + (0.3 + brilloBtn1 * 0.3) + ")";
      ctx.fillRect(ANCHO / 2 - btnW / 2, btnY1, btnW, btnH);
      ctx.strokeStyle = "rgba(120, 220, 255, " + brilloBtn1 + ")";
      ctx.lineWidth = 3;
      ctx.strokeRect(ANCHO / 2 - btnW / 2, btnY1, btnW, btnH);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 24px monospace";
      ctx.fillText("▶  EMPEZAR", ANCHO / 2, btnY1 + btnH / 2);

      ctx.fillStyle = "#888888";
      ctx.font = "14px monospace";
      ctx.fillText("Pulsa ENTER o toca el botón", ANCHO / 2, btnY1 + btnH + 30);

      const btnY2 = btnY1 + btnH + 70;
      ctx.fillStyle = "rgba(40, 60, 90, 0.7)";
      ctx.fillRect(ANCHO / 2 - btnW / 2, btnY2, btnW, btnH);
      ctx.strokeStyle = "rgba(100, 130, 170, 0.8)";
      ctx.lineWidth = 2;
      ctx.strokeRect(ANCHO / 2 - btnW / 2, btnY2, btnW, btnH);

      ctx.fillStyle = "#c0d0e0";
      ctx.font = "20px monospace";
      ctx.fillText("?  CÓMO JUGAR", ANCHO / 2, btnY2 + btnH / 2);

      estado._btnEmpezar = { x: ANCHO / 2 - btnW / 2, y: btnY1, w: btnW, h: btnH };
      estado._btnInstrucciones = { x: ANCHO / 2 - btnW / 2, y: btnY2, w: btnW, h: btnH };

      ctx.textAlign = "start";
      ctx.textBaseline = "alphabetic";
    }

    // ---- Instrucciones ----
    if (estado.modo === "instrucciones") {
      ctx.fillStyle = "rgba(0, 0, 0, 0.9)";
      ctx.fillRect(0, 0, ANCHO, ALTO);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 36px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("CÓMO JUGAR", ANCHO / 2, 60);

      ctx.font = "16px monospace";
      ctx.textAlign = "left";
      const lineas = [
        "MOVER:    ← →  o  A / D",
        "SALTAR:   ESPACIO  o  ↑  o  W",
        "DOBLE SALTO: pulsa salto otra vez en el aire",
        "SALIR:    ESC (pregunta si quieres salir)",
        "",
        "OBJETIVO:",
        "· Sube lo más alto posible",
        "· Coge los 3 fragmentos de código de cada pantalla",
        "· Si coges los 3, ganas 1 vida (máx. 5)",
        "",
        "VIDAS:",
        "· Empiezas con 3 vidas",
        "· Caída > 90 m → pierdes 1 vida",
        "· 0 vidas → Game Over",
        "",
        "PANTALLAS:",
        "· Cada 220 m cambias de pantalla",
        "· Hay 4 ambientes distintos",
      ];

      let yTexto = 120;
      for (const linea of lineas) {
        if (linea.endsWith(":")) {
          ctx.fillStyle = "#ffd700";
          ctx.font = "bold 16px monospace";
        } else {
          ctx.fillStyle = "#c0d0e0";
          ctx.font = "15px monospace";
        }
        ctx.fillText(linea, 60, yTexto);
        yTexto += 24;
      }

      ctx.fillStyle = "#888888";
      ctx.font = "14px monospace";
      ctx.textAlign = "center";
      ctx.fillText("Pulsa ENTER o ESC para volver", ANCHO / 2, ALTO - 40);

      ctx.textAlign = "start";
      ctx.textBaseline = "alphabetic";
    }

    // ---- Game Over ----
    if (estado.modo === "gameover") {
      ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
      ctx.fillRect(0, 0, ANCHO, ALTO);

      ctx.fillStyle = "#ff4444";
      ctx.font = "bold 52px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("GAME OVER", ANCHO / 2, 180);

      const px = ANCHO / 2 - 200;
      const py = 260;
      const pw = 400;
      const ph = 220;

      ctx.fillStyle = "rgba(20, 30, 50, 0.9)";
      ctx.fillRect(px, py, pw, ph);
      ctx.strokeStyle = "rgba(120, 200, 255, 0.8)";
      ctx.lineWidth = 3;
      ctx.strokeRect(px, py, pw, ph);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 22px monospace";
      ctx.fillText("RESUMEN", ANCHO / 2, py + 30);

      ctx.font = "18px monospace";
      ctx.fillStyle = "#a0c0e0";
      ctx.fillText("Altura máxima:  " + estado.camara.alturaMaxima + " m", ANCHO / 2, py + 80);
      ctx.fillText("Fragmentos:  " + estado.fragmentosRecogidos + "/" + estado.fragmentosTotales, ANCHO / 2, py + 115);
      ctx.fillText("Pantalla:  P" + estado.pantalla, ANCHO / 2, py + 150);

      ctx.fillStyle = "#ffd700";
      ctx.font = "bold 18px monospace";
      const nuevoRecord = estado.camara.alturaMaxima >= estado.camara.record && estado.camara.alturaMaxima > 0;
      if (nuevoRecord) {
        ctx.fillText("¡NUEVO RÉCORD!", ANCHO / 2, py + 185);
      } else {
        ctx.fillText("Récord:  " + estado.camara.record + " m", ANCHO / 2, py + 185);
      }

      const btnW = 260;
      const btnH = 55;
      const btnY1 = py + ph + 40;
      const btnY2 = btnY1 + btnH + 20;

      const brilloBtn = 0.7 + Math.sin(Date.now() / 300) * 0.3;
      ctx.fillStyle = "rgba(80, 180, 255, " + (0.3 + brilloBtn * 0.3) + ")";
      ctx.fillRect(ANCHO / 2 - btnW / 2, btnY1, btnW, btnH);
      ctx.strokeStyle = "rgba(120, 220, 255, " + brilloBtn + ")";
      ctx.lineWidth = 3;
      ctx.strokeRect(ANCHO / 2 - btnW / 2, btnY1, btnW, btnH);
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 22px monospace";
      ctx.fillText("↻  REINTENTAR", ANCHO / 2, btnY1 + btnH / 2);

      ctx.fillStyle = "rgba(40, 60, 90, 0.7)";
      ctx.fillRect(ANCHO / 2 - btnW / 2, btnY2, btnW, btnH);
      ctx.strokeStyle = "rgba(100, 130, 170, 0.8)";
      ctx.lineWidth = 2;
      ctx.strokeRect(ANCHO / 2 - btnW / 2, btnY2, btnW, btnH);
      ctx.fillStyle = "#c0d0e0";
      ctx.font = "20px monospace";
      ctx.fillText("←  MENÚ", ANCHO / 2, btnY2 + btnH / 2);

      estado._btnReintentar = { x: ANCHO / 2 - btnW / 2, y: btnY1, w: btnW, h: btnH };
      estado._btnMenu = { x: ANCHO / 2 - btnW / 2, y: btnY2, w: btnW, h: btnH };

      ctx.textAlign = "start";
      ctx.textBaseline = "alphabetic";
    }

    // ---- Confirmar salida ----
    if (estado.modo === "confirmar-salida") {
      ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
      ctx.fillRect(0, 0, ANCHO, ALTO);

      const px = ANCHO / 2 - 220;
      const py = ALTO / 2 - 140;
      const pw = 440;
      const ph = 280;

      ctx.fillStyle = "rgba(20, 30, 50, 0.95)";
      ctx.fillRect(px, py, pw, ph);
      ctx.strokeStyle = "rgba(255, 220, 100, 0.9)";
      ctx.lineWidth = 3;
      ctx.strokeRect(px, py, pw, ph);

      ctx.fillStyle = "#ffd700";
      ctx.font = "bold 26px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("¿SALIR DE LA PARTIDA?", ANCHO / 2, py + 50);

      ctx.fillStyle = "#c0d0e0";
      ctx.font = "16px monospace";
      ctx.fillText("Perderás el progreso de esta partida.", ANCHO / 2, py + 90);
      ctx.fillText("¿Seguro que quieres salir al menú?", ANCHO / 2, py + 115);

      const btnW = 160;
      const btnH = 55;
      const btnY = py + 170;
      const sep = 30;

      const btnSiX = ANCHO / 2 - btnW - sep / 2;
      const btnNoX = ANCHO / 2 + sep / 2;

      const brilloSi = 0.7 + Math.sin(Date.now() / 250) * 0.3;

      // Botón SÍ
      ctx.fillStyle = "rgba(220, 80, 80, " + (0.3 + brilloSi * 0.3) + ")";
      ctx.fillRect(btnSiX, btnY, btnW, btnH);
      ctx.strokeStyle = "rgba(255, 120, 120, " + brilloSi + ")";
      ctx.lineWidth = 3;
      ctx.strokeRect(btnSiX, btnY, btnW, btnH);
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 22px monospace";
      ctx.fillText("SÍ (S)", btnSiX + btnW / 2, btnY + btnH / 2);

      // Botón NO
      ctx.fillStyle = "rgba(40, 60, 90, 0.7)";
      ctx.fillRect(btnNoX, btnY, btnW, btnH);
      ctx.strokeStyle = "rgba(100, 130, 170, 0.9)";
      ctx.lineWidth = 2;
      ctx.strokeRect(btnNoX, btnY, btnW, btnH);
      ctx.fillStyle = "#c0d0e0";
      ctx.font = "bold 22px monospace";
      ctx.fillText("NO (N)", btnNoX + btnW / 2, btnY + btnH / 2);

      estado._btnSiSalir = { x: btnSiX, y: btnY, w: btnW, h: btnH };
      estado._btnNoSalir = { x: btnNoX, y: btnY, w: btnW, h: btnH };

      ctx.fillStyle = "#888888";
      ctx.font = "13px monospace";
      ctx.fillText("ENTER = sí · ESC = no", ANCHO / 2, py + ph - 25);

      ctx.textAlign = "start";
      ctx.textBaseline = "alphabetic";
    }
  }

  // ---------- Loop ----------
  let ultimoTiempo = 0;
  function loop(tiempo) {
    if (tiempo - ultimoTiempo < 16) { requestAnimationFrame(loop); return; }
    ultimoTiempo = tiempo;
    actualizarFisica();
    render();
    requestAnimationFrame(loop);
  }

  // ---------- Inicializar ----------
  cargarRecord();
  crearPlataformas();
  crearDecoraciones();
  crearMurcielagos();
  estado.personaje.y = Y_SUELO_JUGABLE;
  estado.camara.y = CAMARA_INICIAL;
  estado.modo = "menu";
  requestAnimationFrame(loop);

  window.__juegoEscalada = { estado, contenedor };
})();