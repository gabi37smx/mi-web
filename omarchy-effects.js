/* ============================================================
   omarchy-effects.js · Extras del skin Omarchy (escritorio Hyprland)
   ------------------------------------------------------------
   Solo hace algo cuando <html data-skin="omarchy">. En topo, minecraft y
   matrix no crea nada, no escucha teclas y no gasta timers.

   Qué incluye:
   1. TEMAS de Omarchy (cada uno cambia también forma, tipografía y efectos):
      tokyo-night, synthwave, retro, commodore, vantablack, kurenai, konbini y
      lumon. Se guardan en localStorage
      ("omarchy-theme") y se aplican con data-omarchy-theme en <html>.
   2. Módulos de la barra (tipo Waybar): reloj, lanzador y selector de tema.
   3. LANZADOR tipo Walker: Ctrl+K (⌘K), "/" o Meta/Alt+Espacio.
      Navega por páginas, cambia tema, estilo e idioma y lanza fastfetch.
   4. WORKSPACES: las teclas 1–9 saltan a la entrada n del menú (los números
      que se ven en la cabecera).
   5. AVISOS tipo Mako (esquina superior derecha).
   6. FASTFETCH: ventana de terminal con datos de la sesión.

   Los colores de cada tema viven en style.css (bloque SKIN · OMARCHY).
   Al probar:  localStorage.removeItem("omarchy-hint")  vuelve a mostrar el aviso inicial.
   ============================================================ */

(function omarchyEffects() {
  "use strict";

  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const esOmarchy = () => root.getAttribute("data-skin") === "omarchy";

  const CLAVE_TEMA = "omarchy-theme";
  const CLAVE_AVISO = "omarchy-hint";
  const leer = (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } };
  const guardar = (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* sin almacenamiento: vale para esta página */ } };

  /* ---------- Temas (c = fondo, acento, acento 2, acento 3: solo para las muestras de color) ---------- */
  const TEMAS = [
    {
      "id": "tokyo-night",
      "name": "Tokyo Night",
      "c": [
        "#1a1b26",
        "#7aa2f7",
        "#bb9af7",
        "#9ece6a"
      ],
      "kw": "tokyo night sobrio default"
    },
    {
      "id": "synthwave",
      "name": "Synthwave '84",
      "c": [
        "#241b2f",
        "#ff7edb",
        "#36f9f6",
        "#fede5d"
      ],
      "kw": "synthwave 84 neon rosa cian"
    },
    {
      "id": "retro",
      "name": "Retro 82",
      "c": [
        "#100a02",
        "#ffb000",
        "#ff7a1a",
        "#ffd45e"
      ],
      "kw": "retro 82 ambar crt scanlines"
    },
    {
      "id": "commodore",
      "name": "C64",
      "c": [
        "#352879",
        "#c8c1ff",
        "#8bf0f8",
        "#f2f58f"
      ],
      "kw": "c64 commodore azul basic"
    },
    {
      "id": "vantablack",
      "name": "Vantablack",
      "c": [
        "#000000",
        "#ffffff",
        "#c8c8c8",
        "#9a9a9a"
      ],
      "kw": "vantablack negro blanco monocromo"
    },
    {
      "id": "kurenai",
      "name": "Kurenai",
      "c": [
        "#0d0709",
        "#ef3b50",
        "#e8c07d",
        "#f0d9b5"
      ],
      "kw": "kurenai rojo japones serif"
    },
    {
      "id": "konbini",
      "name": "Konbini",
      "c": [
        "#fff4e0",
        "#c2255c",
        "#0a8f84",
        "#b35c00"
      ],
      "kw": "konbini kawaii claro pastel"
    },
    {
      "id": "lumon",
      "name": "Lumon",
      "c": [
        "#edf3f1",
        "#0b5fa5",
        "#12806f",
        "#2f7d1f"
      ],
      "kw": "lumon severance claro clinico"
    }
  ];
  const TEMA_DEFECTO = "tokyo-night";

  // Fuentes de cada tema: se piden SOLO cuando se usa el tema (igual que hace skin-picker.js con Minecraft)
  const FUENTES = {
    synthwave: "family=Rajdhani:wght@600;700",
    retro: "family=VT323",
    commodore: "family=VT323",
    kurenai: "family=Shippori+Mincho:wght@500;700",
    konbini: "family=Nunito:wght@500;700;800",
    lumon: "family=IBM+Plex+Mono:wght@500;700&family=IBM+Plex+Sans:wght@400;500;600"
  };
  function cargarFuentes(id) {
    const f = FUENTES[id];
    if (!f) return;
    const href = "https://fonts.googleapis.com/css2?" + f + "&display=swap";
    if (document.querySelector('link[href="' + href + '"]')) return;
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = href;
    document.head.appendChild(l);
  }
  const temaPorId = (id) => TEMAS.find((t) => t.id === id) || TEMAS.find((t) => t.id === TEMA_DEFECTO);

  /* ---------- Textos ---------- */
  const TEXTOS = {
    es: {
      lanzador: "Lanzador", placeholder: "Buscar páginas, temas, acciones…", vacio: "Sin resultados",
      ayuda: "↑↓ moverse · ↵ abrir · esc cerrar", tema: "Cambiar tema", temaAhora: "Tema: {n}",
      workspace: "Workspace {n}", gNav: "Ir a", gTema: "Tema", gEstilo: "Estilo", gIdioma: "Idioma", gAcc: "Acción",
      subir: "Subir al inicio", repo: "Abrir el repositorio en GitHub", copiar: "Copiar enlace de esta página",
      copiado: "Enlace copiado", ff: "Ejecutar fastfetch", ffCerrar: "esc para cerrar",
      aviso: "Ctrl+K abre el lanzador · 1–9 saltan de workspace · prueba “fastfetch”", reloj: "Hora"
    },
    val: {
      lanzador: "Llançador", placeholder: "Cerca pàgines, temes, accions…", vacio: "Sense resultats",
      ayuda: "↑↓ moure's · ↵ obrir · esc tancar", tema: "Canvia el tema", temaAhora: "Tema: {n}",
      workspace: "Workspace {n}", gNav: "Anar a", gTema: "Tema", gEstilo: "Estil", gIdioma: "Idioma", gAcc: "Acció",
      subir: "Pujar a l'inici", repo: "Obri el repositori a GitHub", copiar: "Copia l'enllaç d'aquesta pàgina",
      copiado: "Enllaç copiat", ff: "Executa fastfetch", ffCerrar: "esc per a tancar",
      aviso: "Ctrl+K obri el llançador · 1–9 salten de workspace · prova “fastfetch”", reloj: "Hora"
    },
    en: {
      lanzador: "Launcher", placeholder: "Search pages, themes, actions…", vacio: "No results",
      ayuda: "↑↓ move · ↵ open · esc close", tema: "Change theme", temaAhora: "Theme: {n}",
      workspace: "Workspace {n}", gNav: "Go to", gTema: "Theme", gEstilo: "Style", gIdioma: "Language", gAcc: "Action",
      subir: "Back to top", repo: "Open the repository on GitHub", copiar: "Copy this page's link",
      copiado: "Link copied", ff: "Run fastfetch", ffCerrar: "esc to close",
      aviso: "Ctrl+K opens the launcher · 1–9 jump workspaces · try “fastfetch”", reloj: "Time"
    }
  };
  const idioma = () => (root.lang === "en" ? "en" : root.lang === "ca-valencia" ? "val" : "es");
  const tx = (k, v) =>
    ((TEXTOS[idioma()] || TEXTOS.es)[k] || TEXTOS.es[k] || k).replace(/\{(\w+)\}/g, (m, n) => (v && n in v ? v[n] : m));
  const localeHora = () => (idioma() === "en" ? "en-GB" : "es-ES");

  const norm = (s) => String(s).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const el = (tag, cls, texto) => { const e = document.createElement(tag); if (cls) e.className = cls; if (texto != null) e.textContent = texto; return e; };

  /* ---------- CSS propio (solo lo que necesita JS) ---------- */
  const estilo = document.createElement("style");
  estilo.id = "omarchy-effects-css";
  estilo.textContent = `
    /* Módulos de la barra: ocultos salvo en Omarchy */
    .omx-mod { display: none; }
    :root[data-skin="omarchy"] .omx-mod {
      display: inline-grid; place-items: center; flex: none;
      height: 36px; min-width: 36px; padding: 0 .55rem;
      background: var(--surface); color: var(--text);
      border: 1px solid var(--line); border-radius: var(--radius-sm);
      font: 700 .72rem var(--mono); letter-spacing: 0;
      cursor: pointer; transition: border-color .15s, color .15s, box-shadow .15s;
    }
    :root[data-skin="omarchy"] button.omx-mod:hover { border-color: var(--accent); color: var(--accent); box-shadow: 0 0 0 1px var(--accent); }
    :root[data-skin="omarchy"] .omx-mod:focus-visible { outline: 3px solid var(--accent); outline-offset: 2px; }
    :root[data-skin="omarchy"] .omx-clock { cursor: default; color: var(--muted); }
    @media (max-width: 1439px) { :root[data-skin="omarchy"] .omx-clock { display: none; } }
    .omx-mod svg { width: 17px; height: 17px; display: block; pointer-events: none; }
    .omx-swatch { display: grid; grid-template-columns: repeat(2, 7px); gap: 2px; pointer-events: none; }
    .omx-swatch i { width: 7px; height: 7px; border-radius: 2px; background: var(--c); }

    /* Lanzador (Walker) */
    .omx-launcher {
      position: fixed; inset: 0; z-index: 9996;
      display: grid; place-items: start center; padding: 14vh 1rem 1rem;
      background: rgba(0, 0, 0, .5);
      background: color-mix(in srgb, var(--bg) 62%, transparent);
      backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
      animation: omx-fade .15s ease both;
    }
    .omx-launcher__panel {
      width: min(640px, 100%); overflow: hidden;
      color: var(--text); font-family: var(--mono);
      border: 2px solid transparent; border-radius: var(--radius);
      background:
        linear-gradient(var(--surface), var(--surface)) padding-box,
        linear-gradient(135deg, var(--accent), var(--accent-2)) border-box;
      box-shadow: var(--shadow), 0 0 40px rgba(var(--accent-rgb), .18);
      animation: omx-pop .18s cubic-bezier(.22, 1, .36, 1) both;
    }
    .omx-launcher__bar { display: flex; align-items: center; gap: .7rem; padding: .85rem 1rem; border-bottom: 1px solid var(--line); }
    .omx-launcher__prompt { color: var(--accent); font-weight: 700; }
    .omx-launcher__input {
      flex: 1; min-width: 0; padding: 0; margin: 0;
      background: transparent; color: var(--text); caret-color: var(--accent);
      border: 0; outline: 0; box-shadow: none; border-radius: 0;
      font: 500 1rem var(--mono);
    }
    .omx-launcher__input::placeholder { color: var(--muted-2); opacity: 1; }
    .omx-launcher__list { list-style: none; margin: 0; padding: .35rem; max-height: min(52vh, 420px); overflow-y: auto; }
    .omx-launcher__item {
      display: flex; align-items: center; gap: .75rem;
      padding: .55rem .75rem; border-radius: var(--radius-sm);
      font-size: .9rem; cursor: pointer;
    }
    .omx-launcher__item[aria-selected="true"] { background: rgba(var(--accent-rgb), .16); box-shadow: inset 2px 0 0 var(--accent); }
    .omx-launcher__ico { width: 1.4rem; text-align: center; color: var(--accent); flex: none; }
    .omx-launcher__label { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .omx-launcher__tag { color: var(--muted-2); font-size: .72rem; flex: none; }
    .omx-launcher__vacio { padding: 1.1rem; text-align: center; color: var(--muted); font-size: .85rem; }
    .omx-launcher__ayuda { margin: 0; padding: .5rem 1rem; border-top: 1px solid var(--line); color: var(--muted-2); font-size: .72rem; }

    /* Avisos (Mako) */
    .omx-toasts {
      position: fixed; top: calc(62px + var(--frame, 0px)); right: calc(1rem + var(--frame, 0px)); z-index: 9996;
      display: grid; gap: .5rem; width: min(340px, calc(100vw - 2rem)); pointer-events: none;
    }
    .omx-toast {
      display: flex; align-items: center; gap: .75rem;
      padding: .65rem .8rem; color: var(--text);
      background: var(--surface); border: 2px solid var(--accent); border-radius: var(--radius);
      box-shadow: var(--shadow); font: 500 .82rem/1.35 var(--mono);
      animation: omx-slide .22s cubic-bezier(.22, 1, .36, 1) both;
    }
    .omx-toast.is-out { animation: omx-slide-out .2s ease both; }
    .omx-toast__app { display: block; color: var(--muted-2); font-size: .66rem; letter-spacing: .08em; text-transform: uppercase; }
    .omx-toast .omx-swatch { flex: none; }

    /* fastfetch */
    .omx-ff {
      position: fixed; inset: 0; z-index: 9996; display: grid; place-items: center; padding: 1rem;
      background: rgba(0, 0, 0, .5);
      background: color-mix(in srgb, var(--bg) 62%, transparent);
      backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
      animation: omx-fade .15s ease both;
    }
    .omx-ff__win {
      width: min(680px, 100%); padding: 1.3rem 1.4rem 1rem;
      color: var(--text); font: 500 .82rem/1.55 var(--mono);
      border: 2px solid transparent; border-radius: var(--radius);
      background:
        linear-gradient(var(--bg-soft), var(--bg-soft)) padding-box,
        linear-gradient(135deg, var(--accent), var(--accent-2)) border-box;
      box-shadow: var(--shadow), 0 0 40px rgba(var(--accent-rgb), .18);
      animation: omx-pop .18s cubic-bezier(.22, 1, .36, 1) both;
    }
    .omx-ff__cmd { margin: 0 0 .9rem; color: var(--muted); }
    .omx-ff__cmd b { color: var(--accent); }
    .omx-ff__cols { display: flex; gap: 2rem; align-items: flex-start; }
    .omx-ff__logo { margin: 0; color: var(--accent); font: 700 .82rem/1.2 var(--mono); flex: none; }
    .omx-ff__info { margin: 0; min-width: 0; white-space: pre-wrap; overflow-wrap: anywhere; }
    .omx-ff__info b { color: var(--accent); font-weight: 700; }
    .omx-ff__user { color: var(--accent-2); font-weight: 700; }
    .omx-ff__paleta { display: flex; gap: 0; margin-top: .6rem; }
    .omx-ff__paleta i { width: 2rem; height: 1rem; background: var(--c); }
    .omx-ff__pie { margin: .9rem 0 0; color: var(--muted-2); font-size: .72rem; }
    @media (max-width: 560px) { .omx-ff__logo { display: none; } }

    @keyframes omx-fade { from { opacity: 0; } to { opacity: 1; } }
    @keyframes omx-pop { from { opacity: 0; transform: scale(.96); } to { opacity: 1; transform: none; } }
    @keyframes omx-slide { from { opacity: 0; transform: translateX(24px); } to { opacity: 1; transform: none; } }
    @keyframes omx-slide-out { from { opacity: 1; transform: none; } to { opacity: 0; transform: translateX(24px); } }
    @media (prefers-reduced-motion: reduce) {
      .omx-launcher, .omx-launcher__panel, .omx-toast, .omx-toast.is-out, .omx-ff, .omx-ff__win { animation: none; }
    }
  `;
  document.head.appendChild(estilo);

  /* ============================================================
     1 · TEMAS
     ============================================================ */
  const metaTheme = document.getElementById("metaTheme");
  let btnTema = null;

  function temaActual() {
    const id = root.getAttribute("data-omarchy-theme") || leer(CLAVE_TEMA) || TEMA_DEFECTO;
    return temaPorId(id);
  }

  function pintarSwatch(contenedor, colores) {
    contenedor.textContent = "";
    colores.forEach((c) => { const i = document.createElement("i"); i.style.setProperty("--c", c); contenedor.appendChild(i); });
  }

  function pintarBotonTema() {
    if (!btnTema) return;
    const t = temaActual();
    pintarSwatch(btnTema.querySelector(".omx-swatch"), t.c);
    btnTema.setAttribute("aria-label", tx("tema") + " (" + t.name + ")");
    btnTema.setAttribute("title", tx("tema") + " · " + t.name);
  }

  function colorBarraNavegador() {
    window.requestAnimationFrame(() => {
      if (!metaTheme || !esOmarchy()) return;
      const bg = getComputedStyle(root).getPropertyValue("--bg").trim();
      if (bg) metaTheme.setAttribute("content", bg);
    });
  }

  function aplicarTema(id, avisar) {
    const t = temaPorId(id);
    cargarFuentes(t.id);
    root.classList.add("omx-cambiando");
    root.setAttribute("data-omarchy-theme", t.id);
    guardar(CLAVE_TEMA, t.id);
    pintarBotonTema();
    colorBarraNavegador();
    window.setTimeout(() => root.classList.remove("omx-cambiando"), 400);
    if (avisar) notificar(tx("temaAhora", { n: t.name }), t.c);
  }

  function siguienteTema(dir) {
    const i = TEMAS.findIndex((t) => t.id === temaActual().id);
    aplicarTema(TEMAS[(i + dir + TEMAS.length) % TEMAS.length].id, true);
  }

  /* ============================================================
     2 · AVISOS (Mako)
     ============================================================ */
  let contToasts = null;

  function notificar(texto, colores) {
    if (!esOmarchy()) return;
    if (!contToasts) {
      contToasts = el("div", "omx-toasts");
      contToasts.setAttribute("role", "status");
      contToasts.setAttribute("aria-live", "polite");
      document.body.appendChild(contToasts);
    }
    const t = el("div", "omx-toast");
    if (colores) { const sw = el("span", "omx-swatch"); pintarSwatch(sw, colores); t.appendChild(sw); }
    const cuerpo = el("span");
    cuerpo.append(el("span", "omx-toast__app", "omarchy"), document.createTextNode(texto));
    t.appendChild(cuerpo);
    while (contToasts.children.length >= 3) contToasts.firstChild.remove();
    contToasts.appendChild(t);
    window.setTimeout(() => {
      t.classList.add("is-out");
      window.setTimeout(() => t.remove(), reduceMotion ? 0 : 220);
    }, 2800);
  }

  /* ============================================================
     3 · LANZADOR (Walker)
     ============================================================ */
  let lanz = null;   // { fondo, input, lista, items, visibles, idx, previo }

  function entradas() {
    const lista = [];
    const enlaces = [...document.querySelectorAll(".nav-list .nav-link")];
    enlaces.forEach((a, i) => {
      lista.push({
        grupo: tx("gNav"), ico: "↗", label: a.textContent.trim(), tag: tx("workspace", { n: i + 1 }),
        kw: a.getAttribute("href") || "", run: () => { location.href = a.href; }
      });
    });
    const actual = temaActual().id;
    TEMAS.forEach((t) => {
      lista.push({
        grupo: tx("gTema"), ico: "◐", label: t.name + (t.id === actual ? "  ✓" : ""), tag: tx("gTema"),
        kw: "tema theme color " + t.id + " " + (t.kw || ""), colores: t.c, run: () => aplicarTema(t.id, true)
      });
    });
    [["topo", "Topo"], ["omarchy", "Omarchy"], ["minecraft", "Minecraft"], ["matrix", "Matrix"]].forEach(([id, nombre]) => {
      lista.push({
        grupo: tx("gEstilo"), ico: "◧", label: nombre, tag: tx("gEstilo"), kw: "estilo skin style",
        run: () => {
          const op = document.querySelector('.skin-picker__opt[data-skin="' + id + '"]');
          if (op) op.click(); else { root.setAttribute("data-skin", id); guardar("skin", id); }
        }
      });
    });
    [["es", "Español"], ["val", "Valencià"], ["en", "English"]].forEach(([cod, nombre]) => {
      const sel = document.getElementById("languageSelect");
      if (!sel) return;
      lista.push({
        grupo: tx("gIdioma"), ico: "A", label: nombre, tag: tx("gIdioma"), kw: "idioma language lengua " + cod,
        run: () => { sel.value = cod; sel.dispatchEvent(new Event("change", { bubbles: true })); }
      });
    });
    lista.push(
      { grupo: tx("gAcc"), ico: "❯", label: tx("ff"), tag: "fastfetch", kw: "fastfetch neofetch info sistema", run: abrirFastfetch },
      { grupo: tx("gAcc"), ico: "↑", label: tx("subir"), tag: tx("gAcc"), kw: "top arriba inicio", run: () => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }) },
      { grupo: tx("gAcc"), ico: "⎘", label: tx("copiar"), tag: tx("gAcc"), kw: "copy url link enlace",
        run: () => {
          const ok = () => notificar(tx("copiado"));
          if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(location.href).then(ok, () => {});
        } },
      { grupo: tx("gAcc"), ico: "⌥", label: tx("repo"), tag: "GitHub", kw: "github repo codigo code source",
        run: () => { window.open("https://github.com/gabi37smx/mi-web", "_blank", "noopener"); } }
    );
    lista.forEach((e) => { e.n = norm(e.label + " " + e.kw + " " + e.grupo); });
    return lista;
  }

  function filtrar(items, consulta) {
    const tokens = norm(consulta).split(/\s+/).filter(Boolean);
    if (!tokens.length) return items.slice(0, 40);
    const res = [];
    items.forEach((e, orden) => {
      let puntos = 0;
      for (const tk of tokens) {
        if (!e.n.includes(tk)) { puntos = -1; break; }
        const l = norm(e.label);
        puntos += l.startsWith(tk) ? 3 : l.includes(tk) ? 2 : 1;
      }
      if (puntos >= 0) res.push({ e, puntos, orden });
    });
    res.sort((a, b) => b.puntos - a.puntos || a.orden - b.orden);
    return res.map((r) => r.e);
  }

  function pintarLista() {
    const l = lanz;
    l.visibles = filtrar(l.items, l.input.value);
    if (l.idx >= l.visibles.length) l.idx = 0;
    l.lista.textContent = "";
    if (!l.visibles.length) {
      l.lista.appendChild(el("li", "omx-launcher__vacio", tx("vacio")));
      l.input.removeAttribute("aria-activedescendant");
      return;
    }
    l.visibles.forEach((e, i) => {
      const li = el("li", "omx-launcher__item");
      li.id = "omx-op-" + i;
      li.setAttribute("role", "option");
      li.setAttribute("aria-selected", i === l.idx ? "true" : "false");
      const ico = el("span", "omx-launcher__ico", e.colores ? "" : e.ico);
      if (e.colores) { const sw = el("span", "omx-swatch"); pintarSwatch(sw, e.colores); ico.appendChild(sw); }
      li.append(ico, el("span", "omx-launcher__label", e.label), el("span", "omx-launcher__tag", e.tag));
      li.addEventListener("mousemove", () => { if (l.idx !== i) { l.idx = i; marcar(); } });
      li.addEventListener("click", () => ejecutar(i));
      l.lista.appendChild(li);
    });
    l.input.setAttribute("aria-activedescendant", "omx-op-" + l.idx);
  }

  function marcar() {
    const l = lanz;
    [...l.lista.children].forEach((li, i) => li.setAttribute("aria-selected", i === l.idx ? "true" : "false"));
    l.input.setAttribute("aria-activedescendant", "omx-op-" + l.idx);
    const li = l.lista.children[l.idx];
    if (li && li.scrollIntoView) li.scrollIntoView({ block: "nearest" });
  }

  function ejecutar(i) {
    const e = lanz && lanz.visibles[i];
    if (!e) return;
    cerrarLanzador();
    e.run();
  }

  function teclaLanzador(e) {
    if (!lanz) return;
    if (e.key === "Escape") { e.preventDefault(); e.stopImmediatePropagation(); cerrarLanzador(); return; }
    if (e.target !== lanz.input && e.key !== "Tab") return;
    const n = lanz.visibles.length;
    if (e.key === "ArrowDown") { e.preventDefault(); if (n) { lanz.idx = (lanz.idx + 1) % n; marcar(); } }
    else if (e.key === "ArrowUp") { e.preventDefault(); if (n) { lanz.idx = (lanz.idx - 1 + n) % n; marcar(); } }
    else if (e.key === "Enter" && !e.isComposing) { e.preventDefault(); ejecutar(lanz.idx); }
    else if (e.key === "Tab") { e.preventDefault(); lanz.input.focus(); }
  }

  function abrirLanzador(prefill) {
    if (!esOmarchy() || lanz) return;
    const fondo = el("div", "omx-launcher");
    const panel = el("div", "omx-launcher__panel");
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "true");
    panel.setAttribute("aria-label", tx("lanzador"));
    const barra = el("div", "omx-launcher__bar");
    const input = el("input", "omx-launcher__input");
    input.type = "text";
    input.placeholder = tx("placeholder");
    input.autocomplete = "off";
    input.spellcheck = false;
    input.setAttribute("role", "combobox");
    input.setAttribute("aria-expanded", "true");
    input.setAttribute("aria-controls", "omx-lista");
    input.setAttribute("aria-label", tx("lanzador"));
    barra.append(el("span", "omx-launcher__prompt", "❯"), input);
    const lista = el("ul", "omx-launcher__list");
    lista.id = "omx-lista";
    lista.setAttribute("role", "listbox");
    panel.append(barra, lista, el("p", "omx-launcher__ayuda", tx("ayuda")));
    fondo.appendChild(panel);
    document.body.appendChild(fondo);

    lanz = { fondo, input, lista, items: entradas(), visibles: [], idx: 0, previo: document.activeElement };
    input.value = prefill || "";
    input.addEventListener("input", () => { lanz.idx = 0; pintarLista(); });
    fondo.addEventListener("mousedown", (e) => { if (e.target === fondo) cerrarLanzador(); });
    document.addEventListener("keydown", teclaLanzador, true);
    pintarLista();
    input.focus();
  }

  function cerrarLanzador() {
    if (!lanz) return;
    const { fondo, previo } = lanz;
    lanz = null;
    document.removeEventListener("keydown", teclaLanzador, true);
    fondo.remove();
    if (previo && previo.focus && document.contains(previo)) previo.focus({ preventScroll: true });
  }

  /* ============================================================
     4 · FASTFETCH
     ============================================================ */
  let ff = null;
  const LOGO = [
    "      /\\      ",
    "     /  \\     ",
    "    /    \\    ",
    "   /  /\\  \\   ",
    "  /  /  \\  \\  ",
    " /__/    \\__\\ "
  ].join("\n");

  function abrirFastfetch() {
    if (!esOmarchy() || ff) return;
    const t = temaActual();
    const seg = Math.round(performance.now() / 1000);
    const uptime = Math.floor(seg / 60) + "m " + (seg % 60) + "s";
    const filas = [
      ["OS", "Omarchy (edición web)"],
      ["Host", location.hostname || "localhost"],
      ["Kernel", "HTML · CSS · JS vanilla"],
      ["Uptime", uptime],
      ["WM", "Hyprland (en CSS)"],
      ["Theme", t.name],
      ["Locale", idioma() === "val" ? "Valencià" : idioma() === "en" ? "English" : "Español"],
      ["Display", window.innerWidth + "×" + window.innerHeight]
    ];
    const fondo = el("div", "omx-ff");
    const win = el("div", "omx-ff__win");
    win.setAttribute("role", "dialog");
    win.setAttribute("aria-modal", "true");
    win.setAttribute("aria-label", "fastfetch");

    const cmd = el("p", "omx-ff__cmd");
    cmd.append(el("b", null, "❯ "), document.createTextNode("fastfetch"));

    const cols = el("div", "omx-ff__cols");
    cols.appendChild(el("pre", "omx-ff__logo", LOGO));
    const info = el("pre", "omx-ff__info");
    const usuario = el("span", "omx-ff__user", "gabriel@portfolio");
    info.append(usuario, document.createTextNode("\n" + "─".repeat(17) + "\n"));
    filas.forEach(([k, v]) => {
      info.append(el("b", null, k.padEnd(8)), document.createTextNode(v + "\n"));
    });
    const paleta = el("div", "omx-ff__paleta");
    t.c.concat(["var(--text)", "var(--muted)", "var(--line)", "var(--surface-2)"]).forEach((c) => {
      const i = document.createElement("i"); i.style.setProperty("--c", c); paleta.appendChild(i);
    });
    const col2 = el("div");
    col2.append(info, paleta);
    cols.appendChild(col2);

    win.append(cmd, cols, el("p", "omx-ff__pie", tx("ffCerrar")));
    fondo.appendChild(win);
    document.body.appendChild(fondo);
    ff = { fondo, previo: document.activeElement };
    fondo.addEventListener("mousedown", (e) => { if (e.target === fondo) cerrarFastfetch(); });
    document.addEventListener("keydown", teclaFastfetch, true);
    win.tabIndex = -1;
    win.focus({ preventScroll: true });
  }

  function teclaFastfetch(e) {
    if (e.key === "Escape" || e.key === "Enter") { e.preventDefault(); e.stopImmediatePropagation(); cerrarFastfetch(); }
  }

  function cerrarFastfetch() {
    if (!ff) return;
    const { fondo, previo } = ff;
    ff = null;
    document.removeEventListener("keydown", teclaFastfetch, true);
    fondo.remove();
    if (previo && previo.focus && document.contains(previo)) previo.focus({ preventScroll: true });
  }

  /* ============================================================
     5 · ATAJOS (solo en Omarchy)
     ============================================================ */
  document.addEventListener("keydown", (e) => {
    if (!esOmarchy() || lanz || ff) return;

    // Ctrl/⌘ + K y Meta/Alt + Espacio abren el lanzador incluso escribiendo
    if ((e.ctrlKey || e.metaKey) && !e.altKey && !e.shiftKey && e.key.toLowerCase() === "k") { e.preventDefault(); abrirLanzador(); return; }
    if ((e.metaKey || e.altKey) && e.code === "Space") { e.preventDefault(); abrirLanzador(); return; }

    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const t = e.target;
    if (t && t.closest && t.closest("input, textarea, select, [contenteditable='true'], .arcade")) return;

    if (e.key === "/") { e.preventDefault(); abrirLanzador(); return; }
    if (/^[1-9]$/.test(e.key)) {
      const enlaces = [...document.querySelectorAll(".nav-list .nav-link")];
      const a = enlaces[Number(e.key) - 1];
      if (a) {
        notificar(tx("workspace", { n: e.key }) + " · " + a.textContent.trim());
        a.click();
      }
    }
  });

  /* ============================================================
     6 · MÓDULOS DE LA BARRA, RELOJ Y ARRANQUE
     ============================================================ */
  let reloj = null, btnLanz = null, timerReloj = 0;

  function pintarReloj() {
    if (!reloj) return;
    const d = new Date();
    reloj.textContent = d.toLocaleTimeString(localeHora(), { hour: "2-digit", minute: "2-digit" });
    reloj.setAttribute("title", d.toLocaleDateString(localeHora(), { weekday: "long", day: "numeric", month: "long" }));
    reloj.setAttribute("datetime", d.toISOString());
  }
  function iniciarReloj() { pintarReloj(); window.clearInterval(timerReloj); timerReloj = window.setInterval(pintarReloj, 15000); }
  function pararReloj() { window.clearInterval(timerReloj); timerReloj = 0; }

  function crearModulos() {
    const cont = document.querySelector(".header-actions");
    if (!cont) return;

    reloj = document.createElement("time");
    reloj.className = "omx-mod omx-clock";

    btnLanz = el("button", "omx-mod omx-launch");
    btnLanz.type = "button";
    btnLanz.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>';
    btnLanz.addEventListener("click", () => abrirLanzador());

    btnTema = el("button", "omx-mod omx-theme");
    btnTema.type = "button";
    btnTema.appendChild(el("span", "omx-swatch"));
    btnTema.addEventListener("click", (e) => siguienteTema(e.shiftKey ? -1 : 1));

    cont.prepend(reloj, btnLanz, btnTema);
    pintarTextosModulos();
    pintarBotonTema();
  }

  function pintarTextosModulos() {
    if (btnLanz) {
      btnLanz.setAttribute("aria-label", tx("lanzador") + " (Ctrl+K)");
      btnLanz.setAttribute("title", tx("lanzador") + " · Ctrl+K");
    }
    pintarBotonTema();
    pintarReloj();
  }

  document.addEventListener("portfolio:languagechange", pintarTextosModulos);

  let skinPrevia = root.getAttribute("data-skin") || "topo";

  function alEntrar() {
    // Atributo del tema siempre válido: si falta, o es de una versión anterior (nord, gruvbox…), se normaliza
    const t0 = temaActual();
    if (root.getAttribute("data-omarchy-theme") !== t0.id) root.setAttribute("data-omarchy-theme", t0.id);
    cargarFuentes(t0.id);
    iniciarReloj();
    colorBarraNavegador();
    if (!leer(CLAVE_AVISO)) {
      guardar(CLAVE_AVISO, "1");
      window.setTimeout(() => notificar(tx("aviso")), 700);
    }
  }
  function alSalir() {
    pararReloj();
    cerrarLanzador();
    cerrarFastfetch();
  }

  new MutationObserver(() => {
    const skin = root.getAttribute("data-skin") || "topo";
    const entra = skin === "omarchy" && skinPrevia !== "omarchy";
    const sale = skin !== "omarchy" && skinPrevia === "omarchy";
    skinPrevia = skin;
    if (entra) alEntrar();
    if (sale) alSalir();
  }).observe(root, { attributes: true, attributeFilter: ["data-skin"] });

  crearModulos();
  if (esOmarchy()) alEntrar();

  window.omarchyLanzador = { abrir: abrirLanzador, cerrar: cerrarLanzador };
  window.omarchyTema = aplicarTema;
})();