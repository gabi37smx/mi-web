/* ============================================================
   skin-picker.js · Conmutador de estilos visuales (skins)

   Qué hace, en cristiano:
   1. Maneja el botón circular de la cabecera. Al pulsarlo se abre una
      "rueda" con 3 opciones: topo, omarchy y minecraft.
   2. Al elegir una, cambia data-skin en <html> (todo el CSS cambia de golpe,
      sin recargar) y se guarda en localStorage con la clave "skin".
   3. Con el ratón sobre el botón, la rueda del ratón cambia entre los tres skins.
   4. Al cargar cualquier página, el skin se aplica ANTES de pintar con el
      pequeño script del <head> (así no hay parpadeo). Este fichero solo
      añade el comportamiento del botón.
   5. Las fuentes de omarchy y minecraft se piden SOLO cuando se usan, para
      que quien se quede en topo no descargue nada de más.

   Accesibilidad: botón con aria-label, rueda con role="radiogroup", opciones
   con role="radio" + aria-checked, teclado completo (Enter/Espacio, flechas,
   Inicio/Fin, Escape) y aviso a lectores de pantalla con aria-live.
   ============================================================ */

(function () {
  "use strict";

  const root = document.documentElement;
  const picker = document.getElementById("skinPicker");
  const btn = document.getElementById("skinPickerBtn");
  const wheel = document.getElementById("skinWheel");
  if (!picker || !btn || !wheel) return;

  /* ---------- Datos ---------- */
  // x e y: dónde queda cada opción respecto al botón al abrir la rueda (abanico hacia abajo)
  const SKINS = [
    { id: "topo", name: "Topo", x: -46, y: 66 },
    { id: "omarchy", name: "Omarchy", x: 0, y: 80 },
    { id: "minecraft", name: "Minecraft", x: 46, y: 66 }
  ];
  const IDS = SKINS.map((s) => s.id);
  const CLAVE = "skin";

  // Fuentes que necesita cada skin (topo usa las que ya carga la página)
  const FUENTES = {
    omarchy: "family=Sora:wght@600;700",
    minecraft: "family=Press+Start+2P&family=VT323"
  };

  const TEXTOS = {
    es: { btn: "Cambiar estilo visual", pista: "Cambiar estilo visual (clic o rueda del ratón)", group: "Estilo visual", live: "Estilo visual: {n}" },
    val: { btn: "Canvia l'estil visual", pista: "Canvia l'estil visual (clic o roda del ratolí)", group: "Estil visual", live: "Estil visual: {n}" },
    en: { btn: "Change visual style", pista: "Change visual style (click or mouse wheel)", group: "Visual style", live: "Visual style: {n}" }
  };
  const idioma = () => {
    const l = root.lang;
    return l === "en" ? "en" : l === "ca-valencia" ? "val" : "es";
  };
  const tx = (clave, vars) =>
    (TEXTOS[idioma()][clave] || TEXTOS.es[clave]).replace(/\{(\w+)\}/g, (m, k) => (vars && k in vars ? vars[k] : m));

  /* ---------- Skin actual y persistencia ---------- */
  const skinActual = () => {
    const s = root.getAttribute("data-skin");
    return IDS.includes(s) ? s : "topo";
  };

  function guardar(skin) {
    try { localStorage.setItem(CLAVE, skin); } catch (e) { /* sin almacenamiento: el cambio sigue valiendo en esta página */ }
  }

  function cargarFuentes(skin) {
    const f = FUENTES[skin];
    if (!f) return;
    const href = "https://fonts.googleapis.com/css2?" + f + "&display=swap";
    if (document.querySelector('link[href="' + href + '"]')) return;
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = href;
    document.head.appendChild(l);
  }

  // El color de la barra del navegador en móvil sigue al fondo del skin y del tema
  const meta = document.getElementById("metaTheme");
  function actualizarMeta() {
    if (!meta) return;
    const bg = getComputedStyle(root).getPropertyValue("--bg").trim();
    if (bg) meta.setAttribute("content", bg);
  }

  /* ---------- Etiqueta flotante con el nombre del skin (al girar la rueda del ratón) ---------- */
  const estilo = document.createElement("style");
  estilo.id = "skin-picker-css";
  estilo.textContent = `
    .skin-picker__tip {
      position: absolute; top: calc(100% + 8px); left: 50%; transform: translateX(-50%); z-index: 6;
      padding: .2rem .55rem; background: var(--text); color: var(--bg);
      font: 700 .72rem var(--mono); white-space: nowrap; pointer-events: none;
      opacity: 0; transition: opacity .15s;
    }
    .skin-picker__tip.is-visible { opacity: 1; }
    @media (prefers-reduced-motion: reduce) { .skin-picker__tip { transition: none; } }
  `;
  document.head.appendChild(estilo);

  const tip = document.createElement("span");
  tip.className = "skin-picker__tip";
  tip.setAttribute("aria-hidden", "true");
  picker.appendChild(tip);
  let tipTimer = 0;
  function mostrarEtiqueta(nombre) {
    tip.textContent = nombre;
    tip.classList.add("is-visible");
    window.clearTimeout(tipTimer);
    tipTimer = window.setTimeout(() => tip.classList.remove("is-visible"), 1100);
  }

  /* ---------- Construir la rueda ---------- */
  const live = document.createElement("p");
  live.className = "skin-picker__live";
  live.setAttribute("role", "status");
  live.setAttribute("aria-live", "polite");
  picker.appendChild(live);

  const opciones = SKINS.map((s) => {
    const o = document.createElement("button");
    o.type = "button";
    o.className = "skin-picker__opt";
    o.setAttribute("role", "radio");
    o.setAttribute("aria-checked", "false");
    o.setAttribute("aria-label", s.name);
    o.setAttribute("title", s.name);
    o.tabIndex = -1;
    o.dataset.skin = s.id;
    o.style.setProperty("--tx", s.x + "px");
    o.style.setProperty("--ty", s.y + "px");
    const icono = btn.querySelector(".skin-ico--" + s.id);
    if (icono) {
      const copia = icono.cloneNode(true);
      copia.classList.remove("skin-ico");
      o.appendChild(copia);
    }
    wheel.appendChild(o);
    return o;
  });

  function pintarEstado() {
    const actual = skinActual();
    opciones.forEach((o) => {
      const activo = o.dataset.skin === actual;
      o.setAttribute("aria-checked", String(activo));
      o.tabIndex = activo && wheel.classList.contains("is-open") ? 0 : -1;
    });
  }

  function pintarTextos() {
    btn.setAttribute("aria-label", tx("btn"));
    btn.setAttribute("title", tx("pista"));
    wheel.setAttribute("aria-label", tx("group"));
  }

  /* ---------- Abrir y cerrar ---------- */
  const abierta = () => wheel.classList.contains("is-open");

  function abrir() {
    if (abierta()) return;
    wheel.classList.add("is-open");
    btn.setAttribute("aria-expanded", "true");
    pintarEstado();
    const activa = opciones.find((o) => o.getAttribute("aria-checked") === "true") || opciones[0];
    window.requestAnimationFrame(() => activa.focus({ preventScroll: true }));
  }

  function cerrar(devolverFoco) {
    if (!abierta()) return;
    wheel.classList.remove("is-open");
    btn.setAttribute("aria-expanded", "false");
    opciones.forEach((o) => { o.tabIndex = -1; });
    if (devolverFoco) btn.focus({ preventScroll: true });
  }

  /* ---------- Cambiar de skin ---------- */
  function elegir(skin) {
    if (!IDS.includes(skin)) return;
    const cambia = skin !== skinActual();
    root.setAttribute("data-skin", skin);
    guardar(skin);
    cargarFuentes(skin);
    pintarEstado();
    actualizarMeta();
    if (cambia) {
      const nombre = SKINS.find((s) => s.id === skin).name;
      live.textContent = "";
      window.setTimeout(() => { live.textContent = tx("live", { n: nombre }); }, 30);
    }
  }

  // Pasa al siguiente (dir = 1) o al anterior (dir = -1), dando la vuelta al llegar al final
  function ciclar(dir) {
    const i = IDS.indexOf(skinActual());
    const siguiente = SKINS[(i + dir + SKINS.length) % SKINS.length];
    elegir(siguiente.id);
    mostrarEtiqueta(siguiente.name);
  }

  /* ---------- Eventos ---------- */
  btn.addEventListener("click", () => (abierta() ? cerrar(true) : abrir()));

  // Rueda del ratón sobre el botón: una "muesca" = un skin. Se evita que la página haga scroll mientras giras.
  let ultimaRueda = 0;
  picker.addEventListener("wheel", (e) => {
    e.preventDefault();
    const ahora = Date.now();
    if (ahora - ultimaRueda < 220 || e.deltaY === 0) return;
    ultimaRueda = ahora;
    ciclar(e.deltaY > 0 ? 1 : -1);
  }, { passive: false });

  // Con el botón enfocado, ↑ y ↓ también cambian de skin sin abrir la rueda
  btn.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      ciclar(e.key === "ArrowDown" ? 1 : -1);
    }
  });

  opciones.forEach((o) => {
    o.addEventListener("click", () => {
      elegir(o.dataset.skin);
      cerrar(true);
    });
  });

  wheel.addEventListener("keydown", (e) => {
    const i = opciones.indexOf(document.activeElement);
    const ir = (n) => {
      const destino = opciones[(n + opciones.length) % opciones.length];
      opciones.forEach((o) => { o.tabIndex = o === destino ? 0 : -1; });
      destino.focus({ preventScroll: true });
    };
    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown": e.preventDefault(); ir(i + 1); break;
      case "ArrowLeft":
      case "ArrowUp": e.preventDefault(); ir(i - 1); break;
      case "Home": e.preventDefault(); ir(0); break;
      case "End": e.preventDefault(); ir(opciones.length - 1); break;
      case "Escape": e.preventDefault(); cerrar(true); break;
      default: break; // Enter y Espacio activan el botón (click) de forma nativa
    }
  });

  picker.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && abierta()) { e.preventDefault(); cerrar(true); }
  });

  // Click fuera de la rueda, o foco que sale de ella: se cierra
  document.addEventListener("pointerdown", (e) => { if (abierta() && !picker.contains(e.target)) cerrar(false); });
  picker.addEventListener("focusout", (e) => { if (abierta() && !picker.contains(e.relatedTarget)) cerrar(false); });

  // Al cambiar de idioma se actualizan los textos del conmutador
  document.addEventListener("portfolio:languagechange", pintarTextos);

  // El tema claro/oscuro lo cambia script.js: aquí solo se reajusta el color de la barra del navegador
  if (window.MutationObserver) {
    new MutationObserver(actualizarMeta).observe(root, { attributes: true, attributeFilter: ["data-theme", "data-skin"] });
  }

  // Si se cambia el skin en otra pestaña, esta se pone igual
  window.addEventListener("storage", (e) => {
    if (e.key === CLAVE && IDS.includes(e.newValue) && e.newValue !== skinActual()) elegir(e.newValue);
  });

  /* ---------- Arranque ---------- */
  pintarTextos();
  pintarEstado();
  cargarFuentes(skinActual());
  actualizarMeta();
  console.info("[skin-picker] listo · skin actual:", skinActual());
})();