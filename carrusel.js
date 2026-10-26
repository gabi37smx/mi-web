/* ============================================================
   carrusel.js · Carrusel 3D (Coverflow) para móvil · v2

   Qué hace:
   - Solo actúa con la pantalla de móvil (<= 720px). En escritorio se ve la
     cuadrícula normal y este script no toca nada.
   - Se activa y se desactiva solo al cambiar el tamaño de la ventana o girar
     el móvil (antes había que recargar la página).
   - Las tarjetas siguen al dedo mientras arrastras, y al soltar se colocan
     solas. Un gesto rápido puede pasar varias tarjetas.
   - También se maneja con el teclado (flechas, Inicio y Fin) y tocando una
     tarjeta lateral para traerla al centro.
   ============================================================ */
(function () {
  "use strict";

  const esMovil = window.matchMedia("(max-width: 720px)");
  const sinMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)");
  const instancias = new Map(); // raíz del carrusel -> instancia activa

  // Ajustes del efecto (si quieres cambiar el aspecto, es aquí)
  const SEPARACION = 0.55;     // separación entre tarjetas (fracción de su ancho)
  const PROFUNDIDAD = 150;     // cuánto se hunden las tarjetas laterales (px)
  const GIRO = 35;             // grados que giran las tarjetas laterales
  const ESCALA_LATERAL = 0.8;  // tamaño de las laterales respecto a la central
  const UMBRAL_ARRASTRE = 6;   // px que hay que mover para considerarlo arrastre
  const INERCIA_MS = 120;      // cuánto "lanza" un gesto rápido
  const MAX_SALTO = 2;         // tarjetas extra máximas que puede añadir la inercia

  function iniciar(raiz) {
    const pista = raiz.querySelector("[data-carousel-track]");
    if (!pista) return null;

    const tarjetas = Array.from(pista.children);
    const total = tarjetas.length;
    if (total < 2) return null;

    const control = new AbortController();
    const opciones = { signal: control.signal };
    const estilosOriginales = tarjetas.map((t) => t.getAttribute("style"));

    let posicion = 0;   // posición actual, con decimales (0 = primera tarjeta al centro)
    let destino = 0;    // tarjeta a la que vamos
    let animacion = null;
    let ancho = 260;    // ancho de una tarjeta (se mide)
    let ignorarClick = false;
    let arrastre = null;

    raiz.classList.add("is-coverflow");
    pista.setAttribute("tabindex", "0");

    // --- Medidas: el alto del carrusel se adapta a la tarjeta más alta ---
    function medir() {
      ancho = tarjetas[0].offsetWidth || 260;
      const alto = Math.max(...tarjetas.map((t) => t.offsetHeight));
      raiz.style.setProperty("--cf-alto", alto + 70 + "px");
    }

    // --- Dibujo: calcula la posición 3D de cada tarjeta según `posicion` ---
    function dibujar() {
      const paso = ancho * SEPARACION;
      for (let i = 0; i < total; i++) {
        const tarjeta = tarjetas[i];
        const d = i - posicion;      // distancia al centro (con decimales)
        const a = Math.abs(d);

        // Las que están muy lejos no se dibujan
        if (a > 2.2) {
          if (tarjeta.style.visibility !== "hidden") tarjeta.style.visibility = "hidden";
          continue;
        }

        const dc = Math.max(-2, Math.min(2, d));
        const cerca = Math.min(a, 1);                 // 0 en el centro, 1 en las laterales
        const x = dc * paso;
        const z = -PROFUNDIDAD * cerca;
        const giro = -GIRO * dc;
        const escala = 1 - (1 - ESCALA_LATERAL) * cerca;
        const opacidad = a <= 1 ? 1 - 0.4 * a : Math.max(0, 0.6 - 0.6 * (a - 1));

        tarjeta.style.visibility = "";
        tarjeta.style.opacity = opacidad.toFixed(3);
        tarjeta.style.zIndex = String(100 - Math.round(a * 10));
        tarjeta.style.transform =
          "translate(-50%, -50%) translate3d(" + x.toFixed(1) + "px, 0, " + z.toFixed(1) + "px) " +
          "rotateY(" + giro.toFixed(1) + "deg) scale(" + escala.toFixed(3) + ")";
      }
    }

    // --- Animación hasta una tarjeta (con aceleración suave al final) ---
    function irA(indice, instante) {
      destino = Math.max(0, Math.min(total - 1, Math.round(indice)));
      if (animacion) cancelAnimationFrame(animacion);
      animacion = null;

      const inicio = posicion;
      const distancia = destino - inicio;
      if (instante || sinMovimiento.matches || Math.abs(distancia) < 0.001) {
        posicion = destino;
        dibujar();
        return;
      }

      const duracion = Math.min(450, 220 + Math.abs(distancia) * 90);
      const t0 = performance.now();
      function paso(ahora) {
        const p = Math.min(1, (ahora - t0) / duracion);
        posicion = inicio + distancia * (1 - Math.pow(1 - p, 3)); // easeOutCubic
        dibujar();
        animacion = p < 1 ? requestAnimationFrame(paso) : null;
      }
      animacion = requestAnimationFrame(paso);
    }

    // --- Arrastre (ratón, dedo y lápiz con el mismo código) ---
    pista.addEventListener("pointerdown", (e) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      if (animacion) { cancelAnimationFrame(animacion); animacion = null; }
      arrastre = {
        id: e.pointerId,
        x0: e.clientX,
        pos0: posicion,
        muestras: [{ x: e.clientX, t: e.timeStamp }],
        movido: false,
      };
    }, opciones);

    pista.addEventListener("pointermove", (e) => {
      if (!arrastre || e.pointerId !== arrastre.id) return;
      const dx = e.clientX - arrastre.x0;

      if (!arrastre.movido) {
        if (Math.abs(dx) < UMBRAL_ARRASTRE) return;
        arrastre.movido = true;
        try { pista.setPointerCapture(e.pointerId); } catch (_) { /* sin captura */ }
        raiz.classList.add("is-arrastrando");
      }

      arrastre.muestras.push({ x: e.clientX, t: e.timeStamp });
      if (arrastre.muestras.length > 6) arrastre.muestras.shift();

      // Un poco de "goma" en los extremos para que se note que no hay más
      let p = arrastre.pos0 - dx / (ancho * SEPARACION);
      if (p < 0) p *= 0.35;
      else if (p > total - 1) p = total - 1 + (p - (total - 1)) * 0.35;
      posicion = p;
      dibujar();
    }, opciones);

    function soltar(e) {
      if (!arrastre || e.pointerId !== arrastre.id) return;
      const a = arrastre;
      arrastre = null;
      raiz.classList.remove("is-arrastrando");
      if (!a.movido) return; // fue un toque: lo gestiona el click

      ignorarClick = true;
      setTimeout(() => { ignorarClick = false; }, 60);

      if (e.type === "pointercancel") { irA(posicion); return; }

      // Velocidad del gesto: positiva si fue hacia la derecha
      const primera = a.muestras[0];
      const ultima = a.muestras[a.muestras.length - 1];
      let v = (ultima.x - primera.x) / Math.max(1, ultima.t - primera.t);
      if (e.timeStamp - ultima.t > 100) v = 0; // el dedo se paró antes de soltar
      v = Math.max(-3, Math.min(3, v));        // tope de velocidad
      // La inercia añade como mucho 2 tarjetas más a lo que ya has arrastrado
      const extra = Math.max(-MAX_SALTO, Math.min(MAX_SALTO, -(v * INERCIA_MS) / (ancho * SEPARACION)));
      irA(posicion + extra);
    }
    pista.addEventListener("pointerup", soltar, opciones);
    pista.addEventListener("pointercancel", soltar, opciones);

    // Tocar una tarjeta lateral la trae al centro
    pista.addEventListener("click", (e) => {
      if (ignorarClick) { e.preventDefault(); e.stopPropagation(); return; }
      const tarjeta = e.target.closest(".cert-card");
      const i = tarjeta ? tarjetas.indexOf(tarjeta) : -1;
      if (i >= 0 && i !== Math.round(posicion)) irA(i);
    }, opciones);

    // Que el navegador no arrastre el texto ni las imágenes
    pista.addEventListener("dragstart", (e) => e.preventDefault(), opciones);

    // Teclado
    pista.addEventListener("keydown", (e) => {
      let nuevo = null;
      if (e.key === "ArrowRight") nuevo = destino + 1;
      else if (e.key === "ArrowLeft") nuevo = destino - 1;
      else if (e.key === "Home") nuevo = 0;
      else if (e.key === "End") nuevo = total - 1;
      if (nuevo === null) return;
      e.preventDefault();
      irA(nuevo);
    }, opciones);

    // Volver a medir si cambia el tamaño, el idioma o se cargan las fuentes
    function remedir() { medir(); dibujar(); }
    window.addEventListener("resize", remedir, opciones);
    document.addEventListener("portfolio:languagechange", remedir, opciones);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { if (!control.signal.aborted) remedir(); });

    medir();
    dibujar();

    // Deja todo como estaba (al pasar a escritorio)
    function destruir() {
      control.abort();
      if (animacion) cancelAnimationFrame(animacion);
      raiz.classList.remove("is-coverflow", "is-arrastrando");
      raiz.style.removeProperty("--cf-alto");
      pista.removeAttribute("tabindex");
      tarjetas.forEach((t, i) => {
        if (estilosOriginales[i] === null) t.removeAttribute("style");
        else t.setAttribute("style", estilosOriginales[i]);
      });
    }

    return { destruir: destruir };
  }

  // Activa o desactiva los carruseles según el tamaño de pantalla
  function sincronizar() {
    document.querySelectorAll("[data-carousel]").forEach((raiz) => {
      const activo = instancias.has(raiz);
      if (esMovil.matches && !activo) {
        const instancia = iniciar(raiz);
        if (instancia) instancias.set(raiz, instancia);
      } else if (!esMovil.matches && activo) {
        instancias.get(raiz).destruir();
        instancias.delete(raiz);
      }
    });
  }

  if (esMovil.addEventListener) esMovil.addEventListener("change", sincronizar);
  else esMovil.addListener(sincronizar); // navegadores antiguos
  sincronizar();
})();