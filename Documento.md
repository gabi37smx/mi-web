# Prompts clave · Juego en móvil (17 oct 2026)

Órdenes que di a la IA (Claude) para adaptar "Vía al Cielo" al móvil, con el resultado y el commit donde quedó.

## 1 · Joystick táctil en lugar de dos botones

**Orden (resumida):** en la versión móvil, en vez de tres botones (saltar, izquierda, derecha), quiero que izquierda y derecha sean un solo control tipo joystick: mantengo el dedo y, si lo desplazo a la derecha, Steve va a la derecha; si lo desplazo a la izquierda, a la izquierda, sin levantar el dedo. Solo en móvil, y que funcione en Android e iOS sin romper nada.

**Decisión de la IA:** Pointer Events con `setPointerCapture` (funciona igual en Android e iOS), zona muerta del 20 %, salto en botón aparte para poder mover y saltar a la vez.

**Resultado:** commit `v:36.13 arreglo botones desplazamiento por yoistic`.

## 2 · Pantalla completa en iOS

**Orden:** en iPhone no permite pantalla completa; ¿se puede arreglar sin romper nada?

**Decisión de la IA:** Safari en iPhone no admite la Fullscreen API para elementos, así que se simula con `position: fixed` (clase `pseudo-fs`) que ocupa la ventana visible, bloquea el scroll de la página y oculta el chatbot flotante. En Android y escritorio se mantiene la pantalla completa real.

**Resultado:** commit `v:36.14 arreglo pantalla completa ios`.

## 3 · Botones ☰ y ✕ dentro del canvas

**Orden:** en iOS los botones de menú y de cerrar tapan la vida y la información del juego; quiero que estén dentro de la pantalla del juego, uno en la esquina superior izquierda y otro en la superior derecha.

**Decisión de la IA:** anclar los botones a las esquinas del canvas calculando su posición con `getBoundingClientRect` y `ResizeObserver` (variables CSS `--fl-top`, `--fl-left`, `--fl-right`), de modo que se recolocan al girar el móvil o al cambiar el tamaño.

**Resultado:** commit `v:36.15 arreglo botones salir y pantalla completa dentro del juego, para que no tapen datos del juego`.

## 4 · Mejorar Lighthouse sin romper nada

**Orden:** ¿mejoramos o lo dejamos así? (Rendimiento 90 en móvil, Moto G Power con 4G lenta).

**Decisión de la IA:** el 90 cumple el mínimo pero va justo. Dos cambios seguros: (1) los 12 fondos de ciudad (~3 MB) dejan de pedirse al cargar la página y se piden cuando el juego está a 600 px de entrar en pantalla o al primer toque; (2) las Google Fonts del `index.html` dejan de bloquear el primer pintado (mismo patrón que `proyectos.html`).

**Resultado:** commit `v:36.16 arreglo lighthouse`.