/* ============================================================
   juego.js · "Vía de bloques", un arcade de piezas que caen
   con alma de escalada.

   Qué hace este fichero, en cristiano:
   1. Dibuja el juego dentro de <div id="juego-root"> (en index.html).
   2. El visitante encaja piezas y cierra líneas. Cada 5 líneas sube
      de grado de escalada: 4, 5, 5+, 6a, 6a+, 6b... 
   3. Se juega con las flechas del teclado o con los botones en pantalla
      (para el móvil). El récord se guarda en el navegador.
   4. Textos en español, valenciano e inglés, igual que el resto de la web.

   Todo (diseño, textos y lógica) está en este único fichero.
   No necesita tocar style.css ni script.js. No usa red ni librerías.
   ============================================================ */

(function () {
  "use strict";

  if (window.__juegoCargado) return;
  window.__juegoCargado = true;

  const root = document.getElementById("juego-root");
  if (!root) return;

  /* ==========================================================
     1. AJUSTES
     ========================================================== */
  const COLS = 10;
  const ROWS = 20;
  const CELL = 30;
  const CLAVE_RECORD = "gv-via-bloques-record";
  const LINEAS_POR_GRADO = 5;
  const GRADOS = ["4", "5", "5+", "6a", "6a+", "6b", "6b+", "6c", "6c+", "7a", "7a+", "7b"];
  const PUNTOS_LINEAS = [0, 100, 300, 500, 800];

  const FORMAS = {
    I: [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
    O: [[1, 1], [1, 1]],
    T: [[0, 1, 0], [1, 1, 1], [0, 0, 0]],
    S: [[0, 1, 1], [1, 1, 0], [0, 0, 0]],
    Z: [[1, 1, 0], [0, 1, 1], [0, 0, 0]],
    J: [[1, 0, 0], [1, 1, 1], [0, 0, 0]],
    L: [[0, 0, 1], [1, 1, 1], [0, 0, 0]]
  };
  const COLORES = {
    I: "#58b4d1", O: "#e8b84a", T: "#a082cf", S: "#7fb685",
    Z: "#e04a52", J: "#5b8fd9", L: "#e08a4a"
  };

  /* ==========================================================
     2. TEXTOS EN LOS TRES IDIOMAS
     ========================================================== */
  const TEXTOS = {
    es: {
      tag: "06 · Juego", titleA: "Un descanso:", titleB: "sube la vía",
      intro: "Un arcade clásico con alma de escalada: encaja las piezas, cierra líneas y sube de grado. Cada 5 líneas, una vía más difícil.",
      group: "Juego Vía de bloques", board: "Tablero del juego",
      score: "Puntos", lines: "Líneas", grade: "Vía", best: "Récord", next: "Siguiente",
      play: "Jugar", resume: "Continuar", again: "Otra vez",
      restart: "Reiniciar partida",
      restartConfirm: "¿Seguro que quieres reiniciar? Perderás la partida actual.",
      startTitle: "Vía de bloques", startText: "Encaja las piezas y cierra líneas para subir de grado.",
      pausedTitle: "En pausa", pausedText: "Pulsa P o el botón para seguir.",
      overTitle: "¡Caída en la vía {g}!", overText: "{l} líneas · {s} puntos",
      newRecord: "¡Nuevo récord!", recordIs: "Récord: {r}",
      keys: "← → mover · ↑ girar · ↓ bajar · Espacio caer · P pausa",
      left: "Mover a la izquierda", right: "Mover a la derecha", down: "Bajar la pieza",
      rotate: "Girar la pieza", drop: "Dejar caer la pieza", restartShort: "Reiniciar",
      sGo: "Partida en marcha", sPause: "Partida en pausa",
      sOver: "Fin de la partida. {s} puntos.", sUp: "¡Subes a la vía {g}!"
    },
    val: {
      tag: "06 · Joc", titleA: "Un descans:", titleB: "puja la via",
      intro: "Un arcade clàssic amb ànima d'escalada: encaixa les peces, tanca línies i puja de grau. Cada 5 línies, una via més difícil.",
      group: "Joc Via de blocs", board: "Tauler del joc",
      score: "Punts", lines: "Línies", grade: "Via", best: "Rècord", next: "Següent",
      play: "Jugar", resume: "Continuar", again: "Una altra vegada",
      restart: "Reiniciar partida",
      restartConfirm: "Segur que vols reiniciar? Perdràs la partida actual.",
      startTitle: "Via de blocs", startText: "Encaixa les peces i tanca línies per pujar de grau.",
      pausedTitle: "En pausa", pausedText: "Prem P o el botó per continuar.",
      overTitle: "Caiguda a la via {g}!", overText: "{l} línies · {s} punts",
      newRecord: "Nou rècord!", recordIs: "Rècord: {r}",
      keys: "← → moure · ↑ girar · ↓ baixar · Espai caure · P pausa",
      left: "Moure a l'esquerra", right: "Moure a la dreta", down: "Baixar la peça",
      rotate: "Girar la peça", drop: "Deixar caure la peça", restartShort: "Reiniciar",
      sGo: "Partida en marxa", sPause: "Partida en pausa",
      sOver: "Fi de la partida. {s} punts.", sUp: "Puges a la via {g}!"
    },
    en: {
      tag: "06 · Game", titleA: "A break:", titleB: "climb the route",
      intro: "A classic arcade with a climber's soul: fit the pieces, clear lines and climb up the grades. Every 5 lines, a harder route.",
      group: "Block Route game", board: "Game board",
      score: "Score", lines: "Lines", grade: "Grade", best: "Best", next: "Next",
      play: "Play", resume: "Resume", again: "Play again",
      restart: "Restart game",
      restartConfirm: "Are you sure you want to restart? You'll lose the current game.",
      startTitle: "Block Route", startText: "Fit the pieces and clear lines to climb up the grades.",
      pausedTitle: "Paused", pausedText: "Press P or the button to keep going.",
      overTitle: "Fell on grade {g}!", overText: "{l} lines · {s} points",
      newRecord: "New best!", recordIs: "Best: {r}",
      keys: "← → move · ↑ rotate · ↓ soft drop · Space hard drop · P pause",
      left: "Move left", right: "Move right", down: "Soft drop",
      rotate: "Rotate piece", drop: "Hard drop", restartShort: "Restart",
      sGo: "Game on", sPause: "Game paused",
      sOver: "Game over. {s} points.", sUp: "You reach grade {g}!"
    }
  };

  const idioma = () => {
    const l = document.documentElement.lang;
    return l === "en" ? "en" : l === "ca-valencia" ? "val" : "es";
  };
  const tx = (clave, vars) => {
    const texto = (TEXTOS[idioma()] && TEXTOS[idioma()][clave]) || TEXTOS.es[clave] || clave;
    return texto.replace(/\{(\w+)\}/g, (m, n) => (vars && n in vars ? vars[n] : m));
  };

  /* ==========================================================
     3. DISEÑO (CSS dentro del propio JS)
     ========================================================== */
  const CSS = `
    .juego-intro { color: var(--muted); max-width: 62ch; margin-top: .75rem; }
    .arcade { display: grid; grid-template-columns: minmax(0, 300px) minmax(0, 1fr); gap: 2rem; align-items: start; margin-top: 2.5rem; outline: none; }
    .arcade:focus-visible { outline: 3px solid var(--accent); outline-offset: 8px; }

    .arcade__screen { position: relative; width: 100%; max-width: 300px; border: 2px solid var(--text); box-shadow: 6px 6px 0 var(--text); background: #14110e; line-height: 0; }
    .arcade__screen canvas { display: block; width: 100%; height: auto; aspect-ratio: 1 / 2; }
    .arcade__overlay { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: .9rem; padding: 1.25rem; text-align: center; background: rgba(20, 17, 14, .9); color: #f2ede3; line-height: 1.4; }
    .arcade__overlay[hidden] { display: none; }
    .arcade__overlay-title { margin: 0; font-family: var(--display); font-size: 1.5rem; font-weight: 700; }
    .arcade__overlay-text { margin: 0; font-family: var(--mono); font-size: .85rem; color: #d8d2c4; white-space: pre-line; }

    .arcade__toast {
      position: absolute; left: 50%; top: 12%;
      transform: translateX(-50%);
      padding: .55rem 1rem;
      background: var(--accent, #e04a52);
      color: #fff;
      font-family: var(--display);
      font-size: .95rem;
      font-weight: 700;
      border: 2px solid var(--text);
      box-shadow: 3px 3px 0 var(--text);
      pointer-events: none;
      z-index: 3;
      white-space: nowrap;
    }
    .arcade__toast[hidden] { display: none; }
    @media (prefers-reduced-motion: no-preference) {
      .arcade__toast { animation: arcadeToastIn .25s ease-out; }
      @keyframes arcadeToastIn {
        from { opacity: 0; transform: translate(-50%, -8px); }
        to   { opacity: 1; transform: translate(-50%, 0); }
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .arcade__toast { animation: none; }
    }

    .arcade__side { display: flex; flex-direction: column; gap: 1.25rem; }
    .arcade__stats { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .75rem; margin: 0; max-width: 360px; }
    .arcade__stat { background: var(--surface); border: 2px solid var(--text); box-shadow: 2px 2px 0 var(--text); padding: .6rem .8rem; }
    .arcade__stat dt { font-family: var(--mono); font-size: .72rem; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); }
    .arcade__stat dd { margin: 0; font-family: var(--display); font-size: 1.5rem; font-weight: 700; color: var(--text); }

    .arcade__stats-row { display: flex; align-items: flex-start; gap: .75rem; }
    .arcade__restart {
      flex: 0 0 auto;
      width: 48px; height: 48px;
      display: grid; place-items: center;
      padding: 0; font: inherit;
      color: var(--text); background: var(--surface);
      border: 2px solid var(--text);
      box-shadow: 2px 2px 0 var(--text);
      cursor: pointer; touch-action: manipulation;
    }
    .arcade__restart svg { width: 22px; height: 22px; pointer-events: none; }
    .arcade__restart:active { transform: translate(2px, 2px); box-shadow: 0 0 0 var(--text); }
    @media (prefers-reduced-motion: reduce) {
      .arcade__restart:active { transform: none; }
    }

    .arcade__next { display: flex; align-items: center; gap: 1rem; font-family: var(--mono); font-size: .72rem; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); }
    .arcade__next canvas { width: 80px; height: 80px; background: #14110e; border: 2px solid var(--text); }

    .arcade__pad { display: grid; grid-template-columns: repeat(3, 64px); grid-template-areas: ". rot ." "left down right" "drop drop drop"; gap: .5rem; width: max-content; }
    .arcade__btn { height: 56px; display: grid; place-items: center; padding: 0; font: inherit; color: var(--text); background: var(--surface); border: 2px solid var(--text); box-shadow: 2px 2px 0 var(--text); cursor: pointer; touch-action: manipulation; user-select: none; -webkit-user-select: none; -webkit-touch-callout: none; }
    .arcade__btn svg { width: 26px; height: 26px; pointer-events: none; }
    .arcade__btn:active { transform: translate(2px, 2px); box-shadow: 0 0 0 var(--text); }
    .arcade__btn[data-act="rot"] { grid-area: rot; }
    .arcade__btn[data-act="left"] { grid-area: left; }
    .arcade__btn[data-act="down"] { grid-area: down; }
    .arcade__btn[data-act="right"] { grid-area: right; }
    .arcade__btn[data-act="drop"] { grid-area: drop; }
    .arcade__keys { margin: 0; font-family: var(--mono); font-size: .8rem; color: var(--muted); max-width: 40ch; }
    .arcade-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }

    /* Móvil: marcadores arriba, tablero y botones JUNTOS en la pantalla (sin tener que hacer scroll mientras juegas).
       El tablero se encoge según la altura de la pantalla para que siempre quepan los botones debajo. */
    @media (max-width: 760px) {
      .arcade { grid-template-columns: 1fr; justify-items: center; gap: .75rem; margin-top: 1.5rem; }
      .arcade__side { display: contents; }
      .arcade__stats-row { order: 1; width: 100%; max-width: 300px; align-items: stretch; gap: .5rem; }
      .arcade__stats { flex: 1 1 auto; max-width: none; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: .4rem; }
      .arcade__stat { padding: .3rem .4rem; }
      .arcade__stat dt { font-size: .56rem; letter-spacing: .02em; }
      .arcade__stat dd { font-size: 1.05rem; }
      .arcade__restart { width: 44px; height: auto; }
      .arcade__screen { order: 2; max-width: clamp(150px, calc((100vh - 210px) / 2), 300px); max-width: clamp(150px, calc((100svh - 210px) / 2), 300px); }
      .arcade__overlay { gap: .6rem; padding: .75rem; }
      .arcade__overlay-title { font-size: 1.2rem; }
      .arcade__overlay-text { font-size: .75rem; }
      .arcade__pad { order: 3; width: 100%; max-width: 300px; grid-template-columns: repeat(5, minmax(0, 1fr)); grid-template-areas: "left down right rot drop"; gap: .4rem; }
      .arcade__btn { height: 52px; }
      .arcade__next { order: 4; }
      .arcade__keys { order: 5; text-align: center; }
    }

    @media (prefers-reduced-motion: no-preference) {
      .arcade__screen.is-flash { animation: arcadeFlash .2s ease-out; }
      @keyframes arcadeFlash { from { outline: 4px solid var(--accent); } to { outline: 4px solid transparent; } }
    }
    @media (prefers-reduced-motion: reduce) {
      .arcade__btn:active { transform: none; }
    }
  `;

  const estilo = document.createElement("style");
  estilo.id = "juego-css";
  estilo.textContent = CSS;
  document.head.appendChild(estilo);

  /* ==========================================================
     4. HTML DEL JUEGO
     ========================================================== */
  const ICONOS = {
    left: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    right: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    down: '<path d="M12 5v14M6 13l6 6 6-6"/>',
    rot: '<path d="M20 12a8 8 0 1 1-2.3-5.7M20 4v5h-5"/>',
    drop: '<path d="M7 6l5 5 5-5M7 13l5 5 5-5"/>',
    restart: '<path d="M3 12a9 9 0 1 0 3-6.7M3 4v5h5"/>'
  };
  const boton = (acc, clave) =>
    '<button type="button" class="arcade__btn" data-act="' + acc + '" data-ak="' + clave + '">' +
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
    ICONOS[acc] + '</svg></button>';

  root.innerHTML =
    '<div class="section-head">' +
      '<span class="section-tag" data-k="tag"></span>' +
      '<h2 id="juego-title"><span data-k="titleA"></span> <span class="accent-text" data-k="titleB"></span></h2>' +
      '<p class="juego-intro" data-k="intro"></p>' +
    '</div>' +
    '<div class="arcade" id="arcade" tabindex="0" role="group" data-ak="group">' +
      '<div class="arcade__screen" id="arcadeScreen">' +
        '<canvas id="arcadeBoard" width="' + COLS * CELL + '" height="' + ROWS * CELL + '" role="img"></canvas>' +
        '<div class="arcade__toast" id="arcadeToast" hidden></div>' +
        '<div class="arcade__overlay" id="arcadeOverlay">' +
          '<p class="arcade__overlay-title" id="arcadeOvTitle"></p>' +
          '<p class="arcade__overlay-text" id="arcadeOvText"></p>' +
          '<button type="button" class="btn btn-primary" id="arcadeAction"></button>' +
        '</div>' +
      '</div>' +
      '<div class="arcade__side">' +
        '<div class="arcade__stats-row">' +
          '<dl class="arcade__stats">' +
            '<div class="arcade__stat"><dt data-k="score"></dt><dd id="arcadeScore">0</dd></div>' +
            '<div class="arcade__stat"><dt data-k="lines"></dt><dd id="arcadeLines">0</dd></div>' +
            '<div class="arcade__stat"><dt data-k="grade"></dt><dd id="arcadeGrade">4</dd></div>' +
            '<div class="arcade__stat"><dt data-k="best"></dt><dd id="arcadeBest">0</dd></div>' +
          '</dl>' +
          '<button type="button" class="arcade__restart" id="arcadeRestart" data-ak="restart">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
            ICONOS.restart + '</svg>' +
          '</button>' +
        '</div>' +
        '<div class="arcade__next"><span data-k="next"></span><canvas id="arcadeNext" width="120" height="120" aria-hidden="true"></canvas></div>' +
        '<div class="arcade__pad">' +
          boton("rot", "rotate") + boton("left", "left") + boton("down", "down") +
          boton("right", "right") + boton("drop", "drop") +
        '</div>' +
        '<p class="arcade__keys" data-k="keys"></p>' +
      '</div>' +
    '</div>' +
    '<p class="arcade-sr" id="arcadeStatus" role="status" aria-live="polite"></p>';

  const arcade = document.getElementById("arcade");
  const screen = document.getElementById("arcadeScreen");
  const canvas = document.getElementById("arcadeBoard");
  const ctx = canvas.getContext("2d");
  const nextCanvas = document.getElementById("arcadeNext");
  const nctx = nextCanvas.getContext("2d");
  const overlay = document.getElementById("arcadeOverlay");
  const ovTitle = document.getElementById("arcadeOvTitle");
  const ovText = document.getElementById("arcadeOvText");
  const actionBtn = document.getElementById("arcadeAction");
  const restartBtn = document.getElementById("arcadeRestart");
  const toastEl = document.getElementById("arcadeToast");
  const statScore = document.getElementById("arcadeScore");
  const statLines = document.getElementById("arcadeLines");
  const statGrade = document.getElementById("arcadeGrade");
  const statBest = document.getElementById("arcadeBest");
  const statusEl = document.getElementById("arcadeStatus");

  /* ==========================================================
     5. ESTADO DEL JUEGO
     ========================================================== */
  let state = "idle";
  let board = vacio();
  let piece = null;
  let nextType = null;
  let bag = [];
  let score = 0;
  let lines = 0;
  let gradeIdx = 0;
  let record = 0;
  let newRecord = false;
  let rafId = 0;
  let lastTs = 0;
  let acc = 0;
  let toastTimer = 0;

  try { record = parseInt(localStorage.getItem(CLAVE_RECORD), 10) || 0; } catch (e) { record = 0; }

  function vacio() {
    return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
  }

  function tomarDeLaBolsa() {
    if (!bag.length) {
      bag = Object.keys(FORMAS);
      for (let i = bag.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [bag[i], bag[j]] = [bag[j], bag[i]];
      }
    }
    return bag.pop();
  }

  const girar = (m) => m[0].map((_, i) => m.map((fila) => fila[i]).reverse());
  const gravedadMs = () => Math.max(90, 800 - gradeIdx * 65);

  function choca(m, x, y) {
    for (let r = 0; r < m.length; r++) {
      for (let c = 0; c < m[r].length; c++) {
        if (!m[r][c]) continue;
        const nx = x + c;
        const ny = y + r;
        if (nx < 0 || nx >= COLS || ny >= ROWS) return true;
        if (ny >= 0 && board[ny][nx]) return true;
      }
    }
    return false;
  }

  function nuevaPartida() {
    board = vacio();
    bag = [];
    score = 0;
    lines = 0;
    gradeIdx = 0;
    newRecord = false;
    nextType = tomarDeLaBolsa();
    sacarPieza();
  }

  function sacarPieza() {
    const type = nextType;
    nextType = tomarDeLaBolsa();
    const m = FORMAS[type].map((fila) => fila.slice());
    piece = { type, m, x: Math.floor((COLS - m[0].length) / 2), y: type === "I" ? -1 : 0 };
    if (choca(piece.m, piece.x, piece.y)) finDePartida();
  }

  function fijarPieza() {
    let porEncima = false;
    piece.m.forEach((fila, r) => fila.forEach((v, c) => {
      if (!v) return;
      const by = piece.y + r;
      if (by < 0) porEncima = true;
      else board[by][piece.x + c] = COLORES[piece.type];
    }));
    if (porEncima) { finDePartida(); return; }
    cerrarLineas();
    if (state === "playing") sacarPieza();
  }

  function cerrarLineas() {
    let cerradas = 0;
    for (let r = ROWS - 1; r >= 0;) {
      if (board[r].every(Boolean)) {
        board.splice(r, 1);
        board.unshift(Array(COLS).fill(0));
        cerradas++;
      } else {
        r--;
      }
    }
    if (cerradas) {
      score += PUNTOS_LINEAS[cerradas] * (gradeIdx + 1);
      lines += cerradas;
      const nuevo = Math.min(Math.floor(lines / LINEAS_POR_GRADO), GRADOS.length - 1);
      if (nuevo > gradeIdx) {
        gradeIdx = nuevo;
        anunciar(tx("sUp", { g: GRADOS[gradeIdx] }));
        mostrarToast(tx("sUp", { g: GRADOS[gradeIdx] }));
      }
      destello();
    }
    actualizarMarcadores();
  }

  function finDePartida() {
    if (state === "over") return;
    window.cancelAnimationFrame(rafId);
    if (score > record) {
      record = score;
      newRecord = true;
      try { localStorage.setItem(CLAVE_RECORD, String(record)); } catch (e) {}
    }
    cambiarEstado("over");
    anunciar(tx("sOver", { s: score }));
  }

  /* ==========================================================
     6. MOVIMIENTOS
     ========================================================== */
  function moverX(dx) {
    if (state !== "playing") return;
    if (!choca(piece.m, piece.x + dx, piece.y)) piece.x += dx;
  }

  function girarPieza() {
    if (state !== "playing") return;
    const girada = girar(piece.m);
    for (const dx of [0, -1, 1, -2, 2]) {
      if (!choca(girada, piece.x + dx, piece.y)) {
        piece.m = girada;
        piece.x += dx;
        return;
      }
    }
  }

  function bajarUna() {
    if (state !== "playing") return;
    if (!choca(piece.m, piece.x, piece.y + 1)) {
      piece.y++;
      score += 1;
      acc = 0;
      actualizarMarcadores();
    }
  }

  function dejarCaer() {
    if (state !== "playing") return;
    let celdas = 0;
    while (!choca(piece.m, piece.x, piece.y + 1)) { piece.y++; celdas++; }
    score += celdas * 2;
    fijarPieza();
    acc = 0;
    actualizarMarcadores();
  }

  function pasoDeGravedad() {
    if (!choca(piece.m, piece.x, piece.y + 1)) piece.y++;
    else fijarPieza();
  }

  /* ==========================================================
     7. BUCLE DEL JUEGO
     ========================================================== */
  function fotograma(ts) {
    if (state !== "playing") return;
    acc += Math.min(ts - lastTs, 100);
    lastTs = ts;
    const g = gravedadMs();
    while (acc >= g && state === "playing") {
      acc -= g;
      pasoDeGravedad();
    }
    dibujar();
    if (state === "playing") rafId = window.requestAnimationFrame(fotograma);
  }

  function cambiarEstado(nuevo) {
    state = nuevo;
    if (state === "playing") {
      lastTs = performance.now();
      acc = 0;
      rafId = window.requestAnimationFrame(fotograma);
    }
    pintarOverlay();
    actualizarMarcadores();
    dibujar();
  }

  function empezar() { nuevaPartida(); cambiarEstado("playing"); anunciar(tx("sGo")); }
  function pausar() {
    if (state !== "playing") return;
    window.cancelAnimationFrame(rafId);
    cambiarEstado("paused");
    anunciar(tx("sPause"));
  }
  function reanudar() {
    if (state !== "paused") return;
    cambiarEstado("playing");
    anunciar(tx("sGo"));
  }

  function reiniciar() {
    if (state === "playing" || state === "paused") {
      if (!window.confirm(tx("restartConfirm"))) return;
    }
    empezar();
    enfocar();
  }

  /* ==========================================================
     8. DIBUJO
     ========================================================== */
  function casilla(c, x, y, size, color, fantasma) {
    const px = x * size;
    const py = y * size;
    if (fantasma) {
      c.globalAlpha = 0.45;
      c.strokeStyle = color;
      c.lineWidth = 2;
      c.strokeRect(px + 3, py + 3, size - 6, size - 6);
      c.globalAlpha = 1;
      return;
    }
    c.fillStyle = color;
    c.fillRect(px, py, size, size);
    const borde = Math.max(3, Math.round(size / 8));
    c.fillStyle = "rgba(255,255,255,.28)";
    c.fillRect(px, py, size, borde);
    c.fillRect(px, py, borde, size);
    c.fillStyle = "rgba(0,0,0,.30)";
    c.fillRect(px, py + size - borde, size, borde);
    c.fillRect(px + size - borde, py, borde, size);
    c.strokeStyle = "#14110e";
    c.lineWidth = 2;
    c.strokeRect(px + 1, py + 1, size - 2, size - 2);
  }

  function dibujar() {
    ctx.fillStyle = "#14110e";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "rgba(242,237,227,.06)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let c = 1; c < COLS; c++) { ctx.moveTo(c * CELL + 0.5, 0); ctx.lineTo(c * CELL + 0.5, ROWS * CELL); }
    for (let r = 1; r < ROWS; r++) { ctx.moveTo(0, r * CELL + 0.5); ctx.lineTo(COLS * CELL, r * CELL + 0.5); }
    ctx.stroke();

    board.forEach((fila, r) => fila.forEach((color, c) => { if (color) casilla(ctx, c, r, CELL, color, false); }));

    if (piece && state !== "idle") {
      if (state === "playing") {
        let gy = piece.y;
        while (!choca(piece.m, piece.x, gy + 1)) gy++;
        piece.m.forEach((fila, r) => fila.forEach((v, c) => {
          if (v && gy + r >= 0) casilla(ctx, piece.x + c, gy + r, CELL, COLORES[piece.type], true);
        }));
      }
      piece.m.forEach((fila, r) => fila.forEach((v, c) => {
        if (v && piece.y + r >= 0) casilla(ctx, piece.x + c, piece.y + r, CELL, COLORES[piece.type], false);
      }));
    }

    nctx.fillStyle = "#14110e";
    nctx.fillRect(0, 0, nextCanvas.width, nextCanvas.height);
    if (nextType && state !== "idle") {
      const m = FORMAS[nextType];
      const size = 24;
      const ox = (nextCanvas.width / size - m[0].length) / 2;
      const oy = (nextCanvas.height / size - m.length) / 2;
      m.forEach((fila, r) => fila.forEach((v, c) => { if (v) casilla(nctx, ox + c, oy + r, size, COLORES[nextType], false); }));
    }
  }

  /* ==========================================================
     9. TEXTOS, MARCADORES Y ACCESIBILIDAD
     ========================================================== */
  function anunciar(mensaje) { statusEl.textContent = mensaje; }

  function mostrarToast(mensaje) {
    if (!toastEl) return;
    window.clearTimeout(toastTimer);
    toastEl.textContent = mensaje;
    toastEl.hidden = false;
    toastTimer = window.setTimeout(() => { toastEl.hidden = true; }, 2000);
  }

  function actualizarMarcadores() {
    statScore.textContent = String(score);
    statLines.textContent = String(lines);
    statGrade.textContent = GRADOS[gradeIdx];
    statBest.textContent = String(Math.max(record, score));
    canvas.setAttribute("aria-label",
      tx("board") + ". " + tx("score") + " " + score + ", " + tx("lines") + " " + lines + ", " + tx("grade") + " " + GRADOS[gradeIdx]);
  }

  function pintarOverlay() {
    if (state === "playing") { overlay.hidden = true; return; }
    overlay.hidden = false;
    if (state === "idle") {
      ovTitle.textContent = tx("startTitle");
      ovText.textContent = tx("startText") + (record ? "\n" + tx("recordIs", { r: record }) : "");
      actionBtn.textContent = tx("play");
    } else if (state === "paused") {
      ovTitle.textContent = tx("pausedTitle");
      ovText.textContent = tx("pausedText");
      actionBtn.textContent = tx("resume");
    } else {
      ovTitle.textContent = tx("overTitle", { g: GRADOS[gradeIdx] });
      ovText.textContent = tx("overText", { l: lines, s: score }) + "\n" + (newRecord ? tx("newRecord") : tx("recordIs", { r: record }));
      actionBtn.textContent = tx("again");
    }
  }

  function pintarTextos() {
    root.querySelectorAll("[data-k]").forEach((el) => { el.textContent = tx(el.dataset.k); });
    root.querySelectorAll("[data-ak]").forEach((el) => {
      const t = tx(el.dataset.ak);
      el.setAttribute("aria-label", t);
      if (el.tagName === "BUTTON") el.setAttribute("title", t);
    });
    pintarOverlay();
    actualizarMarcadores();
  }

  function destello() {
    screen.classList.remove("is-flash");
    void screen.offsetWidth;
    screen.classList.add("is-flash");
  }
  screen.addEventListener("animationend", () => screen.classList.remove("is-flash"));

  /* ==========================================================
     10. CONTROLES
     ========================================================== */
  const enfocar = () => arcade.focus({ preventScroll: true });

  arcade.addEventListener("keydown", (e) => {
    if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey) return;
    const k = e.key;
    if (state === "playing") {
      if (k === "ArrowLeft") moverX(-1);
      else if (k === "ArrowRight") moverX(1);
      else if (k === "ArrowDown") bajarUna();
      else if (k === "ArrowUp" || k === "x" || k === "X") girarPieza();
      else if (k === " ") dejarCaer();
      else if (k === "p" || k === "P" || k === "Escape") pausar();
      else return;
      e.preventDefault();
      if (state === "playing") dibujar();
    } else if (state === "paused" && (k === "p" || k === "P" || k === "Escape")) {
      e.preventDefault();
      reanudar();
    }
  });

  actionBtn.addEventListener("click", () => {
    if (state === "paused") reanudar(); else empezar();
    enfocar();
  });

  restartBtn.addEventListener("click", reiniciar);

  const ACCIONES = {
    left: { fn: () => moverX(-1), repetir: true },
    right: { fn: () => moverX(1), repetir: true },
    down: { fn: bajarUna, repetir: true },
    rot: { fn: girarPieza, repetir: false },
    drop: { fn: dejarCaer, repetir: false }
  };

  root.querySelectorAll(".arcade__btn").forEach((btn) => {
    const { fn, repetir } = ACCIONES[btn.dataset.act];
    let t1 = 0;
    let t2 = 0;
    const accion = () => { fn(); if (state === "playing") dibujar(); };
    const parar = () => { window.clearTimeout(t1); window.clearInterval(t2); };

    btn.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      try { btn.setPointerCapture(e.pointerId); } catch (err) {}
      accion();
      if (repetir) t1 = window.setTimeout(() => { t2 = window.setInterval(accion, 85); }, 260);
    });
    ["pointerup", "pointercancel"].forEach((ev) =>
      btn.addEventListener(ev, (e) => {
        try { btn.releasePointerCapture(e.pointerId); } catch (err) {}
        parar();
        if (state === "playing") enfocar();
      }));
    btn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); accion(); }
    });
  });

  document.addEventListener("visibilitychange", () => { if (document.hidden) pausar(); });
  arcade.addEventListener("focusout", (e) => {
    if (!arcade.contains(e.relatedTarget)) pausar();
  });
  if ("IntersectionObserver" in window) {
    new IntersectionObserver((entradas) => {
      if (!entradas[0].isIntersecting) pausar();
    }, { threshold: 0.15 }).observe(arcade);
  }

  document.addEventListener("portfolio:languagechange", pintarTextos);

  /* ==========================================================
     11. ARRANQUE
     ========================================================== */
  nuevaPartida();
  state = "idle";
  pintarTextos();
  dibujar();

  /* ▼ Las 5 pruebas del Tutorial 4 (Paso 6):
     [ ] 1. Teclado: se puede jugar la partida entera con Tab + flechas
            + Espacio + P (pausa) + botón Reiniciar con Enter.
     [ ] 2. Récord persistente: cierra la pestaña, vuelve a abrirla,
            el récord sigue en las stats.
     [ ] 3. Móvil: en pantalla pequeña no se sale del ancho, los botones
            del pad responden al pulgar y al mantener pulsado repiten.
     [ ] 4. prefers-reduced-motion: con la opción activada en el sistema,
            no hay flash, no hay animación de toast y los botones no se
            "hunden". El juego sigue siendo jugable.
     [ ] 5. Tercera persona: alguien que no ha visto el juego lo abre y
            juega sin que le expliques nada. Si necesita instrucciones,
            hay que mejorar el overlay de inicio.
  */
})();