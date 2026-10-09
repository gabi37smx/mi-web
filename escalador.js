/* ============================================================
   escalador.js · Escalador animado de la barra lateral (versión 3)

   Qué hace:
   1. Dibuja un escalador distinto según el skin activo:
        · topo / omarchy  →  escalador de líneas (v2 original)
        · minecraft       →  Steve pixel art
   2. Al cambiar de skin en caliente, redibuja automáticamente.
   3. Mientras haces scroll alterna dos poses (brazo y pierna contrarios).
   4. Al parar se queda colgado y se balancea suave.
   5. Las presas por las que ya ha pasado se quedan iluminadas.
   6. Al llegar a una presa, esa presa da un destello y el escalador saluda.
   7. Al final de la página levanta los dos brazos (¡cima!).
   8. Con "reducir movimiento" no hay alternancia, balanceo, destello ni saludo.

   No toca script.js ni style.css: sustituye el dibujo que pinta script.js y
   trae su propio CSS. Se carga DESPUÉS de script.js.
   ============================================================ */

(function () {
  "use strict";

  const climber = document.getElementById("climber");
  if (!climber) return;

  const holds = [...document.querySelectorAll(".climb-hold")];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const PASO = 140;
  const UMBRAL = 14;
  const SALUDO_MS = 900;
  const PULSO_MS = 1400;

  /* ---------- CSS propio ---------- */
  const estilo = document.createElement("style");
  estilo.id = "escalador-css";
  estilo.textContent = `
    .climb-climber { width: 32px; height: 40px; }
    @media (max-width: 720px) { .climb-climber { width: 26px; height: 33px; } }

    /* Escalador de líneas: color mostaza */
    .climb-climber { color: #a67300; }
    [data-theme="dark"] .climb-climber { color: var(--accent-3); }

    .climb-climber svg { transform-origin: 50% 20%; }
    .climb-climber .cuerpo { stroke-width: 3.4; }
    .climb-climber .relleno { fill: var(--accent); stroke: none; }
    .climb-climber .mano, .climb-climber .pie { fill: currentColor; stroke: none; }

    /* Poses del escalador de líneas */
    .climb-climber .pose, .climb-climber .arm-wave { display: none; }
    .climb-climber svg:not(.is-pose-b):not(.is-summit) .pose-a,
    .climb-climber svg.is-pose-b:not(.is-summit) .pose-b,
    .climb-climber svg.is-summit .pose-c { display: inline; }

    .climb-climber svg.is-waving:not(.is-summit) .pose-a { display: inline; }
    .climb-climber svg.is-waving:not(.is-summit) .pose-b { display: none; }
    .climb-climber svg.is-waving:not(.is-summit) .arm-r-a { display: none; }
    .climb-climber svg.is-waving:not(.is-summit) .arm-wave { display: inline; }
    .climb-climber .arm-wave { transform-box: view-box; transform-origin: 13px 9.8px; }

    /* Poses de Steve pixel art */
    .climb-climber .steve-pose { display: none; }
    .climb-climber svg[data-escalador="3"]:not(.is-pose-b):not(.is-summit) .steve-pose-a,
    .climb-climber svg[data-escalador="3"].is-pose-b:not(.is-summit) .steve-pose-b,
    .climb-climber svg[data-escalador="3"].is-summit .steve-pose-c { display: inline; }
    .climb-climber svg[data-escalador="3"].is-waving:not(.is-summit) .steve-pose-a { display: inline; }
    .climb-climber svg[data-escalador="3"].is-waving:not(.is-summit) .steve-pose-b { display: none; }
    .climb-climber svg[data-escalador="3"].is-waving:not(.is-summit) .steve-arm-r-a { display: none; }
    .climb-climber svg[data-escalador="3"].is-waving:not(.is-summit) .steve-arm-wave { display: inline; }
    .climb-climber svg[data-escalador="3"] .steve-arm-wave { transform-box: view-box; transform-origin: 13px 9.8px; }

    /* Presas */
    .climb-hold.is-passed:not(.is-active):not(.is-lit) { background: rgba(var(--accent-rgb), .28); }
    .climb-hold.is-lit {
      background: rgba(var(--accent-rgb), .22);
      border-color: var(--accent);
      box-shadow: none;
    }

    /* Movimiento (si el visitante no ha pedido reducirlo) */
    @media (prefers-reduced-motion: no-preference) {
      .climb-climber svg:not(.is-moving):not(.is-summit) { animation: escaladorBalanceo 2.6s ease-in-out infinite alternate; }
      .climb-climber svg.is-summit { animation: escaladorCima .45s ease-in-out infinite alternate; }
      .climb-climber svg.is-waving .arm-wave,
      .climb-climber svg.is-waving .steve-arm-wave { animation: escaladorSaluda .3s ease-in-out infinite alternate; }
      .climb-hold.is-hello { animation: presaSaluda ${PULSO_MS}ms ease-out; }
      @keyframes escaladorBalanceo { from { transform: rotate(-3deg); } to { transform: rotate(3deg); } }
      @keyframes escaladorCima { from { transform: translateY(0); } to { transform: translateY(-2px); } }
      @keyframes escaladorSaluda { from { transform: rotate(-14deg); } to { transform: rotate(14deg); } }
      @keyframes presaSaluda {
        0%   { background: rgba(var(--accent-rgb), .7); box-shadow: 0 0 0 0 rgba(var(--accent-rgb), .55), 0 0 10px 2px rgba(var(--accent-rgb), .45); }
        100% { background: rgba(var(--accent-rgb), .22); box-shadow: 0 0 0 16px rgba(var(--accent-rgb), 0), 0 0 0 0 rgba(var(--accent-rgb), 0); }
      }
    }
  `;
  document.head.appendChild(estilo);

  /* ---------- Dibujo 1: escalador de líneas (topo/omarchy) ---------- */
  const DIBUJO_LINEAS = `
    <svg viewBox="0 0 24 30" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-escalador="2">
      <circle cx="12" cy="5.4" r="2.3"/>
      <path class="relleno" d="M9.5 5.2 A2.5 2.5 0 0 1 14.5 5.2 Z"/>
      <path class="cuerpo" d="M12 8.6 V16"/>
      <rect class="relleno" x="9.9" y="14.6" width="4.2" height="1.9" rx=".7"/>
      <g class="pose pose-a">
        <path d="M11 9.8 L7.6 7.4 L6.9 3.9"/><circle class="mano" cx="6.9" cy="3.6" r="1.15"/>
        <path class="arm-r-a" d="M13 10 L16.4 12.4 L17.2 15.6"/><circle class="mano arm-r-a" cx="17.2" cy="15.9" r="1.1"/>
        <path d="M11.2 16.4 L7.6 20.2 L8.6 25.6"/><ellipse class="pie" cx="8.9" cy="26.4" rx="1.7" ry="1.1"/>
        <path d="M12.8 16.4 L16.4 19.4 L15.8 25"/><ellipse class="pie" cx="15.9" cy="25.9" rx="1.7" ry="1.1"/>
      </g>
      <g class="pose pose-b">
        <path d="M13 9.8 L16.4 7.4 L17.1 3.9"/><circle class="mano" cx="17.1" cy="3.6" r="1.15"/>
        <path d="M11 10 L7.6 12.4 L6.8 15.6"/><circle class="mano" cx="6.8" cy="15.9" r="1.1"/>
        <path d="M12.8 16.4 L16.4 20.2 L15.4 25.6"/><ellipse class="pie" cx="15.1" cy="26.4" rx="1.7" ry="1.1"/>
        <path d="M11.2 16.4 L7.6 19.4 L8.2 25"/><ellipse class="pie" cx="8.1" cy="25.9" rx="1.7" ry="1.1"/>
      </g>
      <g class="pose pose-c">
        <path d="M11 9.8 L8 6.6 L6.4 3"/><circle class="mano" cx="6.3" cy="2.8" r="1.15"/>
        <path d="M13 9.8 L16 6.6 L17.6 3"/><circle class="mano" cx="17.7" cy="2.8" r="1.15"/>
        <path d="M11.2 16.4 L9.6 21.4 L9.4 26"/><ellipse class="pie" cx="9.2" cy="26.8" rx="1.7" ry="1.1"/>
        <path d="M12.8 16.4 L14.4 21.4 L14.6 26"/><ellipse class="pie" cx="14.8" cy="26.8" rx="1.7" ry="1.1"/>
      </g>
      <g class="arm-wave">
        <path d="M13 9.8 L17 7.6 L19 4.2"/><circle class="mano" cx="19.2" cy="3.8" r="1.15"/>
      </g>
    </svg>
  `;

  /* ---------- Dibujo 2: Steve pixel art (minecraft) ---------- */
  /* Paleta:
     piel #C9A27E · pelo #5A3A1E · ojos #FFFFFF/#3A1E0E
     camiseta #24A0A0 · pantalón #3A4A7A · botas #3A2E1E
     contorno #1a1a1a
  */

  const CABEZA = `
    <rect x="6" y="0" width="12" height="8" fill="#C9A27E" stroke="#1a1a1a" stroke-width="0.5"/>
    <rect x="6" y="0" width="12" height="3" fill="#5A3A1E" stroke="#1a1a1a" stroke-width="0.5"/>
    <rect x="6" y="3" width="2" height="2" fill="#5A3A1E" stroke="#1a1a1a" stroke-width="0.5"/>
    <rect x="16" y="3" width="2" height="2" fill="#5A3A1E" stroke="#1a1a1a" stroke-width="0.5"/>
    <rect x="9" y="4" width="1" height="1" fill="#FFFFFF"/>
    <rect x="14" y="4" width="1" height="1" fill="#FFFFFF"/>
    <rect x="10" y="4" width="1" height="1" fill="#3A1E0E"/>
    <rect x="15" y="4" width="1" height="1" fill="#3A1E0E"/>
    <rect x="10" y="6" width="4" height="1" fill="#3A1E0E"/>
  `;

  const TORSO = `
    <rect x="6" y="8" width="12" height="9" fill="#24A0A0" stroke="#1a1a1a" stroke-width="0.5"/>
  `;

  const PANTALON = `
    <rect x="6" y="17" width="12" height="7" fill="#3A4A7A" stroke="#1a1a1a" stroke-width="0.5"/>
  `;

  const STEVE_POSE_A = `
    <g class="steve-pose steve-pose-a">
      <rect x="4" y="0" width="2" height="9" fill="#C9A27E" stroke="#1a1a1a" stroke-width="0.5"/>
      <rect class="steve-arm-r-a" x="18" y="8" width="2" height="9" fill="#C9A27E" stroke="#1a1a1a" stroke-width="0.5"/>
      <rect x="6" y="24" width="3" height="5" fill="#3A4A7A" stroke="#1a1a1a" stroke-width="0.5"/>
      <rect x="5" y="29" width="4" height="2" fill="#3A2E1E" stroke="#1a1a1a" stroke-width="0.5"/>
      <rect x="12" y="24" width="3" height="8" fill="#3A4A7A" stroke="#1a1a1a" stroke-width="0.5"/>
      <rect x="12" y="32" width="4" height="2" fill="#3A2E1E" stroke="#1a1a1a" stroke-width="0.5"/>
    </g>
  `;

  const STEVE_POSE_B = `
    <g class="steve-pose steve-pose-b">
      <rect x="4" y="8" width="2" height="9" fill="#C9A27E" stroke="#1a1a1a" stroke-width="0.5"/>
      <rect x="18" y="0" width="2" height="9" fill="#C9A27E" stroke="#1a1a1a" stroke-width="0.5"/>
      <rect x="9" y="24" width="3" height="8" fill="#3A4A7A" stroke="#1a1a1a" stroke-width="0.5"/>
      <rect x="8" y="32" width="4" height="2" fill="#3A2E1E" stroke="#1a1a1a" stroke-width="0.5"/>
      <rect x="15" y="24" width="3" height="5" fill="#3A4A7A" stroke="#1a1a1a" stroke-width="0.5"/>
      <rect x="15" y="29" width="4" height="2" fill="#3A2E1E" stroke="#1a1a1a" stroke-width="0.5"/>
    </g>
  `;

  const STEVE_POSE_C = `
    <g class="steve-pose steve-pose-c">
      <rect x="2" y="0" width="2" height="8" fill="#C9A27E" stroke="#1a1a1a" stroke-width="0.5"/>
      <rect x="20" y="0" width="2" height="8" fill="#C9A27E" stroke="#1a1a1a" stroke-width="0.5"/>
      <rect x="9" y="24" width="3" height="8" fill="#3A4A7A" stroke="#1a1a1a" stroke-width="0.5"/>
      <rect x="12" y="24" width="3" height="8" fill="#3A4A7A" stroke="#1a1a1a" stroke-width="0.5"/>
      <rect x="8" y="32" width="4" height="2" fill="#3A2E1E" stroke="#1a1a1a" stroke-width="0.5"/>
      <rect x="12" y="32" width="4" height="2" fill="#3A2E1E" stroke="#1a1a1a" stroke-width="0.5"/>
    </g>
  `;

  const STEVE_ARM_WAVE = `
    <g class="steve-arm-wave">
      <rect x="20" y="0" width="2" height="8" fill="#C9A27E" stroke="#1a1a1a" stroke-width="0.5"/>
    </g>
  `;

  const DIBUJO_STEVE = `
    <svg viewBox="0 0 24 34" shape-rendering="crispEdges" aria-hidden="true" data-escalador="3">
      ${CABEZA}
      ${TORSO}
      ${PANTALON}
      ${STEVE_POSE_A}
      ${STEVE_POSE_B}
      ${STEVE_POSE_C}
      ${STEVE_ARM_WAVE}
    </svg>
  `;

  /* ---------- Elegir dibujo según skin activo ---------- */
  function skinActual() {
    return document.documentElement.getAttribute("data-skin") || "topo";
  }

  function dibujoParaSkin(skin) {
    return skin === "minecraft" ? DIBUJO_STEVE : DIBUJO_LINEAS;
  }

  // Repinta el escalador con el dibujo que toque. Devuelve el SVG.
  function montar() {
    const skin = skinActual();
    const marca = skin === "minecraft" ? "3" : "2";
    if (!climber.querySelector(`[data-escalador="${marca}"]`)) {
      climber.innerHTML = dibujoParaSkin(skin);
    }
    return climber.querySelector("svg");
  }

  let svg = montar();
  let reposo = 0;
  let saludoTimer = 0;

  /* ---------- Presas ---------- */
  let presasY = [];
  function medirPresas() {
    presasY = holds.map((h) => {
      const r = h.getBoundingClientRect();
      return r.top + r.height / 2;
    });
  }

  let presaActual = -1;
  let primeraVez = true;

  function saludar(i) {
    if (reduceMotion) return;
    const presa = holds[i];
    presa.classList.remove("is-hello");
    void presa.offsetWidth;
    presa.classList.add("is-hello");
    window.setTimeout(() => presa.classList.remove("is-hello"), PULSO_MS);

    svg.classList.add("is-waving");
    window.clearTimeout(saludoTimer);
    saludoTimer = window.setTimeout(() => svg.classList.remove("is-waving"), SALUDO_MS);
  }

  function actualizarPresas(progreso) {
    if (presasY.length < 2) return;
    const yEscalador = presasY[0] + (presasY[presasY.length - 1] - presasY[0]) * progreso;

    let cercana = -1;
    let mejor = Infinity;
    presasY.forEach((y, i) => {
      const d = Math.abs(y - yEscalador);
      if (d < mejor) { mejor = d; cercana = i; }
      holds[i].classList.toggle("is-passed", y < yEscalador - UMBRAL);
    });

    const enPresa = mejor <= UMBRAL ? cercana : -1;
    holds.forEach((h, i) => h.classList.toggle("is-lit", i === enPresa));

    if (enPresa !== presaActual) {
      presaActual = enPresa;
      if (enPresa !== -1 && !primeraVez) saludar(enPresa);
    }
    primeraVez = false;
  }

  /* ---------- Scroll ---------- */
  function actualizar() {
    svg = montar();
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const progreso = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;

    actualizarPresas(progreso);
    svg.classList.toggle("is-summit", progreso >= 0.985);
    if (reduceMotion) return;

    svg.classList.toggle("is-pose-b", Math.floor(y / PASO) % 2 === 1);
    svg.classList.add("is-moving");
    window.clearTimeout(reposo);
    reposo = window.setTimeout(() => svg.classList.remove("is-moving"), 220);
  }

  function remedir() { medirPresas(); actualizar(); }

  window.addEventListener("scroll", actualizar, { passive: true });
  window.addEventListener("resize", remedir);
  window.addEventListener("load", remedir);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(remedir);
  window.requestAnimationFrame(remedir);

  /* ---------- Redibujar al cambiar de skin en caliente ---------- */
  const observer = new MutationObserver(() => {
    // Forzamos a que se monte el dibujo correcto y se recalcule todo
    svg = montar();
    // Esperamos un tick para que el CSS de la skin esté aplicado
    window.requestAnimationFrame(remedir);
  });
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-skin"]
  });
})();