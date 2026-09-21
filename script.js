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
const sectionIds = navLinks.map((l) => l.getAttribute("href")).filter((h) => h.length > 1);
const sections = sectionIds.map((id) => document.querySelector(id)).filter(Boolean);

if ("IntersectionObserver" in window && sections.length) {
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
  sections.forEach((s) => navIO.observe(s));
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
   Cursor personalizado · dot + aro con inercia y feedback de click
   ============================================================ */

(function customCursor() {
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!finePointer || reduceMotion) return;

  const wrap = document.createElement("div");
  wrap.className = "cursor";
  wrap.setAttribute("aria-hidden", "true");

  const dot = document.createElement("div");
  dot.className = "cursor__dot";

  const ring = document.createElement("div");
  ring.className = "cursor__ring";

  wrap.append(dot, ring);
  document.body.appendChild(wrap);
  wrap.style.display = "block";

  // Posiciones reales del ratón
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  // Posiciones interpoladas (inercia)
  let dotX = mouseX, dotY = mouseY;       // el punto: rápido
  let ringX = mouseX, ringY = mouseY;     // el aro: más lento

  // Suavizados (0 = no se mueve, 1 = instantáneo)
  const DOT_EASE  = 0.35;
  const RING_EASE = 0.15;

  // Escala del punto (para el click)
  let dotScale = 1;
  let dotScaleTarget = 1;

  // Movimiento del ratón
  window.addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse") return;
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  // Click: encoge aro y punto
  window.addEventListener("pointerdown", () => {
    wrap.classList.add("is-clicking");
    dotScaleTarget = 0.5;
  });
  window.addEventListener("pointerup", () => {
    wrap.classList.remove("is-clicking");
    dotScaleTarget = 1;
  });

  // Hover sobre elementos clicables
  const interactive = "a, button, .btn, .nav-link, .social-link, .to-top, input, textarea, select, [role='button']";
  document.querySelectorAll(interactive).forEach((el) => {
    el.addEventListener("pointerenter", () => wrap.classList.add("is-hovering"));
    el.addEventListener("pointerleave", () => wrap.classList.remove("is-hovering"));
  });

  // Ocultar si el ratón sale de la ventana
  document.addEventListener("mouseleave", () => { wrap.style.opacity = "0"; });
  document.addEventListener("mouseenter", () => { wrap.style.opacity = "1"; });

  // Bucle de animación
  function loop() {
    dotX += (mouseX - dotX) * DOT_EASE;
    dotY += (mouseY - dotY) * DOT_EASE;

    ringX += (mouseX - ringX) * RING_EASE;
    ringY += (mouseY - ringY) * RING_EASE;

    dotScale += (dotScaleTarget - dotScale) * 0.25;

    dot.style.transform  = `translate3d(${dotX}px, ${dotY}px, 0) scale(${dotScale})`;
    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;

    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();
/* ============================================================
   Efecto magnético en el título del hero
   El texto se desplaza ligeramente siguiendo al cursor,
   pero se queda anclado a su posición.
   ============================================================ */

(function magneticTitle() {
  const title = document.querySelector(".hero-title");
  if (!title) return;

  // Desactivar en táctil y con prefers-reduced-motion
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!finePointer || reduceMotion) return;

  // Cuánto se puede desplazar como máximo (en px).
  // 5-6 px ≈ medio centímetro en pantalla. Súbelo si lo quieres más exagerado.
  const MAX_SHIFT = 8;

  // Posición actual (interpolada) para que el movimiento sea suave
  let currentX = 0, currentY = 0;
  let targetX = 0,  targetY = 0;

  // Suavizado (0 = no se mueve, 1 = instantáneo)
  const EASE = 0.08;

  // Al entrar en el título, activamos la clase para quitar el retardo
  title.addEventListener("pointerenter", () => {
    title.classList.add("is-hovered");
  });

  // Mientras el ratón se mueve dentro del título, calculamos el desplazamiento
  title.addEventListener("pointermove", (e) => {
    const rect = title.getBoundingClientRect();

    // Posición del ratón normalizada dentro del título: de -1 a 1
    const relX = (e.clientX - rect.left) / rect.width;   // 0..1
    const relY = (e.clientY - rect.top) / rect.height;   // 0..1

    // Convertimos a -1..1 (centro = 0)
    const nx = (relX - 0.5) * 2;
    const ny = (relY - 0.5) * 2;

    // Desplazamiento objetivo (máx MAX_SHIFT px)
    targetX = nx * MAX_SHIFT;
    targetY = ny * MAX_SHIFT;
  });

  // Al salir, volvemos a la posición original con transición suave
  title.addEventListener("pointerleave", () => {
    title.classList.remove("is-hovered");
    targetX = 0;
    targetY = 0;
  });

  // Bucle de animación con interpolación (lerp)
  function loop() {
    currentX += (targetX - currentX) * EASE;
    currentY += (targetY - currentY) * EASE;
    title.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();
