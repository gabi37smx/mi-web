/* ============================================================
   escalador.js · Escalador animado de la barra lateral (versión 2)

   Qué hace, en cristiano:
   1. Dibujo con más cuerpo (casco, torso, arnés, manos y pies) en color mostaza.
   2. Mientras haces scroll alterna dos poses (brazo y pierna contrarios).
   3. Al parar se queda colgado y se balancea suave.
   4. Las presas por las que ya ha pasado se quedan iluminadas.
   5. Al llegar a una presa, esa presa da un destello que se apaga despacio
      (queda un tono suave para no tapar al escalador) y él la saluda con la mano.
   6. Al final de la página levanta los dos brazos (¡cima!).
   7. Con "reducir movimiento" no hay alternancia, balanceo, destello ni saludo:
      solo quedan los tonos de las presas y la pose de cima.

   No toca script.js ni style.css: sustituye el dibujo que pinta script.js y
   trae su propio CSS. Se carga DESPUÉS de script.js.
   ============================================================ */

(function () {
  "use strict";

  const climber = document.getElementById("climber");
  if (!climber) return;

  const holds = [...document.querySelectorAll(".climb-hold")];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const PASO = 140;      // píxeles de scroll entre un cambio de pose y el siguiente
  const UMBRAL = 14;     // distancia (px) a la que se considera que el escalador "está en" una presa
  const SALUDO_MS = 900; // duración del saludo del escalador
  const PULSO_MS = 1400; // duración del destello de la presa (se apaga despacio)

  /* ---------- Diseño (CSS propio) ---------- */
  const estilo = document.createElement("style");
  estilo.id = "escalador-css";
  estilo.textContent = `
    /* Un poco más grande que antes (26×32 → 32×40) */
    .climb-climber { width: 32px; height: 40px; }
    @media (max-width: 720px) { .climb-climber { width: 26px; height: 33px; } }

    /* Color mostaza para que destaque sobre la cuerda y las presas rojas.
       Tema oscuro: el mostaza de tu paleta (--accent-3). Tema claro: un ocre más oscuro, porque el
       mostaza claro sobre el fondo crema casi no se ve (contraste 2:1; el ocre da 3,5:1). */
    .climb-climber { color: #a67300; }
    [data-theme="dark"] .climb-climber { color: var(--accent-3); }

    .climb-climber svg { transform-origin: 50% 20%; }
    .climb-climber .cuerpo { stroke-width: 3.4; }
    .climb-climber .relleno { fill: var(--accent); stroke: none; }
    .climb-climber .mano, .climb-climber .pie { fill: currentColor; stroke: none; }

    /* Poses: solo se ve una a la vez */
    .climb-climber .pose, .climb-climber .arm-wave { display: none; }
    .climb-climber svg:not(.is-pose-b):not(.is-summit) .pose-a,
    .climb-climber svg.is-pose-b:not(.is-summit) .pose-b,
    .climb-climber svg.is-summit .pose-c { display: inline; }

    /* Saludo: pose A con el brazo derecho levantado */
    .climb-climber svg.is-waving:not(.is-summit) .pose-a { display: inline; }
    .climb-climber svg.is-waving:not(.is-summit) .pose-b { display: none; }
    .climb-climber svg.is-waving:not(.is-summit) .arm-r-a { display: none; }
    .climb-climber svg.is-waving:not(.is-summit) .arm-wave { display: inline; }
    .climb-climber .arm-wave { transform-box: view-box; transform-origin: 13px 9.8px; }

    /* Presas: las ya superadas quedan teñidas; la actual lleva solo un tono suave
       para no tapar al escalador. El destello fuerte es solo la animación de llegada. */
    .climb-hold.is-passed:not(.is-active):not(.is-lit) { background: rgba(var(--accent-rgb), .28); }
    .climb-hold.is-lit {
      background: rgba(var(--accent-rgb), .22);
      border-color: var(--accent);
      box-shadow: none;
    }

    /* Los movimientos solo se ven si el visitante no pidió reducir el movimiento */
    @media (prefers-reduced-motion: no-preference) {
      .climb-climber svg:not(.is-moving):not(.is-summit) { animation: escaladorBalanceo 2.6s ease-in-out infinite alternate; }
      .climb-climber svg.is-summit { animation: escaladorCima .45s ease-in-out infinite alternate; }
      .climb-climber svg.is-waving .arm-wave { animation: escaladorSaluda .3s ease-in-out infinite alternate; }
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

  /* ---------- Dibujo: cuerpo común + poses ---------- */
  const DIBUJO = `
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

  // script.js ya pintó un escalador sencillo; aquí lo cambiamos por el de poses.
  function montar() {
    if (!climber.querySelector('[data-escalador="2"]')) climber.innerHTML = DIBUJO;
    return climber.querySelector("svg");
  }

  let svg = montar();
  let reposo = 0;
  let saludoTimer = 0;

  /* ---------- Posición de las presas ---------- */
  // La barra es fija, así que los centros de las presas en pantalla no cambian al hacer scroll.
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
    void presa.offsetWidth; // reinicia la animación
    presa.classList.add("is-hello");
    window.setTimeout(() => presa.classList.remove("is-hello"), PULSO_MS);

    svg.classList.add("is-waving");
    window.clearTimeout(saludoTimer);
    saludoTimer = window.setTimeout(() => svg.classList.remove("is-waving"), SALUDO_MS);
  }

  function actualizarPresas(progreso) {
    if (presasY.length < 2) return;
    // Misma fórmula que script.js para colocar al escalador entre la primera y la última presa
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
    svg = montar(); // por si script.js lo repintó después
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
})();