/* ============================================================
   easter-eggs.js · Huevos de pascua del portfolio
   ------------------------------------------------------------
   Solo se activa en el skin "minecraft". En topo y omarchy
   el script no hace nada.
   ============================================================ */

(function easterEggs() {
  "use strict";
    /* ============================================================
     SONIDOS · Web Audio API (sin archivos externos)
     ============================================================ */

  // Estado del sonido (leído de localStorage, por defecto OFF)
  let sonidoActivo = localStorage.getItem("ee-sonido") === "on";

  // Contexto de audio (se crea lazy al primer sonido, porque los navegadores
  // no permiten crear AudioContext hasta que hay interacción del usuario)
  let audioCtx = null;
  function getAudioCtx() {
    if (!audioCtx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return null;
      audioCtx = new Ctx();
    }
    if (audioCtx.state === "suspended") audioCtx.resume();
    return audioCtx;
  }

  // Genera un "pop" tipo Minecraft (click de botón)
  function sonidoClick() {
    if (!sonidoActivo || !esMinecraft() || reduceMotion) return;
    const ctx = getAudioCtx();
    if (!ctx) return;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "square";
    osc.frequency.setValueAtTime(880, t);
    osc.frequency.exponentialRampToValueAtTime(440, t + 0.06);

    gain.gain.setValueAtTime(0.08, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.09);
  }

  // "Tick" sutil al pasar por encima (opcional)
  function sonidoHover() {
    if (!sonidoActivo || !esMinecraft() || reduceMotion) return;
    const ctx = getAudioCtx();
    if (!ctx) return;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "square";
    osc.frequency.setValueAtTime(1200, t);

    gain.gain.setValueAtTime(0.025, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.04);
  }

  // Arpegio tipo "logro desbloqueado" (para el Konami)
  function sonidoKonami() {
    if (!sonidoActivo || !esMinecraft() || reduceMotion) return;
    const ctx = getAudioCtx();
    if (!ctx) return;

    const notas = [523.25, 659.25, 783.99, 1046.5];  // C5 E5 G5 C6
    notas.forEach((f, i) => {
      const t = ctx.currentTime + i * 0.08;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(f, t);
      gain.gain.setValueAtTime(0.06, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.16);
    });
  }

  // Exponer para que la parte del Konami lo llame
  window.eeSonidoKonami = sonidoKonami;

  // ---------- Solo activo en Minecraft ----------
  function skinActual() {
    return document.documentElement.getAttribute("data-skin") || "topo";
  }
  function esMinecraft() {
    return skinActual() === "minecraft";
  }

  // ---------- Reduced motion ----------
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- CSS inyectado (solo cuando se activa por primera vez) ----------
  function inyectarCSS() {
    if (document.getElementById("easter-eggs-css")) return;
    const estilo = document.createElement("style");
    estilo.id = "easter-eggs-css";
    estilo.textContent = `
      /* --- Lluvia de bloques --- */
      .ee-lluvia {
        position: fixed;
        inset: 0;
        pointer-events: none;
        overflow: hidden;
        z-index: 9998;
      }
      .ee-bloque {
        position: absolute;
        top: -64px;
        width: 32px;
        height: 32px;
        image-rendering: pixelated;
        animation: ee-caer linear forwards;
        will-change: transform;
      }
      @keyframes ee-caer {
        0%   { transform: translateY(0) rotate(0deg); }
        100% { transform: translateY(110vh) rotate(720deg); }
      }

      /* --- Toast "Logro desbloqueado" --- */
      .ee-toast {
        position: fixed;
        top: 1.5rem;
        right: 1.5rem;
        z-index: 9999;
        display: flex;
        align-items: center;
        gap: .85rem;
        padding: .85rem 1.15rem;
        background: #2b2b2b;
        color: #F4FBF8;
        border: 3px solid;
        border-color: #b8b8b8 #5a5a5a #5a5a5a #b8b8b8;
        box-shadow:
          0 0 0 2px #1a1a1a,
          inset 1px 1px 0 rgba(255,255,255,.15),
          0 4px 0 rgba(0,0,0,.5);
        font-family: "Monocraft", "VT323", monospace;
        font-size: .78rem;
        letter-spacing: .02em;
        line-height: 1.3;
        animation: ee-toast-in .3s steps(3) forwards;
      }
      .ee-toast.is-out { animation: ee-toast-out .3s steps(3) forwards; }
      .ee-toast__icono {
        font-size: 1.6rem;
        filter: drop-shadow(1px 1px 0 rgba(0,0,0,.6));
      }
      .ee-toast__titulo {
        display: block;
        font-size: .6rem;
        color: #F9D67D;   /* dorado tipo "logro" */
        margin-bottom: .15rem;
        letter-spacing: .06em;
      }
      @keyframes ee-toast-in {
        from { opacity: 0; transform: translateX(20px); }
        to   { opacity: 1; transform: translateX(0); }
      }
      @keyframes ee-toast-out {
        from { opacity: 1; transform: translateX(0); }
        to   { opacity: 0; transform: translateX(20px); }
      }

      @media (prefers-reduced-motion: reduce) {
        .ee-bloque { display: none; }
        .ee-toast { animation: none; }
        .ee-toast.is-out { animation: none; opacity: 0; }
      }
    `;
    document.head.appendChild(estilo);
  }

  // ---------- Generador de bloques pixel art (SVG inline) ----------
  // Devuelve el data-URI de un bloque de color "color" con motas "colorDetalle".
  function bloqueSVG(principal, detalle) {
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16' shape-rendering='crispEdges'>
      <rect width='16' height='16' fill='${principal}'/>
      <rect x='2' y='3' width='2' height='2' fill='${detalle}' opacity='.55'/>
      <rect x='9' y='6' width='2' height='2' fill='${detalle}' opacity='.45'/>
      <rect x='5' y='11' width='2' height='2' fill='${detalle}' opacity='.5'/>
      <rect x='12' y='12' width='1' height='1' fill='${detalle}' opacity='.4'/>
      <rect x='2' y='3' width='16' height='0' fill='none'/>
      <rect x='0' y='0' width='16' height='1' fill='rgba(255,255,255,.15)'/>
      <rect x='0' y='15' width='16' height='1' fill='rgba(0,0,0,.25)'/>
    </svg>`;
    return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
  }

  // Paleta de bloques (principal, detalle)
  const BLOQUES = [
    ["#7A7A7A", "#4a4a4a"],   // piedra
    ["#5DECF5", "#3BA8B0"],   // diamante
    ["#F9D67D", "#b89a3e"],   // oro
    ["#C9A27E", "#8a6a3f"],   // tierra
    ["#8B6239", "#5A3A1E"],   // madera
    ["#52A385", "#2f6b52"],   // copper oxidado
    ["#976253", "#5c3a2e"]    // brick
  ];

   // ---------- Lluvia de bloques ----------
  let lluviaActiva = false;
  function lanzarLluvia() {
    if (reduceMotion || lluviaActiva) return;
    lluviaActiva = true;

    const contenedor = document.createElement("div");
    contenedor.className = "ee-lluvia";
    document.body.appendChild(contenedor);

    // --- Parámetros de la lluvia ---
    const DURACION_EMISION = 3500;   // durante 3.5s se generan bloques sin parar
    const INTERVALO_EMISION = 55;    // cada 55ms sale un bloque nuevo (~60-70 bloques)
    const DURACION_CAIDA_MIN = 3.5;  // cada bloque tarda entre 3.5s…
    const DURACION_CAIDA_MAX = 5.5;  // …y 5.5s en llegar abajo

    let intervalo = null;
    let bloqueandoSalida = false;

    function emitirBloque() {
      if (bloqueandoSalida) return;

      const bloque = document.createElement("div");
      bloque.className = "ee-bloque";
      const [principal, detalle] = BLOQUES[Math.floor(Math.random() * BLOQUES.length)];
      bloque.style.backgroundImage = `url("${bloqueSVG(principal, detalle)}")`;
      bloque.style.backgroundSize = "cover";
      bloque.style.left = (Math.random() * 96) + "vw";
      const duracion = DURACION_CAIDA_MIN + Math.random() * (DURACION_CAIDA_MAX - DURACION_CAIDA_MIN);
      bloque.style.animationDuration = duracion + "s";

      // Tamaño variable
      const tamano = 24 + Math.floor(Math.random() * 24);
      bloque.style.width = tamano + "px";
      bloque.style.height = tamano + "px";

      contenedor.appendChild(bloque);

      // Auto-limpieza individual: cuando termina su animación, se borra
      bloque.addEventListener("animationend", () => bloque.remove(), { once: true });
    }

    // Emisión continua
    intervalo = setInterval(emitirBloque, INTERVALO_EMISION);

    // Al cabo de DURACION_EMISION, dejamos de emitir nuevos bloques
    setTimeout(() => {
      bloqueandoSalida = true;
      clearInterval(intervalo);
    }, DURACION_EMISION);

    // Cuando el último bloque ha caído (emisión + duración máxima), limpiamos
    const tiempoTotal = DURACION_EMISION + (DURACION_CAIDA_MAX * 1000) + 500;
    setTimeout(() => {
      contenedor.remove();
      lluviaActiva = false;
    }, tiempoTotal);
  }
  // ---------- Toast "Logro desbloqueado" ----------
  let toastAbierto = false;
  function lanzarToast(texto = "¡Has encontrado un secreto!") {
    if (toastAbierto) return;
    toastAbierto = true;

    inyectarCSS();

    const toast = document.createElement("div");
    toast.className = "ee-toast";
    toast.setAttribute("role", "status");
    toast.innerHTML = `
      <span class="ee-toast__icono" aria-hidden="true">🏆</span>
      <span>
        <span class="ee-toast__titulo">LOGRO DESBLOQUEADO</span>
        ${texto}
      </span>
    `;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("is-out");
      setTimeout(() => {
        toast.remove();
        toastAbierto = false;
      }, 350);
    }, 4000);
  }

  // ---------- Konami code ----------
  const KONAMI = [
    "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
    "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
    "b", "a"
  ];
  let progreso = 0;
  let ultimoAcierto = 0;

  document.addEventListener("keydown", (e) => {
    if (!esMinecraft()) return;

    // Reinicia si ha pasado mucho tiempo desde la última tecla
    const ahora = Date.now();
    if (ahora - ultimoAcierto > 3000) progreso = 0;
    ultimoAcierto = ahora;

    // Normaliza la tecla (por si es "B" mayúscula)
    const tecla = e.key.length === 1 ? e.key.toLowerCase() : e.key;

    if (tecla === KONAMI[progreso]) {
      progreso++;
      if (progreso === KONAMI.length) {
        progreso = 0;
        onKonami();
      }
    } else {
      // Si falla, reinicia. Pero si la tecla es el primero, empieza de nuevo.
      progreso = (tecla === KONAMI[0]) ? 1 : 0;
    }
  });

  function onKonami() {
    inyectarCSS();
    lanzarToast("¡Has desbloqueado la lluvia de bloques!");
    lanzarLluvia();
    // Sonido (lo añadiremos en el paso 2)
    if (typeof window.eeSonidoKonami === "function") {
      window.eeSonidoKonami();
    }
  }

  // ---------- API pública para futuros easter eggs ----------
  window.eeLanzarToast = lanzarToast;
  window.eeLanzarLluvia = lanzarLluvia;

  // ---------- Log de bienvenida (solo en Minecraft) ----------
  if (esMinecraft() && !reduceMotion) {
    console.log(
      "%c⛏  ¿Buscando secretos? Prueba el código Konami…",
      "color:#5DECF5;font-family:monospace;font-size:14px;"
    );
  }
   
     /* ============================================================
     LISTENERS DE SONIDO (blindados)
     ============================================================ */

  // Cualquier cosa que sea "pulsable" en la web.
  // Amplia a propósito para que TODO botón/enlace/tarjeta-clickable suene.
  const INTERACTIVOS = [
    // Genéricos
    "a", "button", "[role='button']",
    // Botones con clase específica
    ".btn", ".nav-link", ".social-link", ".to-top", ".filter-btn",
    // Componentes interactivos propios
    ".climb-hold", ".card-grade",
    ".cordada-burbuja", ".cordada-cerrar", ".cordada-chip", ".cordada-enviar",
    // Tarjetas que actúan como enlaces
    ".project-card", ".project-preview", ".like-card", ".cert-card",
    ".news-item", ".github-activity__card",
    // Casos especiales
    ".stack-slot", ".tag", ".chip",
    "[onclick]", "[tabindex]", "input[type='button']",
    "input[type='submit']", "input[type='reset']", "summary"
  ].join(", ");

  // Listener único en el documento entero.
  // Usa capture: true para que se dispare ANTES que otros listeners (por si
  // algún script llama a preventDefault o stopPropagation).
  document.addEventListener("click", (e) => {
    if (!sonidoActivo || !esMinecraft() || reduceMotion) return;
    const objetivo = e.target.closest && e.target.closest(INTERACTIVOS);
    if (!objetivo) return;
    sonidoClick();
  }, { passive: true, capture: true });

  // Hover (opcional, muy sutil). Lo dejamos desactivado para no cansar.
  // Si lo quieres, descomenta:
  // document.addEventListener("pointerover", (e) => {
  //   if (!sonidoActivo) return;
  //   if (e.target.closest && e.target.closest(INTERACTIVOS)) sonidoHover();
  // }, { passive: true }); 
    /* ============================================================
     TOGGLE DE SONIDO EN EL HEADER
     ============================================================ */
  const soundBtn = document.getElementById("soundToggle");

  function actualizarBotonSonido() {
    if (!soundBtn) return;
    const enMinecraft = esMinecraft();
    soundBtn.hidden = !enMinecraft;
    soundBtn.setAttribute("aria-pressed", sonidoActivo ? "true" : "false");
    soundBtn.setAttribute("aria-label", sonidoActivo ? "Desactivar sonidos" : "Activar sonidos");
  }

  // Estado inicial
  actualizarBotonSonido();

  if (soundBtn) {
    soundBtn.addEventListener("click", () => {
      sonidoActivo = !sonidoActivo;
      localStorage.setItem("ee-sonido", sonidoActivo ? "on" : "off");
      actualizarBotonSonido();
      // Feedback: suena al activar
      if (sonidoActivo) sonidoClick();
    });
  }

  // Reacciona al cambio de skin (aparece/desaparece el botón)
  const obsSkin = new MutationObserver(actualizarBotonSonido);
  obsSkin.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-skin"]
  });
})();