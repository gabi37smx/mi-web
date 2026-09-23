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
   ============================================================ */

(function customCursor() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

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

  const mqFine = window.matchMedia("(hover: hover) and (pointer: fine)");

  function applyMode() {
    const hasMouse = mqFine.matches;
    wrap.style.display = hasMouse ? "block" : "none";
    document.documentElement.classList.toggle("has-fine-pointer", hasMouse);
  }

  applyMode();
  if (mqFine.addEventListener) mqFine.addEventListener("change", applyMode);
  else if (mqFine.addListener) mqFine.addListener(applyMode);

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

  requestAnimationFrame(() => { refreshPositions(); updateClimber(); });
})();

/* ============================================================
   Formulario de contacto · validación + envío simulado
   ============================================================ */

(function contactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const success = document.getElementById("formSuccess");

  const showError = (field, message) => {
    const wrap = field.closest(".form-field");
    if (!wrap) return;
    wrap.classList.add("has-error");
    const err = wrap.querySelector(".form-error");
    if (err) err.textContent = message;
  };

  const clearError = (field) => {
    const wrap = field.closest(".form-field");
    if (!wrap) return;
    wrap.classList.remove("has-error");
    const err = wrap.querySelector(".form-error");
    if (err) err.textContent = "";
  };

  // --- Lógica del checkbox "Quiero que me llames" ---
  const checkLlamada = document.getElementById("quiero-llamada");
  const campoTelefono = document.getElementById("campo-telefono");
  const inputTelefono = document.getElementById("telefono");

  if (checkLlamada && campoTelefono && inputTelefono) {
    checkLlamada.addEventListener("change", () => {
      if (checkLlamada.checked) {
        campoTelefono.style.display = "flex";
        inputTelefono.required = true;
        setTimeout(() => inputTelefono.focus(), 50);
      } else {
        campoTelefono.style.display = "none";
        inputTelefono.required = false;
        inputTelefono.value = "";
        clearError(inputTelefono);
      }
    });
  }

  // --- Validación por campo ---
  const validate = (field) => {
    const value = field.value.trim();
    const name = field.name;

    if (name === "nombre") {
      if (!value) { showError(field, "Escribe tu nombre."); return false; }
      if (value.length < 2) { showError(field, "Mínimo 2 caracteres."); return false; }
    }
    if (name === "email") {
      if (!value) { showError(field, "Escribe tu email."); return false; }
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      if (!ok) { showError(field, "Email no válido."); return false; }
    }
    if (name === "asunto") {
      if (!value) { showError(field, "Elige un asunto."); return false; }
    }
    if (name === "mensaje") {
      if (!value) { showError(field, "Escribe un mensaje."); return false; }
      if (value.length < 10) { showError(field, "Mínimo 10 caracteres."); return false; }
    }
    if (name === "telefono" && inputTelefono && inputTelefono.required) {
      if (!value) { showError(field, "Escribe tu número de teléfono."); return false; }
      const ok = /^[+\d\s()-]{7,}$/.test(value);
      if (!ok) { showError(field, "Teléfono no válido."); return false; }
    }
    clearError(field);
    return true;
  };

  form.querySelectorAll("input, select, textarea").forEach((field) => {
    field.addEventListener("blur", () => {
      if (field.value.trim() !== "") validate(field);
    });
    field.addEventListener("input", () => {
      if (field.closest(".form-field")?.classList.contains("has-error")) validate(field);
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const fields = form.querySelectorAll("input, select, textarea");
    let allOk = true;
    let firstBad = null;

    fields.forEach((f) => {
      if (f.name === "telefono" && (!inputTelefono || !inputTelefono.required)) return;

      const ok = validate(f);
      if (!ok) {
        allOk = false;
        if (!firstBad) firstBad = f;
      }
    });

    if (!allOk) {
      firstBad && firstBad.focus();
      return;
    }

    // Envío simulado
    form.reset();
    if (campoTelefono) campoTelefono.style.display = "none";
    if (inputTelefono) inputTelefono.required = false;

    if (success) {
      success.hidden = false;
      success.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => { success.hidden = true; }, 6000);
    }
  });
})();

/* ============================================================
   Filtros de la página de proyectos
   ============================================================ */

(function projectFilters() {
  const buttons = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll("#projectsGrid .project-card");
  if (!buttons.length || !cards.length) return;

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;

      buttons.forEach((b) => b.classList.toggle("is-active", b === btn));

      cards.forEach((card) => {
        if (filter === "all") {
          card.classList.remove("is-hidden");
          return;
        }
        const types = (card.dataset.type || "").split(/\s+/);
        card.classList.toggle("is-hidden", !types.includes(filter));
      });
    });
  });
})();