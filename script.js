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
    const goingToLight = theme === "dark"; // si ahora es oscuro, el botón pasa a claro
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

  // Estado inicial (coherente con el script inline del <head>)
  apply(currentTheme());

  btn.addEventListener("click", () => {
    const next = currentTheme() === "dark" ? "light" : "dark";
    apply(next);
  });

  // Si el usuario cambia la preferencia del sistema y no ha elegido manualmente, seguirla
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