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
  const DARK = "#0a0f14", LIGHT = "#f6f8fb";
  const current = () => root.getAttribute("data-theme") || "dark";
  const updateBtn = (t) => {
    const toLight = t === "dark";
    btn.setAttribute("aria-pressed", String(toLight));
    btn.setAttribute("aria-label", toLight ? "Cambiar a modo claro" : "Cambiar a modo oscuro");
    btn.setAttribute("title", toLight ? "Modo claro" : "Modo oscuro");
  };
  const apply = (t) => {
    root.setAttribute("data-theme", t);
    if (meta) meta.setAttribute("content", t === "light" ? LIGHT : DARK);
    updateBtn(t);
    try { localStorage.setItem("theme", t); } catch (e) {}
  };
  apply(current());
  btn.addEventListener("click", () => apply(current() === "dark" ? "light" : "dark"));
  const mq = window.matchMedia("(prefers-color-scheme: light)");
  mq.addEventListener && mq.addEventListener("change", (e) => {
    let stored = null; try { stored = localStorage.getItem("theme"); } catch (err) {}
    if (!stored) apply(e.matches ? "light" : "dark");
  });
})();

/* ---- Cabecera con fondo al hacer scroll ---- */
const header = document.querySelector(".site-header");
const onScrollHeader = () => header.classList.toggle("is-scrolled", window.scrollY > 10);
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

/* ---- Cursor personalizado (solo puntero fino, sin reduce-motion) ---- */
(function customCursor() {
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const dot = document.querySelector(".cursor__dot");
  const ring = document.querySelector(".cursor__ring");
  const label = document.querySelector(".cursor__label");
  if (!canHover || reduce || !dot || !ring) return;

  document.body.classList.add("cursor-on");
  const INTERACTIVE = "a, button, .card, .like-card, .stat, .stack-list li";
  let mx = innerWidth / 2, my = innerHeight / 2;
  let rx = mx, ry = my, shown = false;

  const setLabel = (el) => {
    const t = el && el.closest ? el.closest("[data-cursor]") : null;
    if (t && label) { label.textContent = t.getAttribute("data-cursor"); ring.classList.add("is-label"); }
    else ring.classList.remove("is-label");
  };

  window.addEventListener("mousemove", (e) => {
    mx = e.clientX; my = e.clientY;
    if (!shown) { dot.style.opacity = 1; ring.style.opacity = 1; shown = true; }
    dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    const over = document.querySelector(`${INTERACTIVE}:hover`);
    ring.classList.toggle("is-hover", !!over);
    dot.classList.toggle("is-hover", !!over);
    setLabel(over);
  });

  window.addEventListener("mousedown", () => ring.classList.add("is-down"));
  window.addEventListener("mouseup", () => ring.classList.remove("is-down"));
  document.addEventListener("mouseleave", () => { dot.style.opacity = 0; ring.style.opacity = 0; shown = false; });

  (function loop() {
    rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
    requestAnimationFrame(loop);
  })();
})();

/* ---- Foco de luz que sigue al cursor en el hero ---- */
(function heroSpot() {
  const hero = document.querySelector(".hero");
  if (!hero) return;
  hero.addEventListener("pointermove", (e) => {
    const r = hero.getBoundingClientRect();
    hero.style.setProperty("--mx", `${e.clientX - r.left}px`);
    hero.style.setProperty("--my", `${e.clientY - r.top}px`);
  });
})();

/* ---- Efecto máquina de escribir (typing) ---- */
(function typing() {
  const el = document.querySelector(".typing");
  if (!el) return;
  const words = (el.dataset.words || "").split(",").map((w) => w.trim()).filter(Boolean);
  const delay = parseInt(el.dataset.delay || "2200", 10);
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!words.length) return;
  let i = 0, j = 0, deleting = false;
  if (reduce) { el.textContent = words[0]; return; }
  (function tick() {
    const w = words[i];
    if (!deleting) {
      el.textContent = w.slice(0, ++j);
      if (j === w.length) { deleting = true; return setTimeout(tick, delay); }
      return setTimeout(tick, 55 + Math.random() * 40);
    } else {
      el.textContent = w.slice(0, --j);
      if (j === 0) { deleting = false; i = (i + 1) % words.length; return setTimeout(tick, 250); }
      return setTimeout(tick, 28);
    }
  })();
})();

/* ---- Animaciones on-scroll (IntersectionObserver) ---- */
const revealEls = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("is-visible"));
}

/* ---- Resaltar enlace activo del menú ---- */
const navLinks = [...document.querySelectorAll(".main-nav a[href^='#']")];
const sections = navLinks.map((l) => document.querySelector(l.getAttribute("href"))).filter(Boolean);
if ("IntersectionObserver" in window && sections.length) {
  const navIO = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = "#" + entry.target.id;
      navLinks.forEach((link) => link.setAttribute("aria-current", link.getAttribute("href") === id ? "true" : "false"));
    });
  }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
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
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const animate = (el) => {
    const target = el.textContent.trim();
    const num = parseInt(target, 10);
    if (isNaN(num)) return;
    const prefix = target.startsWith("1º") ? "1º" : "";
    if (reduce) return;
    let n = 0; const step = Math.max(1, Math.ceil(num / 40));
    const t = setInterval(() => { n += step; if (n >= num) { n = num; clearInterval(t); } el.textContent = prefix ? prefix : String(n); }, 28);
  };
  const cIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { animate(e.target); cIO.unobserve(e.target); } });
  }, { threshold: 0.4 });
  stats.forEach((s) => cIO.observe(s));
})();

/* ---- Botón "volver arriba" ---- */
const toTop = document.getElementById("toTop");
if (toTop) toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));