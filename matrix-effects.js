/* ============================================================
   matrix-effects.js · Extras del skin Matrix
   ------------------------------------------------------------
   Solo hace algo cuando <html data-skin="matrix">. En topo, omarchy y
   minecraft el script no toca nada (ni canvas, ni botón visible, ni teclas).

   Qué incluye:
   1. Lluvia de código: <canvas> fijo DETRÁS del contenido, tenue (~30%),
      a 30 fps, en pausa si la pestaña está oculta.
      · No se activa con "reducir movimiento" ni en pantallas táctiles.
      · Botón en la cabecera para apagarla (se recuerda en localStorage).
   2. "Wake up, Neo...": secuencia tipo terminal la PRIMERA vez que se
      activa el skin. Se cierra con clic, cualquier tecla o Esc.
   3. Konami (↑↑↓↓←→←→ B A) en Matrix: repite la secuencia y la lluvia
      se intensifica unos segundos.

   El cursor de bloque y el efecto glitch son CSS puro y viven en style.css.

   Para volver a ver la secuencia al probar:
      localStorage.removeItem("matrix-neo")   o bien   matrixDespertar()
   ============================================================ */

(function matrixEffects() {
  "use strict";

  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const tactil = window.matchMedia("(hover: none), (pointer: coarse)").matches;

  const esMatrix = () => root.getAttribute("data-skin") === "matrix";
  const lluviaPermitida = () => !reduceMotion && !tactil;

  /* ---------- Persistencia (con try/catch por si no hay localStorage) ---------- */
  const CLAVE_LLUVIA = "matrix-rain";   // "off" = apagada; cualquier otra cosa = encendida
  const CLAVE_NEO = "matrix-neo";       // "1" = la secuencia ya se vio
  const leer = (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } };
  const guardar = (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* sin almacenamiento: se sigue sin recordar */ } };

  /* ---------- Textos (la secuencia de la película va en inglés en los 3 idiomas) ---------- */
  const TEXTOS = {
    es: { rainOff: "Desactivar lluvia de código", rainOn: "Activar lluvia de código", pista: "Pulsa una tecla para continuar" },
    val: { rainOff: "Desactiva la pluja de codi", rainOn: "Activa la pluja de codi", pista: "Prem una tecla per a continuar" },
    en: { rainOff: "Turn off code rain", rainOn: "Turn on code rain", pista: "Press any key to continue" }
  };
  const idioma = () => (root.lang === "en" ? "en" : root.lang === "ca-valencia" ? "val" : "es");
  const tx = (k) => (TEXTOS[idioma()] || TEXTOS.es)[k];

  const LINEAS = ["Wake up, Neo...", "The Matrix has you...", "Follow the white rabbit.", "Knock, knock, Neo."];

  /* ---------- CSS propio (solo lo que necesita JS) ---------- */
  const estilo = document.createElement("style");
  estilo.id = "matrix-effects-css";
  estilo.textContent = `
    .matrix-rain {
      position: fixed; inset: 0; width: 100%; height: 100%;
      z-index: -1; pointer-events: none;
      opacity: .3; transition: opacity .8s ease;
    }
    .matrix-rain.is-boost { opacity: .8; }

    /* Botón de la lluvia: oculto salvo en Matrix */
    .matrix-rain-toggle { display: none; }
    :root[data-skin="matrix"] .matrix-rain-toggle {
      display: grid; place-items: center; flex: none;
      width: 42px; height: 42px; padding: 0;
      background: #000; color: var(--accent);
      border: 1px solid var(--accent);
      box-shadow: 0 0 8px rgba(0, 255, 65, .35);
      cursor: pointer;
      transition: color .2s, box-shadow .2s;
    }
    :root[data-skin="matrix"] .matrix-rain-toggle:hover {
      color: var(--accent-2);
      box-shadow: 0 0 14px rgba(0, 255, 65, .6);
    }
    :root[data-skin="matrix"] .matrix-rain-toggle[aria-pressed="false"] {
      color: var(--muted-2); border-color: var(--line); box-shadow: none;
    }
    :root[data-skin="matrix"] .matrix-rain-toggle:focus-visible { outline: 3px solid var(--accent); outline-offset: 3px; }
    .matrix-rain-toggle svg { width: 20px; height: 20px; display: block; pointer-events: none; }

    /* Secuencia "Wake up, Neo" */
    .matrix-neo {
      position: fixed; inset: 0; z-index: 9990;
      display: grid; place-content: center; gap: 2rem; padding: 2rem;
      background: rgba(0, 0, 0, .92); color: #00FF41;
      font-family: "JetBrains Mono", ui-monospace, "Courier New", monospace;
      cursor: pointer;
      animation: matrix-neo-in .4s ease both;
    }
    .matrix-neo.is-out { animation: matrix-neo-out .45s ease both; pointer-events: none; }
    .matrix-neo__texto {
      margin: 0; min-height: 1.4em;
      font-size: clamp(1.15rem, 3.4vw, 2.1rem); line-height: 1.4;
      white-space: pre-wrap;
      text-shadow: 0 0 10px rgba(0, 255, 65, .7);
    }
    .matrix-neo__cursor { animation: matrix-neo-blink 1s steps(1) infinite; }
    .matrix-neo__pista {
      margin: 0; font-size: .8rem; letter-spacing: .08em; text-transform: uppercase; color: #00a02d;
    }
    .matrix-neo__sr {
      position: absolute; width: 1px; height: 1px; overflow: hidden;
      clip: rect(0 0 0 0); white-space: nowrap;
    }
    @keyframes matrix-neo-in  { from { opacity: 0; } to { opacity: 1; } }
    @keyframes matrix-neo-out { from { opacity: 1; } to { opacity: 0; } }
    @keyframes matrix-neo-blink { 0% { opacity: 1; } 50% { opacity: 0; } }

    @media (prefers-reduced-motion: reduce) {
      .matrix-rain { transition: none; }
      .matrix-neo, .matrix-neo.is-out { animation: none; }
      .matrix-neo__cursor { animation: none; }
    }
  `;
  document.head.appendChild(estilo);

  /* ============================================================
     1 · LLUVIA DE CÓDIGO
     ============================================================ */
  const GLIFOS = ("ｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ" + "0123456789Z:.=*+-<>|").split("");
  const FRAME_MS = 1000 / 30;     // 30 fps: suficiente para este efecto y ligero para la CPU
  const TAM = 16;                 // alto/ancho de cada celda en px
  const FUENTE = TAM + 'px "JetBrains Mono", ui-monospace, monospace';

  let canvas = null, ctx = null, raf = 0, ultimo = 0, ancho = 0, alto = 0;
  let filas = [], vel = [], glifo = [];
  let tImpulso = 0, tResize = 0;

  const velocidadNueva = () => 0.22 + Math.random() * 0.4;   // filas por frame

  function medir() {
    if (!canvas) return;
    ancho = window.innerWidth;
    alto = window.innerHeight;
    canvas.width = ancho;       // (esto también reinicia el contexto, por eso la fuente va después)
    canvas.height = alto;
    ctx.font = FUENTE;
    ctx.textBaseline = "top";
    const n = Math.ceil(ancho / TAM);
    filas = new Array(n); vel = new Array(n); glifo = new Array(n);
    for (let i = 0; i < n; i++) {
      filas[i] = -Math.random() * (alto / TAM);   // cada columna arranca en un momento distinto
      vel[i] = velocidadNueva();
      glifo[i] = "";
    }
  }

  function frame(t) {
    raf = window.requestAnimationFrame(frame);
    if (t - ultimo < FRAME_MS) return;
    ultimo = t;

    // Desvanece lo anterior sin pintar fondo: el canvas sigue siendo transparente
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = "rgba(0, 0, 0, .06)";
    ctx.fillRect(0, 0, ancho, alto);
    ctx.globalCompositeOperation = "source-over";

    for (let i = 0; i < filas.length; i++) {
      const antes = Math.floor(filas[i]);
      filas[i] += vel[i];
      const ahora = Math.floor(filas[i]);
      if (ahora === antes) continue;              // todavía no ha saltado de celda

      const x = i * TAM;
      // La cabeza anterior (blanca) pasa a ser estela verde
      if (antes >= 0 && glifo[i] && antes * TAM < alto) {
        ctx.clearRect(x, antes * TAM, TAM, TAM);
        ctx.fillStyle = "#00FF41";
        ctx.fillText(glifo[i], x, antes * TAM);
      }
      // Nueva cabeza
      if (ahora >= 0 && ahora * TAM < alto) {
        glifo[i] = GLIFOS[(Math.random() * GLIFOS.length) | 0];
        ctx.fillStyle = "#d9ffe3";
        ctx.fillText(glifo[i], x, ahora * TAM);
      }
      // Fuera de pantalla: a veces reaparece arriba con otra velocidad
      if (ahora * TAM > alto && Math.random() > 0.975) {
        filas[i] = -Math.random() * 20;
        vel[i] = velocidadNueva();
      }
    }
  }

  function iniciarLluvia() {
    if (canvas) return;
    canvas = document.createElement("canvas");
    canvas.className = "matrix-rain";
    canvas.setAttribute("aria-hidden", "true");
    document.body.appendChild(canvas);
    ctx = canvas.getContext("2d");
    if (!ctx) { canvas.remove(); canvas = null; return; }
    medir();
    if (!document.hidden) raf = window.requestAnimationFrame(frame);
  }

  function pararLluvia() {
    window.cancelAnimationFrame(raf);
    window.clearTimeout(tImpulso);
    if (canvas) { canvas.remove(); canvas = null; ctx = null; }
  }

  // La lluvia se intensifica unos segundos (Konami)
  function impulso(ms) {
    if (!canvas) return;
    canvas.classList.add("is-boost");
    window.clearTimeout(tImpulso);
    tImpulso = window.setTimeout(() => { if (canvas) canvas.classList.remove("is-boost"); }, ms);
  }

  window.addEventListener("resize", () => {
    window.clearTimeout(tResize);
    tResize = window.setTimeout(medir, 150);
  });

  // Pestaña oculta: no se gasta CPU
  document.addEventListener("visibilitychange", () => {
    window.cancelAnimationFrame(raf);
    if (canvas && !document.hidden) raf = window.requestAnimationFrame(frame);
  });

  /* ---------- Botón de la cabecera ---------- */
  let boton = null;

  function lluviaEncendida() { return leer(CLAVE_LLUVIA) !== "off"; }

  function actualizarBoton() {
    if (!boton) return;
    const on = lluviaEncendida();
    boton.setAttribute("aria-pressed", on ? "true" : "false");
    boton.setAttribute("aria-label", on ? tx("rainOff") : tx("rainOn"));
    boton.setAttribute("title", on ? tx("rainOff") : tx("rainOn"));
  }

  function crearBoton() {
    const cont = document.querySelector(".header-actions");
    if (!cont || !lluviaPermitida()) return;
    boton = document.createElement("button");
    boton.type = "button";
    boton.className = "matrix-rain-toggle";
    boton.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false">' +
      '<path d="M6 3v5M6 12v2M12 6v3M12 13v7M18 4v2M18 10v6"/></svg>';
    boton.addEventListener("click", () => {
      guardar(CLAVE_LLUVIA, lluviaEncendida() ? "off" : "on");
      sincronizar();
    });
    const selectorIdioma = document.getElementById("languageSelect");
    if (selectorIdioma) selectorIdioma.after(boton); else cont.prepend(boton);
    actualizarBoton();
  }

  function sincronizar() {
    const quiere = esMatrix() && lluviaPermitida() && lluviaEncendida();
    if (quiere) iniciarLluvia(); else pararLluvia();
    actualizarBoton();
  }

  document.addEventListener("portfolio:languagechange", actualizarBoton);

  /* ============================================================
     2 · "WAKE UP, NEO..."
     ============================================================ */
  let capa = null;
  let timers = [];

  const esperar = (fn, ms) => { timers.push(window.setTimeout(fn, ms)); };
  const limpiarTimers = () => { timers.forEach(window.clearTimeout); timers = []; };

  function onTecla() { cerrarNeo(); }

  function cerrarNeo() {
    if (!capa) return;
    limpiarTimers();
    const c = capa;
    capa = null;
    document.removeEventListener("keydown", onTecla, true);
    c.classList.add("is-out");
    window.setTimeout(() => c.remove(), reduceMotion ? 0 : 450);
  }

  function despertar() {
    if (capa) return;

    capa = document.createElement("div");
    capa.className = "matrix-neo";
    capa.setAttribute("role", "status");
    capa.setAttribute("aria-live", "polite");

    // Lectores de pantalla: texto completo de una vez (lo que se "teclea" va aria-hidden)
    const sr = document.createElement("span");
    sr.className = "matrix-neo__sr";
    sr.textContent = LINEAS.join(" ");

    const texto = document.createElement("p");
    texto.className = "matrix-neo__texto";
    texto.setAttribute("aria-hidden", "true");
    const msg = document.createElement("span");
    const cursor = document.createElement("span");
    cursor.className = "matrix-neo__cursor";
    cursor.textContent = "█";
    texto.append(msg, cursor);

    const pista = document.createElement("p");
    pista.className = "matrix-neo__pista";
    pista.textContent = tx("pista");

    capa.append(sr, texto, pista);
    capa.addEventListener("click", cerrarNeo);
    document.body.appendChild(capa);
    // El listener de teclas se añade un instante después para no cerrarla con la tecla que la abrió
    esperar(() => document.addEventListener("keydown", onTecla, true), 150);

    // Con "reducir movimiento": todo el texto de golpe, sin teclear ni parpadeo
    if (reduceMotion) {
      msg.textContent = LINEAS.join("\n");
      cursor.remove();
      esperar(cerrarNeo, 5000);
      return;
    }

    let i = 0;
    function escribir(linea, k) {
      if (!capa) return;
      msg.textContent = linea.slice(0, k);
      if (k < linea.length) {
        esperar(() => escribir(linea, k + 1), 55 + Math.random() * 40);
      } else {
        esperar(siguiente, 1300);
      }
    }
    function siguiente() {
      i++;
      if (i >= LINEAS.length) { cerrarNeo(); return; }
      msg.textContent = "";
      escribir(LINEAS[i], 0);
    }
    esperar(() => escribir(LINEAS[0], 0), 500);
  }

  /* ============================================================
     3 · KONAMI (solo en Matrix)
     ============================================================ */
  const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
  let progreso = 0;
  let ultimoAcierto = 0;

  document.addEventListener("keydown", (e) => {
    if (!esMatrix()) return;
    // No interferir cuando se escribe en un formulario
    if (e.target && e.target.closest && e.target.closest("input, textarea, select, [contenteditable]")) return;

    const ahora = Date.now();
    if (ahora - ultimoAcierto > 3000) progreso = 0;
    ultimoAcierto = ahora;

    const tecla = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (tecla === KONAMI[progreso]) {
      progreso++;
      if (progreso === KONAMI.length) {
        progreso = 0;
        impulso(6000);
        despertar();
      }
    } else {
      progreso = tecla === KONAMI[0] ? 1 : 0;
    }
  });

  /* ============================================================
     ARRANQUE y cambio de skin en caliente
     ============================================================ */
  let skinPrevia = root.getAttribute("data-skin") || "topo";

  new MutationObserver(() => {
    const skin = root.getAttribute("data-skin") || "topo";
    const entra = skin === "matrix" && skinPrevia !== "matrix";
    skinPrevia = skin;
    sincronizar();
    if (skin !== "matrix") cerrarNeo();
    if (entra && !leer(CLAVE_NEO)) {      // solo la primera vez
      guardar(CLAVE_NEO, "1");
      despertar();
    }
  }).observe(root, { attributes: true, attributeFilter: ["data-skin"] });

  crearBoton();
  sincronizar();
  if (esMatrix() && !leer(CLAVE_NEO)) {   // skin ya guardado como Matrix y secuencia sin ver
    guardar(CLAVE_NEO, "1");
    window.setTimeout(despertar, 600);
  }

  // API pública por si se quiere lanzar a mano
  window.matrixDespertar = despertar;
  window.matrixLluviaImpulso = impulso;
})();