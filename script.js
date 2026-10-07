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

  const DARK_COLOR = "#151310";
  const LIGHT_COLOR = "#f2ede3";

  const currentTheme = () => root.getAttribute("data-theme") || "dark";

  const updateButton = (theme) => {
    const goingToLight = theme === "dark";
    const language = root.lang === "ca-valencia" ? "val" : root.lang;
    const labels = {
      es: { light: "Cambiar a modo claro", dark: "Cambiar a modo oscuro", lightTitle: "Modo claro", darkTitle: "Modo oscuro" },
      val: { light: "Canvia al mode clar", dark: "Canvia al mode fosc", lightTitle: "Mode clar", darkTitle: "Mode fosc" },
      en: { light: "Switch to light mode", dark: "Switch to dark mode", lightTitle: "Light mode", darkTitle: "Dark mode" },
    }[language] || { light: "Cambiar a modo claro", dark: "Cambiar a modo oscuro", lightTitle: "Modo claro", darkTitle: "Modo oscuro" };
    btn.setAttribute("aria-pressed", String(goingToLight));
    btn.setAttribute("aria-label", goingToLight ? labels.light : labels.dark);
    btn.setAttribute("title", goingToLight ? labels.lightTitle : labels.darkTitle);
  };

  const apply = (theme) => {
    root.setAttribute("data-theme", theme);
    if (meta) meta.setAttribute("content", theme === "light" ? LIGHT_COLOR : DARK_COLOR);
    updateButton(theme);
    try { localStorage.setItem("theme", theme); } catch (e) {}
  };

  apply(currentTheme());
  document.addEventListener("portfolio:languagechange", () => updateButton(currentTheme()));

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
  let words = (el.dataset.words || "").split(",").map((w) => w.trim()).filter(Boolean);
  const delay = parseInt(el.dataset.delay || "2200", 10);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!words.length) return;

  let i = 0, j = 0, deleting = false;
  if (reduceMotion) {
    el.textContent = words[0];
    document.addEventListener("portfolio:languagechange", () => {
      words = (el.dataset.words || "").split(",").map((word) => word.trim()).filter(Boolean);
      el.textContent = words[0] || "";
    });
    return;
  }

  document.addEventListener("portfolio:languagechange", () => {
    words = (el.dataset.words || "").split(",").map((word) => word.trim()).filter(Boolean);
    i = 0;
    j = 0;
    deleting = false;
    el.textContent = "";
  });

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
          // ▼ CAMBIO: aria-current="page" en vez de "true" (Accessibility)
          if (active) link.setAttribute("aria-current", "page");
          else link.removeAttribute("aria-current");
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

/* ---- Contador animado en las estadísticas del hero ----
   Misión: convertir un dato en un momento; el número se recuerda mejor si se cuenta solo.
   Cuenta una sola vez, en 1 segundo, cuando el número entra en pantalla.
   Con prefers-reduced-motion (o sin IntersectionObserver) se queda el número final del HTML. */
(function counters() {
  const stats = [...document.querySelectorAll(".stat strong")].filter((el) => /^\d+$/.test(el.textContent.trim()));
  if (!stats.length) return;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion || !("IntersectionObserver" in window)) return;

  const DURATION = 1000;
  const animate = (el) => {
    const final = parseInt(el.dataset.final, 10);
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min((now - t0) / DURATION, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = String(Math.round(final * eased));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const cIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { animate(e.target); cIO.unobserve(e.target); }
    });
  }, { threshold: 0.4 });

  stats.forEach((el) => {
    el.dataset.final = el.textContent.trim();
    el.textContent = "0";
    cIO.observe(el);
  });
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

  const interactive = "a, button, .btn, .nav-link, .social-link, .to-top, .climb-hold, .card-grade, input, textarea, select, [role='button'], .cordada-burbuja, .cordada-cerrar, .cordada-chip, .cordada-campo, .cordada-enviar";

  document.addEventListener("pointerover", (e) => {
    if (e.target.closest && e.target.closest(interactive)) {
      wrap.classList.add("is-hovering");
    }
  });
  document.addEventListener("pointerout", (e) => {
    const dentro = e.target.closest && e.target.closest(interactive);
    const saliendoA = e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest(interactive);
    if (dentro && !saliendoA) {
      wrap.classList.remove("is-hovering");
    }
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
   Tiempo actual en Xàtiva · Open-Meteo
   ============================================================ */

(function weatherWidget() {
  const widget = document.getElementById("weatherWidget");
  if (!widget) return;

  const translate = (text) => window.portfolioTranslate ? window.portfolioTranslate(text) : text;
  const weatherCodes = {
    0: { desc: "Despejado", icon: "☀️" },
    1: { desc: "Mayormente despejado", icon: "🌤" },
    2: { desc: "Parcialmente nublado", icon: "⛅" },
    3: { desc: "Nublado", icon: "☁️" },
    45: { desc: "Niebla", icon: "🌫" },
    48: { desc: "Niebla helada", icon: "🌫" },
    51: { desc: "Llovizna ligera", icon: "🌦" },
    53: { desc: "Llovizna", icon: "🌦" },
    55: { desc: "Llovizna fuerte", icon: "🌧" },
    56: { desc: "Llovizna helada", icon: "🌧" },
    57: { desc: "Llovizna helada fuerte", icon: "🌧" },
    61: { desc: "Lluvia ligera", icon: "🌧" },
    63: { desc: "Lluvia", icon: "🌧" },
    65: { desc: "Lluvia fuerte", icon: "🌧" },
    66: { desc: "Lluvia helada ligera", icon: "🌧" },
    67: { desc: "Lluvia helada fuerte", icon: "🌧" },
    71: { desc: "Nieve ligera", icon: "🌨" },
    73: { desc: "Nieve", icon: "🌨" },
    75: { desc: "Nieve fuerte", icon: "❄️" },
    77: { desc: "Granos de nieve", icon: "❄️" },
    80: { desc: "Chubascos ligeros", icon: "🌦" },
    81: { desc: "Chubascos", icon: "🌧" },
    82: { desc: "Chubascos fuertes", icon: "⛈" },
    85: { desc: "Chubascos de nieve", icon: "🌨" },
    86: { desc: "Chubascos de nieve fuertes", icon: "❄️" },
    95: { desc: "Tormenta", icon: "⛈" },
    96: { desc: "Tormenta con granizo", icon: "⛈" },
    99: { desc: "Tormenta fuerte con granizo", icon: "⛈" },
  };

  const elements = {
    form: document.getElementById("weatherSearch"),
    cityInput: document.getElementById("weatherCityInput"),
    searchButton: document.querySelector(".weather-widget__search-button"),
    searchStatus: document.getElementById("weatherSearchStatus"),
    icon: document.getElementById("weatherIcon"),
    city: document.getElementById("weatherCity"),
    temp: document.getElementById("weatherTemp"),
    desc: document.getElementById("weatherDesc"),
    wind: document.getElementById("weatherWind"),
    humidity: document.getElementById("weatherHumidity"),
    verdict: document.getElementById("weatherVerdict"),
  };
  let city = widget.dataset.city || "Xàtiva";
  let coordinates = { lat: widget.dataset.lat, lon: widget.dataset.lon };
  let currentWeather = null;
  let loadError = false;

  elements.cityInput.value = city;

  function renderWeather() {
    if (!currentWeather) {
      if (loadError) {
        elements.city.textContent = city;
        elements.verdict.textContent = translate("No se pudo cargar el tiempo. Inténtalo más tarde.");
      }
      return;
    }

    const { code, temperature, wind, humidity } = currentWeather;
    const info = weatherCodes[code] || { desc: "—", icon: "🌡" };
    const isBad = code >= 51 || wind > 35 || temperature < 3 || temperature > 33;

    elements.icon.textContent = info.icon;
    elements.city.textContent = `${city} · ${translate("Ahora")}`;
    elements.temp.textContent = `${temperature}°`;
    elements.desc.textContent = translate(info.desc);
    elements.wind.textContent = `${wind} km/h`;
    elements.humidity.textContent = `${humidity}%`;
    elements.verdict.textContent = `${isBad ? "⚠️" : "✅"} ${translate(isBad ? "Hoy mejor no escalar al aire libre" : "Buen día para escalar")}`;
    elements.verdict.classList.toggle("is-bad", isBad);
    elements.verdict.classList.toggle("is-good", !isBad);
  }

  async function loadWeather() {
    const params = new URLSearchParams({
      latitude: coordinates.lat,
      longitude: coordinates.lon,
      current: "temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code",
      timezone: "auto",
    });

    try {
      const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
      if (!response.ok) throw new Error(`Open-Meteo respondió ${response.status}`);
      const { current } = await response.json();
      if (!current) throw new Error("La respuesta no incluye datos actuales");

      currentWeather = {
        code: current.weather_code,
        temperature: Math.round(current.temperature_2m),
        wind: Math.round(current.wind_speed_10m),
        humidity: current.relative_humidity_2m,
      };
      loadError = false;
      renderWeather();
    } catch (error) {
      console.warn("Error en el widget del tiempo:", error);
      currentWeather = null;
      loadError = true;
      elements.verdict.classList.remove("is-good", "is-bad");
      renderWeather();
    }
  }

  async function selectCity(name) {
    const query = name.trim();
    if (!query) {
      elements.searchStatus.textContent = translate("Escribe una ciudad.");
      elements.cityInput.focus();
      return;
    }

    elements.searchButton.disabled = true;
    elements.searchStatus.textContent = translate("Buscando ciudad…");

    try {
      const params = new URLSearchParams({ name: query, count: "1", language: "es", format: "json" });
      const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?${params}`);
      if (!response.ok) throw new Error(`Open-Meteo respondió ${response.status}`);
      const data = await response.json();
      const result = data.results?.[0];
      if (!result) throw new Error("Ciudad no encontrada");

      city = result.name + (result.country_code ? ` (${result.country_code})` : "");
      coordinates = { lat: result.latitude, lon: result.longitude };
      currentWeather = null;
      loadError = false;
      elements.cityInput.value = result.name;
      elements.searchStatus.textContent = "";
      document.dispatchEvent(new CustomEvent("portfolio:citychange", {
        detail: { city, searchCity: result.name, lat: result.latitude, lon: result.longitude },
      }));
      await loadWeather();
    } catch (error) {
      console.error("Error buscando ciudad:", error);
      elements.searchStatus.textContent = translate("No se encontró esa ciudad.");
    } finally {
      elements.searchButton.disabled = false;
    }
  }

  elements.form.addEventListener("submit", (event) => {
    event.preventDefault();
    selectCity(elements.cityInput.value);
  });
  document.addEventListener("portfolio:languagechange", renderWeather);
  loadWeather();
  window.setInterval(loadWeather, 15 * 60 * 1000);
})();

/* ============================================================
   Zonas de escalada cerca de la ciudad consultada
   ============================================================ */

(function climbingZones() {
  const widget = document.getElementById("weatherWidget");
  const container = document.getElementById("climbingLinks");
  const status = document.getElementById("climbingLinksStatus");
  const list = document.getElementById("climbingLinksList");
  const fallback = document.getElementById("climbingLinksFallback");
  const grid = document.getElementById("climbingLinksGrid");
  if (!widget || !container || !status || !list || !fallback || !grid) return;

  const API_URL = "https://portfolio-backend-m07q.onrender.com/api/climbing/zones";
  const translate = (text) => window.portfolioTranslate ? window.portfolioTranslate(text) : text;
  const safeUrl = (url) => typeof url === "string" && /^https:\/\//i.test(url) ? url : null;
  let requestId = 0;
  let currentCity = "";
  let loading = false;
  let lastData = null;

  function renderLinks(links) {
    grid.replaceChildren();
    fallback.hidden = !links;
    if (!links) return;

    [
      ["🧗 theCrag", links.thecrag],
      ["🏔️ TheTopo", links.thetopo],
      ["🔍 Google", links.google],
    ].forEach(([label, url]) => {
      const href = safeUrl(url);
      if (!href) return;
      const anchor = document.createElement("a");
      anchor.className = "climbing-links__item";
      anchor.href = href;
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";
      anchor.textContent = label;
      grid.append(anchor);
    });
  }

  function render() {
    list.replaceChildren();
    if (!lastData) {
      container.hidden = !loading;
      status.textContent = loading ? translate("Buscando zonas de escalada…") : "";
      fallback.hidden = true;
      return;
    }

    container.hidden = false;
    const results = Array.isArray(lastData.results) ? lastData.results : [];
    if (lastData.error) {
      status.textContent = translate("No se pudieron cargar las zonas. Inténtalo más tarde.");
    } else if (results.length === 0) {
      status.textContent = `${translate("No hay datos de OpenBeta para")} ${lastData.city}.`;
    } else {
      status.textContent = "";
    }

    results.forEach((area) => {
      const item = document.createElement("li");
      item.className = "climbing-links__zone";

      const name = document.createElement("strong");
      name.textContent = area.name;
      item.append(name);

      if (area.totalClimbs > 0) {
        const climbs = document.createElement("span");
        climbs.className = "climbing-links__climbs";
        climbs.textContent = `${area.totalClimbs} ${translate("vías")}`;
        item.append(climbs);
      }

      const actions = document.createElement("div");
      actions.className = "climbing-links__actions";
      [
        ["📍", area.mapsUrl, "Ver en el mapa"],
        ["🧭", area.directionsUrl, "Cómo llegar"],
      ].forEach(([label, url, description]) => {
        const href = safeUrl(url);
        if (!href) return;
        const anchor = document.createElement("a");
        anchor.className = "climbing-links__icon";
        anchor.href = href;
        anchor.target = "_blank";
        anchor.rel = "noopener noreferrer";
        anchor.textContent = label;
        anchor.title = translate(description);
        anchor.setAttribute("aria-label", translate(description));
        actions.append(anchor);
      });
      item.append(actions);
      list.append(item);
    });

    renderLinks(lastData.searchLinks);
  }

  async function loadZones(cityName) {
    const id = ++requestId;
    currentCity = cityName.trim();
    lastData = null;
    loading = Boolean(currentCity);
    if (!loading) {
      render();
      return;
    }
    render();

    try {
      const response = await fetch(`${API_URL}?q=${encodeURIComponent(currentCity)}`);
      if (!response.ok) throw new Error(`Backend respondió ${response.status}`);
      const data = await response.json();
      if (id !== requestId) return;
      lastData = data;
    } catch (error) {
      if (id !== requestId) return;
      console.warn("Error cargando zonas de escalada:", error);
      lastData = { city: currentCity, results: [], searchLinks: null, error: true };
    } finally {
      if (id === requestId) {
        loading = false;
        render();
      }
    }
  }

  document.addEventListener("portfolio:citychange", (event) => {
    loadZones(event.detail.searchCity || event.detail.city || "");
  });
  document.addEventListener("portfolio:languagechange", render);
  loadZones(widget.dataset.city || "");
})();

/* ============================================================
   Formulario de contacto · validación + envío al backend
   ============================================================ */

(function contactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const success = document.getElementById("formSuccess");
  const submitBtn = document.getElementById("submitBtn");
  const stateIdle = submitBtn ? submitBtn.querySelector(".btn-state--idle") : null;
  const stateLoading = submitBtn ? submitBtn.querySelector(".btn-state--loading") : null;
  const stateSuccess = submitBtn ? submitBtn.querySelector(".btn-state--success") : null;
  const translate = (message) => window.portfolioTranslate ? window.portfolioTranslate(message) : message;

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

  const validate = (field) => {
    const value = field.value.trim();
    const name = field.name;

    if (name === "nombre") {
      if (!value) { showError(field, translate("Escribe tu nombre.")); return false; }
      if (value.length < 2) { showError(field, translate("Mínimo 2 caracteres.")); return false; }
    }
    if (name === "email") {
      if (!value) { showError(field, translate("Escribe tu email.")); return false; }
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      if (!ok) { showError(field, translate("Email no válido.")); return false; }
    }
    if (name === "asunto") {
      if (!value) { showError(field, translate("Elige un asunto.")); return false; }
    }
    if (name === "mensaje") {
      if (!value) { showError(field, translate("Escribe un mensaje.")); return false; }
      if (value.length < 10) { showError(field, translate("Mínimo 10 caracteres.")); return false; }
    }
    if (name === "telefono" && inputTelefono && inputTelefono.required) {
      if (!value) { showError(field, translate("Escribe tu número de teléfono.")); return false; }
      const ok = /^[+\d\s()-]{7,}$/.test(value);
      if (!ok) { showError(field, translate("Teléfono no válido.")); return false; }
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

  const showState = (which) => {
    if (stateIdle) stateIdle.hidden = which !== "idle";
    if (stateLoading) stateLoading.hidden = which !== "loading";
    if (stateSuccess) stateSuccess.hidden = which !== "success";
  };

  const setDisabled = (disabled) => {
    if (submitBtn) submitBtn.disabled = disabled;
  };

  form.addEventListener("submit", async (e) => {
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

    const payload = {
      nombre: form.nombre.value.trim(),
      email: form.email.value.trim(),
      asunto: form.asunto.value,
      mensaje: form.mensaje.value.trim(),
      telefono: inputTelefono ? inputTelefono.value.trim() : null,
      quiereLlamada: checkLlamada ? checkLlamada.checked : false,
    };

    const backendUrl = "https://portfolio-backend-m07q.onrender.com/api/contact";

    setDisabled(true);
    showState("loading");

    try {
      const res = await fetch(backendUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Error del servidor");

      form.reset();
      if (campoTelefono) campoTelefono.style.display = "none";
      if (inputTelefono) inputTelefono.required = false;

      showState("success");
      setTimeout(() => {
        showState("idle");
        setDisabled(false);
      }, 2000);

      if (success) {
        success.hidden = false;
        success.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(() => { success.hidden = true; }, 6000);
      }
    } catch (err) {
      console.error(err);
      alert(translate("No se pudo enviar el mensaje. Inténtalo más tarde."));
      showState("idle");
      setDisabled(false);
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

/* ---- Casos de proyecto: problema, solución y resultado ---- */
(function projectCases() {
  const buttons = document.querySelectorAll(".js-toggle-case");
  const translate = (text) => window.portfolioTranslate?.(text) || text;

  function updateLabel(button) {
    const label = button.firstChild;
    if (!label) return;
    const isOpen = button.getAttribute("aria-expanded") === "true";
    label.nodeValue = `\n                ${translate(isOpen ? "Ocultar caso completo" : "Ver caso completo")} `;
  }

  buttons.forEach((button) => {
    const caseBlock = document.getElementById(button.getAttribute("aria-controls"));
    if (!caseBlock) return;

    button.addEventListener("click", () => {
      const isOpen = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!isOpen));
      caseBlock.hidden = isOpen;
      button.querySelector(".js-toggle-icon").textContent = isOpen ? "→" : "←";
      updateLabel(button);
    });

    document.addEventListener("portfolio:languagechange", () => updateLabel(button));
  });
})();

/* ============================================================
   Terminal que se escribe sola
   ============================================================ */

(function typingTerminal() {
  const term = document.getElementById("typingTerminal");
  if (!term) return;

  const code = {
    es:  { cond: "no_llegue_a_la_cima", solve: "resolver_problema", learn: "aprender", climb: "subir",  ok: "✓ Programa ejecutado. Subiendo..." },
    val: { cond: "no_arribe_al_cim",    solve: "resoldre_problema", learn: "aprendre", climb: "pujar",  ok: "✓ Programa executat. Pujant..." },
    en:  { cond: "not_at_the_summit",   solve: "solve_problem",     learn: "learn",    climb: "climb",  ok: "✓ Program executed. Climbing..." }
  };

  const currentLang = () => {
    const l = document.documentElement.lang;
    return l === "en" ? "en" : l === "ca-valencia" ? "val" : "es";
  };

  const buildLines = (lang) => {
    const t = code[lang] || code.es;
    return [
      '<span class="term-prompt">$</span> while (<span class="term-var">' + t.cond + '</span>) {',
      '  <span class="term-fn">' + t.solve + '</span>();',
      '  <span class="term-fn">' + t.learn + '</span>();',
      '  <span class="term-fn">' + t.climb + '</span>();',
      '}',
      '<span class="term-ok">' + t.ok + '</span>',
      '<span class="term-prompt">$</span> <span class="term-cursor">▊</span>'
    ];
  };

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let timer = null;
  let started = false;
  let textNodes = [];

  const render = (lang) => { term.innerHTML = buildLines(lang).join("\n"); };

  const prepareTyping = () => {
    const walker = document.createTreeWalker(term, NodeFilter.SHOW_TEXT);
    textNodes = [];
    let node;
    while ((node = walker.nextNode())) {
      textNodes.push({ node, text: node.textContent });
      node.textContent = "";
    }
  };

  let nodeIndex = 0;
  let charIndex = 0;

  function type() {
    if (nodeIndex >= textNodes.length) return;
    const current = textNodes[nodeIndex];
    current.node.textContent += current.text.charAt(charIndex);
    charIndex++;
    if (charIndex >= current.text.length) {
      nodeIndex++;
      charIndex = 0;
    }
    timer = window.setTimeout(type, 32);
  }

  function start() {
    if (started) return;
    started = true;
    type();
  }

  render(currentLang());
  if (!reduceMotion) prepareTyping();

  document.addEventListener("portfolio:languagechange", (event) => {
    window.clearTimeout(timer);
    started = true;
    render((event.detail && event.detail.language) || currentLang());
  });

  if (reduceMotion) return;

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          start();
          observer.unobserve(term);
        }
      });
    }, { threshold: 0.4 });
    observer.observe(term);
  } else {
    start();
  }
})();

/* ============================================================
   Actividad pública de GitHub
   ============================================================ */

(function githubActivity() {
  const container = document.getElementById("githubActivity");
  const subtitle = document.getElementById("githubActivitySubtitle");
  const grid = document.getElementById("githubActivityGrid");
  if (!container || !subtitle || !grid) return;

  const API_URL = "https://portfolio-backend-m07q.onrender.com/api/github/activity";
  const translate = (text) => window.portfolioTranslate ? window.portfolioTranslate(text) : text;
  let activity = null;

  function render() {
    if (!activity?.repos?.length) return;
    container.hidden = false;
    grid.replaceChildren();
    subtitle.textContent = `${activity.user.publicRepos} ${translate("repositorios públicos")} · ${activity.user.followers} ${translate("seguidores")}`;

    activity.repos.forEach((repo) => {
      const card = document.createElement("a");
      card.className = "github-activity__card";
      card.href = repo.url;
      card.target = "_blank";
      card.rel = "noopener noreferrer";

      const name = document.createElement("strong");
      name.className = "github-activity__name";
      name.textContent = repo.name;
      const description = document.createElement("p");
      description.className = "github-activity__desc";
      description.textContent = repo.description || translate("Sin descripción");
      const meta = document.createElement("span");
      meta.className = "github-activity__meta";
      const bits = [];
      if (repo.language) bits.push(`● ${repo.language}`);
      bits.push(`⭐ ${repo.stars}`);
      bits.push(`🍴 ${repo.forks}`);
      meta.textContent = bits.join(" · ");
      card.append(name, description, meta);
      grid.append(card);
    });
  }

  fetch(API_URL)
    .then((response) => response.ok ? response.json() : Promise.reject(new Error(`HTTP ${response.status}`)))
    .then((data) => {
      activity = data;
      render();
    })
    .catch((error) => {
      console.warn("Error cargando actividad de GitHub:", error);
    });

  document.addEventListener("portfolio:languagechange", render);
})();