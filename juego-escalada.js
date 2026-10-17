/* ============================================================================
   juego-escalada.js · Juego de plataformas del escalador
   ----------------------------------------------------------------------------
   · v73.0 — Fase 8.8 completada: Sídney, Marrakech y Machu Picchu
   · 17 pantallas: 2 cueva + 2 grieta + 1 aire + 12 ciudades
   · Fondos: una sola imagen vertical por ciudad (fondo-{ciudad}.webp)
   · Teclas: no se interceptan si el foco está en un input/textarea/select
   · Rendimiento: el bucle solo corre cuando #juego está en viewport
   ============================================================================ */

(function juegoEscalada() {
  "use strict";

  if (window.__juegoEscaladaCargado) return;
  window.__juegoEscaladaCargado = true;

  // ============================================================================
  // i18n
  // ============================================================================
  const TRADUCCIONES = {
    es: {
      hud_altura: "Altura", hud_fragmentos: "Fragmentos", hud_vida: "Vida", hud_record: "Récord", hud_m: "m", hud_p: "P",
      menu_titulo: "VÍA AL CIELO", menu_subtitulo: "Un juego de escalada vertical", menu_record: "Récord",
      menu_empezar: "▶  EMPEZAR", menu_instrucciones: "?  CÓMO JUGAR", menu_creditos: "★  CRÉDITOS",
      menu_fullscreen: "⛶  PANTALLA COMPLETA", menu_ayuda: "↑↓ / Tab para moverte · ENTER para elegir",
      inst_titulo: "CÓMO JUGAR",
      inst_lineas: [
        "MOVER:    ← →  o  A / D", "SALTAR:   ESPACIO  o  ↑  o  W",
        "DOBLE SALTO: pulsa salto otra vez en el aire",
        "SALIR:    ESC o botón ☰ arriba izquierda",
        "FULLSCREEN: F o botón ⛶ en el menú", "",
        "OBJETIVO:", "· Sube lo más alto posible",
        "· Coge los 3 fragmentos de código de cada pantalla",
        "· Si coges los 3, recuperas vida", "",
        "VIDA:", "· Empiezas con 100% de vida",
        "· Los animales te quitan vida al tocarte",
        "· Caída > 90 m → pierdes 30% de vida",
        "· La vida NO se regenera sola", "",
        "PANTALLAS:", "· Cada 220 m cambias de pantalla", "· Viajas por el mundo entero",
      ],
      inst_volver: "Pulsa ENTER o ESC para volver",
      cred_titulo: "CRÉDITOS", cred_juego: "VÍA AL CIELO", cred_subtitulo: "Un juego de escalada vertical",
      cred_creado: "Creado por", cred_autor: "Gabriel Vidal Badia",
      cred_hecho: "Hecho con HTML, CSS y JavaScript puros",
      cred_inspirado: "Inspirado en Minecraft, la escalada y Matrix",
      cred_gracias: "Gracias por jugar", cred_version: "Versión", cred_volver: "Pulsa ENTER o ESC para volver",
      go_titulo: "GAME OVER", go_resumen: "RESUMEN", go_altura_max: "Altura máxima", go_fragmentos: "Fragmentos",
      go_pantalla: "Pantalla", go_record: "Récord", go_nuevo_record: "¡NUEVO RÉCORD!",
      go_reintentar: "↻  REINTENTAR", go_menu: "←  MENÚ", go_fullscreen: "⛶  PANTALLA COMPLETA",
      salir_titulo: "¿SALIR DE LA PARTIDA?", salir_msg1: "Perderás el progreso de esta partida.",
      salir_msg2: "¿Seguro que quieres salir al menú?", salir_si: "SÍ (S)", salir_no: "NO (N)",
      salir_fullscreen: "⛶  SALIR PANTALLA COMPLETA", salir_ayuda: "↑↓ / Tab para moverte · ENTER para elegir",
      pantalla: "PANTALLA",
      pantalla_cueva: "Cueva", pantalla_grieta: "Grieta", pantalla_aire: "Aire libre", pantalla_infinito: "Infinito",
      pantalla_valencia: "Valencia", pantalla_madrid: "Madrid", pantalla_paris: "París",
      pantalla_londres: "Londres", pantalla_nuevayork: "Nueva York", pantalla_roma: "Roma",
      pantalla_elcairo: "El Cairo", pantalla_tokio: "Tokio", pantalla_rio: "Río",
      pantalla_sidney: "Sídney", pantalla_marrakech: "Marrakech", pantalla_machupicchu: "Machu Picchu",
      subtitulo_valencia: "Ciudad de las Artes y las Ciencias",
      subtitulo_madrid: "Puerta de Alcalá · Cibeles · El Oso y el Madroño",
      subtitulo_paris: "La Torre Eiffel al atardecer",
      subtitulo_londres: "Big Ben, el Támesis y el London Eye",
      subtitulo_nuevayork: "La Estatua de la Libertad y Manhattan",
      subtitulo_roma: "El Coliseo y la Ciudad Eterna",
      subtitulo_elcairo: "Las Pirámides de Giza y el Nilo",
      subtitulo_tokio: "El Monte Fuji y los cerezos en flor",
      subtitulo_rio: "El Cristo Redentor y el Pan de Azúcar",
      subtitulo_sidney: "La Ópera de Sídney y el Harbour Bridge",
      subtitulo_marrakech: "La Koutoubia y la plaza Jemaa el-Fnaa",
      subtitulo_machupicchu: "La ciudadela inca en los Andes",
      pie: "Vía al Cielo · v:73.0 · por Gabriel Vidal Badia",
    },
    val: {
      hud_altura: "Alçada", hud_fragmentos: "Fragments", hud_vida: "Vida", hud_record: "Rècord", hud_m: "m", hud_p: "P",
      menu_titulo: "VIA AL CEL", menu_subtitulo: "Un joc d'escalada vertical", menu_record: "Rècord",
      menu_empezar: "▶  COMENÇAR", menu_instrucciones: "?  COM JUGAR", menu_creditos: "★  CRÈDITS",
      menu_fullscreen: "⛶  PANTALLA COMPLETA", menu_ayuda: "↑↓ / Tab per moure't · ENTER per triar",
      inst_titulo: "COM JUGAR",
      inst_lineas: [
        "MOURE:    ← →  o  A / D", "SALTAR:   ESPAI  o  ↑  o  W",
        "DOBLE SALT: prem salt una altra volta en l'aire",
        "EIXIR:    ESC o botó ☰ dalt esquerra",
        "FULLSCREEN: F o botó ⛶ al menú", "",
        "OBJECTIU:", "· Puja el més alt possible",
        "· Agafa els 3 fragments de codi de cada pantalla",
        "· Si n'agafes els 3, recuperes vida", "",
        "VIDA:", "· Comences amb 100% de vida",
        "· Els animals et lleven vida al tocar-te",
        "· Caiguda > 90 m → perds 30% de vida",
        "· La vida NO es regenera sola", "",
        "PANTALLES:", "· Cada 220 m canvies de pantalla", "· Viatges pel món sencer",
      ],
      inst_volver: "Prem ENTER o ESC per a tornar",
      cred_titulo: "CRÈDITS", cred_juego: "VIA AL CEL", cred_subtitulo: "Un joc d'escalada vertical",
      cred_creado: "Creat per", cred_autor: "Gabriel Vidal Badia",
      cred_hecho: "Fet amb HTML, CSS i JavaScript purs",
      cred_inspirado: "Inspirat en Minecraft, l'escalada i Matrix",
      cred_gracias: "Gràcies per jugar", cred_version: "Versió", cred_volver: "Prem ENTER o ESC per a tornar",
      go_titulo: "GAME OVER", go_resumen: "RESUM", go_altura_max: "Alçada màxima", go_fragmentos: "Fragments",
      go_pantalla: "Pantalla", go_record: "Rècord", go_nuevo_record: "NOU RÈCORD!",
      go_reintentar: "↻  REINTENTAR", go_menu: "←  MENÚ", go_fullscreen: "⛶  PANTALLA COMPLETA",
      salir_titulo: "EIXIR DE LA PARTIDA?", salir_msg1: "Perdràs el progrés d'esta partida.",
      salir_msg2: "Segur que vols eixir al menú?", salir_si: "SÍ (S)", salir_no: "NO (N)",
      salir_fullscreen: "⛶  EIXIR PANTALLA COMPLETA", salir_ayuda: "↑↓ / Tab per moure't · ENTER per triar",
      pantalla: "PANTALLA",
      pantalla_cueva: "Cova", pantalla_grieta: "Esquerda", pantalla_aire: "Aire lliure", pantalla_infinito: "Infinit",
      pantalla_valencia: "València", pantalla_madrid: "Madrid", pantalla_paris: "París",
      pantalla_londres: "Londres", pantalla_nuevayork: "Nova York", pantalla_roma: "Roma",
      pantalla_elcairo: "El Caire", pantalla_tokio: "Tòquio", pantalla_rio: "Rio",
      pantalla_sidney: "Sydney", pantalla_marrakech: "Marrakech", pantalla_machupicchu: "Machu Picchu",
      subtitulo_valencia: "Ciutat de les Arts i les Ciències",
      subtitulo_madrid: "Puerta de Alcalá · Cibeles · L'Osset i el Madroño",
      subtitulo_paris: "La Torre Eiffel a la posta de sol",
      subtitulo_londres: "Big Ben, el Tàmesi i el London Eye",
      subtitulo_nuevayork: "L'Estatua de la Llibertat i Manhattan",
      subtitulo_roma: "El Coliseu i la Ciutat Eterna",
      subtitulo_elcairo: "Les Piràmides de Giza i el Nil",
      subtitulo_tokio: "El Mont Fuji i els cirerers en flor",
      subtitulo_rio: "El Crist Redemptor i el Pa de Sucre",
      subtitulo_sidney: "L'Òpera de Sydney i el Harbour Bridge",
      subtitulo_marrakech: "La Koutoubia i la plaça Jemaa el-Fnaa",
      subtitulo_machupicchu: "La ciutadella inca als Andes",
      pie: "Via al Cel · v:73.0 · per Gabriel Vidal Badia",
    },
    en: {
      hud_altura: "Height", hud_fragmentos: "Fragments", hud_vida: "Health", hud_record: "Record", hud_m: "m", hud_p: "P",
      menu_titulo: "PATH TO THE SKY", menu_subtitulo: "A vertical climbing game", menu_record: "Record",
      menu_empezar: "▶  START", menu_instrucciones: "?  HOW TO PLAY", menu_creditos: "★  CREDITS",
      menu_fullscreen: "⛶  FULLSCREEN", menu_ayuda: "↑↓ / Tab to move · ENTER to choose",
      inst_titulo: "HOW TO PLAY",
      inst_lineas: [
        "MOVE:     ← →  or  A / D", "JUMP:     SPACE  or  ↑  or  W",
        "DOUBLE JUMP: press jump again in mid-air",
        "QUIT:     ESC or ☰ button top-left",
        "FULLSCREEN: F or the ⛶ button in the menu", "",
        "GOAL:", "· Climb as high as you can",
        "· Collect the 3 code fragments on each screen",
        "· If you get all 3, you recover health", "",
        "HEALTH:", "· You start with 100% health",
        "· Animals damage you when they touch you",
        "· Fall > 90 m → lose 30% health",
        "· Health does NOT regenerate on its own", "",
        "SCREENS:", "· Every 220 m you change screen", "· You travel the world",
      ],
      inst_volver: "Press ENTER or ESC to go back",
      cred_titulo: "CREDITS", cred_juego: "PATH TO THE SKY", cred_subtitulo: "A vertical climbing game",
      cred_creado: "Created by", cred_autor: "Gabriel Vidal Badia",
      cred_hecho: "Made with plain HTML, CSS and JavaScript",
      cred_inspirado: "Inspired by Minecraft, climbing and Matrix",
      cred_gracias: "Thanks for playing", cred_version: "Version", cred_volver: "Press ENTER or ESC to go back",
      go_titulo: "GAME OVER", go_resumen: "SUMMARY", go_altura_max: "Max height", go_fragmentos: "Fragments",
      go_pantalla: "Screen", go_record: "Record", go_nuevo_record: "NEW RECORD!",
      go_reintentar: "↻  RETRY", go_menu: "←  MENU", go_fullscreen: "⛶  FULLSCREEN",
      salir_titulo: "QUIT THE GAME?", salir_msg1: "You'll lose your progress in this run.",
      salir_msg2: "Are you sure you want to return to the menu?", salir_si: "YES (Y)", salir_no: "NO (N)",
      salir_fullscreen: "⛶  EXIT FULLSCREEN", salir_ayuda: "↑↓ / Tab to move · ENTER to choose",
      pantalla: "SCREEN",
      pantalla_cueva: "Cave", pantalla_grieta: "Crevice", pantalla_aire: "Open air", pantalla_infinito: "Infinite",
      pantalla_valencia: "Valencia", pantalla_madrid: "Madrid", pantalla_paris: "Paris",
      pantalla_londres: "London", pantalla_nuevayork: "New York", pantalla_roma: "Rome",
      pantalla_elcairo: "Cairo", pantalla_tokio: "Tokyo", pantalla_rio: "Rio",
      pantalla_sidney: "Sydney", pantalla_marrakech: "Marrakech", pantalla_machupicchu: "Machu Picchu",
      subtitulo_valencia: "City of Arts and Sciences",
      subtitulo_madrid: "Puerta de Alcalá · Cibeles · The Bear and the Strawberry Tree",
      subtitulo_paris: "The Eiffel Tower at sunset",
      subtitulo_londres: "Big Ben, the Thames and the London Eye",
      subtitulo_nuevayork: "The Statue of Liberty and Manhattan",
      subtitulo_roma: "The Colosseum and the Eternal City",
      subtitulo_elcairo: "The Pyramids of Giza and the Nile",
      subtitulo_tokio: "Mount Fuji and the cherry blossoms",
      subtitulo_rio: "Christ the Redeemer and Sugarloaf Mountain",
      subtitulo_sidney: "The Sydney Opera House and the Harbour Bridge",
      subtitulo_marrakech: "The Koutoubia and Jemaa el-Fnaa square",
      subtitulo_machupicchu: "The Inca citadel in the Andes",
      pie: "Path to the Sky · v:73.0 · by Gabriel Vidal Badia",
    },
  };

  function idiomaActual() {
    try {
      const ls = localStorage.getItem("language");
      if (ls === "es" || ls === "val" || ls === "en") return ls;
    } catch (e) {}
    const htmlLang = document.documentElement.getAttribute("lang") || "";
    if (htmlLang.startsWith("ca")) return "val";
    if (htmlLang.startsWith("en")) return "en";
    return "es";
  }
  function tx(clave) {
    const idioma = idiomaActual();
    const paquete = TRADUCCIONES[idioma] || TRADUCCIONES.es;
    return paquete[clave] != null ? paquete[clave] : (TRADUCCIONES.es[clave] || clave);
  }

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
  const STEVE_ALTO = 62;

  const SUELO_Y = -40;
  const SUELO_ALTO = 0;
  const Y_SUELO_JUGABLE = SUELO_Y - STEVE_ALTO;
  const CAMARA_INICIAL = -ALTO + SUELO_ALTO;

  const VIDA_INICIAL = 100;
  const VIDA_MAX = 100;
  const FRAGMENTOS_POR_PANTALLA = 3;

  const UMBRAL_CAIDA_PX = 1800;
  const METROS_FIN_PANTALLA = 220;

  const DECO_RANGO = 4600;
  const DECO_RANGO_OBJETO = 4200;
  const DECO_RANGO_PEQUENO = 4000;

  const BANNER_DURACION = 180;

  const DAÑO_PAJARO = 10;
  const DAÑO_AGUILA = 15;
  const DAÑO_OSO = 20;
  const DAÑO_MURCIELAGO = 10;
  const DAÑO_GALLO = 10;
  const DAÑO_CAIDA = 30;
  const DAÑO_RATA = 15;
  const DAÑO_GATO = 15;
  const DAÑO_CAMELLO = 20;
  const DAÑO_GRULLA = 15;
  const DAÑO_TUCAN = 10;
  const DAÑO_CANGURO = 20;
  const DAÑO_MONO = 15;
  const DAÑO_LLAMA = 20;

  const INVULNERABILIDAD_FRAMES = 90;

  const FADEOUT_UNICO_INICIO_M = 155;
  const FADEOUT_UNICO_FIN_M = 200;
  const LIMITE_PROGRESO_IMAGEN = 0.80;
  const ESCALA_IMAGEN_UNICA = 1.40;

  const mediaReduced = window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)")
    : { matches: false };
  let reducedMotion = mediaReduced.matches;
  if (mediaReduced.addEventListener) {
    mediaReduced.addEventListener("change", (e) => { reducedMotion = e.matches; });
  }

  const esIPhone = /iPhone|iPod/.test(navigator.userAgent) ||
                   (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1 && !/iPad/.test(navigator.userAgent));

  const fullscreenSoportado = !!(
    !esIPhone && (
      document.fullscreenEnabled ||
      document.webkitFullscreenEnabled ||
      document.mozFullScreenEnabled ||
      document.msFullscreenEnabled
    )
  );
  // Pantalla completa "simulada" (iPhone y navegadores sin Fullscreen API):
  // el contenedor pasa a position:fixed cubriendo toda la ventana visible.
  let pseudoFS = false;
  const bloquearGestosFS = (e) => { if (e.cancelable) e.preventDefault(); };

  function estaEnFullscreen() {
    return pseudoFS || !!(document.fullscreenElement || document.webkitFullscreenElement ||
              document.mozFullScreenElement || document.msFullscreenElement);
  }
  function pedirFullscreen(el) {
    if (el.requestFullscreen) return el.requestFullscreen({ navigationUI: "hide" }).catch(() => el.requestFullscreen());
    if (el.webkitRequestFullscreen) return Promise.resolve(el.webkitRequestFullscreen());
    if (el.mozRequestFullScreen) return Promise.resolve(el.mozRequestFullScreen());
    if (el.msRequestFullscreen) return Promise.resolve(el.msRequestFullscreen());
    return Promise.reject(new Error("Fullscreen no soportado"));
  }
  function salirFullscreen() {
    const fn = document.exitFullscreen || document.webkitExitFullscreen ||
               document.mozCancelFullScreen || document.msExitFullscreen;
    if (fn) return fn.call(document);
    return Promise.reject(new Error("Exit fullscreen no soportado"));
  }
  function ajustarAlturaFullscreen() {
    if (!estaEnFullscreen()) {
      if (contenedor) contenedor.style.removeProperty("--altura-juego");
      return;
    }
    let h = (window.visualViewport && window.visualViewport.height)
      ? Math.round(window.visualViewport.height)
      : Math.round(window.innerHeight);
    if (contenedor) contenedor.style.setProperty("--altura-juego", h + "px");
  }

  // ---------- Carga de fondos ----------
  // Cada ciudad usa UNA sola imagen vertical (1080x1920) recorrida de
  // abajo a arriba. No hay versión "aérea" (2.webp).
  // Nombres reales en /image:
  //   · fondo-australia.webp  → Sídney
  //   · fondo-marruecos.webp  → Marrakech
  //   · fondo-peru.webp       → Machu Picchu
  const FONDOS = {
    valencia:    { img: null, cargada: false, ruta: "image/fondo-valencia.webp" },
    madrid:      { img: null, cargada: false, ruta: "image/fondo-madrid.webp" },
    paris:       { img: null, cargada: false, ruta: "image/fondo-paris.webp" },
    londres:     { img: null, cargada: false, ruta: "image/fondo-londres.webp" },
    nuevayork:   { img: null, cargada: false, ruta: "image/fondo-nuevayork.webp" },
    roma:        { img: null, cargada: false, ruta: "image/fondo-roma.webp" },
    elcairo:     { img: null, cargada: false, ruta: "image/fondo-elcairo.webp" },
    tokio:       { img: null, cargada: false, ruta: "image/fondo-tokio.webp" },
    rio:         { img: null, cargada: false, ruta: "image/fondo-rio.webp" },
    sidney:      { img: null, cargada: false, ruta: "image/fondo-australia.webp" },
    marrakech:   { img: null, cargada: false, ruta: "image/fondo-marruecos.webp" },
    machupicchu: { img: null, cargada: false, ruta: "image/fondo-peru.webp" },
  };
  function cargarFondos() {
    Object.keys(FONDOS).forEach((k) => {
      const f = FONDOS[k];
      const img = new Image();
      img.onload  = () => { f.cargada = true; };
      img.onerror = () => { f.cargada = false; };
      img.src = f.ruta;
      f.img = img;
    });
  }
  cargarFondos();

  // ---------- Paletas por skin ----------
  const PALETAS_SKIN = {
    topo: { fondo: "#1a0e0a", fondo2: "#2a1a12", suelo: "#5a3a2a", sueloLuz: "#8a5a40", presa: "#6a4a3a", presaLuz: "#a07a60", texto: "#f2ede3", textoSuave: "#d4c4b0", acento: "#c94a2a", acentoSuave: "#e07050", menuFondo: "rgba(20, 10, 8, 0.92)", botonFondo: "201, 74, 42", botonBorde: "232, 120, 80", botonSecFondo: "80, 50, 40", botonSecBorde: "140, 100, 80", panelFondo: "rgba(30, 15, 10, 0.95)", panelBorde: "201, 74, 42", transicionTexto: "#f2ede3", vinyeta: "rgba(0,0,0,0.5)", bloques: false, lluviaMatrix: false },
    omarchy: { fondo: "#050a1a", fondo2: "#0a1430", suelo: "#1a2540", sueloLuz: "#3a5a9a", presa: "#2a3a5a", presaLuz: "#5a8ae0", texto: "#e8f0ff", textoSuave: "#a0b8e0", acento: "#3a8ae0", acentoSuave: "#60b0ff", menuFondo: "rgba(5, 10, 30, 0.92)", botonFondo: "58, 138, 224", botonBorde: "96, 176, 255", botonSecFondo: "20, 40, 80", botonSecBorde: "80, 140, 220", panelFondo: "rgba(10, 20, 50, 0.95)", panelBorde: "96, 176, 255", transicionTexto: "#e8f0ff", vinyeta: "rgba(0,0,20,0.5)", bloques: false, lluviaMatrix: false },
    minecraft: { fondo: "#0a2a30", fondo2: "#0e3a42", suelo: "#2a6a70", sueloLuz: "#5aa0a8", presa: "#3a8a90", presaLuz: "#7ac0c8", texto: "#e0fff0", textoSuave: "#a0e0d0", acento: "#2ad0a0", acentoSuave: "#60ffd0", menuFondo: "rgba(6, 30, 34, 0.92)", botonFondo: "42, 208, 160", botonBorde: "96, 255, 208", botonSecFondo: "20, 60, 60", botonSecBorde: "60, 160, 150", panelFondo: "rgba(10, 40, 44, 0.95)", panelBorde: "42, 208, 160", transicionTexto: "#e0fff0", vinyeta: "rgba(0,0,0,0.55)", bloques: true, lluviaMatrix: false },
    matrix: { fondo: "#000000", fondo2: "#001a00", suelo: "#0a2a0a", sueloLuz: "#2aff2a", presa: "#0d3a0d", presaLuz: "#40ff40", texto: "#c8ffc8", textoSuave: "#80ff80", acento: "#00ff41", acentoSuave: "#80ff80", menuFondo: "rgba(0, 10, 0, 0.92)", botonFondo: "0, 180, 60", botonBorde: "0, 255, 65", botonSecFondo: "10, 40, 10", botonSecBorde: "0, 120, 40", panelFondo: "rgba(0, 20, 0, 0.95)", panelBorde: "0, 255, 65", transicionTexto: "#00ff41", vinyeta: "rgba(0,0,0,0.3)", bloques: false, lluviaMatrix: true },
  };

  function skinActual() {
    const s = document.documentElement.getAttribute("data-skin");
    return (s && PALETAS_SKIN[s]) ? s : "topo";
  }
  function paletaActual() {
    return PALETAS_SKIN[skinActual()];
  }
  function colorConAlpha(hex, alpha) {
    if (!hex) return "rgba(0, 0, 0, " + alpha + ")";
    if (hex.indexOf("rgba") === 0 || hex.indexOf("rgb") === 0) return hex;
    let h = hex.replace("#", "");
    if (h.length === 8) {
      const a = parseInt(h.slice(6, 8), 16) / 255;
      alpha = alpha * a;
      h = h.slice(0, 6);
    }
    if (h.length !== 6) return hex;
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
  }

  // ---------- Lluvia Matrix ----------
  const matrixLluvia = { cols: [], chars: "アカサタナハマヤラワ0123456789ABCDEFabcdef<>{}[]()=+-*/;:", inicializado: false };
  function initMatrixLluvia() {
    if (matrixLluvia.inicializado) return;
    matrixLluvia.cols = [];
    const anchoChar = 14;
    const total = Math.floor(ANCHO / anchoChar);
    for (let i = 0; i < total; i++) {
      matrixLluvia.cols.push({ x: i * anchoChar + 4, y: Math.random() * -ALTO, vel: 1 + Math.random() * 3, largo: 8 + Math.floor(Math.random() * 20) });
    }
    matrixLluvia.inicializado = true;
  }
  function dibujarMatrixLluvia() {
    if (reducedMotion) return;
    initMatrixLluvia();
    ctx.font = "13px monospace";
    ctx.textBaseline = "top";
    for (const col of matrixLluvia.cols) {
      col.y += col.vel;
      if (col.y - col.largo * 16 > ALTO) { col.y = -col.largo * 16; col.vel = 1 + Math.random() * 3; col.largo = 8 + Math.floor(Math.random() * 20); }
      for (let k = 0; k < col.largo; k++) {
        const cy = col.y - k * 16;
        if (cy < -16 || cy > ALTO) continue;
        const ch = matrixLluvia.chars[Math.floor(Math.random() * matrixLluvia.chars.length)];
        const esCabeza = k === 0;
        const alpha = esCabeza ? 1 : Math.max(0.05, 1 - k / col.largo);
        if (esCabeza) ctx.fillStyle = "rgba(200, 255, 200, " + alpha + ")";
        else ctx.fillStyle = "rgba(0, 220, 60, " + alpha + ")";
        ctx.fillText(ch, col.x, cy);
      }
    }
    ctx.textBaseline = "alphabetic";
  }

  // ============================================================================
  // Tipos de pantalla
  // ============================================================================
  const TIPOS_PANTALLA = {
    cueva: { id: 1, categoria: "cueva", fondo: "#1a1410", fondo2: "#2e2620", fondoAbajo: "#1a1410", suelo: "#4a3a30", sueloLuz: "#6a5545", presa: "#5a4a3e", presaLuz: "#8a7565", decoraciones: ["estalactita", "estalagmita", "musgo", "roca", "gota", "cofre", "esqueleto", "craneo", "moneda", "petroleo"], murcielagos: 25, vinyetaFuerte: true, degradado: false, murcielagosVoladores: true },
    grieta: { id: 2, categoria: "cueva", fondo: "#2a1f18", fondo2: "#3a2e26", fondoAbajo: "#2a1f18", suelo: "#5a4a3e", sueloLuz: "#8a7565", presa: "#6a5a4e", presaLuz: "#9a8575", decoraciones: ["estalactita", "musgo", "roca", "gota", "cristal", "grieta-luz", "craneo"], murcielagos: 15, vinyetaFuerte: true, degradado: false, murcielagosVoladores: true },
    aire: { id: 3, categoria: "aire", fondo: "#87CEEB", fondo2: "#5a9ec9", fondoAbajo: "#a0d8ef", suelo: "#6a8a4a", sueloLuz: "#8aaa6a", presa: "#f0f4f8", presaLuz: "#ffffff", decoraciones: ["nube", "montana", "arbol", "pajaro", "aguila"], murcielagos: 0, vinyetaFuerte: false, degradado: false },
    infinito: { id: 4, categoria: "cueva", fondo: "#1a1410", fondo2: "#2e2620", fondoAbajo: "#1a1410", suelo: "#4a3a30", sueloLuz: "#6a5545", presa: "#5a4a3e", presaLuz: "#8a7565", decoraciones: ["estalactita", "estalagmita", "musgo", "roca", "gota", "cofre", "esqueleto", "craneo", "moneda", "petroleo"], murcielagos: 25, vinyetaFuerte: true, degradado: false, murcielagosVoladores: true },

    valencia: {
      id: 10, categoria: "ciudad",
      fondo: "#5db8e0", fondo2: "#a8d8e8", fondoAbajo: "#f0e8d0",
      suelo: "#ff8c00", sueloLuz: "#ffb347",
      presa: "#ff8c00", presaLuz: "#ffb347",
      coloresPropios: true, fondoImg: "valencia", esCiudad: true,
      bandera: ["senyera"], decoraciones: [], animalVolador: "murcielago",
      murcielagos: 0, vinyetaFuerte: false, degradado: true,
      bannerColorA: "#c92a4a", bannerColorB: "#e8b84a", bannerEmoji: "🦇",
    },
    madrid: {
      id: 11, categoria: "ciudad",
      fondo: "#9ec5e8", fondo2: "#d0d8dc", fondoAbajo: "#e8d8b8",
      suelo: "#473e3f", sueloLuz: "#473e3f",
      presa: "#473e3f", presaLuz: "#473e3f",
      coloresPropios: true, fondoImg: "madrid", esCiudad: true,
      bandera: ["espana"], decoraciones: [], animalCaminante: "oso-bipedo",
      murcielagos: 0, vinyetaFuerte: false, degradado: true,
      bannerColorA: "#c60b1e", bannerColorB: "#ffc400", bannerEmoji: "🐻",
    },
    paris: {
      id: 12, categoria: "ciudad",
      fondo: "#0a0a2a", fondo2: "#1a2a5a", fondoAbajo: "#4a3a5a",
      suelo: "#796f6f1d", sueloLuz: "#796f6f1d",
      presa: "#d4a84a", presaLuz: "#f0c870",
      coloresPropios: true, fondoImg: "paris", esCiudad: true,
      bandera: ["francia"], decoraciones: [], animalVolador: "gallo",
      murcielagos: 0, vinyetaFuerte: false, degradado: true,
      bannerColorA: "#0055a4", bannerColorB: "#ef4135", bannerEmoji: "🐓",
    },
    londres: {
      id: 13, categoria: "ciudad",
      fondo: "#5a6070", fondo2: "#8890a0", fondoAbajo: "#c8ccd4",
      suelo: "#c41e3a", sueloLuz: "#e04a5a",
      presa: "#c41e3a", presaLuz: "#e04a5a",
      coloresPropios: true, fondoImg: "londres", esCiudad: true,
      bandera: ["reino-unido"], decoraciones: [], animalVolador: "cuervo",
      murcielagos: 0, vinyetaFuerte: false, degradado: true,
      bannerColorA: "#012169", bannerColorB: "#C8102E", bannerEmoji: "🐦‍⬛",
    },
    nuevayork: {
      id: 14, categoria: "ciudad",
      fondo: "#4a5a78", fondo2: "#8a7a8a", fondoAbajo: "#e8b880",
      suelo: "#f4c430", sueloLuz: "#f7d76a",
      presa: "#f4c430", presaLuz: "#f7d76a",
      coloresPropios: true, fondoImg: "nuevayork", esCiudad: true,
      bandera: ["eeuu"], decoraciones: [], animalCaminante: "rata",
      murcielagos: 0, vinyetaFuerte: false, degradado: true,
      bannerColorA: "#3C3B6E", bannerColorB: "#B22234", bannerEmoji: "🗽",
    },
    roma: {
      id: 15, categoria: "ciudad",
      fondo: "#4a7a3a", fondo2: "#6a9a4a", fondoAbajo: "#a8c878",
      suelo: "#3a5a28", sueloLuz: "#5a7a40",
      presa: "#2a5a1a", presaLuz: "#4a8a2a",
      coloresPropios: true, fondoImg: "roma", esCiudad: true,
      bandera: ["italia"], decoraciones: [], animalCaminante: "gato-romano",
      murcielagos: 0, vinyetaFuerte: false, degradado: true,
      bannerColorA: "#009246", bannerColorB: "#CE2B37", bannerEmoji: "🏛",
    },
    elcairo: {
      id: 16, categoria: "ciudad",
      fondo: "#e8a850", fondo2: "#f0c878", fondoAbajo: "#f8e0a8",
      suelo: "#c89040", sueloLuz: "#e8b060",
      presa: "#c89040", presaLuz: "#e8b060",
      coloresPropios: true, fondoImg: "elcairo", esCiudad: true,
      bandera: ["egipto"], decoraciones: [], animalCaminante: "camello",
      murcielagos: 0, vinyetaFuerte: false, degradado: true,
      bannerColorA: "#C8102E", bannerColorB: "#000000", bannerEmoji: "🐪",
    },
    tokio: {
      id: 17, categoria: "ciudad",
      fondo: "#f0b8c8", fondo2: "#d8a8c8", fondoAbajo: "#a888c8",
      suelo: "#6a4a7a", sueloLuz: "#8a6a9a",
      presa: "#d04868", presaLuz: "#f06888",
      coloresPropios: true, fondoImg: "tokio", esCiudad: true,
      bandera: ["japon"], decoraciones: [], animalVolador: "grulla",
      murcielagos: 0, vinyetaFuerte: false, degradado: true,
      bannerColorA: "#BC002D", bannerColorB: "#FFFFFF", bannerEmoji: "🗾",
    },
    rio: {
      id: 18, categoria: "ciudad",
      fondo: "#4aa8d8", fondo2: "#7ac8e8", fondoAbajo: "#f0d8a8",
      suelo: "#2a5a2a", sueloLuz: "#4a8a4a",
      presa: "#2a8a4a", presaLuz: "#50c070",
      coloresPropios: true, fondoImg: "rio", esCiudad: true,
      bandera: ["brasil"], decoraciones: [], animalVolador: "tucan",
      murcielagos: 0, vinyetaFuerte: false, degradado: true,
      bannerColorA: "#009C3B", bannerColorB: "#FFDF00", bannerEmoji: "🏖",
    },
    sidney: {
      id: 19, categoria: "ciudad",
      fondo: "#f0b878", fondo2: "#e89898", fondoAbajo: "#8888c8",
      suelo: "#f0c840", sueloLuz: "#f7e070",
      presa: "#f0c840", presaLuz: "#f7e070",
      coloresPropios: true, fondoImg: "sidney", esCiudad: true,
      bandera: ["australia"], decoraciones: [], animalCaminante: "canguro",
      murcielagos: 0, vinyetaFuerte: false, degradado: true,
      bannerColorA: "#00008B", bannerColorB: "#FFD700", bannerEmoji: "🦘",
    },
    marrakech: {
      id: 20, categoria: "ciudad",
      fondo: "#e8a858", fondo2: "#d88858", fondoAbajo: "#a84838",
      suelo: "#c84838", sueloLuz: "#e87058",
      presa: "#c84838", presaLuz: "#e87058",
      coloresPropios: true, fondoImg: "marrakech", esCiudad: true,
      bandera: ["marruecos"], decoraciones: [], animalCaminante: "mono",
      murcielagos: 0, vinyetaFuerte: false, degradado: true,
      bannerColorA: "#C1272D", bannerColorB: "#006233", bannerEmoji: "🐒",
    },
    machupicchu: {
      id: 21, categoria: "ciudad",
      fondo: "#88b8d8", fondo2: "#c8d8b8", fondoAbajo: "#7a9a58",
      suelo: "#6a8a48", sueloLuz: "#8aaa68",
      presa: "#8a6a3a", presaLuz: "#a88a5a",
      coloresPropios: true, fondoImg: "machupicchu", esCiudad: true,
      bandera: ["peru"], decoraciones: [], animalCaminante: "llama",
      murcielagos: 0, vinyetaFuerte: false, degradado: true,
      bannerColorA: "#D91023", bannerColorB: "#FFFFFF", bannerEmoji: "🦙",
    },
  };

  const CATALOGO_PANTALLAS = [
    { tipo: "cueva" }, { tipo: "cueva" }, { tipo: "grieta" }, { tipo: "grieta" }, { tipo: "aire" },
    { tipo: "valencia" }, { tipo: "madrid" }, { tipo: "paris" },
    { tipo: "londres" }, { tipo: "nuevayork" }, { tipo: "roma" },
    { tipo: "elcairo" }, { tipo: "tokio" }, { tipo: "rio" },
    { tipo: "sidney" }, { tipo: "marrakech" }, { tipo: "machupicchu" },
  ];

  function tipoDePantalla(numero) {
    if (numero <= CATALOGO_PANTALLAS.length) {
      const tipo = CATALOGO_PANTALLAS[numero - 1].tipo;
      return TIPOS_PANTALLA[tipo] ? tipo : "cueva";
    }
    const tipos = ["cueva", "grieta", "aire", "infinito", "valencia", "madrid", "paris", "londres", "nuevayork", "roma", "elcairo", "tokio", "rio", "sidney", "marrakech", "machupicchu"];
    return tipos[Math.floor(Math.random() * tipos.length)];
  }
  function nombreDePantalla(numero) {
    const tipo = (numero <= CATALOGO_PANTALLAS.length) ? CATALOGO_PANTALLAS[numero - 1].tipo : tipoDePantalla(numero);
    return tx("pantalla_" + tipo);
  }
  function tipoActual() {
    return TIPOS_PANTALLA[estado.tipoPantalla] || TIPOS_PANTALLA.cueva;
  }

  // ---------- Conjuntos temáticos ----------
  const CONJUNTOS = [
    { nombre: "Python",     trozos: ['def escalar():', '    subir_presa()', '    return "cima"'], resultado: "🏔 CIMA 🏔" },
    { nombre: "JavaScript", trozos: ['const subir = () => {', '  saltarPresa();', '};'],          resultado: "🚀 ¡SALTADO! 🚀" },
    { nombre: "Git",        trozos: ['git add .', 'git commit -m "vía"', 'git push'],              resultado: "✅ COMMIT ✓" },
    { nombre: "SQL",        trozos: ['SELECT * FROM', '  presas', 'WHERE altura > 100;'],          resultado: "📊 10 RESULTADOS" },
    { nombre: "HTML",       trozos: ['<div class="vía">', '  <presa/>', '</div>'],                 resultado: "🎨 VISTA ✓" },
  ];

  // ---------- Paletas de animales ----------
  const PALETAS_RATA = [
    { cuerpo: "#a8a8a8", cuerpo2: "#909090", orejas: "#808080", panza: "#d0d0d0" },
    { cuerpo: "#4a4a4a", cuerpo2: "#3a3a3a", orejas: "#2a2a2a", panza: "#6a6a6a" },
    { cuerpo: "#a08060", cuerpo2: "#806040", orejas: "#604830", panza: "#c8a880" },
  ];
  const PALETAS_GATO = [
    { cuerpo: "#f0e8d8", cuerpo2: "#d8c8b0", rayas: "#e0d0b8", orejas: "#f0e8d8", interior: "#f0b8b8", ojos: "#2aff2a", nariz: "#f0b8b8" },
    { cuerpo: "#2a2a2a", cuerpo2: "#1a1a1a", rayas: "#3a3a3a", orejas: "#1a1a1a", interior: "#5a3a3a", ojos: "#ffd700", nariz: "#5a3a3a" },
    { cuerpo: "#f0e8d8", cuerpo2: "#d8c8b0", rayas: "#e08030", orejas: "#2a2a2a", interior: "#e08030", ojos: "#2aff2a", nariz: "#e08030" },
    { cuerpo: "#a08060", cuerpo2: "#806040", rayas: "#604830", orejas: "#806040", interior: "#d8a8a8", ojos: "#2aff2a", nariz: "#d8a8a8" },
  ];
  const PALETAS_OSO = [
    { cuerpo: "#4a2a1a", cuerpo2: "#6a4a3a", pelo: "#3a1e0a", garra: "#1a0a04", hocico: "#6a4a3a", nariz: "#1a1a1a" },
    { cuerpo: "#8a6a4a", cuerpo2: "#a88a68", pelo: "#6a4a2a", garra: "#3a1e0a", hocico: "#a88a68", nariz: "#2a1a10" },
    { cuerpo: "#2a1a10", cuerpo2: "#3a2a1a", pelo: "#1a0a04", garra: "#0a0000", hocico: "#3a2a1a", nariz: "#0a0a0a" },
  ];
  const PALETAS_CUERVO = [
    { cuerpo: "#1a1a24", ala: "#0a0a12", pico: "#3a3a44", ojo: "#e8e8f0" },
    { cuerpo: "#3a3a44", ala: "#2a2a34", pico: "#4a4a54", ojo: "#ffffff" },
    { cuerpo: "#0a1a2a", ala: "#000a12", pico: "#2a3a4a", ojo: "#a0e0ff" },
  ];
  const PALETAS_CAMELLO = [
    { cuerpo: "#c8a878", cuerpo2: "#a88858", joroba: "#d8b888", pelo: "#8a6a3a", casco: "#5a4a2a", nariz: "#3a2a1a" },
    { cuerpo: "#a88858", cuerpo2: "#8a6848", joroba: "#b8a878", pelo: "#6a4a2a", casco: "#3a2a1a", nariz: "#2a1a0a" },
    { cuerpo: "#d8b888", cuerpo2: "#b89868", joroba: "#e8c898", pelo: "#a88858", casco: "#6a5a3a", nariz: "#4a3a2a" },
  ];
  const PALETAS_GRULLA = [
    { cuerpo: "#f8f4ec", cuerpo2: "#e0d8c8", cabeza: "#1a1a1a", pico: "#e0a050", patas: "#c84868", ojo: "#f0f0f0" },
    { cuerpo: "#e8e0d0", cuerpo2: "#c8c0b0", cabeza: "#2a2a2a", pico: "#c89040", patas: "#a83858", ojo: "#e0e0e0" },
    { cuerpo: "#f8f0e0", cuerpo2: "#d8d0c0", cabeza: "#0a0a0a", pico: "#e8b060", patas: "#d85878", ojo: "#ffffff" },
  ];
  const PALETAS_TUCAN = [
    { cuerpo: "#1a1a1a", pecho: "#ffcc00", pico1: "#ff8800", pico2: "#ffcc00", picoTip: "#1a1a1a", ojo: "#88ddff", anillo: "#66ccff" },
    { cuerpo: "#1a1a2a", pecho: "#ffffff", pico1: "#66cc33", pico2: "#ffcc00", picoTip: "#1a1a1a", ojo: "#ffddaa", anillo: "#ff6600" },
    { cuerpo: "#0a0a1a", pecho: "#ff4466", pico1: "#8844cc", pico2: "#ffcc00", picoTip: "#1a1a1a", ojo: "#ffddaa", anillo: "#66dd88" },
  ];
  const PALETAS_CANGURO = [
    { cuerpo: "#a87858", cuerpo2: "#c89878", vientre: "#e0c8a8", patas: "#8a5838", orejas: "#d8b090", nariz: "#2a1a10", ojos: "#1a1a1a" },
    { cuerpo: "#8a5a3a", cuerpo2: "#a87858", vientre: "#d8b898", patas: "#6a3a1a", orejas: "#c89878", nariz: "#2a1a10", ojos: "#1a1a1a" },
    { cuerpo: "#c89878", cuerpo2: "#e0b898", vientre: "#f0d8b8", patas: "#a87858", orejas: "#e8c8a8", nariz: "#3a2a1a", ojos: "#1a1a1a" },
  ];
  const PALETAS_MONO = [
    { cuerpo: "#6a4a2a", cuerpo2: "#8a6a48", cara: "#d8b090", hocico: "#f0d8b8", ojos: "#3a2a1a", nariz: "#2a1a10" },
    { cuerpo: "#4a3a2a", cuerpo2: "#6a5a48", cara: "#c8a880", hocico: "#e8c8a8", ojos: "#3a2a1a", nariz: "#2a1a10" },
    { cuerpo: "#8a6a48", cuerpo2: "#a88858", cara: "#e0c0a0", hocico: "#f0d8c0", ojos: "#3a2a1a", nariz: "#3a2a1a" },
  ];
  const PALETAS_LLAMA = [
    { cuerpo: "#e0c8a8", cuerpo2: "#c8a878", panza: "#f0e0c8", patas: "#a88858", orejas: "#d8b898", nariz: "#3a2a1a", ojos: "#1a1a1a" },
    { cuerpo: "#a87858", cuerpo2: "#8a5a3a", panza: "#c89878", patas: "#6a4a2a", orejas: "#a87858", nariz: "#2a1a10", ojos: "#1a1a1a" },
    { cuerpo: "#f0d8b8", cuerpo2: "#d8b898", panza: "#fff0d8", patas: "#c89878", orejas: "#e0c8a8", nariz: "#3a2a1a", ojos: "#1a1a1a" },
  ];

  // ---------- Estrellas y nubes ----------
  const estrellas = [];
  function initEstrellas() {
    if (estrellas.length > 0) return;
    for (let i = 0; i < 90; i++) {
      estrellas.push({
        x: Math.random() * ANCHO,
        y: Math.random() * ALTO * 0.7,
        tam: Math.random() * 1.8 + 0.4,
        parpadeo: Math.random() * Math.PI * 2,
      });
    }
  }
  const nubes = [];
  function initNubes() {
    if (nubes.length > 0) return;
    for (let i = 0; i < 4; i++) {
      nubes.push({
        x: Math.random() * ANCHO,
        y: 80 + Math.random() * 400,
        ancho: 120 + Math.random() * 100,
        alto: 22 + Math.random() * 14,
        vel: 0.08 + Math.random() * 0.12,
        alpha: 0.10 + Math.random() * 0.10,
      });
    }
  }

  // ---------- Estado ----------
  const estado = {
    modo: "menu", modoAnterior: null, opcionActiva: 0,
    personaje: {
      x: ANCHO / 2 - STEVE_ANCHO / 2, y: Y_SUELO_JUGABLE,
      ancho: STEVE_ANCHO, alto: STEVE_ALTO,
      velX: 0, velY: 0, enSuelo: false, saltando: false,
      dobleSaltoDisponible: true, saltoSuelto: true,
      frame: "parado", mirandoDerecha: true,
      ultimaPlataforma: null, alturaMaximaVuelo: Y_SUELO_JUGABLE, dañoTiempo: 0,
      vida: VIDA_INICIAL,
      invulnerable: 0,
    },
    plataformas: [], decoraciones: [], murcielagos: [],
    fragmentos: [], popups: [], popupGrande: null, conjuntoActual: null,
    teclas: { izquierda: false, derecha: false, salto: false },
    camara: { y: CAMARA_INICIAL, alturaMaxima: 0, record: 0 },
    fragmentosRecogidos: 0, fragmentosTotales: 0,
    pantalla: 1, tipoPantalla: "cueva",
    transicion: null, gameOver: false, bonusVidaDado: false,
    banner: null,
  };

  function opcionesMenuActual() {
    if (estado.modo === "menu") {
      const op = ["empezar", "instrucciones", "creditos"];
      if (!estaEnFullscreen()) op.push("pantalla-completa");
      return op;
    }
    if (estado.modo === "gameover") {
      const op = ["reintentar", "menu"];
      if (!estaEnFullscreen()) op.push("pantalla-completa");
      return op;
    }
    if (estado.modo === "confirmar-salida") {
      const op = ["si", "no"];
      if (estaEnFullscreen()) op.push("salir-fullscreen");
      return op;
    }
    return [];
  }
  function numOpciones() { return opcionesMenuActual().length; }
  function moverFoco(delta) {
    const n = numOpciones();
    if (n === 0) return;
    estado.opcionActiva = (estado.opcionActiva + delta + n) % n;
  }
  function opcionActual() {
    const lista = opcionesMenuActual();
    return lista[estado.opcionActiva] || null;
  }
  function activarOpcionActiva() {
    const opcion = opcionActual();
    if (!opcion) return;
    if (estado.modo === "menu") {
      if (opcion === "empezar") iniciarPartidaDesdeMenu();
      else if (opcion === "instrucciones") estado.modo = "instrucciones";
      else if (opcion === "creditos") estado.modo = "creditos";
      else if (opcion === "pantalla-completa") entrarPantallaCompleta();
    } else if (estado.modo === "gameover") {
      if (opcion === "reintentar") iniciarPartidaDesdeMenu();
      else if (opcion === "menu") { estado.modo = "menu"; estado.opcionActiva = 0; }
      else if (opcion === "pantalla-completa") entrarPantallaCompleta();
    } else if (estado.modo === "confirmar-salida") {
      if (opcion === "si") salirAlMenu();
      else if (opcion === "no") cancelarSalida();
      else if (opcion === "salir-fullscreen") salirPantallaCompleta();
    }
  }
  function enfocada(nombreOpcion) { return opcionActual() === nombreOpcion; }

  function actualizarClaseJugando() {
    if (!contenedor) return;
    const visible = estado.modo === "jugando" || estado.modo === "confirmar-salida";
    if (visible) contenedor.classList.add("jugando");
    else contenedor.classList.remove("jugando");
  }

  function entrarPseudoFullscreen() {
    if (pseudoFS || !contenedor) return;
    pseudoFS = true;
    contenedor.classList.add("pseudo-fs");
    document.documentElement.classList.add("juego-pseudo-fs");
    contenedor.addEventListener("touchmove", bloquearGestosFS, { passive: false });
    ajustarAlturaFullscreen();
    ajustarFocoTrasFullscreen();
    // Safari reajusta la barra de direcciones un instante después
    setTimeout(ajustarAlturaFullscreen, 150);
    setTimeout(ajustarAlturaFullscreen, 400);
  }
  function salirPseudoFullscreen() {
    if (!pseudoFS) return;
    pseudoFS = false;
    contenedor.removeEventListener("touchmove", bloquearGestosFS);
    contenedor.classList.remove("pseudo-fs");
    document.documentElement.classList.remove("juego-pseudo-fs");
    contenedor.style.removeProperty("--altura-juego");
    ajustarFocoTrasFullscreen();
  }

  function entrarPantallaCompleta() {
    if (estaEnFullscreen()) return;
    if (!fullscreenSoportado) { entrarPseudoFullscreen(); return; }
    pedirFullscreen(contenedor).then(() => {
      if (screen.orientation && screen.orientation.lock) screen.orientation.lock("portrait").catch(() => {});
      ajustarAlturaFullscreen();
    }).catch(() => { entrarPseudoFullscreen(); });
  }
  function salirPantallaCompleta() {
    if (pseudoFS) { salirPseudoFullscreen(); return Promise.resolve(); }
    if (!fullscreenSoportado) return Promise.resolve();
    return salirFullscreen().finally(() => {
      contenedor.style.removeProperty("--altura-juego");
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    });
  }
  function ajustarFocoTrasFullscreen() {
    const n = numOpciones();
    if (estado.opcionActiva >= n) estado.opcionActiva = Math.max(0, n - 1);
  }

  function actualizarBloqueoScroll() {
    const jugando = estado.modo === "jugando" || estado.modo === "confirmar-salida";
    const visible = contenedor && contenedor.style.display !== "none" && document.body.contains(contenedor);
    if (jugando && visible) document.body.style.overflow = "hidden";
    else { document.body.style.overflow = ""; document.documentElement.style.overflow = ""; }
  }
  setInterval(() => {
    const jugando = estado.modo === "jugando" || estado.modo === "confirmar-salida";
    const visible = contenedor && contenedor.style.display !== "none" && document.body.contains(contenedor);
    if ((!jugando || !visible) && document.body.style.overflow === "hidden") {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
  }, 1000);

  function mostrarBanner(tipoPantalla) {
    const tipo = TIPOS_PANTALLA[tipoPantalla];
    if (!tipo || !tipo.bannerEmoji) return;
    estado.banner = {
      tiempo: 0, duracion: BANNER_DURACION,
      nombre: tx("pantalla_" + tipoPantalla),
      subtitulo: tx("subtitulo_" + tipoPantalla),
      emoji: tipo.bannerEmoji,
      colorA: tipo.bannerColorA, colorB: tipo.bannerColorB,
    };
  }

  function crearPlataformas() {
    estado.tipoPantalla = tipoDePantalla(estado.pantalla);
    const tipo = TIPOS_PANTALLA[estado.tipoPantalla] || TIPOS_PANTALLA.cueva;
    const plats = [];
    plats.push({ x: 0, y: SUELO_Y, ancho: ANCHO, alto: SUELO_ALTO, tipo: "suelo" });

    const esCiudad = !!tipo.esCiudad;
    const TOTAL = esCiudad ? 20 : 30;

    let y = -180;
    let xActual = 200;
    for (let i = 0; i < TOTAL; i++) {
      const progreso = i / TOTAL;
      let separacionY, ancho;
      if (esCiudad) {
        separacionY = 120 + Math.round(progreso * 100);
        ancho = 180 - Math.round(progreso * 100);
      } else {
        separacionY = 100 + Math.round(progreso * 80);
        ancho = 200 - Math.round(progreso * 100);
      }
      const alto = 24;
      const minX = 40;
      const maxX = ANCHO - ancho - 40;
      let nuevoX;
      if (xActual < ANCHO / 2) nuevoX = maxX - Math.random() * 100;
      else nuevoX = minX + Math.random() * 100;
      xActual = nuevoX;
      plats.push({ x: nuevoX, y, ancho, alto, tipo: "presa", tieneFragmento: false, esBandera: false });
      y -= separacionY;
    }

    if (tipo.bandera) {
      const candidatasBandera = plats.filter((p) => p.tipo === "presa");
      const idx1 = Math.floor(Math.random() * candidatasBandera.length);
      let idx2 = Math.floor(Math.random() * candidatasBandera.length);
      while (idx2 === idx1 && candidatasBandera.length > 1) idx2 = Math.floor(Math.random() * candidatasBandera.length);
      if (candidatasBandera[idx1]) candidatasBandera[idx1].esBandera = true;
      if (candidatasBandera[idx2]) candidatasBandera[idx2].esBandera = true;
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
          x: plat.x + plat.ancho / 2, y: plat.y - 30,
          frase: plat.fraseCodigo, indiceTrozo: plat.indiceTrozo,
          plataforma: plat, recogido: false, tiempo: Math.random() * 6.28,
        });
      }
    });
    estado.fragmentosTotales = estado.fragmentos.length;
    estado.fragmentosRecogidos = 0;
    estado.bonusVidaDado = false;

    if (tipo.categoria === "ciudad") mostrarBanner(estado.tipoPantalla);
    else estado.banner = null;
  }

  function crearDecoraciones() {
    const tipo = tipoActual();
    const permitidas = tipo.decoraciones || [];
    const decor = [];
    function permitido(t) { return permitidas.indexOf(t) !== -1; }

    if (permitido("estalactita")) {
      for (let i = 0; i < 55; i++) decor.push({ tipo: "estalactita", x: Math.random() * ANCHO, y: -Math.random() * DECO_RANGO - 100, largo: 25 + Math.random() * 60, ancho: 10 + Math.random() * 14 });
    }
    if (permitido("estalagmita")) {
      for (let i = 0; i < 30; i++) decor.push({ tipo: "estalagmita", x: Math.random() * ANCHO, y: -Math.random() * DECO_RANGO - 100, largo: 20 + Math.random() * 40, ancho: 8 + Math.random() * 12 });
    }
    if (permitido("musgo")) {
      for (let i = 0; i < 45; i++) decor.push({ tipo: "musgo", x: Math.random() * ANCHO, y: -Math.random() * DECO_RANGO - 100, ancho: 40 + Math.random() * 60, alto: 20 + Math.random() * 30 });
    }
    if (permitido("roca")) {
      for (let i = 0; i < 60; i++) decor.push({ tipo: "roca", x: Math.random() * ANCHO, y: -Math.random() * DECO_RANGO - 100, ancho: 12 + Math.random() * 20, alto: 10 + Math.random() * 16 });
    }
    if (permitido("gota")) {
      for (let i = 0; i < 40; i++) decor.push({ tipo: "gota", x: Math.random() * ANCHO, y: -Math.random() * DECO_RANGO - 100, ancho: 3, alto: 6 });
    }
    if (permitido("cofre")) {
      for (let i = 0; i < 14; i++) decor.push({ tipo: "cofre", x: 60 + Math.random() * (ANCHO - 120), y: -300 - Math.random() * DECO_RANGO_OBJETO, ancho: 34, alto: 22, abierto: Math.random() > 0.5, tiempo: Math.random() * 6.28 });
    }
    if (permitido("esqueleto")) {
      for (let i = 0; i < 8; i++) decor.push({ tipo: "esqueleto", x: 80 + Math.random() * (ANCHO - 200), y: -400 - Math.random() * DECO_RANGO_PEQUENO, ancho: 90 + Math.random() * 40, alto: 50 + Math.random() * 20 });
    }
    if (permitido("craneo")) {
      for (let i = 0; i < 18; i++) decor.push({ tipo: "craneo", x: 40 + Math.random() * (ANCHO - 80), y: -350 - Math.random() * DECO_RANGO_OBJETO, tam: 10 + Math.random() * 6 });
    }
    if (permitido("moneda")) {
      for (let i = 0; i < 24; i++) decor.push({ tipo: "moneda", x: 40 + Math.random() * (ANCHO - 80), y: -300 - Math.random() * DECO_RANGO_OBJETO, tam: 6 + Math.random() * 4, tiempo: Math.random() * 6.28 });
    }
    if (permitido("petroleo")) {
      for (let i = 0; i < 10; i++) decor.push({ tipo: "petroleo", x: 80 + Math.random() * (ANCHO - 160), y: -350 - Math.random() * DECO_RANGO_OBJETO, ancho: 60 + Math.random() * 80, alto: 14 + Math.random() * 10 });
    }
    if (permitido("cristal")) {
      for (let i = 0; i < 32; i++) decor.push({ tipo: "cristal", x: Math.random() * ANCHO, y: -Math.random() * DECO_RANGO - 100, tam: 8 + Math.random() * 14, tiempo: Math.random() * 6.28 });
    }
    if (permitido("grieta-luz")) {
      for (let i = 0; i < 22; i++) decor.push({ tipo: "grieta-luz", x: Math.random() * ANCHO, y: -Math.random() * DECO_RANGO - 100, largo: 40 + Math.random() * 80, ancho: 3 + Math.random() * 4 });
    }
    if (permitido("montana")) {
      for (let i = 0; i < 16; i++) decor.push({ tipo: "montana", x: Math.random() * ANCHO, y: -Math.random() * DECO_RANGO - 100, ancho: 120 + Math.random() * 100, alto: 80 + Math.random() * 60 });
    }
    if (permitido("arbol")) {
      for (let i = 0; i < 36; i++) decor.push({ tipo: "arbol", x: 20 + Math.random() * (ANCHO - 40), y: -Math.random() * DECO_RANGO - 100, alto: 40 + Math.random() * 40 });
    }
    if (permitido("pajaro")) {
      for (let i = 0; i < 24; i++) decor.push({ tipo: "pajaro", x: Math.random() * ANCHO, y: -Math.random() * DECO_RANGO - 100, tiempo: Math.random() * 10 });
    }
    if (permitido("aguila")) {
      for (let i = 0; i < 22; i++) decor.push({ tipo: "aguila", x: Math.random() * ANCHO, y: -Math.random() * DECO_RANGO - 100, tam: 22 + Math.random() * 8, vel: 0.5 + Math.random() * 0.5, tiempo: Math.random() * 10, mirandoDerecha: Math.random() > 0.5 });
    }

    if (tipo.animalVolador === "murcielago" || tipo.animalVolador === "gallo") {
      const cantidad = tipo.animalVolador === "murcielago" ? 16 : 14;
      for (let i = 0; i < cantidad; i++) {
        decor.push({ tipo: tipo.animalVolador, x: Math.random() * ANCHO, y: -Math.random() * DECO_RANGO - 100, vel: 0.6 + Math.random() * 0.7, tiempo: Math.random() * 10, mirandoDerecha: Math.random() > 0.5 });
      }
    }

    if (tipo.animalCaminante === "oso-bipedo") {
      for (let i = 0; i < 8; i++) {
        decor.push({ tipo: "oso-bipedo", x: 40 + Math.random() * (ANCHO - 80), y: -Math.random() * DECO_RANGO - 100, vel: 0.35, tiempo: Math.random() * 10, mirandoDerecha: Math.random() > 0.5, ancho: 44, alto: 80, _atascado: 0, paleta: PALETAS_OSO[Math.floor(Math.random() * PALETAS_OSO.length)] });
      }
    }

    if (tipo.animalVolador === "cuervo") {
      for (let i = 0; i < 12; i++) {
        decor.push({ tipo: "cuervo", x: Math.random() * ANCHO, y: -Math.random() * DECO_RANGO - 100, vel: 0.7 + Math.random() * 0.7, tiempo: Math.random() * 10, mirandoDerecha: Math.random() > 0.5, paleta: PALETAS_CUERVO[Math.floor(Math.random() * PALETAS_CUERVO.length)] });
      }
    }

    if (tipo.animalCaminante === "rata") {
      for (let i = 0; i < 10; i++) {
        decor.push({ tipo: "rata", x: 40 + Math.random() * (ANCHO - 80), y: -Math.random() * DECO_RANGO - 100, vel: 0.5 + Math.random() * 0.3, tiempo: Math.random() * 10, mirandoDerecha: Math.random() > 0.5, _atascado: 0, paleta: PALETAS_RATA[Math.floor(Math.random() * PALETAS_RATA.length)] });
      }
    }

    if (tipo.animalCaminante === "gato-romano") {
      for (let i = 0; i < 10; i++) {
        decor.push({ tipo: "gato-romano", x: 40 + Math.random() * (ANCHO - 80), y: -Math.random() * DECO_RANGO - 100, vel: 0.4 + Math.random() * 0.3, tiempo: Math.random() * 10, mirandoDerecha: Math.random() > 0.5, _atascado: 0, paleta: PALETAS_GATO[Math.floor(Math.random() * PALETAS_GATO.length)] });
      }
    }

    if (tipo.animalCaminante === "camello") {
      for (let i = 0; i < 6; i++) {
        decor.push({ tipo: "camello", x: 40 + Math.random() * (ANCHO - 80), y: -Math.random() * DECO_RANGO - 100, vel: 0.3, tiempo: Math.random() * 10, mirandoDerecha: Math.random() > 0.5, ancho: 56, alto: 90, _atascado: 0, paleta: PALETAS_CAMELLO[Math.floor(Math.random() * PALETAS_CAMELLO.length)] });
      }
    }

    if (tipo.animalVolador === "grulla") {
      for (let i = 0; i < 10; i++) {
        decor.push({ tipo: "grulla", x: Math.random() * ANCHO, y: -Math.random() * DECO_RANGO - 100, vel: 0.7 + Math.random() * 0.6, tiempo: Math.random() * 10, mirandoDerecha: Math.random() > 0.5, tam: 32 + Math.random() * 8, paleta: PALETAS_GRULLA[Math.floor(Math.random() * PALETAS_GRULLA.length)] });
      }
    }

    if (tipo.animalVolador === "tucan") {
      for (let i = 0; i < 12; i++) {
        decor.push({ tipo: "tucan", x: Math.random() * ANCHO, y: -Math.random() * DECO_RANGO - 100, vel: 0.6 + Math.random() * 0.7, tiempo: Math.random() * 10, mirandoDerecha: Math.random() > 0.5, paleta: PALETAS_TUCAN[Math.floor(Math.random() * PALETAS_TUCAN.length)] });
      }
    }

    if (tipo.animalCaminante === "canguro") {
      for (let i = 0; i < 6; i++) {
        decor.push({ tipo: "canguro", x: 40 + Math.random() * (ANCHO - 80), y: -Math.random() * DECO_RANGO - 100, vel: 0.5 + Math.random() * 0.3, tiempo: Math.random() * 10, mirandoDerecha: Math.random() > 0.5, ancho: 44, alto: 78, _atascado: 0, paleta: PALETAS_CANGURO[Math.floor(Math.random() * PALETAS_CANGURO.length)] });
      }
    }

    if (tipo.animalCaminante === "mono") {
      for (let i = 0; i < 8; i++) {
        decor.push({ tipo: "mono", x: 40 + Math.random() * (ANCHO - 80), y: -Math.random() * DECO_RANGO - 100, vel: 0.5 + Math.random() * 0.3, tiempo: Math.random() * 10, mirandoDerecha: Math.random() > 0.5, ancho: 30, alto: 44, _atascado: 0, paleta: PALETAS_MONO[Math.floor(Math.random() * PALETAS_MONO.length)] });
      }
    }

    if (tipo.animalCaminante === "llama") {
      for (let i = 0; i < 6; i++) {
        decor.push({ tipo: "llama", x: 40 + Math.random() * (ANCHO - 80), y: -Math.random() * DECO_RANGO - 100, vel: 0.4 + Math.random() * 0.3, tiempo: Math.random() * 10, mirandoDerecha: Math.random() > 0.5, ancho: 40, alto: 82, _atascado: 0, paleta: PALETAS_LLAMA[Math.floor(Math.random() * PALETAS_LLAMA.length)] });
      }
    }

    estado.decoraciones = decor;
  }

  function crearMurcielagos() {
    const tipo = tipoActual();
    const cantidad = tipo.murcielagos || 0;
    const bats = [];
    for (let i = 0; i < cantidad; i++) {
      bats.push({ x: 40 + Math.random() * (ANCHO - 80), y: -200 - i * 90 - Math.random() * 60, despierto: 0, mirandoDerecha: Math.random() > 0.5, tiempo: Math.random() * 10, vel: 0.3 + Math.random() * 0.4 });
    }
    estado.murcielagos = bats;
  }

  function cargarRecord() {
    try { const g = localStorage.getItem("je-record"); if (g) estado.camara.record = parseInt(g, 10) || 0; } catch (e) {}
  }
  function guardarRecord() {
    try { localStorage.setItem("je-record", estado.camara.record); } catch (e) {}
  }

  const contenedor = document.createElement("div");
  contenedor.className = "juego-escalada notranslate";
  contenedor.setAttribute("translate", "no");
  contenedor.innerHTML = `
    <button class="juego-escalada__salir-fullscreen" type="button" aria-label="Salir de pantalla completa" title="Salir de pantalla completa">✕</button>
    <button class="juego-escalada__menu-flotante" type="button" aria-label="Menú" title="Menú">☰</button>
    <div class="juego-escalada__info notranslate" translate="no">
      <span><span data-i18n="hud_altura">Altura</span>: <strong id="je-altura">0</strong> <span data-i18n="hud_m">m</span></span>
      <span><span data-i18n="hud_fragmentos">Fragmentos</span>: <strong id="je-frags">0/0</strong></span>
      <span><span data-i18n="hud_vida">Vida</span>: <strong id="je-vida">100</strong>%</span>
      <span><span data-i18n="hud_record">Récord</span>: <strong id="je-record">0</strong> <span data-i18n="hud_m">m</span></span>
    </div>
    <div class="juego-escalada__barra notranslate" translate="no">
      <div class="juego-escalada__barra-fondo">
        <div class="juego-escalada__barra-relleno" id="je-barra-vida"></div>
      </div>
      <span class="juego-escalada__barra-pct" id="je-barra-pct">100%</span>
    </div>
    <canvas class="juego-escalada__canvas notranslate" translate="no" width="${ANCHO}" height="${ALTO}"></canvas>
    <div class="juego-escalada__controles notranslate" translate="no">
      <div class="juego-escalada__joystick" role="group" aria-label="Joystick: desliza a izquierda o derecha">
        <span class="juego-escalada__joystick-flecha juego-escalada__joystick-flecha--izq" aria-hidden="true">◀</span>
        <span class="juego-escalada__joystick-flecha juego-escalada__joystick-flecha--der" aria-hidden="true">▶</span>
        <div class="juego-escalada__joystick-knob" aria-hidden="true"></div>
      </div>
      <button class="juego-escalada__btn" data-accion="salto" aria-label="Saltar">↑</button>
    </div>
    <div class="juego-escalada__footer notranslate" translate="no">
      <span id="je-footer"></span>
    </div>
  `;

  const raizJuego = document.getElementById("juego-root");
  if (raizJuego) {
    raizJuego.appendChild(contenedor);
    contenedor.style.display = "flex";
  } else {
    document.body.appendChild(contenedor);
    contenedor.style.display = "flex";
  }

  const canvas = contenedor.querySelector(".juego-escalada__canvas");
  const ctx = canvas.getContext("2d");
  const elAltura = contenedor.querySelector("#je-altura");
  const elFrags = contenedor.querySelector("#je-frags");
  const elVida = contenedor.querySelector("#je-vida");
  const elRecord = contenedor.querySelector("#je-record");
  const elBarraVida = contenedor.querySelector("#je-barra-vida");
  const elBarraPct = contenedor.querySelector("#je-barra-pct");
  const elFooter = contenedor.querySelector("#je-footer");
  const btnSalirFullscreen = contenedor.querySelector(".juego-escalada__salir-fullscreen");
  const btnMenuFlotante = contenedor.querySelector(".juego-escalada__menu-flotante");

  btnSalirFullscreen.addEventListener("click", () => salirPantallaCompleta());
  btnMenuFlotante.addEventListener("click", () => pedirConfirmacionSalida());

  // Los botones flotantes (☰ y ✕) se anclan a las esquinas del CANVAS, no del
  // contenedor: así quedan dentro de la pantalla del juego y no tapan el HUD.
  function posicionarBotonesFlotantes() {
    if (!contenedor || !canvas) return;
    const c = canvas.getBoundingClientRect();
    const p = contenedor.getBoundingClientRect();
    if (!c.width || !p.width) return;
    const MARGEN = 6;  // separación respecto al borde del canvas
    const bordeCanvas = canvas.clientLeft || 2;
    const izqPadre = p.left + contenedor.clientLeft;
    const arrPadre = p.top + contenedor.clientTop;
    const derPadre = izqPadre + contenedor.clientWidth;
    contenedor.style.setProperty("--fl-top", Math.round(c.top - arrPadre + bordeCanvas + MARGEN) + "px");
    contenedor.style.setProperty("--fl-left", Math.round(c.left - izqPadre + bordeCanvas + MARGEN) + "px");
    contenedor.style.setProperty("--fl-right", Math.round(derPadre - c.right + bordeCanvas + MARGEN) + "px");
  }
  let rafFlotantes = 0;
  function programarBotonesFlotantes() {
    if (rafFlotantes) return;
    rafFlotantes = requestAnimationFrame(() => { rafFlotantes = 0; posicionarBotonesFlotantes(); });
  }
  if (window.ResizeObserver) {
    const ro = new ResizeObserver(programarBotonesFlotantes);
    ro.observe(canvas);
    ro.observe(contenedor);
    const infoHUD = contenedor.querySelector(".juego-escalada__info");
    if (infoHUD) ro.observe(infoHUD);
  }
  new MutationObserver(programarBotonesFlotantes).observe(contenedor, { attributes: true, attributeFilter: ["class"] });
  window.addEventListener("resize", programarBotonesFlotantes);
  window.addEventListener("orientationchange", () => { setTimeout(programarBotonesFlotantes, 200); });
  if (window.visualViewport) window.visualViewport.addEventListener("resize", programarBotonesFlotantes);
  ["fullscreenchange", "webkitfullscreenchange"].forEach((ev) => document.addEventListener(ev, () => { setTimeout(programarBotonesFlotantes, 50); }));
  window.addEventListener("load", programarBotonesFlotantes);
  document.addEventListener("portfolio:languagechange", () => { setTimeout(programarBotonesFlotantes, 50); });
  programarBotonesFlotantes();

  function aplicarIdiomaAlJuego() {
    contenedor.querySelectorAll("[data-i18n]").forEach((el) => {
      const clave = el.getAttribute("data-i18n");
      el.textContent = tx(clave);
    });
    if (elFooter) elFooter.textContent = tx("pie");
    btnSalirFullscreen.setAttribute("aria-label", tx("salir_fullscreen"));
    btnSalirFullscreen.setAttribute("title", tx("salir_fullscreen"));
    btnMenuFlotante.setAttribute("aria-label", tx("salir_titulo"));
    btnMenuFlotante.setAttribute("title", tx("salir_titulo"));
  }
  aplicarIdiomaAlJuego();

  const observerSkin = new MutationObserver(() => { aplicarColoresHUD(); });
  observerSkin.observe(document.documentElement, { attributes: true, attributeFilter: ["data-skin"] });
  document.addEventListener("portfolio:languagechange", () => { aplicarIdiomaAlJuego(); });
  window.addEventListener("storage", (e) => { if (e.key === "language") aplicarIdiomaAlJuego(); });

  function aplicarColoresHUD() {
    const p = paletaActual();
    const info = contenedor.querySelector(".juego-escalada__info");
    if (info) info.style.color = p.textoSuave;
    [elAltura, elFrags, elVida, elRecord].forEach((el) => { if (el) el.style.color = p.acento; });
    if (elFooter) elFooter.style.color = p.textoSuave;
  }
  aplicarColoresHUD();

  ["fullscreenchange", "webkitfullscreenchange", "mozfullscreenchange", "MSFullscreenChange"].forEach((ev) => {
    document.addEventListener(ev, () => { ajustarFocoTrasFullscreen(); ajustarAlturaFullscreen(); });
  });
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", ajustarAlturaFullscreen);
    window.visualViewport.addEventListener("scroll", ajustarAlturaFullscreen);
  }
  window.addEventListener("resize", ajustarAlturaFullscreen);
  window.addEventListener("orientationchange", () => { setTimeout(ajustarAlturaFullscreen, 150); });

  // ---------------------------------------------------------------------------
  // Detección de foco en campo de texto
  // ---------------------------------------------------------------------------
  function focoEnCampoDeTexto() {
    const el = document.activeElement;
    if (!el) return false;
    const tag = el.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
    if (el.isContentEditable) return true;
    return false;
  }

  document.addEventListener("keydown", (e) => {
    if (focoEnCampoDeTexto()) return;

    const enMenu = estado.modo === "menu" || estado.modo === "gameover" || estado.modo === "confirmar-salida";
    if (enMenu) {
      if (e.key === "ArrowDown" || e.key === "Tab") { e.preventDefault(); moverFoco(e.shiftKey ? -1 : 1); return; }
      if (e.key === "ArrowUp") { e.preventDefault(); moverFoco(-1); return; }
    }
    if (estado.modo === "menu") {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); activarOpcionActiva(); }
      else if (e.key === "i" || e.key === "I") { e.preventDefault(); estado.modo = "instrucciones"; }
      else if (e.key === "c" || e.key === "C") { e.preventDefault(); estado.modo = "creditos"; }
      else if (e.key === "f" || e.key === "F") { e.preventDefault(); entrarPantallaCompleta(); }
      return;
    }
    if (estado.modo === "instrucciones" || estado.modo === "creditos") {
      if (e.key === "Enter" || e.key === " " || e.key === "Escape") { e.preventDefault(); estado.modo = "menu"; estado.opcionActiva = 1; }
      return;
    }
    if (estado.modo === "gameover") {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); activarOpcionActiva(); }
      else if (e.key === "Escape") { e.preventDefault(); estado.modo = "menu"; estado.opcionActiva = 0; }
      else if (e.key === "f" || e.key === "F") { e.preventDefault(); entrarPantallaCompleta(); }
      return;
    }
    if (estado.modo === "confirmar-salida") {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); activarOpcionActiva(); }
      else if (e.key === "Escape" || e.key === "n" || e.key === "N") { e.preventDefault(); cancelarSalida(); }
      else if (e.key === "s" || e.key === "S" || e.key === "y" || e.key === "Y") { e.preventDefault(); salirAlMenu(); }
      return;
    }
    if (e.key === "Escape") {
      e.preventDefault();
      if (estaEnFullscreen()) {
        salirPantallaCompleta().finally(() => {
          document.body.style.overflow = "";
          document.documentElement.style.overflow = "";
          actualizarBloqueoScroll();
        });
      } else { pedirConfirmacionSalida(); }
      return;
    }
    if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") { estado.teclas.izquierda = true; e.preventDefault(); }
    if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") { estado.teclas.derecha = true; e.preventDefault(); }
    if (e.key === " " || e.key === "ArrowUp" || e.key === "w" || e.key === "W") { estado.teclas.salto = true; e.preventDefault(); }
  });
  document.addEventListener("keyup", (e) => {
    if (focoEnCampoDeTexto()) return;
    if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") estado.teclas.izquierda = false;
    if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") estado.teclas.derecha = false;
    if (e.key === " " || e.key === "ArrowUp" || e.key === "w" || e.key === "W") {
      estado.teclas.salto = false;
      estado.personaje.saltoSuelto = true;
    }
  });

  // Botón de salto (táctil)
  contenedor.querySelectorAll(".juego-escalada__btn").forEach((btn) => {
    const accion = btn.dataset.accion;
    const activar = (e) => {
      e.preventDefault();
      if (accion === "salto") estado.teclas.salto = true;
    };
    const desactivar = (e) => {
      e.preventDefault();
      if (accion === "salto") { estado.teclas.salto = false; estado.personaje.saltoSuelto = true; }
    };
    btn.addEventListener("pointerdown", activar);
    btn.addEventListener("pointerup", desactivar);
    btn.addEventListener("pointerleave", desactivar);
    btn.addEventListener("pointercancel", desactivar);
  });

  // Joystick (táctil): mantén el dedo y desliza a izquierda/derecha sin levantarlo.
  // Usa Pointer Events + setPointerCapture, así sigue al dedo aunque se salga del pad,
  // y funciona a la vez que el botón de salto (multitáctil) en Android e iOS.
  (function iniciarJoystick() {
    const pad = contenedor.querySelector(".juego-escalada__joystick");
    const knob = pad && pad.querySelector(".juego-escalada__joystick-knob");
    if (!pad || !knob) return;

    const ZONA_MUERTA = 0.2;   // 20% central = quieto
    let punteroId = null;

    function mover(clientX, clientY) {
      const r = pad.getBoundingClientRect();
      const radio = Math.max(1, (r.width - knob.offsetWidth) / 2);
      const dx = clientX - (r.left + r.width / 2);
      const dy = Math.max(-10, Math.min(10, (clientY - (r.top + r.height / 2)) * 0.3));
      const valor = Math.max(-1, Math.min(1, dx / radio));
      knob.style.transform = "translate(calc(-50% + " + (valor * radio) + "px), calc(-50% + " + dy + "px))";
      estado.teclas.izquierda = valor < -ZONA_MUERTA;
      estado.teclas.derecha = valor > ZONA_MUERTA;
    }

    function soltar() {
      punteroId = null;
      estado.teclas.izquierda = false;
      estado.teclas.derecha = false;
      knob.style.transform = "";
      pad.classList.remove("activo");
    }

    pad.addEventListener("pointerdown", (e) => {
      if (punteroId !== null) return;
      e.preventDefault();
      punteroId = e.pointerId;
      try { pad.setPointerCapture(e.pointerId); } catch (err) { /* sin captura: sigue funcionando dentro del pad */ }
      pad.classList.add("activo");
      mover(e.clientX, e.clientY);
    });
    pad.addEventListener("pointermove", (e) => {
      if (e.pointerId !== punteroId) return;
      e.preventDefault();
      mover(e.clientX, e.clientY);
    });
    ["pointerup", "pointercancel", "lostpointercapture"].forEach((ev) => {
      pad.addEventListener(ev, (e) => { if (e.pointerId === punteroId) soltar(); });
    });
    pad.addEventListener("contextmenu", (e) => e.preventDefault());
    window.addEventListener("blur", soltar);
    document.addEventListener("visibilitychange", () => { if (document.hidden) soltar(); });
  })();

  canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const escalaX = ANCHO / rect.width;
    const escalaY = ALTO / rect.height;
    const mx = (e.clientX - rect.left) * escalaX;
    const my = (e.clientY - rect.top) * escalaY;
    function dentro(btn) {
      if (!btn) return false;
      return mx >= btn.x && mx <= btn.x + btn.w && my >= btn.y && my <= btn.y + btn.h;
    }
    if (estado.modo === "menu") {
      if (dentro(estado._btnEmpezar)) { estado.opcionActiva = 0; iniciarPartidaDesdeMenu(); }
      else if (dentro(estado._btnInstrucciones)) { estado.opcionActiva = 1; estado.modo = "instrucciones"; }
      else if (dentro(estado._btnCreditos)) { estado.opcionActiva = 2; estado.modo = "creditos"; }
      else if (dentro(estado._btnPantallaCompleta)) entrarPantallaCompleta();
    } else if (estado.modo === "gameover") {
      if (dentro(estado._btnReintentar)) { estado.opcionActiva = 0; iniciarPartidaDesdeMenu(); }
      else if (dentro(estado._btnMenu)) { estado.opcionActiva = 1; estado.modo = "menu"; estado.opcionActiva = 0; }
      else if (dentro(estado._btnPantallaCompleta)) entrarPantallaCompleta();
    } else if (estado.modo === "confirmar-salida") {
      if (dentro(estado._btnSiSalir)) { estado.opcionActiva = 0; salirAlMenu(); }
      else if (dentro(estado._btnNoSalir)) { estado.opcionActiva = 1; cancelarSalida(); }
      else if (dentro(estado._btnSalirFullscreen)) salirPantallaCompleta();
    }
  });

  function pedirConfirmacionSalida() {
    if (estado.modo !== "jugando") return;
    estado.modoAnterior = estado.modo;
    estado.modo = "confirmar-salida";
    estado.opcionActiva = 0;
    estado.teclas.izquierda = false;
    estado.teclas.derecha = false;
    estado.teclas.salto = false;
    actualizarClaseJugando();
    actualizarBloqueoScroll();
  }
  function cancelarSalida() {
    estado.modo = estado.modoAnterior || "jugando";
    estado.modoAnterior = null;
    actualizarClaseJugando();
    actualizarBloqueoScroll();
  }
  function salirAlMenu() {
    estado.modo = "menu";
    estado.modoAnterior = null;
    estado.gameOver = false;
    estado.opcionActiva = 0;
    const p = estado.personaje;
    p.x = ANCHO / 2 - STEVE_ANCHO / 2;
    p.y = Y_SUELO_JUGABLE;
    p.velX = 0; p.velY = 0;
    p.enSuelo = false; p.saltando = false;
    p.dobleSaltoDisponible = true; p.saltoSuelto = true;
    p.frame = "parado";
    p.alturaMaximaVuelo = Y_SUELO_JUGABLE;
    p.dañoTiempo = 0;
    p.vida = VIDA_INICIAL;
    p.invulnerable = 0;
    estado.camara.y = CAMARA_INICIAL;
    estado.banner = null;
    actualizarClaseJugando();
    actualizarBloqueoScroll();
  }

  function aplicarDaño(cantidad) {
    const p = estado.personaje;
    if (p.invulnerable > 0) return;
    if (estado.modo !== "jugando") return;
    p.vida -= cantidad;
    if (p.vida < 0) p.vida = 0;
    p.dañoTiempo = 30;
    p.invulnerable = INVULNERABILIDAD_FRAMES;
    if (p.vida <= 0) {
      estado.gameOver = true;
      estado.modo = "gameover";
      estado.opcionActiva = 0;
      actualizarClaseJugando();
      actualizarBloqueoScroll();
    }
  }

  function comprobarColisionesAnimales() {
    const p = estado.personaje;
    const pcx = p.x + p.ancho / 2;
    const pcy = p.y + p.alto / 2;

    for (const bat of estado.murcielagos) {
      const bx = bat.x + 13;
      const by = bat.y + 12;
      const d = Math.hypot(bx - pcx, by - pcy);
      if (d < 22) { aplicarDaño(DAÑO_MURCIELAGO); return; }
    }

    for (const d of estado.decoraciones) {
      const dx = d.x;
      const dy = d.y + 12;
      let radio = 0;
      let daño = 0;
      if (d.tipo === "murcielago") { radio = 20; daño = DAÑO_MURCIELAGO; }
      else if (d.tipo === "gallo") { radio = 22; daño = DAÑO_GALLO; }
      else if (d.tipo === "pajaro") { radio = 12; daño = DAÑO_PAJARO; }
      else if (d.tipo === "aguila") { radio = 24; daño = DAÑO_AGUILA; }
      else if (d.tipo === "oso-bipedo") { radio = 32; daño = DAÑO_OSO; }
      else if (d.tipo === "cuervo") { radio = 20; daño = DAÑO_PAJARO; }
      else if (d.tipo === "rata") { radio = 20; daño = DAÑO_RATA; }
      else if (d.tipo === "gato-romano") { radio = 22; daño = DAÑO_GATO; }
      else if (d.tipo === "camello") { radio = 36; daño = DAÑO_CAMELLO; }
      else if (d.tipo === "grulla") { radio = 32; daño = DAÑO_GRULLA; }
      else if (d.tipo === "tucan") { radio = 20; daño = DAÑO_TUCAN; }
      else if (d.tipo === "canguro") { radio = 30; daño = DAÑO_CANGURO; }
      else if (d.tipo === "mono") { radio = 22; daño = DAÑO_MONO; }
      else if (d.tipo === "llama") { radio = 32; daño = DAÑO_LLAMA; }
      if (radio === 0) continue;
      const dist = Math.hypot(dx - pcx, dy - pcy);
      if (dist < radio) { aplicarDaño(daño); return; }
    }
  }

  function colisionaEntidadConPlataformas(cx, cy, radio) {
    const ax = cx - radio, ay = cy - radio;
    const aw = radio * 2, ah = radio * 2;
    for (const plat of estado.plataformas) {
      if (ax + aw > plat.x && ax < plat.x + plat.ancho &&
          ay + ah > plat.y && ay < plat.y + plat.alto) {
        return true;
      }
    }
    return false;
  }

  function actualizarAnimales() {
    const p = estado.personaje;

    for (const bat of estado.murcielagos) {
      const dist = Math.abs(bat.y - p.y) + Math.abs(bat.x - p.x) * 0.5;
      if (dist < 120) bat.despierto = Math.min(1, bat.despierto + 0.15);
      else bat.despierto = Math.max(0, bat.despierto - 0.05);
      bat.tiempo += 0.1;
      const vel = (bat.vel || 0.4) * 0.6;
      let nx = bat.x + (bat.mirandoDerecha ? 1 : -1) * vel;
      let ny = bat.y + Math.sin(bat.tiempo * 1.7) * 1.2;
      if (nx > ANCHO - 26) { nx = ANCHO - 26; bat.mirandoDerecha = false; }
      if (nx < 0) { nx = 0; bat.mirandoDerecha = true; }
      bat.x = nx;
      bat.y = ny;
    }

    for (const d of estado.decoraciones) {
      if (d.tipo === "murcielago" || d.tipo === "gallo" || d.tipo === "cuervo" || d.tipo === "tucan") {
        d.tiempo += 0.3;
        const factor = d.tipo === "cuervo" ? 0.8 : (d.tipo === "gallo" ? 0.8 : 0.9);
        const vel = d.vel * factor;
        d.x += (d.mirandoDerecha ? 1 : -1) * vel;
        if (d.x > ANCHO + 40) { d.x = ANCHO + 40; d.mirandoDerecha = false; }
        if (d.x < -40) { d.x = -40; d.mirandoDerecha = true; }
      } else if (d.tipo === "grulla") {
        d.tiempo += 0.06;
        const vel = d.vel * 1.2;
        d.x += (d.mirandoDerecha ? 1 : -1) * vel;
        if (d.x > ANCHO + 70) { d.x = ANCHO + 70; d.mirandoDerecha = false; }
        if (d.x < -70) { d.x = -70; d.mirandoDerecha = true; }
        d.y += Math.sin(d.tiempo * 1.5) * 0.4;
      } else if (d.tipo === "oso-bipedo") {
        d.tiempo += 0.12;
        const vel = d.vel * 0.7;
        let nx = d.x + (d.mirandoDerecha ? 1 : -1) * vel;
        if (nx > ANCHO - 20) { nx = ANCHO - 20; d.mirandoDerecha = false; }
        if (nx < 20) { nx = 20; d.mirandoDerecha = true; }
        const choca = colisionaEntidadConPlataformas(nx, d.y + 35, 17);
        if (!choca) { d.x = nx; d._atascado = 0; }
        else { d._atascado = (d._atascado || 0) + 1; d.mirandoDerecha = !d.mirandoDerecha; if (d._atascado > 5) { d.y -= 60; d._atascado = 0; } }
      } else if (d.tipo === "camello") {
        d.tiempo += 0.10;
        const vel = d.vel * 0.6;
        let nx = d.x + (d.mirandoDerecha ? 1 : -1) * vel;
        if (nx > ANCHO - 30) { nx = ANCHO - 30; d.mirandoDerecha = false; }
        if (nx < 30) { nx = 30; d.mirandoDerecha = true; }
        const choca = colisionaEntidadConPlataformas(nx, d.y + 42, 20);
        if (!choca) { d.x = nx; d._atascado = 0; }
        else { d._atascado = (d._atascado || 0) + 1; d.mirandoDerecha = !d.mirandoDerecha; if (d._atascado > 5) { d.y -= 70; d._atascado = 0; } }
      } else if (d.tipo === "canguro") {
        d.tiempo += 0.15;
        const vel = d.vel * 1.1;
        let nx = d.x + (d.mirandoDerecha ? 1 : -1) * vel;
        if (nx > ANCHO - 25) { nx = ANCHO - 25; d.mirandoDerecha = false; }
        if (nx < 25) { nx = 25; d.mirandoDerecha = true; }
        const choca = colisionaEntidadConPlataformas(nx, d.y + 34, 18);
        if (!choca) { d.x = nx; d._atascado = 0; }
        else { d._atascado = (d._atascado || 0) + 1; d.mirandoDerecha = !d.mirandoDerecha; if (d._atascado > 5) { d.y -= 60; d._atascado = 0; } }
      } else if (d.tipo === "mono") {
        d.tiempo += 0.18;
        const vel = d.vel * 1.0;
        let nx = d.x + (d.mirandoDerecha ? 1 : -1) * vel;
        if (nx > ANCHO - 18) { nx = ANCHO - 18; d.mirandoDerecha = false; }
        if (nx < 18) { nx = 18; d.mirandoDerecha = true; }
        const choca = colisionaEntidadConPlataformas(nx, d.y + 20, 14);
        if (!choca) { d.x = nx; d._atascado = 0; }
        else { d._atascado = (d._atascado || 0) + 1; d.mirandoDerecha = !d.mirandoDerecha; if (d._atascado > 5) { d.y -= 40; d._atascado = 0; } }
      } else if (d.tipo === "llama") {
        d.tiempo += 0.10;
        const vel = d.vel * 0.6;
        let nx = d.x + (d.mirandoDerecha ? 1 : -1) * vel;
        if (nx > ANCHO - 25) { nx = ANCHO - 25; d.mirandoDerecha = false; }
        if (nx < 25) { nx = 25; d.mirandoDerecha = true; }
        const choca = colisionaEntidadConPlataformas(nx, d.y + 40, 18);
        if (!choca) { d.x = nx; d._atascado = 0; }
        else { d._atascado = (d._atascado || 0) + 1; d.mirandoDerecha = !d.mirandoDerecha; if (d._atascado > 5) { d.y -= 60; d._atascado = 0; } }
      } else if (d.tipo === "rata") {
        d.tiempo += 0.15;
        const vel = d.vel * 0.9;
        let nx = d.x + (d.mirandoDerecha ? 1 : -1) * vel;
        if (nx > ANCHO - 10) { nx = ANCHO - 10; d.mirandoDerecha = false; }
        if (nx < 10) { nx = 10; d.mirandoDerecha = true; }
        const choca = colisionaEntidadConPlataformas(nx, d.y + 8, 12);
        if (!choca) { d.x = nx; d._atascado = 0; }
        else { d._atascado = (d._atascado || 0) + 1; d.mirandoDerecha = !d.mirandoDerecha; if (d._atascado > 5) { d.y -= 40; d._atascado = 0; } }
      } else if (d.tipo === "gato-romano") {
        d.tiempo += 0.12;
        const vel = d.vel * 0.8;
        let nx = d.x + (d.mirandoDerecha ? 1 : -1) * vel;
        if (nx > ANCHO - 15) { nx = ANCHO - 15; d.mirandoDerecha = false; }
        if (nx < 15) { nx = 15; d.mirandoDerecha = true; }
        const choca = colisionaEntidadConPlataformas(nx, d.y + 18, 16);
        if (!choca) { d.x = nx; d._atascado = 0; }
        else { d._atascado = (d._atascado || 0) + 1; d.mirandoDerecha = !d.mirandoDerecha; if (d._atascado > 5) { d.y -= 50; d._atascado = 0; } }
      } else if (d.tipo === "aguila") {
        d.tiempo += 0.04;
        const vel = d.vel * 1.6;
        d.x += (d.mirandoDerecha ? 1 : -1) * vel;
        if (d.x > ANCHO + 60) { d.x = ANCHO + 60; d.mirandoDerecha = false; }
        if (d.x < -60) { d.x = -60; d.mirandoDerecha = true; }
        d.y += Math.sin(d.tiempo * 2) * 0.3;
      } else if (d.tipo === "nube") {
        d.x += d.vel * 0.3;
        if (d.x > ANCHO + 100) d.x = -100;
      } else if (d.tipo === "pajaro") {
        // decoración pura
      }
    }
  }

  function respawn() {
    const p = estado.personaje;
    if (p.vida <= 0) { estado.gameOver = true; estado.modo = "gameover"; estado.opcionActiva = 0; actualizarClaseJugando(); actualizarBloqueoScroll(); return; }
    let respawnPlat = null;
    let mejorDist = Infinity;
    for (const plat of estado.plataformas) {
      if (plat.tipo !== "presa") continue;
      if (plat.y >= p.y) continue;
      const dist = p.y - plat.y;
      if (dist < mejorDist) { mejorDist = dist; respawnPlat = plat; }
    }
    if (respawnPlat) { p.x = respawnPlat.x + respawnPlat.ancho / 2 - p.ancho / 2; p.y = respawnPlat.y - p.alto - 2; }
    else { p.x = ANCHO / 2 - p.ancho / 2; p.y = Y_SUELO_JUGABLE; }
    p.velX = 0; p.velY = 0;
    p.saltando = false; p.dobleSaltoDisponible = true; p.saltoSuelto = true;
    p.frame = "parado";
    p.alturaMaximaVuelo = p.y;
  }

  function iniciarTransicion() {
    estado.transicion = { tiempo: 0, duracion: 120, tipo: estado.tipoPantalla };
    estado.pantalla++;
    estado.tipoPantalla = tipoDePantalla(estado.pantalla);
    crearPlataformas();
    crearDecoraciones();
    crearMurcielagos();
    const p = estado.personaje;
    p.x = ANCHO / 2 - STEVE_ANCHO / 2;
    p.y = Y_SUELO_JUGABLE;
    p.velX = 0; p.velY = 0;
    p.alturaMaximaVuelo = p.y;
    p.enSuelo = false; p.saltando = false;
    p.dobleSaltoDisponible = true; p.saltoSuelto = true;
    estado.camara.y = CAMARA_INICIAL;
  }
  function actualizarTransicion() {
    if (estado.modo !== "jugando") return false;
    if (!estado.transicion) return false;
    estado.transicion.tiempo++;
    if (estado.transicion.tiempo > estado.transicion.duracion) { estado.transicion = null; return false; }
    return true;
  }
  function dibujarTransicion() {
    const tr = estado.transicion;
    if (!tr) return;
    const p = paletaActual();
    const mitad = tr.duracion / 2;
    let alpha;
    if (tr.tiempo < mitad) alpha = tr.tiempo / mitad;
    else alpha = (tr.duracion - tr.tiempo) / mitad;
    ctx.fillStyle = "rgba(0, 0, 0, " + alpha + ")";
    ctx.fillRect(0, 0, ANCHO, ALTO);
    ctx.fillStyle = p.transicionTexto;
    ctx.globalAlpha = alpha;
    ctx.font = "bold 36px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(tx("pantalla") + " " + estado.pantalla + " · " + nombreDePantalla(estado.pantalla), ANCHO / 2, ALTO / 2);
    ctx.globalAlpha = 1;
    ctx.textAlign = "start";
    ctx.textBaseline = "alphabetic";
  }

  function actualizarBanner() {
    if (!estado.banner) return;
    estado.banner.tiempo++;
    if (estado.banner.tiempo > estado.banner.duracion) { estado.banner = null; }
  }
  function dibujarBanner() {
    const b = estado.banner;
    if (!b) return;
    const t = b.tiempo;
    const duracion = b.duracion;
    let alpha = 1;
    if (t < 20) alpha = t / 20;
    if (t > duracion - 30) alpha = (duracion - t) / 30;
    alpha = Math.max(0, Math.min(1, alpha));
    const anchoBanner = 480;
    const altoBanner = 130;
    const x = (ANCHO - anchoBanner) / 2;
    const y = 30;
    ctx.fillStyle = "rgba(0, 0, 0, " + (alpha * 0.88) + ")";
    ctx.fillRect(x, y, anchoBanner, altoBanner);
    ctx.fillStyle = b.colorA;
    ctx.globalAlpha = alpha;
    ctx.fillRect(x, y, anchoBanner, 6);
    ctx.fillStyle = b.colorB;
    ctx.fillRect(x, y + altoBanner - 6, anchoBanner, 6);
    ctx.strokeStyle = "rgba(255, 255, 255, " + (alpha * 0.45) + ")";
    ctx.lineWidth = 2;
    ctx.strokeRect(x + 1, y + 1, anchoBanner - 2, altoBanner - 2);
    ctx.font = "bold 54px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#ffffff";
    ctx.globalAlpha = alpha;
    ctx.fillText(b.emoji, x + 65, y + altoBanner / 2);
    ctx.font = "bold 38px monospace";
    ctx.textAlign = "left";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(b.nombre.toUpperCase(), x + 130, y + 50);
    ctx.font = "14px monospace";
    ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
    ctx.fillText(b.subtitulo, x + 130, y + 90);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x + 130, y + 68);
    ctx.lineTo(x + anchoBanner - 20, y + 68);
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.textAlign = "start";
    ctx.textBaseline = "alphabetic";
  }

  function iniciarPartidaDesdeMenu() {
    estado.modo = "jugando";
    estado.opcionActiva = 0;
    reiniciarPartida();
    actualizarClaseJugando();
    actualizarBloqueoScroll();
  }
  function reiniciarPartida() {
    estado.modo = "jugando";
    estado.fragmentosRecogidos = 0;
    estado.gameOver = false;
    estado.bonusVidaDado = false;
    estado.camara.y = CAMARA_INICIAL;
    estado.camara.alturaMaxima = 0;
    estado.pantalla = 1;
    estado.tipoPantalla = tipoDePantalla(1);
    estado.transicion = null;
    estado.popups = [];
    estado.popupGrande = null;
    estado.banner = null;
    const p = estado.personaje;
    p.x = ANCHO / 2 - STEVE_ANCHO / 2;
    p.y = Y_SUELO_JUGABLE;
    p.velX = 0; p.velY = 0;
    p.enSuelo = false; p.saltando = false;
    p.dobleSaltoDisponible = true; p.saltoSuelto = true;
    p.frame = "parado";
    p.alturaMaximaVuelo = Y_SUELO_JUGABLE;
    p.dañoTiempo = 0;
    p.vida = VIDA_INICIAL;
    p.invulnerable = 0;
    crearPlataformas();
    crearDecoraciones();
    crearMurcielagos();
  }

  function colisiona(a, b) {
    return a.x + a.ancho > b.x && a.x < b.x + b.ancho && a.y + a.alto > b.y && a.y < b.y + b.alto;
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
    let aterrizo = false, plataformaTocada = null;
    for (const plat of estado.plataformas) {
      if (colisiona(p, plat)) {
        if (dy > 0) { p.y = plat.y - p.alto; aterrizo = true; plataformaTocada = plat; }
        else if (dy < 0) { p.y = plat.y + plat.alto; }
        p.velY = 0;
      }
    }
    if (plataformaTocada) p.ultimaPlataforma = plataformaTocada;
    return aterrizo;
  }

  function comprobarFragmentos() {
    const p = estado.personaje;
    for (const frag of estado.fragmentos) {
      if (frag.recogido) continue;
      const dx = Math.abs((p.x + p.ancho / 2) - frag.x);
      const dy = Math.abs((p.y + p.alto / 2) - frag.y);
      if (dx < 30 && dy < 30) {
        frag.recogido = true;
        estado.fragmentosRecogidos++;
        estado.popups.push({ x: frag.x, y: frag.y, texto: frag.frase, tiempo: 0, duracion: 80, tipo: "fragmento" });
        if (estado.fragmentosRecogidos >= estado.fragmentosTotales) {
          estado.popupGrande = { tiempo: 0, duracion: 90, conjunto: estado.conjuntoActual };
        }
      }
    }
    if (estado.fragmentosRecogidos >= estado.fragmentosTotales && !estado.bonusVidaDado) {
      estado.bonusVidaDado = true;
      estado.personaje.vida = Math.min(VIDA_MAX, estado.personaje.vida + 25);
      estado.popups.push({ x: p.x + p.ancho / 2, y: p.y, texto: "+25% VIDA", tiempo: 0, duracion: 220, tipo: "vida" });
    }
  }

  function comprobarCaida() {
    const p = estado.personaje;
    if (!p.enSuelo) {
      if (p.velY <= 0 && p.y < p.alturaMaximaVuelo) p.alturaMaximaVuelo = p.y;
      return;
    }
    const caida = p.y - p.alturaMaximaVuelo;
    if (caida > UMBRAL_CAIDA_PX) { aplicarDaño(DAÑO_CAIDA); }
    p.alturaMaximaVuelo = p.y;
  }

  function actualizarFisica() {
    const p = estado.personaje;
    if (estado.modo !== "jugando") return;
    if (estado.gameOver) return;
    if (actualizarTransicion()) return;
    actualizarBanner();

    if (p.dañoTiempo > 0) p.dañoTiempo--;
    if (p.invulnerable > 0) p.invulnerable--;

    if (estado.teclas.izquierda) { p.velX -= ACELERACION; p.mirandoDerecha = false; }
    if (estado.teclas.derecha)   { p.velX += ACELERACION; p.mirandoDerecha = true; }
    if (!estado.teclas.izquierda && !estado.teclas.derecha) p.velX *= FRICCION;
    p.velX = Math.max(-VELOCIDAD_MAX_X, Math.min(VELOCIDAD_MAX_X, p.velX));

    if (estado.teclas.salto && p.saltoSuelto && p.enSuelo) {
      p.velY = VELOCIDAD_SALTO;
      p.enSuelo = false; p.saltando = true;
      p.saltoSuelto = false; p.dobleSaltoDisponible = true;
      p.alturaMaximaVuelo = p.y;
    } else if (estado.teclas.salto && p.saltoSuelto && !p.enSuelo && p.dobleSaltoDisponible) {
      p.velY = Math.min(p.velY, 0) + IMPULSO_DOBLE;
      p.saltando = true; p.saltoSuelto = false; p.dobleSaltoDisponible = false;
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
    actualizarAnimales();
    comprobarColisionesAnimales();

    const objetivo = p.y - ALTO * 0.4;
    estado.camara.y += (objetivo - estado.camara.y) * 0.15;
    if (estado.camara.y > CAMARA_INICIAL) estado.camara.y = CAMARA_INICIAL;

    const alturaEnPantalla = Math.max(0, Math.round((Y_SUELO_JUGABLE - p.y) / PX_POR_METRO));
    if (alturaEnPantalla >= METROS_FIN_PANTALLA) { iniciarTransicion(); return; }

    const altura = (estado.pantalla - 1) * METROS_FIN_PANTALLA + alturaEnPantalla;
    if (altura > estado.camara.alturaMaxima) estado.camara.alturaMaxima = altura;
    if (altura > estado.camara.record) { estado.camara.record = altura; guardarRecord(); }

    elAltura.textContent = altura + " " + tx("hud_m") + " · " + tx("hud_p") + estado.pantalla;
    elFrags.textContent = estado.fragmentosRecogidos + "/" + estado.fragmentosTotales;
    elVida.textContent = Math.round(p.vida);
    const porcentaje = Math.max(0, Math.min(100, p.vida));
    elBarraVida.style.width = porcentaje + "%";
    let color = "#4caf50";
    if (porcentaje < 30) color = "#f44336";
    else if (porcentaje < 60) color = "#ff9800";
    else if (porcentaje < 80) color = "#ffc107";
    elBarraVida.style.background = color;
    if (elBarraPct) { elBarraPct.textContent = Math.round(porcentaje) + "%"; elBarraPct.style.color = color; }
    elRecord.textContent = estado.camara.record;
  }

  function dibujarSteve(x, y, frame, mirando, daño) {
    const p = estado.personaje;
    if (p.invulnerable > 0 && Math.floor(p.invulnerable / 6) % 2 === 0) return;
    const piel = daño > 0 && Math.floor(daño / 4) % 2 === 0 ? "#ff8888" : "#C9A27E";
    const pelo = "#5A3A1E";
    const camiseta = daño > 0 && Math.floor(daño / 4) % 2 === 0 ? "#ff6666" : "#24A0A0";
    const pantalon = "#3A4A7A";
    const bota = "#3A2E1E";
    const ojo = "#1a1a1a";
    ctx.save();
    if (!mirando) { ctx.translate(x + 26, y); ctx.scale(-1, 1); x = 0; y = 0; }
    ctx.fillStyle = piel; ctx.fillRect(x, y, 26, 22);
    ctx.fillStyle = pelo;
    ctx.fillRect(x, y, 26, 7);
    ctx.fillRect(x, y + 7, 3, 5);
    ctx.fillRect(x + 23, y + 7, 3, 5);
    ctx.fillStyle = ojo;
    ctx.fillRect(x + 6, y + 11, 3, 3);
    ctx.fillRect(x + 17, y + 11, 3, 3);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(x + 7, y + 12, 1, 1);
    ctx.fillRect(x + 18, y + 12, 1, 1);
    ctx.fillStyle = ojo; ctx.fillRect(x + 10, y + 17, 6, 1);
    ctx.fillStyle = camiseta;
    ctx.fillRect(x + 3, y + 22, 20, 20);
    ctx.fillStyle = "#1a6a6a";
    ctx.fillRect(x + 9, y + 22, 8, 3);
    if (frame === "parado") {
      ctx.fillStyle = piel;
      ctx.fillRect(x + 1, y + 24, 3, 16);
      ctx.fillRect(x + 22, y + 24, 3, 16);
    } else if (frame === "corriendo") {
      ctx.fillStyle = piel;
      ctx.fillRect(x + 1, y + 21, 3, 16);
      ctx.fillRect(x + 22, y + 27, 3, 16);
    } else {
      ctx.fillStyle = piel;
      ctx.fillRect(x - 1, y + 11, 3, 18);
      ctx.fillRect(x + 24, y + 11, 3, 18);
    }
    ctx.fillStyle = pantalon;
    if (frame === "parado") {
      ctx.fillRect(x + 4, y + 42, 8, 18);
      ctx.fillRect(x + 14, y + 42, 8, 18);
    } else if (frame === "corriendo") {
      ctx.fillRect(x + 3, y + 42, 8, 18);
      ctx.fillRect(x + 15, y + 42, 8, 18);
    } else {
      ctx.fillRect(x + 5, y + 42, 7, 18);
      ctx.fillRect(x + 14, y + 42, 7, 18);
    }
    ctx.fillStyle = bota;
    if (frame === "parado") {
      ctx.fillRect(x + 4, y + 58, 8, 3);
      ctx.fillRect(x + 14, y + 58, 8, 3);
    } else if (frame === "corriendo") {
      ctx.fillRect(x + 3, y + 58, 8, 3);
      ctx.fillRect(x + 15, y + 58, 8, 3);
    } else {
      ctx.fillRect(x + 5, y + 58, 7, 3);
      ctx.fillRect(x + 14, y + 58, 7, 3);
    }
    ctx.restore();
  }

  function dibujarMurcielago(bat, x, y) {
    const cuerpo = "#1a1a1a", ala = "#0a0a0a";
    const brillo = bat.despierto;
    const aleteo = bat.despierto > 0.5 ? Math.sin(bat.tiempo * 4) * 1.5 : 0;
    const pulso = 0.5 + Math.sin(bat.tiempo * 2.5) * 0.5;
    ctx.strokeStyle = "rgba(201, 162, 39, " + (0.55 + pulso * 0.45) + ")";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(x + 10, y + 12, 14 + aleteo * 0.2, 11, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "rgba(201, 162, 39, " + (0.08 + pulso * 0.10) + ")";
    ctx.beginPath();
    ctx.ellipse(x + 10, y + 12, 18 + aleteo * 0.3, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = ala;
    ctx.fillRect(x - 3, y + 8 + aleteo, 8, 10);
    ctx.fillRect(x + 15, y + 8 - aleteo, 8, 10);
    ctx.fillStyle = cuerpo;
    ctx.fillRect(x + 5, y + 6, 10, 12);
    ctx.fillRect(x + 3, y + 3, 4, 5);
    ctx.fillRect(x + 13, y + 3, 4, 5);
    const ojoColor = bat.despierto > 0.1
      ? "rgba(255, " + (100 + Math.round(80 * brillo)) + ", 50, " + (0.3 + brillo * 0.7) + ")"
      : "#ff3a3a";
    ctx.fillStyle = ojoColor;
    ctx.fillRect(x + 7, y + 9, 2, 2); ctx.fillRect(x + 11, y + 9, 2, 2);
    if (brillo > 0.5) {
      ctx.fillStyle = "rgba(255, 150, 50, " + ((brillo - 0.5) * 0.6) + ")";
      ctx.fillRect(x + 6, y + 8, 4, 4); ctx.fillRect(x + 10, y + 8, 4, 4);
    }
    ctx.fillStyle = cuerpo;
    ctx.fillRect(x + 9, y + 18, 2, 3);
  }

  function dibujarFragmento(frag) {
    if (frag.recogido) return;
    const fx = frag.x;
    const fy = frag.y - estado.camara.y;
    const flote = Math.sin(frag.tiempo) * 3;
    const y = fy + flote;
    ctx.fillStyle = "rgba(120, 200, 255, " + (0.3 + Math.sin(frag.tiempo * 2) * 0.1) + ")";
    ctx.beginPath(); ctx.arc(fx, y, 22, 0, Math.PI * 2); ctx.fill();
    const ancho = 16, alto = 16;
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(fx - ancho / 2 - 1, y - alto / 2 - 1, ancho + 2, alto + 2);
    ctx.fillStyle = "#3a6ea5";
    ctx.fillRect(fx - ancho / 2, y - alto / 2, ancho, alto);
    ctx.fillStyle = "#5a8ec5";
    ctx.fillRect(fx - ancho / 2 + 1, y - alto / 2 + 1, ancho - 2, 2);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 10px monospace";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("</>", fx, y + 1);
    ctx.textAlign = "start"; ctx.textBaseline = "alphabetic";
  }

  function dibujarPopups() {
    for (let i = estado.popups.length - 1; i >= 0; i--) {
      const pop = estado.popups[i];
      pop.tiempo++; pop.y -= 0.4;
      if (pop.tiempo > pop.duracion) { estado.popups.splice(i, 1); continue; }
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
      ctx.fillStyle = pop.tipo === "vida" ? "rgba(102, 255, 102, " + alpha + ")" : "rgba(180, 220, 255, " + alpha + ")";
      ctx.font = "bold 13px monospace";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(pop.texto, px, py + 1);
      ctx.textAlign = "start"; ctx.textBaseline = "alphabetic";
    }
  }

  function dibujarPopupGrande() {
    const pg = estado.popupGrande;
    if (!pg) return;
    const pal = paletaActual();
    pg.tiempo++;
    if (pg.tiempo > pg.duracion) { estado.popupGrande = null; return; }
    const duracion = pg.duracion, t = pg.tiempo;
    let alpha = 1;
    if (t < 10) alpha = t / 10;
    if (t > duracion - 20) alpha = (duracion - t) / 20;
    alpha = Math.max(0, Math.min(1, alpha));
    const anchoPanel = 460, altoPanel = 150;
    const px = (ANCHO - anchoPanel) / 2;
    const py = 20;
    ctx.fillStyle = "rgba(0, 0, 0, " + (alpha * 0.55) + ")";
    ctx.fillRect(px - 8, py - 8, anchoPanel + 16, altoPanel + 16);
    ctx.fillStyle = pal.panelFondo;
    ctx.globalAlpha = alpha;
    ctx.fillRect(px, py, anchoPanel, altoPanel);
    ctx.globalAlpha = 1;
    ctx.strokeStyle = "rgba(" + pal.panelBorde + ", " + alpha + ")";
    ctx.lineWidth = 3;
    ctx.strokeRect(px, py, anchoPanel, altoPanel);
    ctx.fillStyle = pal.acento;
    ctx.globalAlpha = alpha;
    ctx.font = "bold 18px monospace";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("¡FRAGMENTOS COMPLETOS!", ANCHO / 2, py + 26);
    ctx.fillStyle = pal.texto;
    ctx.font = "13px monospace";
    for (let i = 0; i < pg.conjunto.trozos.length; i++) {
      ctx.fillText(pg.conjunto.trozos[i], ANCHO / 2, py + 58 + i * 18);
    }
    const parpadeo = Math.sin(t * 0.4) * 0.5 + 0.5;
    ctx.fillStyle = pal.acentoSuave;
    ctx.globalAlpha = alpha * (0.6 + parpadeo * 0.4);
    ctx.font = "bold 18px monospace";
    ctx.fillText(pg.conjunto.resultado, ANCHO / 2, py + altoPanel - 22);
    ctx.globalAlpha = 1;
    ctx.textAlign = "start"; ctx.textBaseline = "alphabetic";
  }

  function dibujarMurcielagoValencia(d, dy) {
    const aleteo = Math.sin(d.tiempo * 5) * 5;
    const dir = d.mirandoDerecha ? 1 : -1;
    ctx.fillStyle = "#0a0a0a";
    ctx.beginPath();
    ctx.moveTo(d.x - 4, dy - 2);
    ctx.quadraticCurveTo(d.x - 18, dy - 6 + aleteo, d.x - 24, dy + 2 + aleteo);
    ctx.lineTo(d.x - 20, dy + 6 + aleteo);
    ctx.quadraticCurveTo(d.x - 14, dy + 4, d.x - 6, dy + 4);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(d.x + 4, dy - 2);
    ctx.quadraticCurveTo(d.x + 18, dy - 6 - aleteo, d.x + 24, dy + 2 - aleteo);
    ctx.lineTo(d.x + 20, dy + 6 - aleteo);
    ctx.quadraticCurveTo(d.x + 14, dy + 4, d.x + 6, dy + 4);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#2a2a2a";
    ctx.beginPath();
    ctx.ellipse(d.x, dy, 7, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#1a1a1a";
    ctx.beginPath();
    ctx.moveTo(d.x - 3, dy - 4);
    ctx.lineTo(d.x - 8, dy - 12);
    ctx.lineTo(d.x - 1, dy - 5);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(d.x + 3, dy - 4);
    ctx.lineTo(d.x + 8, dy - 12);
    ctx.lineTo(d.x + 1, dy - 5);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#ff2020";
    ctx.beginPath();
    ctx.arc(d.x + dir * 2, dy - 2, 1.3, 0, Math.PI * 2);
    ctx.fill();
  }

  function dibujarGalloParis(d, dy) {
    const dir = d.mirandoDerecha ? 1 : -1;
    const aleteo = Math.sin(d.tiempo * 4) * 3;
    ctx.fillStyle = "#0055a4";
    ctx.beginPath();
    ctx.moveTo(d.x - dir * 10, dy - 4);
    ctx.quadraticCurveTo(d.x - dir * 28, dy - 18 + aleteo, d.x - dir * 16, dy + 2);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.moveTo(d.x - dir * 10, dy + 2);
    ctx.quadraticCurveTo(d.x - dir * 26, dy + 2 - aleteo, d.x - dir * 16, dy + 10);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#ef4135";
    ctx.beginPath();
    ctx.moveTo(d.x - dir * 10, dy + 6);
    ctx.quadraticCurveTo(d.x - dir * 22, dy + 16 + aleteo, d.x - dir * 12, dy + 16);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#f8f8f8";
    ctx.beginPath();
    ctx.ellipse(d.x, dy + 4, 14, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#c8c8c8";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = "#f8f8f8";
    ctx.beginPath();
    ctx.arc(d.x + dir * 12, dy - 6, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#ef4135";
    ctx.beginPath();
    ctx.arc(d.x + dir * 8, dy - 14, 4, 0, Math.PI * 2);
    ctx.arc(d.x + dir * 12, dy - 16, 5, 0, Math.PI * 2);
    ctx.arc(d.x + dir * 16, dy - 14, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffc400";
    ctx.beginPath();
    ctx.moveTo(d.x + dir * 19, dy - 6);
    ctx.lineTo(d.x + dir * 28, dy - 5);
    ctx.lineTo(d.x + dir * 19, dy - 2);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#1a1a1a";
    ctx.beginPath();
    ctx.arc(d.x + dir * 14, dy - 7, 1.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#ffc400";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(d.x - 4, dy + 12);
    ctx.lineTo(d.x - 5, dy + 18);
    ctx.moveTo(d.x + 4, dy + 12);
    ctx.lineTo(d.x + 5, dy + 18);
    ctx.stroke();
  }

  function dibujarCuervo(d, dy) {
    const dir = d.mirandoDerecha ? 1 : -1;
    const aleteo = Math.sin(d.tiempo * 5) * 4;
    const p = d.paleta || PALETAS_CUERVO[0];
    ctx.fillStyle = p.ala;
    ctx.beginPath();
    ctx.moveTo(d.x - 3, dy - 1);
    ctx.quadraticCurveTo(d.x - 15, dy - 11 + aleteo, d.x - 11, dy + 2);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(d.x + 3, dy - 1);
    ctx.quadraticCurveTo(d.x + 15, dy - 11 - aleteo, d.x + 11, dy + 2);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = p.cuerpo;
    ctx.beginPath();
    ctx.ellipse(d.x, dy + 2, 7, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(d.x + dir * 5, dy - 1, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = p.pico;
    ctx.beginPath();
    ctx.moveTo(d.x + dir * 8, dy - 2);
    ctx.lineTo(d.x + dir * 12, dy - 1);
    ctx.lineTo(d.x + dir * 8, dy);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = p.ojo;
    ctx.beginPath();
    ctx.arc(d.x + dir * 6, dy - 2, 0.9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = p.ala;
    ctx.beginPath();
    ctx.moveTo(d.x - dir * 7, dy + 2);
    ctx.lineTo(d.x - dir * 13, dy + 5);
    ctx.lineTo(d.x - dir * 9, dy + 1);
    ctx.closePath();
    ctx.fill();
  }

  function dibujarRata(d, dy) {
    const dir = d.mirandoDerecha ? 1 : -1;
    const correteo = Math.sin(d.tiempo * 8) * 1;
    const p = d.paleta || PALETAS_RATA[0];
    ctx.strokeStyle = "#8a7a6a";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(d.x - dir * 10, dy + 8);
    ctx.quadraticCurveTo(d.x - dir * 24, dy + 6 + correteo, d.x - dir * 36, dy + 16 + correteo);
    ctx.stroke();
    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.beginPath();
    ctx.ellipse(d.x, dy + 13, 15, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = p.cuerpo;
    ctx.beginPath();
    ctx.ellipse(d.x, dy + 5, 15, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = p.panza;
    ctx.beginPath();
    ctx.ellipse(d.x, dy + 8, 10, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = p.cuerpo2;
    ctx.beginPath();
    ctx.ellipse(d.x + dir * 13, dy + 1, 8, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = p.cuerpo;
    ctx.beginPath();
    ctx.moveTo(d.x + dir * 18, dy + 1);
    ctx.lineTo(d.x + dir * 25, dy + 3);
    ctx.lineTo(d.x + dir * 18, dy + 4);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#2a1a10";
    ctx.beginPath();
    ctx.arc(d.x + dir * 24, dy + 3, 1.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = p.orejas;
    ctx.beginPath();
    ctx.arc(d.x + dir * 10, dy - 5, 4, 0, Math.PI * 2);
    ctx.arc(d.x + dir * 15, dy - 4, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#d8a8a8";
    ctx.beginPath();
    ctx.arc(d.x + dir * 10, dy - 5, 2, 0, Math.PI * 2);
    ctx.arc(d.x + dir * 15, dy - 4, 1.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#1a1a1a";
    ctx.beginPath();
    ctx.arc(d.x + dir * 14, dy + 0.5, 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(d.x + dir * 14.5, dy, 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(200,200,200,0.5)";
    ctx.lineWidth = 0.6;
    ctx.beginPath();
    ctx.moveTo(d.x + dir * 22, dy + 3);
    ctx.lineTo(d.x + dir * 28, dy + 1);
    ctx.moveTo(d.x + dir * 22, dy + 3);
    ctx.lineTo(d.x + dir * 28, dy + 5);
    ctx.stroke();
    ctx.fillStyle = p.cuerpo2;
    ctx.fillRect(d.x - 7, dy + 12 + correteo, 3, 4);
    ctx.fillRect(d.x + 0, dy + 12 - correteo, 3, 4);
    ctx.fillRect(d.x + 7, dy + 12 + correteo, 3, 4);
  }

  function dibujarGatoRomano(d, dy) {
    const dir = d.mirandoDerecha ? 1 : -1;
    const meneo = Math.sin(d.tiempo * 3) * 3;
    const p = d.paleta || PALETAS_GATO[0];
    ctx.strokeStyle = p.cuerpo2;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(d.x - dir * 9, dy + 6);
    ctx.quadraticCurveTo(d.x - dir * 16, dy - 2 + meneo, d.x - dir * 13, dy - 10 + meneo);
    ctx.stroke();
    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.beginPath();
    ctx.ellipse(d.x, dy + 11, 11, 2.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = p.cuerpo;
    ctx.beginPath();
    ctx.ellipse(d.x, dy + 3, 10, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = p.rayas;
    ctx.fillRect(d.x - 5, dy, 1.5, 5);
    ctx.fillRect(d.x - 1, dy, 1.5, 5);
    ctx.fillRect(d.x + 3, dy, 1.5, 5);
    ctx.fillStyle = p.cuerpo2;
    ctx.beginPath();
    ctx.arc(d.x + dir * 8, dy - 2, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = p.orejas;
    ctx.beginPath();
    ctx.moveTo(d.x + dir * 4, dy - 7);
    ctx.lineTo(d.x + dir * 3, dy - 12);
    ctx.lineTo(d.x + dir * 8, dy - 7);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(d.x + dir * 10, dy - 7);
    ctx.lineTo(d.x + dir * 12, dy - 12);
    ctx.lineTo(d.x + dir * 13, dy - 6);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = p.interior;
    ctx.beginPath();
    ctx.moveTo(d.x + dir * 5, dy - 8);
    ctx.lineTo(d.x + dir * 4.5, dy - 11);
    ctx.lineTo(d.x + dir * 7.5, dy - 7);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(d.x + dir * 11, dy - 8);
    ctx.lineTo(d.x + dir * 12, dy - 11);
    ctx.lineTo(d.x + dir * 12.5, dy - 7);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = p.ojos;
    ctx.beginPath();
    ctx.arc(d.x + dir * 6.5, dy - 2, 1.1, 0, Math.PI * 2);
    ctx.arc(d.x + dir * 10, dy - 2, 1.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#0a0a0a";
    ctx.beginPath();
    ctx.ellipse(d.x + dir * 6.5, dy - 2, 0.35, 1.05, 0, 0, Math.PI * 2);
    ctx.ellipse(d.x + dir * 10, dy - 2, 0.35, 1.05, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = p.nariz;
    ctx.beginPath();
    ctx.arc(d.x + dir * 9, dy + 1, 0.9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = p.cuerpo2;
    ctx.fillRect(d.x - 5, dy + 9, 2.5, 3.5);
    ctx.fillRect(d.x + 2, dy + 9, 2.5, 3.5);
  }

  function dibujarOsoBipedo(d, dy) {
    const balanceo = Math.sin(d.tiempo * 3) * 3;
    const brazoIzqY = Math.sin(d.tiempo * 3) * 4;
    const brazoDerY = -Math.sin(d.tiempo * 3) * 4;
    const p = d.paleta || PALETAS_OSO[0];
    ctx.save();
    ctx.translate(d.x, 0);
    if (!d.mirandoDerecha) ctx.scale(-1, 1);
    const x = 0;
    const y = dy;
    ctx.fillStyle = p.pelo;
    ctx.fillRect(x - 14, y + 24 + balanceo * 0.3, 10, 16);
    ctx.fillRect(x + 4, y + 24 - balanceo * 0.3, 10, 16);
    ctx.fillStyle = p.garra;
    ctx.fillRect(x - 15, y + 38 + balanceo * 0.3, 12, 4);
    ctx.fillRect(x + 3, y + 38 - balanceo * 0.3, 12, 4);
    ctx.fillStyle = p.cuerpo;
    ctx.beginPath();
    ctx.ellipse(x, y + 4, 20, 22, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = p.cuerpo2;
    ctx.beginPath();
    ctx.ellipse(x, y + 8, 12, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = p.cuerpo;
    ctx.beginPath();
    ctx.ellipse(x - 20, y - 6 + brazoIzqY, 6, 12, 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x + 20, y - 6 + brazoDerY, 6, 12, -0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = p.garra;
    ctx.beginPath();
    ctx.moveTo(x - 24, y - 16 + brazoIzqY);
    ctx.lineTo(x - 26, y - 22 + brazoIzqY);
    ctx.lineTo(x - 22, y - 18 + brazoIzqY);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x - 21, y - 17 + brazoIzqY);
    ctx.lineTo(x - 22, y - 24 + brazoIzqY);
    ctx.lineTo(x - 19, y - 18 + brazoIzqY);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x - 18, y - 16 + brazoIzqY);
    ctx.lineTo(x - 18, y - 22 + brazoIzqY);
    ctx.lineTo(x - 16, y - 17 + brazoIzqY);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x + 24, y - 16 + brazoDerY);
    ctx.lineTo(x + 26, y - 22 + brazoDerY);
    ctx.lineTo(x + 22, y - 18 + brazoDerY);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x + 21, y - 17 + brazoDerY);
    ctx.lineTo(x + 22, y - 24 + brazoDerY);
    ctx.lineTo(x + 19, y - 18 + brazoDerY);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x + 18, y - 16 + brazoDerY);
    ctx.lineTo(x + 18, y - 22 + brazoDerY);
    ctx.lineTo(x + 16, y - 17 + brazoDerY);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = p.cuerpo;
    ctx.beginPath();
    ctx.arc(x + 2, y - 22, 13, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x - 8, y - 32, 5, 0, Math.PI * 2);
    ctx.arc(x + 12, y - 32, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = p.pelo;
    ctx.beginPath();
    ctx.arc(x - 8, y - 32, 2.5, 0, Math.PI * 2);
    ctx.arc(x + 12, y - 32, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = p.hocico;
    ctx.beginPath();
    ctx.ellipse(x + 8, y - 18, 6, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = p.nariz;
    ctx.beginPath();
    ctx.arc(x + 12, y - 18, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#f0e8d8";
    ctx.beginPath();
    ctx.arc(x - 1, y - 24, 2.5, 0, Math.PI * 2);
    ctx.arc(x + 7, y - 24, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#1a1a1a";
    ctx.beginPath();
    ctx.arc(x - 0.5, y - 24, 1.3, 0, Math.PI * 2);
    ctx.arc(x + 7.5, y - 24, 1.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#1a1a1a";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x - 4, y - 27);
    ctx.lineTo(x + 1, y - 26);
    ctx.moveTo(x + 10, y - 27);
    ctx.lineTo(x + 5, y - 26);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + 8, y - 15);
    ctx.quadraticCurveTo(x + 5, y - 12, x + 2, y - 14);
    ctx.stroke();
    ctx.restore();
  }

  function dibujarCamello(d, dy) {
    const balanceo = Math.sin(d.tiempo * 2.5) * 4;
    const p = d.paleta || PALETAS_CAMELLO[0];
    ctx.save();
    ctx.translate(d.x, 0);
    if (!d.mirandoDerecha) ctx.scale(-1, 1);
    const x = 0;
    const y = dy;
    ctx.fillStyle = p.cuerpo2;
    ctx.fillRect(x - 16, y + 34 + balanceo * 0.4, 6, 30);
    ctx.fillRect(x - 8, y + 34 - balanceo * 0.3, 6, 30);
    ctx.fillRect(x + 4, y + 34 - balanceo * 0.4, 6, 30);
    ctx.fillRect(x + 12, y + 34 + balanceo * 0.3, 6, 30);
    ctx.fillStyle = p.casco;
    ctx.fillRect(x - 17, y + 62 + balanceo * 0.4, 8, 4);
    ctx.fillRect(x - 9, y + 62 - balanceo * 0.3, 8, 4);
    ctx.fillRect(x + 3, y + 62 - balanceo * 0.4, 8, 4);
    ctx.fillRect(x + 11, y + 62 + balanceo * 0.3, 8, 4);
    ctx.fillStyle = p.cuerpo;
    ctx.beginPath();
    ctx.ellipse(x, y + 24, 22, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = p.joroba;
    ctx.beginPath();
    ctx.ellipse(x + 2, y + 10, 14, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = p.cuerpo;
    ctx.beginPath();
    ctx.moveTo(x + 16, y + 20);
    ctx.quadraticCurveTo(x + 26, y + 4, x + 22, y - 18);
    ctx.lineTo(x + 30, y - 20);
    ctx.quadraticCurveTo(x + 34, y + 4, x + 24, y + 26);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = p.cuerpo;
    ctx.beginPath();
    ctx.ellipse(x + 30, y - 22, 10, 7, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = p.cuerpo2;
    ctx.beginPath();
    ctx.arc(x + 26, y - 28, 3, 0, Math.PI * 2);
    ctx.arc(x + 32, y - 28, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = p.cuerpo2;
    ctx.beginPath();
    ctx.ellipse(x + 38, y - 22, 4, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#1a1a1a";
    ctx.beginPath();
    ctx.arc(x + 30, y - 24, 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = p.nariz;
    ctx.beginPath();
    ctx.arc(x + 41, y - 22, 1.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = p.pelo;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x - 20, y + 22);
    ctx.lineTo(x - 24, y + 30 + balanceo * 0.3);
    ctx.stroke();
    ctx.restore();
  }

  function dibujarGrulla(d, dy) {
    const dir = d.mirandoDerecha ? 1 : -1;
    const aleteo = Math.sin(d.tiempo * 3) * 6;
    const p = d.paleta || PALETAS_GRULLA[0];
    const t = d.tam || 34;
    const escala = t / 34;
    ctx.save();
    ctx.translate(d.x, dy);
    if (!d.mirandoDerecha) ctx.scale(-1, 1);
    ctx.scale(escala, escala);
    ctx.fillStyle = p.cuerpo;
    ctx.beginPath();
    ctx.moveTo(-4, -2);
    ctx.quadraticCurveTo(-30, -18 + aleteo, -22, 6);
    ctx.quadraticCurveTo(-14, 2, -4, 2);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(4, -2);
    ctx.quadraticCurveTo(30, -18 - aleteo, 22, 6);
    ctx.quadraticCurveTo(14, 2, 4, 2);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = p.cabeza;
    ctx.beginPath();
    ctx.moveTo(-22, -6);
    ctx.lineTo(-30, 4);
    ctx.lineTo(-24, 6);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(22, -6);
    ctx.lineTo(30, 4);
    ctx.lineTo(24, 6);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = p.cuerpo;
    ctx.beginPath();
    ctx.ellipse(0, 4, 12, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = p.cuerpo2;
    ctx.beginPath();
    ctx.ellipse(0, 6, 8, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = p.cuerpo;
    ctx.lineWidth = 3.5;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(6, 2);
    ctx.quadraticCurveTo(18, -6, 16, -18);
    ctx.stroke();
    ctx.fillStyle = p.cabeza;
    ctx.beginPath();
    ctx.arc(16, -20, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#c83030";
    ctx.beginPath();
    ctx.arc(18, -23, 1.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = p.ojo;
    ctx.beginPath();
    ctx.arc(17, -20, 0.9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#1a1a1a";
    ctx.beginPath();
    ctx.arc(17.3, -20, 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = p.pico;
    ctx.beginPath();
    ctx.moveTo(20, -20);
    ctx.lineTo(30, -19);
    ctx.lineTo(20, -17);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = p.patas;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(0, 10);
    ctx.lineTo(-2, 22);
    ctx.moveTo(4, 10);
    ctx.lineTo(6, 22);
    ctx.stroke();
    ctx.restore();
  }

  function dibujarTucan(d, dy) {
    const dir = d.mirandoDerecha ? 1 : -1;
    const aleteo = Math.sin(d.tiempo * 5) * 4;
    const p = d.paleta || PALETAS_TUCAN[0];
    ctx.save();
    ctx.translate(d.x, dy);
    if (!d.mirandoDerecha) ctx.scale(-1, 1);
    ctx.fillStyle = p.cuerpo;
    ctx.beginPath();
    ctx.moveTo(-3, -1);
    ctx.quadraticCurveTo(-16, -12 + aleteo, -12, 3);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(3, -1);
    ctx.quadraticCurveTo(16, -12 - aleteo, 12, 3);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = p.cuerpo;
    ctx.beginPath();
    ctx.ellipse(0, 3, 8, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = p.pecho;
    ctx.beginPath();
    ctx.ellipse(-1, 5, 5, 3.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = p.cuerpo;
    ctx.beginPath();
    ctx.arc(6, -2, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = p.pico1;
    ctx.beginPath();
    ctx.moveTo(9, -4);
    ctx.quadraticCurveTo(20, -6, 22, -3);
    ctx.quadraticCurveTo(20, -1, 9, -1);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = p.pico2;
    ctx.beginPath();
    ctx.moveTo(9, -1);
    ctx.quadraticCurveTo(19, -1, 22, -3);
    ctx.quadraticCurveTo(19, 0.5, 9, 0.5);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = p.picoTip;
    ctx.beginPath();
    ctx.arc(22, -3, 1.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = p.anillo;
    ctx.beginPath();
    ctx.arc(7, -3, 1.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = p.ojo;
    ctx.beginPath();
    ctx.arc(7, -3, 1, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#1a1a1a";
    ctx.beginPath();
    ctx.arc(7.2, -3, 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = p.cuerpo;
    ctx.beginPath();
    ctx.moveTo(-7, 2);
    ctx.lineTo(-13, 5);
    ctx.lineTo(-9, 1);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#4a3a2a";
    ctx.fillRect(-2, 8, 1.5, 3);
    ctx.fillRect(2, 8, 1.5, 3);
    ctx.restore();
  }

  function dibujarCanguro(d, dy) {
    const balanceo = Math.sin(d.tiempo * 4) * 4;
    const p = d.paleta || PALETAS_CANGURO[0];
    ctx.save();
    ctx.translate(d.x, 0);
    if (!d.mirandoDerecha) ctx.scale(-1, 1);
    const x = 0;
    const y = dy;
    ctx.fillStyle = p.patas;
    ctx.beginPath();
    ctx.ellipse(x - 8, y + 42, 10, 20, 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x + 6, y + 42, 10, 20, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = p.cuerpo;
    ctx.beginPath();
    ctx.ellipse(x - 12, y + 60, 14, 6, 0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x + 10, y + 60, 14, 6, -0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = p.cuerpo2;
    ctx.beginPath();
    ctx.moveTo(x - 14, y + 30);
    ctx.quadraticCurveTo(x - 34, y + 40 + balanceo, x - 40, y + 60 + balanceo);
    ctx.lineTo(x - 30, y + 62 + balanceo);
    ctx.quadraticCurveTo(x - 22, y + 42, x - 12, y + 36);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = p.cuerpo;
    ctx.beginPath();
    ctx.ellipse(x, y + 20, 16, 22, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = p.vientre;
    ctx.beginPath();
    ctx.ellipse(x + 2, y + 26, 10, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = p.cuerpo2;
    ctx.beginPath();
    ctx.ellipse(x + 10, y + 14, 5, 9, -0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x + 4, y + 22, 4, 7, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = p.cuerpo;
    ctx.beginPath();
    ctx.ellipse(x + 6, y - 2, 7, 10, 0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = p.cuerpo2;
    ctx.beginPath();
    ctx.ellipse(x + 8, y - 14, 10, 8, 0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = p.cuerpo;
    ctx.beginPath();
    ctx.ellipse(x + 15, y - 12, 6, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = p.nariz;
    ctx.beginPath();
    ctx.arc(x + 19, y - 12, 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = p.cuerpo2;
    ctx.beginPath();
    ctx.ellipse(x + 4, y - 22, 3.5, 8, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x + 12, y - 22, 3.5, 8, 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = p.orejas;
    ctx.beginPath();
    ctx.ellipse(x + 4, y - 22, 2, 6, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x + 12, y - 22, 2, 6, 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = p.ojos;
    ctx.beginPath();
    ctx.arc(x + 12, y - 15, 1.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(x + 12.5, y - 15.5, 0.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function dibujarMono(d, dy) {
    const balanceo = Math.sin(d.tiempo * 5) * 2;
    const p = d.paleta || PALETAS_MONO[0];
    ctx.save();
    ctx.translate(d.x, 0);
    if (!d.mirandoDerecha) ctx.scale(-1, 1);
    const x = 0;
    const y = dy;
    ctx.strokeStyle = p.cuerpo;
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x - 10, y + 12);
    ctx.quadraticCurveTo(x - 20, y + 10, x - 18, y - 2);
    ctx.quadraticCurveTo(x - 14, y - 8, x - 8, y - 4);
    ctx.stroke();
    ctx.fillStyle = p.cuerpo2;
    ctx.fillRect(x - 8, y + 26, 6, 14);
    ctx.fillRect(x + 4, y + 26, 6, 14);
    ctx.fillStyle = p.cuerpo;
    ctx.fillRect(x - 9, y + 38, 8, 3);
    ctx.fillRect(x + 3, y + 38, 8, 3);
    ctx.fillStyle = p.cuerpo;
    ctx.beginPath();
    ctx.ellipse(x, y + 14, 12, 16, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = p.cuerpo2;
    ctx.beginPath();
    ctx.ellipse(x, y + 18, 7, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = p.cuerpo;
    ctx.fillRect(x - 12, y + 8 + balanceo, 4, 14);
    ctx.fillRect(x + 8, y + 8 - balanceo, 4, 14);
    ctx.fillStyle = p.cuerpo;
    ctx.beginPath();
    ctx.arc(x + 2, y - 4, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = p.cara;
    ctx.beginPath();
    ctx.ellipse(x + 2, y - 2, 6, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = p.hocico;
    ctx.beginPath();
    ctx.ellipse(x + 2, y + 2, 4, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = p.cuerpo;
    ctx.beginPath();
    ctx.arc(x - 8, y - 6, 5, 0, Math.PI * 2);
    ctx.arc(x + 12, y - 6, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = p.cara;
    ctx.beginPath();
    ctx.arc(x - 8, y - 6, 3, 0, Math.PI * 2);
    ctx.arc(x + 12, y - 6, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = p.ojos;
    ctx.beginPath();
    ctx.arc(x - 1, y - 4, 1.5, 0, Math.PI * 2);
    ctx.arc(x + 6, y - 4, 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(x - 0.5, y - 4.5, 0.5, 0, Math.PI * 2);
    ctx.arc(x + 6.5, y - 4.5, 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = p.nariz;
    ctx.beginPath();
    ctx.arc(x + 2, y + 0.5, 0.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = p.ojos;
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(x - 1, y + 3);
    ctx.quadraticCurveTo(x + 2, y + 5, x + 5, y + 3);
    ctx.stroke();
    ctx.restore();
  }

  function dibujarLlama(d, dy) {
    const balanceo = Math.sin(d.tiempo * 2.5) * 3;
    const p = d.paleta || PALETAS_LLAMA[0];
    ctx.save();
    ctx.translate(d.x, 0);
    if (!d.mirandoDerecha) ctx.scale(-1, 1);
    const x = 0;
    const y = dy;
    ctx.fillStyle = p.patas;
    ctx.fillRect(x - 12, y + 38 + balanceo * 0.4, 5, 30);
    ctx.fillRect(x - 4, y + 38 - balanceo * 0.3, 5, 30);
    ctx.fillRect(x + 6, y + 38 - balanceo * 0.4, 5, 30);
    ctx.fillRect(x + 14, y + 38 + balanceo * 0.3, 5, 30);
    ctx.fillStyle = p.nariz;
    ctx.fillRect(x - 13, y + 66 + balanceo * 0.4, 7, 3);
    ctx.fillRect(x - 5, y + 66 - balanceo * 0.3, 7, 3);
    ctx.fillRect(x + 5, y + 66 - balanceo * 0.4, 7, 3);
    ctx.fillRect(x + 13, y + 66 + balanceo * 0.3, 7, 3);
    ctx.fillStyle = p.cuerpo;
    ctx.beginPath();
    ctx.ellipse(x, y + 28, 20, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = p.panza;
    ctx.beginPath();
    ctx.ellipse(x, y + 32, 12, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = p.cuerpo;
    ctx.beginPath();
    ctx.moveTo(x + 12, y + 22);
    ctx.quadraticCurveTo(x + 22, y + 8, x + 20, y - 14);
    ctx.lineTo(x + 27, y - 14);
    ctx.quadraticCurveTo(x + 30, y + 8, x + 20, y + 28);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = p.cuerpo;
    ctx.beginPath();
    ctx.ellipse(x + 24, y - 16, 9, 7, -0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = p.cuerpo2;
    ctx.beginPath();
    ctx.moveTo(x + 18, y - 22);
    ctx.lineTo(x + 16, y - 34);
    ctx.lineTo(x + 22, y - 24);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x + 26, y - 23);
    ctx.lineTo(x + 28, y - 35);
    ctx.lineTo(x + 31, y - 22);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = p.orejas;
    ctx.beginPath();
    ctx.moveTo(x + 19, y - 23);
    ctx.lineTo(x + 18, y - 31);
    ctx.lineTo(x + 21, y - 24);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x + 27, y - 24);
    ctx.lineTo(x + 28, y - 32);
    ctx.lineTo(x + 30, y - 23);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = p.cuerpo2;
    ctx.beginPath();
    ctx.ellipse(x + 31, y - 15, 4, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = p.nariz;
    ctx.beginPath();
    ctx.arc(x + 33, y - 15, 1.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = p.ojos;
    ctx.beginPath();
    ctx.arc(x + 24, y - 17, 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(x + 24.5, y - 17.5, 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = p.ojos;
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(x + 31, y - 13);
    ctx.lineTo(x + 33, y - 13);
    ctx.stroke();
    ctx.restore();
  }

  function dibujarCieloDeFondo(tipo) {
    const grad = ctx.createLinearGradient(0, 0, 0, ALTO);
    grad.addColorStop(0, tipo.fondo);
    grad.addColorStop(0.5, tipo.fondo2);
    grad.addColorStop(1, tipo.fondoAbajo || tipo.fondo2);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, ANCHO, ALTO);
  }

  function dibujarCieloNocturno() {
    const grad = ctx.createLinearGradient(0, 0, 0, ALTO);
    grad.addColorStop(0, "#0a0a2a");
    grad.addColorStop(0.5, "#1a2a5a");
    grad.addColorStop(0.75, "#3a3a6a");
    grad.addColorStop(1, "#6a4a5a");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, ANCHO, ALTO);
    initEstrellas();
    const t = Date.now() / 1000;
    for (const est of estrellas) {
      const parpadeo = 0.5 + Math.sin(t * 2 + est.parpadeo) * 0.5;
      const alpha = 0.4 + parpadeo * 0.6;
      ctx.fillStyle = "rgba(255, 255, 230, " + alpha + ")";
      ctx.beginPath();
      ctx.arc(est.x, est.y, est.tam, 0, Math.PI * 2);
      ctx.fill();
      if (est.tam > 1.2) {
        ctx.fillStyle = "rgba(200, 220, 255, " + (alpha * 0.15) + ")";
        ctx.beginPath();
        ctx.arc(est.x, est.y, est.tam * 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    const lunaX = ANCHO * 0.82;
    const lunaY = ALTO * 0.12;
    const lunaR = 38;
    const haloGrad = ctx.createRadialGradient(lunaX, lunaY, lunaR * 0.8, lunaX, lunaY, lunaR * 3);
    haloGrad.addColorStop(0, "rgba(255, 250, 220, 0.25)");
    haloGrad.addColorStop(0.5, "rgba(255, 250, 220, 0.08)");
    haloGrad.addColorStop(1, "rgba(255, 250, 220, 0)");
    ctx.fillStyle = haloGrad;
    ctx.beginPath();
    ctx.arc(lunaX, lunaY, lunaR * 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#f0e8c8";
    ctx.beginPath();
    ctx.arc(lunaX, lunaY, lunaR, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(180, 170, 140, 0.5)";
    ctx.beginPath();
    ctx.arc(lunaX - 8, lunaY - 6, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(lunaX + 10, lunaY + 8, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(lunaX - 4, lunaY + 14, 2.5, 0, Math.PI * 2);
    ctx.fill();
    initNubes();
    for (const nu of nubes) {
      nu.x += nu.vel;
      if (nu.x > ANCHO + 150) nu.x = -150;
      ctx.fillStyle = "rgba(200, 210, 230, " + nu.alpha + ")";
      ctx.beginPath();
      ctx.ellipse(nu.x, nu.y, nu.ancho / 2, nu.alto / 2, 0, 0, Math.PI * 2);
      ctx.ellipse(nu.x + nu.ancho * 0.25, nu.y - nu.alto * 0.2, nu.ancho * 0.35, nu.alto * 0.45, 0, 0, Math.PI * 2);
      ctx.ellipse(nu.x - nu.ancho * 0.25, nu.y - nu.alto * 0.1, nu.ancho * 0.3, nu.alto * 0.4, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function dibujarImagenRecorrida(img, progreso) {
    if (!img) return;
    const rImg = img.width / img.height;
    const imgW = ANCHO * ESCALA_IMAGEN_UNICA;
    let imgH = imgW / rImg;
    if (imgH < ALTO) {
      imgH = ALTO;
      const w = imgH * rImg;
      const dx = (ANCHO - w) / 2;
      try { ctx.drawImage(img, dx, 0, w, imgH); } catch (e) {}
      return;
    }
    const rango = imgH - ALTO;
    const prog = Math.min(1, progreso / LIMITE_PROGRESO_IMAGEN);
    const offsetY = -(1 - prog) * rango;
    const dx = (ANCHO - imgW) / 2;
    try { ctx.drawImage(img, dx, offsetY, imgW, imgH); } catch (e) {}
  }

  function dibujarFondo() {
    const pal = paletaActual();
    const tipo = tipoActual();
    if (tipo.fondoImg === "paris") {
      dibujarCieloNocturno();
    } else {
      dibujarCieloDeFondo(tipo);
    }

    if (tipo.fondoImg && FONDOS[tipo.fondoImg]) {
      const fondo = FONDOS[tipo.fondoImg];
      const alturaJugadorPx = Math.max(0, Y_SUELO_JUGABLE - estado.personaje.y);
      const alturaJugadorM = alturaJugadorPx / PX_POR_METRO;
      const progreso = Math.min(1, alturaJugadorM / METROS_FIN_PANTALLA);
      let fadeOut = (alturaJugadorM - FADEOUT_UNICO_INICIO_M) / (FADEOUT_UNICO_FIN_M - FADEOUT_UNICO_INICIO_M);
      fadeOut = Math.max(0, Math.min(1, fadeOut));
      const alphaImg = 1 - fadeOut;
      if (fondo.cargada && alphaImg > 0.01) {
        ctx.globalAlpha = alphaImg;
        dibujarImagenRecorrida(fondo.img, progreso);
        ctx.globalAlpha = 1;
      }
    }

    if (pal.lluviaMatrix) dibujarMatrixLluvia();
    const camY = estado.camara.y;

    if (tipo.categoria === "cueva") {
      const alpha = pal.lluviaMatrix ? 0.15 : 0.35;
      for (let i = 0; i < 25; i++) {
        const x = (i * 37) % ANCHO;
        const yBase = ((i * 91) % 400) - 400;
        ctx.fillStyle = "rgba(255, 255, 255, " + (alpha * 0.25) + ")";
        ctx.fillRect(x, yBase - camY, 2, ALTO + 400);
      }
      for (let i = 0; i < 40; i++) {
        const x = (i * 173) % ANCHO;
        const y = ((i * 213) % 2400) - 2400 - camY;
        if (y > -80 && y < ALTO + 80) {
          ctx.fillStyle = "rgba(255, 255, 255, " + (alpha * 0.4) + ")";
          ctx.fillRect(x, y, 5, 5);
        }
      }
    }

    for (const d of estado.decoraciones) {
      const dy = d.y - camY;
      if (dy + 300 < 0 || dy - 300 > ALTO) continue;
      if (d.tipo === "estalactita") {
        ctx.fillStyle = "rgba(0,0,0,0.55)";
        ctx.beginPath();
        ctx.moveTo(d.x, dy);
        ctx.lineTo(d.x + d.ancho / 2, dy + d.largo);
        ctx.lineTo(d.x + d.ancho, dy);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = pal.presaLuz;
        ctx.globalAlpha = 0.25;
        ctx.beginPath();
        ctx.moveTo(d.x + 1, dy);
        ctx.lineTo(d.x + d.ancho / 2, dy + d.largo * 0.8);
        ctx.lineTo(d.x + d.ancho / 2, dy);
        ctx.closePath();
        ctx.fill();
        ctx.globalAlpha = 1;
      } else if (d.tipo === "estalagmita") {
        ctx.fillStyle = "rgba(0,0,0,0.55)";
        ctx.beginPath();
        ctx.moveTo(d.x, dy + d.largo);
        ctx.lineTo(d.x + d.ancho / 2, dy);
        ctx.lineTo(d.x + d.ancho, dy + d.largo);
        ctx.closePath();
        ctx.fill();
      } else if (d.tipo === "musgo") {
        ctx.fillStyle = "rgba(80, 160, 80, 0.35)";
        ctx.beginPath();
        ctx.ellipse(d.x, dy, d.ancho / 2, d.alto / 2, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (d.tipo === "roca") {
        ctx.fillStyle = "rgba(0,0,0,0.4)";
        ctx.fillRect(d.x, dy, d.ancho, d.alto);
      } else if (d.tipo === "gota") {
        ctx.fillStyle = "rgba(180, 220, 255, 0.5)";
        ctx.beginPath();
        ctx.ellipse(d.x, dy, 2, 4, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (d.tipo === "cofre") {
        ctx.fillStyle = "#3a2418";
        ctx.fillRect(d.x, dy, d.ancho, d.alto);
        ctx.fillStyle = "#5a3a22";
        ctx.fillRect(d.x, dy, d.ancho, 3);
        ctx.fillStyle = "#c9a227";
        ctx.fillRect(d.x + d.ancho / 2 - 3, dy + 8, 6, 6);
      } else if (d.tipo === "esqueleto") {
        const hueso = "#d8d0b8";
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
        for (let k = 0; k < 5; k++) ctx.fillRect(d.x + 30 + k * 12, dy + 14, 6, 6);
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
      } else if (d.tipo === "moneda") {
        const giro = Math.abs(Math.cos(Date.now() / 400 + d.tiempo));
        const anchoVisible = d.tam * giro;
        ctx.fillStyle = "#c9a227";
        ctx.beginPath();
        ctx.ellipse(d.x, dy, anchoVisible, d.tam, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (d.tipo === "petroleo") {
        ctx.fillStyle = "rgba(10, 8, 6, 0.85)";
        ctx.beginPath();
        ctx.ellipse(d.x, dy, d.ancho / 2, d.alto / 2, 0, 0, Math.PI * 2);
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
      } else if (d.tipo === "grieta-luz") {
        const pulso = 0.5 + Math.sin(Date.now() / 500 + d.x) * 0.5;
        ctx.fillStyle = "rgba(255, 230, 150, " + (0.2 + pulso * 0.3) + ")";
        ctx.fillRect(d.x, dy, d.ancho, d.largo);
      } else if (d.tipo === "nube") {
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
        const planeo = Math.sin(d.tiempo) * 2;
        const t = d.tam;
        const dir = d.mirandoDerecha ? 1 : -1;
        ctx.fillStyle = "#3a2a1a";
        ctx.beginPath();
        ctx.ellipse(d.x, dy + planeo, t * 0.4, t * 0.18, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(d.x - t * 0.05, dy + planeo - t * 0.05);
        ctx.lineTo(d.x - dir * t * 0.9, dy + planeo - t * 0.25);
        ctx.lineTo(d.x - dir * t * 0.5, dy + planeo + t * 0.05);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(d.x - t * 0.05, dy + planeo - t * 0.05);
        ctx.lineTo(d.x + dir * t * 0.7, dy + planeo - t * 0.25);
        ctx.lineTo(d.x + dir * t * 0.4, dy + planeo + t * 0.05);
        ctx.closePath();
        ctx.fill();
      } else if (d.tipo === "murcielago") {
        dibujarMurcielagoValencia(d, dy);
      } else if (d.tipo === "gallo") {
        dibujarGalloParis(d, dy);
      } else if (d.tipo === "cuervo") {
        dibujarCuervo(d, dy);
      } else if (d.tipo === "rata") {
        dibujarRata(d, dy);
      } else if (d.tipo === "gato-romano") {
        dibujarGatoRomano(d, dy);
      } else if (d.tipo === "oso-bipedo") {
        dibujarOsoBipedo(d, dy);
      } else if (d.tipo === "camello") {
        dibujarCamello(d, dy);
      } else if (d.tipo === "grulla") {
        dibujarGrulla(d, dy);
      } else if (d.tipo === "tucan") {
        dibujarTucan(d, dy);
      } else if (d.tipo === "canguro") {
        dibujarCanguro(d, dy);
      } else if (d.tipo === "mono") {
        dibujarMono(d, dy);
      } else if (d.tipo === "llama") {
        dibujarLlama(d, dy);
      }
    }

    if (tipo.vinyetaFuerte || pal.lluviaMatrix) {
      const grad = ctx.createRadialGradient(ANCHO / 2, ALTO / 2, 150, ANCHO / 2, ALTO / 2, ANCHO);
      grad.addColorStop(0, "rgba(0,0,0,0)");
      grad.addColorStop(1, pal.vinyeta);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, ANCHO, ALTO);
    }
  }

  function dibujarPlataforma(plat, py, pal, tipo) {
    const usarColorTipo = tipo.categoria === "ciudad" || tipo.categoria === "aire";
    const colorPresa = usarColorTipo ? tipo.presa : pal.presa;
    const colorPresaLuz = usarColorTipo ? tipo.presaLuz : pal.presaLuz;

    if (plat.tipo === "suelo") {
      // Suelo invisible
    } else {
      if (plat.esBandera && tipo && tipo.bandera) {
        const tipoBandera = tipo.bandera[0];
        if (tipoBandera === "senyera") {
          const h = plat.alto / 9;
          const coloresSen = ["#d32f2f", "#ffd700", "#d32f2f", "#ffd700", "#d32f2f", "#ffd700", "#d32f2f", "#ffd700", "#d32f2f"];
          for (let i = 0; i < 9; i++) { ctx.fillStyle = coloresSen[i]; ctx.fillRect(plat.x, py + i * h, plat.ancho, h); }
          ctx.fillStyle = "#1a3a8a";
          ctx.fillRect(plat.x, py, plat.ancho * 0.15, plat.alto);
        } else if (tipoBandera === "espana") {
          const h = plat.alto / 4;
          ctx.fillStyle = "#c60b1e"; ctx.fillRect(plat.x, py, plat.ancho, h);
          ctx.fillStyle = "#ffc400"; ctx.fillRect(plat.x, py + h, plat.ancho, h * 2);
          ctx.fillStyle = "#c60b1e"; ctx.fillRect(plat.x, py + h * 3, plat.ancho, h);
        } else if (tipoBandera === "francia") {
          const w = plat.ancho / 3;
          ctx.fillStyle = "#0055a4"; ctx.fillRect(plat.x, py, w, plat.alto);
          ctx.fillStyle = "#ffffff"; ctx.fillRect(plat.x + w, py, w, plat.alto);
          ctx.fillStyle = "#ef4135"; ctx.fillRect(plat.x + w * 2, py, w, plat.alto);
        } else if (tipoBandera === "reino-unido") {
          ctx.fillStyle = "#012169"; ctx.fillRect(plat.x, py, plat.ancho, plat.alto);
          ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 4;
          ctx.beginPath(); ctx.moveTo(plat.x, py); ctx.lineTo(plat.x + plat.ancho, py + plat.alto);
          ctx.moveTo(plat.x + plat.ancho, py); ctx.lineTo(plat.x, py + plat.alto); ctx.stroke();
          ctx.strokeStyle = "#C8102E"; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(plat.x, py); ctx.lineTo(plat.x + plat.ancho, py + plat.alto);
          ctx.moveTo(plat.x + plat.ancho, py); ctx.lineTo(plat.x, py + plat.alto); ctx.stroke();
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(plat.x + plat.ancho / 2 - 5, py, 10, plat.alto);
          ctx.fillRect(plat.x, py + plat.alto / 2 - 4, plat.ancho, 8);
          ctx.fillStyle = "#C8102E";
          ctx.fillRect(plat.x + plat.ancho / 2 - 3, py, 6, plat.alto);
          ctx.fillRect(plat.x, py + plat.alto / 2 - 2, plat.ancho, 4);
        } else if (tipoBandera === "eeuu") {
          const franjas = 13;
          const h = plat.alto / franjas;
          for (let i = 0; i < franjas; i++) { ctx.fillStyle = i % 2 === 0 ? "#B22234" : "#ffffff"; ctx.fillRect(plat.x, py + i * h, plat.ancho, h); }
          ctx.fillStyle = "#3C3B6E";
          ctx.fillRect(plat.x, py, plat.ancho * 0.4, h * 7);
          ctx.fillStyle = "#ffffff";
          for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) ctx.fillRect(plat.x + 4 + c * 8, py + 3 + r * 6, 2, 2);
        } else if (tipoBandera === "italia") {
          const w = plat.ancho / 3;
          ctx.fillStyle = "#009246"; ctx.fillRect(plat.x, py, w, plat.alto);
          ctx.fillStyle = "#ffffff"; ctx.fillRect(plat.x + w, py, w, plat.alto);
          ctx.fillStyle = "#CE2B37"; ctx.fillRect(plat.x + w * 2, py, w, plat.alto);
        } else if (tipoBandera === "egipto") {
          const h = plat.alto / 3;
          ctx.fillStyle = "#C8102E"; ctx.fillRect(plat.x, py, plat.ancho, h);
          ctx.fillStyle = "#ffffff"; ctx.fillRect(plat.x, py + h, plat.ancho, h);
          ctx.fillStyle = "#000000"; ctx.fillRect(plat.x, py + h * 2, plat.ancho, h);
        } else if (tipoBandera === "japon") {
          ctx.fillStyle = "#ffffff"; ctx.fillRect(plat.x, py, plat.ancho, plat.alto);
          ctx.fillStyle = "#BC002D";
          ctx.beginPath();
          ctx.arc(plat.x + plat.ancho / 2, py + plat.alto / 2, plat.alto * 0.35, 0, Math.PI * 2);
          ctx.fill();
        } else if (tipoBandera === "brasil") {
          ctx.fillStyle = "#009C3B"; ctx.fillRect(plat.x, py, plat.ancho, plat.alto);
          ctx.fillStyle = "#FFDF00";
          ctx.beginPath();
          ctx.moveTo(plat.x + plat.ancho / 2, py + 2);
          ctx.lineTo(plat.x + plat.ancho - 2, py + plat.alto / 2);
          ctx.lineTo(plat.x + plat.ancho / 2, py + plat.alto - 2);
          ctx.lineTo(plat.x + 2, py + plat.alto / 2);
          ctx.closePath();
          ctx.fill();
          ctx.fillStyle = "#002776";
          ctx.beginPath();
          ctx.arc(plat.x + plat.ancho / 2, py + plat.alto / 2, plat.alto * 0.28, 0, Math.PI * 2);
          ctx.fill();
        } else if (tipoBandera === "australia") {
          ctx.fillStyle = "#00008B"; ctx.fillRect(plat.x, py, plat.ancho, plat.alto);
          ctx.fillStyle = "#ffffff";
          const jw = plat.ancho * 0.4;
          const jh = plat.alto * 0.5;
          ctx.fillRect(plat.x + jw / 2 - 1, py, 2, jh);
          ctx.fillRect(plat.x, py + jh / 2 - 1, jw, 2);
          ctx.strokeStyle = "#C8102E";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(plat.x, py); ctx.lineTo(plat.x + jw, py + jh);
          ctx.moveTo(plat.x + jw, py); ctx.lineTo(plat.x, py + jh);
          ctx.stroke();
          ctx.fillStyle = "#ffffff";
          ctx.beginPath(); ctx.arc(plat.x + plat.ancho * 0.7, py + plat.alto * 0.3, plat.alto * 0.08, 0, Math.PI * 2); ctx.fill();
          ctx.beginPath(); ctx.arc(plat.x + plat.ancho * 0.8, py + plat.alto * 0.5, plat.alto * 0.06, 0, Math.PI * 2); ctx.fill();
          ctx.beginPath(); ctx.arc(plat.x + plat.ancho * 0.65, py + plat.alto * 0.65, plat.alto * 0.06, 0, Math.PI * 2); ctx.fill();
        } else if (tipoBandera === "marruecos") {
          ctx.fillStyle = "#C1272D"; ctx.fillRect(plat.x, py, plat.ancho, plat.alto);
          ctx.fillStyle = "#006233";
          const cx = plat.x + plat.ancho / 2;
          const cy = py + plat.alto / 2;
          const r = plat.alto * 0.35;
          ctx.beginPath();
          for (let i = 0; i < 5; i++) {
            const ang = -Math.PI / 2 + (i * 4 * Math.PI) / 5;
            const x1 = cx + Math.cos(ang) * r;
            const y1 = cy + Math.sin(ang) * r;
            if (i === 0) ctx.moveTo(x1, y1);
            else ctx.lineTo(x1, y1);
          }
          ctx.closePath();
          ctx.fill();
        } else if (tipoBandera === "peru") {
          const w = plat.ancho / 3;
          ctx.fillStyle = "#D91023"; ctx.fillRect(plat.x, py, w, plat.alto);
          ctx.fillStyle = "#ffffff"; ctx.fillRect(plat.x + w, py, w, plat.alto);
          ctx.fillStyle = "#D91023"; ctx.fillRect(plat.x + w * 2, py, w, plat.alto);
        }
        ctx.strokeStyle = "#1a1a1a";
        ctx.lineWidth = 2;
        ctx.strokeRect(plat.x + 1, py + 1, plat.ancho - 2, plat.alto - 2);
      } else if (pal.bloques && !usarColorTipo) {
        ctx.fillStyle = colorPresa;
        ctx.fillRect(plat.x, py, plat.ancho, plat.alto);
        ctx.fillStyle = colorPresaLuz;
        ctx.fillRect(plat.x, py, plat.ancho, 3);
        ctx.fillStyle = "rgba(0,0,0,0.35)";
        ctx.fillRect(plat.x, py + plat.alto - 3, plat.ancho, 3);
      } else {
        const radio = 10;
        if (usarColorTipo) {
          ctx.fillStyle = colorConAlpha(colorPresa, 0.55);
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
          ctx.fillStyle = colorConAlpha(colorPresaLuz, 0.70);
          ctx.fillRect(plat.x + radio, py, plat.ancho - radio * 2, 3);
          ctx.strokeStyle = colorConAlpha(colorPresaLuz, 0.40);
          ctx.lineWidth = 1.5;
          ctx.strokeRect(plat.x + 1, py + 1, plat.ancho - 2, plat.alto - 2);
        } else {
          ctx.fillStyle = colorPresa;
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
          ctx.fillStyle = colorPresaLuz;
          ctx.fillRect(plat.x + radio, py, plat.ancho - 2 * radio, 3);
        }
      }
    }
  }

  function dibujarBoton(x, y, w, h, texto, foco, colorBase, colorBorde) {
    const brillo = 0.7 + Math.sin(Date.now() / 250) * 0.3;
    const fondo = foco ? "rgba(" + colorBase + ", " + (0.55 + brillo * 0.3) + ")" : "rgba(" + colorBase + ", 0.35)";
    const borde = foco ? "rgba(" + colorBorde + ", " + brillo + ")" : "rgba(" + colorBorde + ", 0.6)";
    ctx.fillStyle = fondo;
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = borde;
    ctx.lineWidth = foco ? 4 : 2;
    ctx.strokeRect(x, y, w, h);
    ctx.fillStyle = foco ? "#ffffff" : "rgba(230, 240, 250, 0.85)";
    ctx.font = "bold " + (foco ? 22 : 20) + "px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(texto, x + w / 2, y + h / 2);
    if (foco) {
      const parpadeo = 0.5 + Math.sin(Date.now() / 180) * 0.5;
      ctx.fillStyle = "rgba(255, 255, 100, " + parpadeo + ")";
      ctx.font = "bold 22px monospace";
      ctx.textAlign = "left";
      ctx.fillText("▶", x - 26, y + h / 2);
      ctx.textAlign = "center";
    }
  }

  function render() {
    const pal = paletaActual();
    const tipo = tipoActual();
    dibujarFondo();

    const p = estado.personaje;
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
      if (plat.tipo !== "suelo") {
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fillRect(plat.x + 4, py + 4, plat.ancho, plat.alto);
      }
      dibujarPlataforma(plat, py, pal, tipo);
      if (plat.tipo === "presa" && plat === siguientePresa) {
        const brillo = 0.6 + Math.sin(Date.now() / 200) * 0.4;
        ctx.strokeStyle = pal.acentoSuave;
        ctx.globalAlpha = brillo;
        ctx.lineWidth = 4;
        ctx.strokeRect(plat.x - 3, py - 3, plat.ancho + 6, plat.alto + 6);
        ctx.globalAlpha = 1;
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
        ctx.fillStyle = pal.acentoSuave;
        ctx.beginPath();
        ctx.arc(px + p.ancho / 2, py - 8, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    dibujarPopups();
    dibujarPopupGrande();
    dibujarTransicion();
    dibujarBanner();

    if (estado.modo === "menu") {
      ctx.fillStyle = pal.menuFondo;
      ctx.fillRect(0, 0, ANCHO, ALTO);
      ctx.fillStyle = pal.texto;
      ctx.font = "bold 56px monospace";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(tx("menu_titulo"), ANCHO / 2, ALTO / 2 - 200);
      ctx.fillStyle = pal.textoSuave;
      ctx.font = "18px monospace";
      ctx.fillText(tx("menu_subtitulo"), ANCHO / 2, ALTO / 2 - 150);
      ctx.fillStyle = pal.acento;
      ctx.font = "16px monospace";
      ctx.fillText(tx("menu_record") + ": " + estado.camara.record + " " + tx("hud_m"), ANCHO / 2, ALTO / 2 - 110);
      const btnW = 280, btnH = 50, sep = 12;
      let by = ALTO / 2 - 50;
      dibujarBoton(ANCHO / 2 - btnW / 2, by, btnW, btnH, tx("menu_empezar"), enfocada("empezar"), pal.botonFondo, pal.botonBorde);
      estado._btnEmpezar = { x: ANCHO / 2 - btnW / 2, y: by, w: btnW, h: btnH };
      by += btnH + sep;
      dibujarBoton(ANCHO / 2 - btnW / 2, by, btnW, btnH, tx("menu_instrucciones"), enfocada("instrucciones"), pal.botonSecFondo, pal.botonSecBorde);
      estado._btnInstrucciones = { x: ANCHO / 2 - btnW / 2, y: by, w: btnW, h: btnH };
      by += btnH + sep;
      dibujarBoton(ANCHO / 2 - btnW / 2, by, btnW, btnH, tx("menu_creditos"), enfocada("creditos"), pal.botonSecFondo, pal.botonSecBorde);
      estado._btnCreditos = { x: ANCHO / 2 - btnW / 2, y: by, w: btnW, h: btnH };
      by += btnH + sep;
      if (!estaEnFullscreen()) {
        dibujarBoton(ANCHO / 2 - btnW / 2, by, btnW, btnH, tx("menu_fullscreen"), enfocada("pantalla-completa"), pal.botonSecFondo, pal.botonSecBorde);
        estado._btnPantallaCompleta = { x: ANCHO / 2 - btnW / 2, y: by, w: btnW, h: btnH };
      } else { estado._btnPantallaCompleta = null; }
      ctx.fillStyle = pal.textoSuave;
      ctx.font = "13px monospace";
      ctx.textAlign = "center";
      ctx.fillText(tx("menu_ayuda"), ANCHO / 2, ALTO / 2 + 260);
      ctx.textAlign = "start"; ctx.textBaseline = "alphabetic";
    }

    if (estado.modo === "instrucciones") {
      ctx.fillStyle = pal.menuFondo; ctx.fillRect(0, 0, ANCHO, ALTO);
      ctx.fillStyle = pal.texto;
      ctx.font = "bold 36px monospace";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(tx("inst_titulo"), ANCHO / 2, 60);
      ctx.font = "16px monospace"; ctx.textAlign = "left";
      const lineas = tx("inst_lineas");
      let yTexto = 120;
      for (const linea of lineas) {
        if (linea.endsWith(":")) { ctx.fillStyle = pal.acento; ctx.font = "bold 16px monospace"; }
        else { ctx.fillStyle = pal.textoSuave; ctx.font = "15px monospace"; }
        ctx.fillText(linea, 60, yTexto);
        yTexto += 24;
      }
      ctx.fillStyle = pal.textoSuave;
      ctx.font = "14px monospace"; ctx.textAlign = "center";
      ctx.fillText(tx("inst_volver"), ANCHO / 2, ALTO - 40);
      ctx.textAlign = "start"; ctx.textBaseline = "alphabetic";
    }

    if (estado.modo === "creditos") {
      ctx.fillStyle = pal.menuFondo; ctx.fillRect(0, 0, ANCHO, ALTO);
      ctx.fillStyle = pal.acento;
      ctx.font = "bold 40px monospace";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(tx("cred_titulo"), ANCHO / 2, 100);
      const px = ANCHO / 2 - 240, py = 160, pw = 480, ph = 420;
      ctx.fillStyle = pal.panelFondo; ctx.fillRect(px, py, pw, ph);
      ctx.strokeStyle = "rgba(" + pal.panelBorde + ", 0.8)"; ctx.lineWidth = 3;
      ctx.strokeRect(px, py, pw, ph);
      ctx.fillStyle = pal.texto; ctx.font = "bold 28px monospace";
      ctx.fillText(tx("cred_juego"), ANCHO / 2, py + 50);
      ctx.fillStyle = pal.textoSuave; ctx.font = "15px monospace";
      ctx.fillText(tx("cred_subtitulo"), ANCHO / 2, py + 80);
      ctx.strokeStyle = "rgba(" + pal.panelBorde + ", 0.4)"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(px + 40, py + 100); ctx.lineTo(px + pw - 40, py + 100); ctx.stroke();
      ctx.fillStyle = pal.textoSuave; ctx.font = "16px monospace";
      ctx.fillText(tx("cred_creado"), ANCHO / 2, py + 140);
      ctx.fillStyle = pal.acento; ctx.font = "bold 24px monospace";
      ctx.fillText(tx("cred_autor"), ANCHO / 2, py + 175);
      ctx.fillStyle = pal.textoSuave; ctx.font = "15px monospace";
      ctx.fillText(tx("cred_hecho"), ANCHO / 2, py + 220);
      ctx.fillText(tx("cred_inspirado"), ANCHO / 2, py + 245);
      ctx.fillStyle = pal.acento; ctx.font = "bold 20px monospace";
      ctx.fillText(tx("cred_gracias"), ANCHO / 2, py + 300);
      ctx.fillStyle = pal.textoSuave; ctx.font = "13px monospace";
      ctx.fillText(tx("cred_version") + ": v:73.0", ANCHO / 2, py + 340);
      ctx.fillText("© 2026", ANCHO / 2, py + 365);
      ctx.fillStyle = pal.textoSuave; ctx.font = "14px monospace";
      ctx.fillText(tx("cred_volver"), ANCHO / 2, ALTO - 40);
      ctx.textAlign = "start"; ctx.textBaseline = "alphabetic";
    }

    if (estado.modo === "gameover") {
      ctx.fillStyle = pal.menuFondo; ctx.fillRect(0, 0, ANCHO, ALTO);
      ctx.fillStyle = pal.acento;
      ctx.font = "bold 52px monospace";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(tx("go_titulo"), ANCHO / 2, 160);
      const px = ANCHO / 2 - 200, py = 230, pw = 400, ph = 220;
      ctx.fillStyle = pal.panelFondo; ctx.fillRect(px, py, pw, ph);
      ctx.strokeStyle = "rgba(" + pal.panelBorde + ", 0.8)"; ctx.lineWidth = 3;
      ctx.strokeRect(px, py, pw, ph);
      ctx.fillStyle = pal.texto; ctx.font = "bold 22px monospace";
      ctx.fillText(tx("go_resumen"), ANCHO / 2, py + 30);
      ctx.font = "18px monospace"; ctx.fillStyle = pal.textoSuave;
      ctx.fillText(tx("go_altura_max") + ":  " + estado.camara.alturaMaxima + " " + tx("hud_m"), ANCHO / 2, py + 80);
      ctx.fillText(tx("go_fragmentos") + ":  " + estado.fragmentosRecogidos + "/" + estado.fragmentosTotales, ANCHO / 2, py + 115);
      ctx.fillText(tx("go_pantalla") + ":  " + tx("hud_p") + estado.pantalla, ANCHO / 2, py + 150);
      ctx.fillStyle = pal.acento; ctx.font = "bold 18px monospace";
      const nuevoRecord = estado.camara.alturaMaxima >= estado.camara.record && estado.camara.alturaMaxima > 0;
      if (nuevoRecord) ctx.fillText(tx("go_nuevo_record"), ANCHO / 2, py + 185);
      else ctx.fillText(tx("go_record") + ":  " + estado.camara.record + " " + tx("hud_m"), ANCHO / 2, py + 185);
      const btnW = 280, btnH = 50, sep = 12;
      let by = py + ph + 30;
      dibujarBoton(ANCHO / 2 - btnW / 2, by, btnW, btnH, tx("go_reintentar"), enfocada("reintentar"), pal.botonFondo, pal.botonBorde);
      estado._btnReintentar = { x: ANCHO / 2 - btnW / 2, y: by, w: btnW, h: btnH };
      by += btnH + sep;
      dibujarBoton(ANCHO / 2 - btnW / 2, by, btnW, btnH, tx("go_menu"), enfocada("menu"), pal.botonSecFondo, pal.botonSecBorde);
      estado._btnMenu = { x: ANCHO / 2 - btnW / 2, y: by, w: btnW, h: btnH };
      by += btnH + sep;
      if (!estaEnFullscreen()) {
        dibujarBoton(ANCHO / 2 - btnW / 2, by, btnW, btnH, tx("go_fullscreen"), enfocada("pantalla-completa"), pal.botonSecFondo, pal.botonSecBorde);
        estado._btnPantallaCompleta = { x: ANCHO / 2 - btnW / 2, y: by, w: btnW, h: btnH };
      } else { estado._btnPantallaCompleta = null; }
      ctx.textAlign = "start"; ctx.textBaseline = "alphabetic";
    }

    if (estado.modo === "confirmar-salida") {
      ctx.fillStyle = "rgba(0, 0, 0, 0.75)"; ctx.fillRect(0, 0, ANCHO, ALTO);
      const px = ANCHO / 2 - 220, py = ALTO / 2 - 160, pw = 440, ph = 320;
      ctx.fillStyle = pal.panelFondo; ctx.fillRect(px, py, pw, ph);
      ctx.strokeStyle = "rgba(" + pal.panelBorde + ", 0.9)"; ctx.lineWidth = 3;
      ctx.strokeRect(px, py, pw, ph);
      ctx.fillStyle = pal.acento; ctx.font = "bold 24px monospace";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(tx("salir_titulo"), ANCHO / 2, py + 45);
      ctx.fillStyle = pal.textoSuave; ctx.font = "15px monospace";
      ctx.fillText(tx("salir_msg1"), ANCHO / 2, py + 80);
      ctx.fillText(tx("salir_msg2"), ANCHO / 2, py + 105);
      const btnW = 160, btnH = 50, sep = 20;
      let by = py + 140;
      const btnSiX = ANCHO / 2 - btnW - sep / 2;
      const btnNoX = ANCHO / 2 + sep / 2;
      dibujarBoton(btnSiX, by, btnW, btnH, tx("salir_si"), enfocada("si"), "220, 80, 80", "255, 120, 120");
      dibujarBoton(btnNoX, by, btnW, btnH, tx("salir_no"), enfocada("no"), pal.botonSecFondo, pal.botonSecBorde);
      estado._btnSiSalir = { x: btnSiX, y: by, w: btnW, h: btnH };
      estado._btnNoSalir = { x: btnNoX, y: by, w: btnW, h: btnH };
      by += btnH + 20;
      if (estaEnFullscreen()) {
        const btnFullW = 340;
        dibujarBoton(ANCHO / 2 - btnFullW / 2, by, btnFullW, btnH, tx("salir_fullscreen"), enfocada("salir-fullscreen"), pal.botonSecFondo, pal.botonSecBorde);
        estado._btnSalirFullscreen = { x: ANCHO / 2 - btnFullW / 2, y: by, w: btnFullW, h: btnH };
      } else { estado._btnSalirFullscreen = null; }
      ctx.fillStyle = pal.textoSuave; ctx.font = "13px monospace";
      ctx.textAlign = "center";
      ctx.fillText(tx("salir_ayuda"), ANCHO / 2, py + ph - 15);
      ctx.textAlign = "start"; ctx.textBaseline = "alphabetic";
    }
  }

  // ============================================================================
  // Bucle principal + IntersectionObserver
  // El juego solo consume CPU cuando la sección #juego está en viewport.
  // ============================================================================
  let ultimoTiempo = 0;
  let rafId = null;           // id del requestAnimationFrame en curso
  let juegoVisible = false;   // ¿está la sección #juego en pantalla?

  function loop(tiempo) {
    if (!juegoVisible) { rafId = null; return; }
    if (tiempo - ultimoTiempo < 16) {
      rafId = requestAnimationFrame(loop);
      return;
    }
    ultimoTiempo = tiempo;
    actualizarFisica();
    render();
    rafId = requestAnimationFrame(loop);
  }

  function arrancarLoop() {
    if (rafId !== null) return;
    if (!juegoVisible) return;
    rafId = requestAnimationFrame(loop);
  }

  function pararLoop() {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  // Preparar estado inicial (esto NO arranca el bucle)
  cargarRecord();
  crearPlataformas();
  crearDecoraciones();
  crearMurcielagos();
  estado.personaje.y = Y_SUELO_JUGABLE;
  estado.camara.y = CAMARA_INICIAL;
  estado.modo = "menu";
  estado.opcionActiva = 0;
  actualizarClaseJugando();

  // Primer frame estático para que el canvas no esté en blanco cuando
  // el usuario llegue a la sección. Esto NO es el bucle.
  try { render(); } catch (e) {}

  function conectarVisibilidadJuego() {
    const seccion = document.getElementById("juego") || contenedor;

    if (typeof IntersectionObserver === "undefined") {
      juegoVisible = true;
      arrancarLoop();
      return;
    }

    const obs = new IntersectionObserver((entradas) => {
      for (const e of entradas) {
        juegoVisible = e.isIntersecting;
        if (juegoVisible) arrancarLoop();
        else pararLoop();
      }
    }, {
      root: null,
      rootMargin: "200px 0px",
      threshold: 0.01,
    });

    obs.observe(seccion);
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) pararLoop();
    else if (juegoVisible) arrancarLoop();
  });

  conectarVisibilidadJuego();

  window.__juegoEscalada = {
    estado, contenedor,
    saltarA(numero, tipoForzado) {
      estado.pantalla = numero;
      estado.tipoPantalla = tipoForzado || tipoDePantalla(numero);
      estado.modo = "jugando";
      estado.gameOver = false;
      estado.fragmentosRecogidos = 0;
      estado.camara.y = CAMARA_INICIAL;
      estado.camara.alturaMaxima = (numero - 1) * METROS_FIN_PANTALLA;
      estado.popups = [];
      estado.popupGrande = null;
      estado.transicion = null;
      estado.banner = null;
      const p = estado.personaje;
      p.x = ANCHO / 2 - STEVE_ANCHO / 2;
      p.y = Y_SUELO_JUGABLE;
      p.velX = 0; p.velY = 0;
      p.enSuelo = false; p.saltando = false;
      p.dobleSaltoDisponible = true; p.saltoSuelto = true;
      p.frame = "parado";
      p.alturaMaximaVuelo = Y_SUELO_JUGABLE;
      p.dañoTiempo = 0;
      p.vida = VIDA_INICIAL;
      p.invulnerable = 0;
      crearPlataformas();
      crearDecoraciones();
      crearMurcielagos();
      actualizarClaseJugando();
      actualizarBloqueoScroll();
      console.log("Saltado a P" + numero + " · tipo: " + estado.tipoPantalla);
    },
    tiposDisponibles() { return Object.keys(TIPOS_PANTALLA); },
    catalogo() { return CATALOGO_PANTALLAS.map((p, i) => ({ numero: i + 1, tipo: p.tipo })); },
    skinsDisponibles() { return Object.keys(PALETAS_SKIN); },
    idiomasDisponibles() { return Object.keys(TRADUCCIONES); },
    idiomaActual,
    esIPhone,
    fullscreenSoportado,
    entrarFullscreen() { entrarPantallaCompleta(); },
    salirFullscreen() { salirPantallaCompleta(); },
    estaEnFullscreen,
    desbloquearScroll() {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    },
    // Rendimiento
    arrancarLoop,
    pararLoop,
    estaArrancado() { return rafId !== null; },
  };
})();