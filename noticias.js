// mi-web/noticias.js · Noticias de IA agrupadas por temas
//
// Cómo funciona:
//   1. Pide las noticias al backend (GNews), igual que antes.
//   2. Quita duplicados (la misma noticia publicada por varios medios se junta en una sola,
//      con todos sus medios como enlaces).
//   3. Clasifica cada titular en un tema general por palabras clave (TEMAS, más abajo).
//   4. Primero se ven las TARJETAS DE TEMA (con cuántas noticias tiene cada una); al elegir una
//      se ve la lista de sus noticias, con botón para volver y atajos a los otros temas.
//   5. El tema abierto va en la URL (#tema-cine), así que funciona el botón "atrás" del navegador
//      y se puede compartir el enlace.
//
// Las tarjetas, botones y etiquetas reutilizan las clases .news-item, .news-title, .news-source,
// .btn y .filter-btn, por lo que cada skin las pinta con su estilo sin tocar nada más.
(function () {
  'use strict';

  // Detectar entorno: local vs producción
  const isLocal = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
  const API_BASE = isLocal
    ? 'http://localhost:3000/api/news/ai'
    : 'https://portfolio-backend-m07q.onrender.com/api/news/ai';

  const CONTAINER_ID = 'news-widget';
  const DATE_ID = 'newsDate';
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ============================================================
     TEXTOS (es · val · en)
     ============================================================ */
  const TEXTOS = {
    es: {
      loading: 'Cargando noticias...', empty: 'No hay noticias disponibles', error: 'No se pudieron cargar las noticias',
      pick: 'Elige un tema para ver sus noticias', back: '← Todos los temas', others: 'Otros temas',
      noticia: ['noticia', 'noticias'], tema: ['tema', 'temas'], en: 'en', sinDatos: 'sin datos',
      leerEn: 'Leer en {d}', abrirTema: 'Ver noticias de {t}'
    },
    val: {
      loading: 'Carregant notícies...', empty: 'No hi ha notícies disponibles', error: 'No es van poder carregar les notícies',
      pick: 'Tria un tema per a vore les seues notícies', back: '← Tots els temes', others: 'Altres temes',
      noticia: ['notícia', 'notícies'], tema: ['tema', 'temes'], en: 'en', sinDatos: 'sense dades',
      leerEn: 'Llig a {d}', abrirTema: 'Vore les notícies de {t}'
    },
    en: {
      loading: 'Loading news...', empty: 'No news available', error: 'Could not load news',
      pick: 'Pick a topic to see its stories', back: '← All topics', others: 'Other topics',
      noticia: ['story', 'stories'], tema: ['topic', 'topics'], en: 'in', sinDatos: 'no data',
      leerEn: 'Read on {d}', abrirTema: 'See {t} stories'
    }
  };

  function getIdioma() {
    const l = document.documentElement.lang;
    if (l === 'en') return 'en';
    if (l === 'ca-valencia') return 'val';
    try {
      const guardado = localStorage.getItem('language');
      if (TEXTOS[guardado]) return guardado;
    } catch (e) { /* sin almacenamiento */ }
    return 'es';
  }
  const tx = (clave, vars) =>
    String(TEXTOS[getIdioma()][clave]).replace(/\{(\w+)\}/g, (m, k) => (vars && k in vars ? vars[k] : m));
  const plural = (n, clave) => TEXTOS[getIdioma()][clave][n === 1 ? 0 : 1];

  /* ============================================================
     TEMAS · nombre en 3 idiomas + palabras clave
     ------------------------------------------------------------
     Las palabras clave van SIN tildes y en minúsculas. Cada una casa al principio de una palabra
     ("empresa" casa con "empresas"); si termina en $ casa solo la palabra entera ("ue$").
     Gana el tema con más coincidencias; en empate manda el orden de PRIORIDAD.
     Lo que no encaja en ninguno cae en "Otras noticias".
     ============================================================ */
  const TEMAS = [
    { id: 'politica', icono: '⚖️',
      nombre: { es: 'Política y regulación', val: 'Política i regulació', en: 'Politics & regulation' },
      kw: ['gobierno', 'trump', 'biden', 'presidente', 'ministr', 'congreso', 'senado', 'parlamento', 'legisl', 'regulaci',
        'normativa', 'reglament', 'prohib', 'union europea', 'comision europea', 'ue$', 'eeuu', 'estados unidos', 'china$',
        'sancion', 'arancel', 'impuesto', 'tribunal', 'juez', 'juicio', 'demanda', 'derechos de autor', 'copyright', 'patente',
        'elecciones', 'politic', 'ley$', 'leyes', 'government', 'regulat', 'court', 'lawsuit', 'congress', 'senate',
        'election', 'policy', 'minister', 'tariff'] },
    { id: 'seguridad', icono: '🛡️',
      nombre: { es: 'Seguridad y desinformación', val: 'Seguretat i desinformació', en: 'Security & misinformation' },
      kw: ['bulo', 'desinform', 'fake', 'falso', 'falsa', 'deepfake', 'fraude', 'estafa', 'ciberataque', 'ciberseguridad',
        'hackeo', 'hacker', 'malware', 'phishing', 'privacidad', 'vigilancia', 'reconocimiento facial', 'seguridad',
        'riesgo', 'peligro', 'manipul', 'sesgo', 'etica', 'security', 'scam', 'fraud', 'misinformation', 'privacy',
        'surveillance', 'danger'] },
    { id: 'ciencia', icono: '🔬',
      nombre: { es: 'Salud y ciencia', val: 'Salut i ciència', en: 'Health & science' },
      kw: ['salud', 'medic', 'hospital', 'cancer', 'enfermedad', 'paciente', 'diagnostic', 'farmac', 'vacuna', 'biolog',
        'cientific', 'ciencia', 'descubr', 'laboratorio', 'espacial', 'astronaut', 'nasa', 'astronom', 'clima', 'energia', 'fisica',
        'quimica', 'proteina', 'health', 'doctor', 'drug', 'science', 'research', 'discover', 'climate'] },
    { id: 'robots', icono: '🤖',
      nombre: { es: 'Robots y vehículos', val: 'Robots i vehicles', en: 'Robots & vehicles' },
      kw: ['robot', 'humanoid', 'dron', 'autonom', 'conduccion', 'coche', 'vehiculo', 'tesla', 'waymo', 'taxi',
        'automatiz', 'drone', 'self-driving', 'vehicle'] },
    { id: 'trabajo', icono: '🎓',
      nombre: { es: 'Trabajo y educación', val: 'Treball i educació', en: 'Work & education' },
      kw: ['empleo', 'trabajo', 'trabajador', 'laboral', 'despido', 'profesion', 'sueldo', 'salario', 'estudiante', 'alumno',
        'colegio', 'escuela', 'instituto', 'universidad', 'educaci', 'profesor', 'docente', 'formacion', 'examen',
        'job$', 'jobs$', 'worker', 'layoff', 'student', 'school', 'teacher', 'education', 'university'] },
    { id: 'empresas', icono: '💼',
      nombre: { es: 'Empresas y economía', val: 'Empreses i economia', en: 'Business & economy' },
      kw: ['empresa', 'compania', 'negocio', 'econom', 'mercado', 'inversi', 'inversor', 'financ', 'banco', 'bolsa',
        'ingresos', 'ventas', 'facturacion', 'beneficio', 'valoracion', 'millones', 'startup', 'emprend', 'ronda de financ',
        'adquier', 'fusion', 'ipo$', 'pyme', 'comercio', 'industria', 'productividad', 'consultora', 'company', 'business',
        'market$', 'invest', 'revenue', 'funding', 'valuation', 'billion', 'acquire'] },
    { id: 'cine', icono: '🎬',
      nombre: { es: 'Cine, arte y creatividad', val: 'Cinema, art i creativitat', en: 'Film, art & creativity' },
      kw: ['pelicula', 'cine', 'oscar', 'actor', 'actriz', 'serie$', 'musica', 'cancion', 'artista', 'arte$', 'pintura',
        'ilustrac', 'dibujo', 'imagen', 'imagenes', 'foto', 'video', 'videojuego', 'concurso', 'premio', 'festival',
        'hollywood', 'netflix', 'disney', 'spotify', 'sora$', 'midjourney', 'doblaje', 'novela', 'libro', 'escritor',
        'movie', 'film', 'music', 'artist', 'photo', 'award', 'contest'] },
    { id: 'modelos', icono: '🧠',
      nombre: { es: 'Modelos y tecnología', val: 'Models i tecnologia', en: 'Models & tech' },
      kw: ['openai', 'chatgpt', 'gpt', 'gemini', 'claude$', 'anthropic', 'mistral', 'deepseek', 'grok', 'xai$',
        'copilot', 'modelo', 'lenguaje', 'chatbot', 'asistente', 'algoritmo', 'aprendizaje automatico',
        'machine learning', 'red neuronal', 'ia generativa', 'nvidia', 'chip', 'procesador', 'gpu$', 'semiconductor',
        'centro de datos', 'supercomput', 'google', 'microsoft', 'apple$', 'amazon', 'samsung', 'huawei',
        'software', 'aplicacion', 'lanzamiento', 'actualizacion', 'tecnolog', 'model$', 'launch', 'release', 'data center'] }
  ];
  const OTROS = {
    id: 'otros', icono: '📰',
    nombre: { es: 'Otras noticias', val: 'Altres notícies', en: 'Other news' }
  };

  const escRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  TEMAS.forEach((t) => {
    t.re = new RegExp(t.kw.map((k) => (k.endsWith('$') ? '\\b' + escRe(k.slice(0, -1)) + '\\b' : '\\b' + escRe(k))).join('|'), 'g');
  });

  const norm = (s) => String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

  function clasificar(titulo) {
    const t = norm(titulo);
    let mejor = null;
    let max = 0;
    TEMAS.forEach((tema) => {            // el orden de TEMAS es la prioridad en caso de empate
      const m = t.match(tema.re);
      const puntos = m ? m.length : 0;
      if (puntos > max) { max = puntos; mejor = tema; }
    });
    return mejor || OTROS;
  }

  /* ============================================================
     DATOS: validar, quitar duplicados y agrupar
     ============================================================ */
  function urlSegura(u) {
    try {
      const x = new URL(u);
      return x.protocol === 'http:' || x.protocol === 'https:' ? x.href : '';
    } catch (e) { return ''; }
  }

  function dominioDe(evento, url) {
    if (evento.domain) return String(evento.domain);
    try { return new URL(url).hostname.replace(/^www\./, ''); } catch (e) { return ''; }
  }

  // La misma noticia en varios medios = una sola entrada con varias fuentes
  function prepararNoticias(eventos) {
    const porClave = new Map();
    eventos.forEach((ev) => {
      const url = urlSegura(ev && ev.url);
      const titulo = ev && ev.title ? String(ev.title).trim() : '';
      if (!url || !titulo) return;       // sin título o con enlace no válido (p. ej. "javascript:"): se descarta
      const clave = norm(titulo).replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim();
      const fuente = { domain: dominioDe(ev, url), url };
      const fecha = ev.publishedAt ? new Date(ev.publishedAt) : null;
      const existente = porClave.get(clave);
      if (existente) {
        if (!existente.fuentes.some((f) => f.url === url || (f.domain && f.domain === fuente.domain))) existente.fuentes.push(fuente);
        if (fecha && !isNaN(fecha) && (!existente.fecha || fecha > existente.fecha)) existente.fecha = fecha;
      } else {
        porClave.set(clave, { title: titulo, fuentes: [fuente], fecha: fecha && !isNaN(fecha) ? fecha : null });
      }
    });
    return [...porClave.values()];
  }

  // -> [{ tema, items }] ordenado: más noticias primero; "Otras noticias" siempre al final
  function agrupar(noticias) {
    const mapa = new Map();
    noticias.forEach((n) => {
      const tema = clasificar(n.title);
      if (!mapa.has(tema.id)) mapa.set(tema.id, { tema, items: [] });
      mapa.get(tema.id).items.push(n);
    });
    const grupos = [...mapa.values()];
    grupos.forEach((g) => g.items.sort((a, b) => (b.fecha || 0) - (a.fecha || 0)));
    const orden = (g) => (g.tema.id === 'otros' ? 999 : TEMAS.indexOf(g.tema));
    grupos.sort((a, b) => (a.tema.id === 'otros') - (b.tema.id === 'otros') || b.items.length - a.items.length || orden(a) - orden(b));
    return grupos;
  }

  /* ============================================================
     ESTADO Y DOM
     ============================================================ */
  const state = { estado: 'cargando', noticias: [], accion: false, ultimoTema: null };

  const el = (tag, cls, texto) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (texto != null) e.textContent = texto;
    return e;
  };

  const nombreDe = (tema) => tema.nombre[getIdioma()] || tema.nombre.es;
  const temaDeHash = () => {
    const m = location.hash.match(/^#tema-([a-z0-9-]+)$/);
    return m ? m[1] : null;
  };

  function tiempoRelativo(fecha) {
    if (!fecha) return '';
    try {
      const loc = { es: 'es', val: 'ca', en: 'en' }[getIdioma()];
      const rtf = new Intl.RelativeTimeFormat(loc, { numeric: 'auto' });
      const seg = (fecha - Date.now()) / 1000;
      const abs = Math.abs(seg);
      if (abs < 3600) return rtf.format(Math.round(seg / 60), 'minute');
      if (abs < 86400) return rtf.format(Math.round(seg / 3600), 'hour');
      return rtf.format(Math.round(seg / 86400), 'day');
    } catch (e) { return ''; }
  }

  function pintarFecha(grupos) {
    const dateEl = document.getElementById(DATE_ID);
    if (!dateEl) return;
    dateEl.textContent = '';
    const fuerte = (t) => { const s = document.createElement('strong'); s.textContent = String(t); return s; };
    if (state.estado === 'ok') {
      const n = state.noticias.length;
      const m = grupos.length;
      dateEl.append(fuerte(n), ` ${plural(n, 'noticia')} ${tx('en')} `, fuerte(m), ` ${plural(m, 'tema')}`);
    } else if (state.estado === 'vacio') {
      dateEl.append(fuerte(0), ` ${plural(0, 'noticia')}`);
    } else if (state.estado === 'error') {
      dateEl.append(fuerte('—'), ` · ${tx('sinDatos')}`);
    }
  }

  function articulo(n) {
    const art = el('article', 'news-item');
    const enlace = el('a', 'news-link');
    enlace.href = n.fuentes[0].url;
    enlace.target = '_blank';
    enlace.rel = 'noopener noreferrer';
    enlace.appendChild(el('h3', 'news-title', n.title));
    art.appendChild(enlace);

    const meta = el('div', 'news-meta');
    n.fuentes.forEach((f, i) => {
      if (!f.domain) return;
      if (i === 0) {
        meta.appendChild(el('span', 'news-source', f.domain));
      } else {                           // otros medios que cuentan lo mismo: enlaces a su versión
        const a = el('a', 'news-source news-source--alt', f.domain);
        a.href = f.url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.setAttribute('aria-label', tx('leerEn', { d: f.domain }));
        meta.appendChild(a);
      }
    });
    const rel = tiempoRelativo(n.fecha);
    if (rel) {
      const t = el('time', 'news-time', rel);
      t.dateTime = n.fecha.toISOString();
      t.title = n.fecha.toLocaleString(getIdioma() === 'en' ? 'en-GB' : getIdioma() === 'val' ? 'ca' : 'es-ES');
      meta.appendChild(t);
    }
    art.appendChild(meta);
    return art;
  }

  function vistaTemas(cont, grupos) {
    const ul = el('ul', 'news-topics');
    grupos.forEach((g) => {
      const li = el('li');
      const b = el('button', 'news-item news-topic');
      b.type = 'button';
      b.dataset.topic = g.tema.id;
      b.setAttribute('aria-label', tx('abrirTema', { t: nombreDe(g.tema) }) + ' (' + g.items.length + ')');
      const ico = el('span', 'news-topic__icon', g.tema.icono);
      ico.setAttribute('aria-hidden', 'true');
      b.append(ico, el('span', 'news-title news-topic__name', nombreDe(g.tema)),
        el('span', 'news-source news-topic__count', g.items.length + ' ' + plural(g.items.length, 'noticia')));
      b.addEventListener('click', () => ir('#tema-' + g.tema.id, g.tema.id));
      li.appendChild(b);
      ul.appendChild(li);
    });
    cont.replaceChildren(el('p', 'news-pick', tx('pick')), ul);
  }

  function vistaTema(cont, grupos, grupo) {
    const atras = el('button', 'btn news-back', tx('back'));
    atras.type = 'button';
    atras.addEventListener('click', () => ir('', grupo.tema.id));

    const h = el('h2', 'news-topic-title');
    h.tabIndex = -1;
    const ico = el('span', null, grupo.tema.icono);
    ico.setAttribute('aria-hidden', 'true');
    h.append(ico, document.createTextNode(' ' + nombreDe(grupo.tema) + ' '),
      el('span', 'news-source', String(grupo.items.length)));

    const barra = el('div', 'news-topbar');
    barra.append(atras, h);

    const lista = el('div', 'news-list');
    grupo.items.forEach((n) => lista.appendChild(articulo(n)));

    const resto = grupos.filter((g) => g !== grupo);
    const otros = el('nav', 'news-others');
    otros.setAttribute('aria-label', tx('others'));
    if (resto.length) {
      otros.appendChild(el('span', 'news-others__label', tx('others')));
      resto.forEach((g) => {
        const chip = el('button', 'filter-btn', nombreDe(g.tema) + ' (' + g.items.length + ')');
        chip.type = 'button';
        chip.addEventListener('click', () => ir('#tema-' + g.tema.id, g.tema.id));
        otros.appendChild(chip);
      });
    }
    cont.replaceChildren(barra, lista, ...(resto.length ? [otros] : []));
  }

  function render() {
    const cont = document.getElementById(CONTAINER_ID);
    if (!cont) return;

    if (state.estado === 'cargando') {
      cont.replaceChildren(el('p', 'news-loading', tx('loading')));
      return;
    }
    if (state.estado === 'error' || state.estado === 'vacio') {
      cont.replaceChildren(el('p', 'news-empty', tx(state.estado === 'error' ? 'error' : 'empty')));
      pintarFecha([]);
      return;
    }

    const grupos = agrupar(state.noticias);
    pintarFecha(grupos);
    const id = temaDeHash();
    const grupo = grupos.find((g) => g.tema.id === id);
    if (grupo) vistaTema(cont, grupos, grupo); else vistaTemas(cont, grupos);

    // Solo cuando el cambio lo provoca la persona (clic o atrás/adelante): foco y desplazamiento
    if (state.accion) {
      state.accion = false;
      const foco = grupo
        ? cont.querySelector('.news-topic-title')
        : cont.querySelector('[data-topic="' + state.ultimoTema + '"]') || cont.querySelector('.news-topic');
      if (foco) foco.focus({ preventScroll: true });
      cont.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    }
  }

  // Cambia de vista guardando el paso en el historial (botón "atrás" del navegador)
  function ir(hash, temaId) {
    state.ultimoTema = temaId;
    state.accion = true;
    try {
      history.pushState(null, '', location.pathname + location.search + hash);
    } catch (e) {
      location.hash = hash;              // por si el navegador no deja pushState (p. ej. file://)
      return;
    }
    render();
  }

  async function cargarNoticias() {
    state.estado = 'cargando';
    render();
    try {
      const res = await fetch(API_BASE);
      if (!res.ok) throw new Error('Error de red');
      const data = await res.json();
      state.noticias = prepararNoticias(Array.isArray(data.events) ? data.events : []);
      state.estado = state.noticias.length ? 'ok' : 'vacio';
    } catch (err) {
      console.warn('[News] Error:', err.message);
      state.noticias = [];
      state.estado = 'error';
    }
    render();
  }

  // Atrás/adelante del navegador o cambio manual del #hash
  window.addEventListener('popstate', () => { state.accion = true; render(); });
  window.addEventListener('hashchange', () => { render(); });
  // Cambio de idioma: se vuelve a pintar con los textos del idioma nuevo (sin pedir nada otra vez)
  document.addEventListener('portfolio:languagechange', () => render());

  document.addEventListener('DOMContentLoaded', cargarNoticias);
  window.reloadNewsWidget = cargarNoticias;
})();