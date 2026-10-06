// mi-web/noticias.js
(function() {
  'use strict';

  // Detectar entorno: local vs producción
  const isLocal = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
  const API_BASE = isLocal
    ? 'http://localhost:3000/api/news/ai'
    : 'https://portfolio-backend-m07q.onrender.com/api/news/ai';

  const CONTAINER_ID = 'news-widget';
  const DATE_ID = 'newsDate';

  const textos = {
    es: { loading: 'Cargando noticias...', empty: 'No hay noticias disponibles', error: 'No se pudieron cargar las noticias' },
    ca: { loading: 'Carregant notícies...', empty: 'No hi ha notícies disponibles', error: 'No es van poder carregar les notícies' },
    en: { loading: 'Loading news...', empty: 'No news available', error: 'Could not load news' }
  };

  function getIdioma() {
    return localStorage.getItem('lang') || 'es';
  }

  async function cargarNoticias() {
    const lang = getIdioma();
    const container = document.getElementById(CONTAINER_ID);
    const dateEl = document.getElementById(DATE_ID);
    if (!container) return;

    container.innerHTML = `<p class="news-loading">${textos[lang].loading}</p>`;

    try {
      const res = await fetch(API_BASE);
      if (!res.ok) throw new Error('Error de red');

      const data = await res.json();

      if (dateEl && data.date) {
        const total = data.total || 0;
        dateEl.innerHTML = `<strong>${total}</strong> artículos · última semana`;
      } else if (dateEl) {
        dateEl.innerHTML = `<strong>0</strong> noticias`;
      }

      if (!data.events || data.events.length === 0) {
        container.innerHTML = `<p class="news-empty">${textos[lang].empty}</p>`;
        return;
      }

      pintarNoticias(container, data.events);

    } catch (err) {
      console.warn('[News] Error:', err.message);
      container.innerHTML = `<p class="news-empty">${textos[lang].error}</p>`;
      if (dateEl) dateEl.innerHTML = '<strong>—</strong> · sin datos';
    }
  }

  function pintarNoticias(container, eventos) {
    const html = eventos.map(evento => {
      const badge = evento.domain
        ? `<span class="news-source">${escaparHtml(evento.domain)}</span>`
        : '';

      return `
        <article class="news-item">
          <a href="${evento.url}" target="_blank" rel="noopener noreferrer" class="news-link">
            <h3 class="news-title">${escaparHtml(evento.title)}</h3>
          </a>
          ${badge}
        </article>
      `;
    }).join('');

    container.innerHTML = `<div class="news-list">${html}</div>`;
  }

  function escaparHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  document.addEventListener('DOMContentLoaded', cargarNoticias);
  window.reloadNewsWidget = cargarNoticias;

})();