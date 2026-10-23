/* ============================================================
   carrusel.js · Carrusel 3D (Coverflow) para móvil
   ============================================================ */
(function () {
  "use strict";

  const esMovil = window.matchMedia("(max-width: 720px)");
  
  // Si no es móvil, no hacemos nada (se ve la cuadrícula normal de PC)
  if (!esMovil.matches) return;

  document.querySelectorAll("[data-carousel]").forEach(iniciar);

  function iniciar(raiz) {
    const pista = raiz.querySelector("[data-carousel-track]");
    if (!pista) return;

    const tarjetas = Array.from(pista.children);
    const total = tarjetas.length;
    if (total < 2) return;

    let indice = 0;
    let inicioX = 0;
    let arrastrando = false;
    let umbralArrastre = 50; 

    function renderizar() {
      tarjetas.forEach((tarjeta, i) => {
        let offset = i - indice;
        
        if (Math.abs(offset) > 2) {
          tarjeta.style.opacity = 0;
          tarjeta.style.pointerEvents = "none";
          tarjeta.style.transform = `translateX(${offset > 0 ? 200 : -200}%) scale(0.5)`;
          return;
        }

        const esCentro = offset === 0;
        const translateX = offset * 55; 
        const translateZ = esCentro ? 0 : -150; 
        const rotateY = offset * -35; 
        const scale = esCentro ? 1 : 0.8; 

        tarjeta.style.opacity = esCentro ? 1 : 0.6;
        tarjeta.style.pointerEvents = "auto";
        
        tarjeta.style.transform = `translateX(${translateX}%) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`;
        
        // La tarjeta central tiene el z-index más alto para que no la tapen
        tarjeta.style.zIndex = total - Math.abs(offset);
        tarjeta.style.boxShadow = esCentro ? "0 10px 30px rgba(0,0,0,0.4)" : "0 4px 10px rgba(0,0,0,0.2)";
      });
    }

    function irA(nuevoIndice) {
      indice = Math.max(0, Math.min(total - 1, nuevoIndice));
      renderizar();
    }

    function alEmpezar(e) {
      arrastrando = true;
      inicioX = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
      pista.style.transition = "none";
    }

    function alMover(e) {
      if (!arrastrando) return;
      const xActual = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
      const desplazamiento = inicioX - xActual;

      if (desplazamiento > umbralArrastre) {
        irA(indice + 1);
        arrastrando = false; 
      } 
      else if (desplazamiento < -umbralArrastre) {
        irA(indice - 1);
        arrastrando = false;
      }
    }

    function alTerminar() {
      arrastrando = false;
      pista.style.transition = "";
    }

    pista.addEventListener("mousedown", alEmpezar);
    pista.addEventListener("mousemove", alMover);
    pista.addEventListener("mouseup", alTerminar);
    pista.addEventListener("mouseleave", alTerminar);

    pista.addEventListener("touchstart", alEmpezar, { passive: true });
    pista.addEventListener("touchmove", alMover, { passive: true });
    pista.addEventListener("touchend", alTerminar);

    renderizar();
  }
})();