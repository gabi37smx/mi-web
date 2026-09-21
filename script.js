/* ============================================================
   script.js · Interacciones del portfolio
   ============================================================ */

/* ---- Año dinámico en el pie ---- */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ---- Toggle de tema claro/oscuro ---- */
(function themeToggle() {
  const btn = document.getElementById("themeToggle");
  const meta = document.getElementById("metaTheme");
  const root = document.documentElement;
  if (!btn) return;

  const DARK_COLOR = "#0a0f14";
  const LIGHT_COLOR = "#f6f8fb";

  const currentTheme = () => root.getAttribute("data-theme") || "dark";

  const updateButton = (theme) => {
    const goingToLight = theme === "dark";
    btn.setAttribute("aria-pressed", String(goingToLight));
    btn.setAttribute("aria-label", goingToLight ? "Cambiar a modo claro" : "Cambiar a modo oscuro");
    btn.setAttribute("title", goingToLight ? "Modo claro" : "Modo oscuro");
  };

  const apply = (theme) => {
    root.setAttribute("data-theme", theme);
    if (meta) meta.setAttribute("content", theme === "light" ? LIGHT_COLOR : DARK_COLOR);
    updateButton(theme);
    try { localStorage.setItem("theme", theme); } catch (e) {}
  };

  apply(currentTheme());

  btn.addEventListener("click", () => {
    const next = currentTheme() === "dark" ? "light" : "dark";
    apply(next);
  });

  const mq = window.matchMedia("(prefers-color-scheme: light)");
  mq.addEventListener && mq.addEventListener("change", (e) => {
    let stored = null;
    try { stored = localStorage.getItem("theme"); } catch (err) {}
    if (!stored) apply(e.matches ? "light" : "dark");
  });
})();

/* ---- Cabecera con fondo al hacer scroll ---- */
const header = document.querySelector(".site-header");
const onScrollHeader = () => {
  if (!header) return;
  if (window.scrollY > 10) header.classList.add("is-scrolled");
  else header.classList.remove("is-scrolled");
};
window.addEventListener("scroll", onScrollHeader, { passive: true });
onScrollHeader();

/* ---- Menú móvil ---- */
const navToggle = document.querySelector(".nav-toggle");
const mainNav = document.querySelector(".main-nav");
if (navToggle && mainNav) {
  navToggle.addEventListener("click", () => {
    const open = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!open));
    mainNav.classList.toggle("is-open", !open);
  });
  mainNav.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      navToggle.setAttribute("aria-expanded", "false");
      mainNav.classList.remove("is-open");
    })
  );
}

/* ---- Efecto máquina de escribir (typing) ---- */
(function typing() {
  const el = document.querySelector(".typing");
  if (!el) return;
  const words = (el.dataset.words || "").split(",").map((w) => w.trim()).filter(Boolean);
  const delay = parseInt(el.dataset.delay || "2200", 10);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!words.length) return;

  let i = 0, j = 0, deleting = false;
  if (reduceMotion) { el.textContent = words[0]; return; }

  function tick() {
    const word = words[i];
    if (!deleting) {
      j++;
      el.textContent = word.slice(0, j);
      if (j === word.length) { deleting = true; return setTimeout(tick, delay); }
      return setTimeout(tick, 55 + Math.random() * 40);
    } else {
      j--;
      el.textContent = word.slice(0, j);
      if (j === 0) { deleting = false; i = (i + 1) % words.length; return setTimeout(tick, 250); }
      return setTimeout(tick, 28);
    }
  }
  tick();
})();

/* ---- Animaciones on-scroll (IntersectionObserver) ---- */
const revealEls = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("is-visible"));
}

/* ---- Resaltar enlace activo del menú ---- */
const navLinks = [...document.querySelectorAll(".main-nav a[href^='#']")];
const navSectionIds = navLinks.map((l) => l.getAttribute("href")).filter((h) => h.length > 1);
const navSections = navSectionIds.map((id) => document.querySelector(id)).filter(Boolean);

if ("IntersectionObserver" in window && navSections.length) {
  const navIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = "#" + entry.target.id;
        navLinks.forEach((link) => {
          const active = link.getAttribute("href") === id;
          link.setAttribute("aria-current", active ? "true" : "false");
        });
      });
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
  );
  navSections.forEach((s) => navIO.observe(s));
}

/* ---- Brillo que sigue al cursor en las tarjetas ---- */
document.querySelectorAll(".card").forEach((card) => {
  card.addEventListener("pointermove", (e) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - r.left}px`);
    card.style.setProperty("--my", `${e.clientY - r.top}px`);
  });
});

/* ---- Contador animado en las estadísticas del hero ---- */
(function counters() {
  const stats = document.querySelectorAll(".stat strong");
  if (!stats.length || !("IntersectionObserver" in window)) return;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const animate = (el) => {
    const target = el.textContent.trim();
    const num = parseInt(target, 10);
    if (isNaN(num)) return;
    const prefix = target.startsWith("1º") ? "1º" : "";
    const final = prefix ? "1º" : String(num);
    if (reduceMotion) { el.textContent = final; return; }
    let n = 0;
    const step = Math.max(1, Math.ceil(num / 40));
    const t = setInterval(() => {
      n += step;
      if (n >= num) { n = num; clearInterval(t); }
      el.textContent = prefix ? prefix : String(n);
    }, 28);
  };

  const cIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { animate(e.target); cIO.unobserve(e.target); }
    });
  }, { threshold: 0.4 });

  stats.forEach((s) => cIO.observe(s));
})();

/* ---- Botón "volver arriba" ---- */
const toTop = document.getElementById("toTop");
if (toTop) {
  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

/* ============================================================
   Cursor personalizado · mano abierta / cerrada
   Se activa/desactiva en vivo si cambia el tipo de puntero
   (por ejemplo, al activar/desactivar la emulación de móvil en F12).
   ============================================================ */

(function customCursor() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  // Creamos la mano una sola vez
  const wrap = document.createElement("div");
  wrap.className = "cursor";
  wrap.setAttribute("aria-hidden", "true");

  const hand = document.createElement("div");
  hand.className = "cursor__hand";
  hand.innerHTML = `
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <g class="hand-open">
        <path d="M9 14V7a2 2 0 1 1 4 0v6"/>
        <path d="M13 13V5a2 2 0 1 1 4 0v8"/>
        <path d="M17 13V6a2 2 0 1 1 4 0v8"/>
        <path d="M21 14V9a2 2 0 1 1 4 0v9a9 9 0 0 1-9 9h-1a8 8 0 0 1-8-8v-5a2 2 0 1 1 4 0"/>
      </g>
      <g class="hand-closed">
        <path d="M8 15v-3a2 2 0 1 1 4 0"/>
        <path d="M12 14V8a2 2 0 1 1 4 0v5"/>
        <path d="M16 13V7a2 2 0 1 1 4 0v6"/>
        <path d="M20 13v-2a2 2 0 1 1 4 0v7a9 9 0 0 1-9 9h-1a8 8 0 0 1-8-8v-4a2 2 0 1 1 4 0v2"/>
      </g>
    </svg>
  `;

  wrap.appendChild(hand);
  document.body.appendChild(wrap);

  // --- Lógica de "¿hay ratón real?" ---
  const mqFine = window.matchMedia("(hover: hover) and (pointer: fine)");

  function applyMode() {
    const hasMouse = mqFine.matches;
    wrap.style.display = hasMouse ? "block" : "none";
    // Marcamos el <html> para que el CSS pueda adaptar otras cosas si quieres
    document.documentElement.classList.toggle("has-fine-pointer", hasMouse);
  }

  applyMode();
  // Escuchamos cambios de emulación en vivo (sin recargar)
  if (mqFine.addEventListener) mqFine.addEventListener("change", applyMode);
  else if (mqFine.addListener) mqFine.addListener(applyMode); // fallback antiguo

  // --- Movimiento ---
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let x = mouseX, y = mouseY;
  const EASE = 0.35;

  window.addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse") return;
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  window.addEventListener("pointerdown", () => {
    wrap.classList.add("is-clicking");
  });
  window.addEventListener("pointerup", () => {
    wrap.classList.remove("is-clicking");
  });

  const interactive = "a, button, .btn, .nav-link, .social-link, .to-top, .climb-hold, .card-grade, input, textarea, select, [role='button']";
  document.querySelectorAll(interactive).forEach((el) => {
    el.addEventListener("pointerenter", () => wrap.classList.add("is-hovering"));
    el.addEventListener("pointerleave", () => wrap.classList.remove("is-hovering"));
  });

  document.addEventListener("mouseleave", () => { wrap.style.opacity = "0"; });
  document.addEventListener("mouseenter", () => { wrap.style.opacity = "1"; });

  function loop() {
    x += (mouseX - x) * EASE;
    y += (mouseY - y) * EASE;
    hand.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();

/* ============================================================
   Efecto magnético en el título del hero
   ============================================================ */

(function magneticTitle() {
  const title = document.querySelector(".hero-title");
  if (!title) return;

  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!finePointer || reduceMotion) return;

  const MAX_SHIFT = 6;

  let currentX = 0, currentY = 0;
  let targetX = 0,  targetY = 0;
  const EASE = 0.12;

  title.addEventListener("pointerenter", () => {
    title.classList.add("is-hovered");
  });

  title.addEventListener("pointermove", (e) => {
    const rect = title.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width;
    const relY = (e.clientY - rect.top) / rect.height;
    const nx = (relX - 0.5) * 2;
    const ny = (relY - 0.5) * 2;
    targetX = nx * MAX_SHIFT;
    targetY = ny * MAX_SHIFT;
  });

  title.addEventListener("pointerleave", () => {
    title.classList.remove("is-hovered");
    targetX = 0;
    targetY = 0;
  });

  function loop() {
    currentX += (targetX - currentX) * EASE;
    currentY += (targetY - currentY) * EASE;
    title.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();

/* ============================================================
   Barra lateral de escalada · escalador SVG + presas activas
   ============================================================ */

(function climbingRail() {
  const rail = document.querySelector(".climb-rail");
  const climber = document.getElementById("climber");
  const holds = [...document.querySelectorAll(".climb-hold")];
  const rope = document.querySelector(".climb-rope");
  if (!rail || !climber || !holds.length || !rope) return;

  // Inyectamos el SVG del escalador (silueta humana trepando)
  climber.innerHTML = `
    <svg viewBox="0 0 24 30" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="12" cy="5" r="2.4"/>
      <path d="M12 7.4 V17"/>
      <path d="M12 10 L7 6"/>
      <path d="M12 11 L17 8"/>
      <path d="M12 17 L8 22 L9 27"/>
      <path d="M12 17 L16 22 L15 27"/>
    </svg>
  `;

  // Posiciones Y (en px, relativas al rail) de cada presa
  let holdPositions = [];

  function getHoldPositions() {
    const railRect = rail.getBoundingClientRect();
    return holds.map((h) => {
      const r = h.getBoundingClientRect();
      return r.top - railRect.top + r.height / 2;
    });
  }

  function refreshPositions() {
    holdPositions = getHoldPositions();
  }

  function updateClimber() {
    if (holdPositions.length < 2) return;

    const scrollY = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const progress = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;

    const first = holdPositions[0];
    const last  = holdPositions[holdPositions.length - 1];
    const y = first + (last - first) * progress;

    climber.style.top = `${y}px`;
  }

  // Presas activas
  const railSectionIds = holds.map((h) => h.dataset.section);
  const railSections = railSectionIds.map((id) => document.getElementById(id)).filter(Boolean);

  const setActive = (id) => {
    holds.forEach((h) => h.classList.toggle("is-active", h.dataset.section === id));
  };

  if ("IntersectionObserver" in window && railSections.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    railSections.forEach((s) => io.observe(s));
  }

  window.addEventListener("scroll", updateClimber, { passive: true });
  window.addEventListener("resize", () => { refreshPositions(); updateClimber(); });

  // Esperamos a que el navegador mida todo
  requestAnimationFrame(() => { refreshPositions(); updateClimber(); });
})();