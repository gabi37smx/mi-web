# 🧗 mi-web · Portfolio personal de Gabriel Vidal Badia

Web personal de marca con temática de escalada. Estudiante de 1º DAM en el IES Simarro (Xàtiva, Valencia), en transición desde el mantenimiento industrial hacia la programación, la IA y los agentes.

> *"Resolver problemas con el cuerpo, igual que con el código."*

🌐 **Web en directo:** https://gabi37smx.github.io/mi-web/
🔧 **Backend (repo separado):** https://github.com/gabi37smx/portfolio-backend

---

## 📖 ¿Qué es este proyecto?

Este repositorio contiene mi portfolio personal, construido desde cero como proyecto de la asignatura **Programación con IA** del ciclo de **Desarrollo de Aplicaciones Multiplataforma (DAM)**.

**No es una plantilla.** Es una web pensada, escrita y desplegada por mí, con:

- **Frontend en HTML, CSS y JavaScript puros** (sin frameworks, sin librerías externas).
- **Backend propio** en Node.js + Express, con base de datos MongoDB y envío de emails.
- **Despliegue real en producción:** GitHub Pages (frontend) y Render (backend).
- **Chatbot propio ("Cordada")** que responde por mí y tiene un plan B si la IA falla.
- **Página de noticias IA** que se actualiza a diario con titulares reales.
- **Juego "Vía al Cielo"**: plataformas con 17 pantallas (cuevas, grietas y 12 ciudades del mundo).
- **Vídeo demo** de 35 segundos con subtítulos.
- **4 skins visuales conmutables** (topo, omarchy, minecraft, matrix) y 3 idiomas (ES/VA/EN).

Todo el proceso está versionado con Git a lo largo de **más de 120 commits**, con mensajes honestos que cuentan las decisiones tomadas.

---

## 🗺️ Secciones de la web

| Sección | Contenido |
| --- | --- |
| Hero | Presentación + efecto máquina de escribir + efecto magnético en el título |
| Sobre mí | Retrato, biografía, terminal animada con bucle de aprendizaje, **vídeo demo con subtítulos** |
| Lo que he hecho | Formación, experiencia, timeline temática ("movimientos de la vía") |
| Proyectos | Casos de proyecto con formato problema → solución → resultado |
| Certificaciones | 2 títulos oficiales + 5 certificaciones Cisco Networking Academy |
| Me gusta | Montaña, escalada, tecnología, IA, música + widget del tiempo en directo + zonas de escalada + actividad de GitHub |
| Juego | **"Vía al Cielo"** (17 pantallas, 3 idiomas, récord en localStorage) |
| Contacto | Formulario real conectado a backend, panel de administración |
| Noticias IA | Titulares reales sobre IA de la última semana, vía backend propio (GNews) |

---

## 🎨 Identidad visual propia

Todo el sistema visual está hecho a mano, sin librerías externas:

- **Logo SVG inline** (`logo-svg` en el header): usa `currentColor` para adaptarse al tema claro/oscuro. Animación al hover con `prefers-reduced-motion` respetado.
- **Favicon SVG propio** (`favicon.svg`): el mismo símbolo, escalado a 16×16 píxeles.
- **4 iconos SVG de la misma familia** (trazo 2px, esquinas redondeadas) para las áreas de trabajo.
- **Cursor personalizado**: mano abierta/cerrada (topo/omarchy), espada de diamante (minecraft) o bloque de terminal (matrix). Se desactiva en móvil y con `prefers-reduced-motion`.
- **Barra lateral de escalada**: escalador SVG que sube por la vía conforme haces scroll.
- **Microinteracciones con intención**:
  - Aparición al scroll (marca el inicio de cada sección).
  - Hover de botones (indica "esto se pulsa").
  - Contador animado en las stats del hero (convierte un dato en un momento).
  - Todas respetan `prefers-reduced-motion`.

---

## 🎥 Vídeo demo · Así trabajo

En la sección "Sobre mí" hay un **vídeo de 35 segundos** (sin sonido) que recorre el portfolio: el asistente Cordada respondiendo, las noticias de IA, los proyectos, la experiencia y el juego "Vía al Cielo". Cierra con mi forma de trabajar: pedir, integrar, probar e iterar.

- **Formato**: 1920×1080, H.264, aprox. 1 MB (comprimido con HandBrake, CRF 28, Optimize for Web).
- **Póster**: `media/poster.webp`.
- **Atributos del `<video>`**: `controls`, `preload="none"`, `poster`, `playsinline`, `width`, `height`.
- **Accesibilidad**: como no tiene audio, lleva una pista de subtítulos descriptivos en español (`media/demo.vtt`, `<track kind="captions" srclang="es" default>`) y un `aria-label` y un pie de vídeo traducidos a ES/VA/EN.

---

## 🎮 Juego "Vía al Cielo"

Un juego de plataformas vertical con temática de escalada que vive en la sección "Juego" del portfolio.

**Cómo funciona:**
- Sube por 17 pantallas distintas: 4 de cueva/grieta, 1 de aire libre y 12 ciudades del mundo (Valencia, Madrid, París, Londres, Nueva York, Roma, El Cairo, Tokio, Río, Sídney, Marrakech y Machu Picchu).
- Cada pantalla tiene 220 m de altura y fondos ilustrados (1080x1920) que se recorren al subir.
- Recoge los 3 fragmentos de código para recuperar vida.
- Animales propios de cada zona (murciélagos, osos, gallos, canguros, llamas...) que te quitan vida si te tocan.
- **Récord persistente** en `localStorage`.
- **Controles**: teclado (flechas, A/D, W/Espacio para doble salto) y móvil (joystick táctil + botón de salto).
- **Joystick táctil** (móvil): mantienes el dedo y deslizas a izquierda o derecha sin levantarlo. Usa Pointer Events con `setPointerCapture`, así que funciona igual en Android e iOS, y permite mover y saltar a la vez (multitáctil).
- **Pantalla completa también en iPhone**: Safari de iPhone no admite la Fullscreen API en elementos, así que se simula con `position: fixed` (clase `pseudo-fs`). En Android y escritorio se usa la pantalla completa real.
- **Botones ☰ (menú) y ✕ (salir)** anclados a las esquinas del canvas con `ResizeObserver`, para que no tapen el marcador ni la barra de vida.
- **Rendimiento**: el bucle del juego solo corre cuando la sección entra en pantalla (`IntersectionObserver`) y los 12 fondos (~3 MB) no se piden al cargar la página, sino cuando el juego está a 600 px de verse o al primer toque.

**Fichero único**: `juego-escalada.js`. Sin librerías, sin red, todo dentro.

---

## 🤖 Chatbot "Cordada"

El chatbot Cordada es el asistente flotante que aparece en la esquina inferior derecha. Responde a los visitantes sobre mí, mis estudios, mis proyectos y cómo contactarme.

### Cómo funciona (arquitectura de dos capas)

- **Capa 1 · IA externa (cuando está disponible):** La pregunta viaja al backend, que la envía a una API de IA externa. La IA genera una respuesta natural basada en mis instrucciones.
- **Capa 2 · Árbol de decisión (plan B, siempre activo):** Si la IA falla (timeout, error HTTP, servicio caído), el chatbot responde con frases literales escritas por mí, organizadas en 9 temas: identidad, estudios, experiencia, proyectos, tecnologías, escalada, certificaciones, contacto e idiomas.

**Ventajas de este diseño:**
- **Resiliencia:** el chatbot no depende de ninguna API externa para funcionar.
- **Privacidad:** la conversación vive solo en el navegador del visitante.
- **Control:** el mensaje "no sé la respuesta" remite al contacto real.

---

## 🌐 APIs externas consumidas

El frontend consume directamente o a través del backend:

| API | Uso | Dónde se usa |
| --- | --- | --- |
| Open-Meteo | Tiempo actual + geocoding | Widget del tiempo (Me gusta) |
| OpenBeta (vía backend) | Zonas de escalada por ciudad | Widget del tiempo (Me gusta) |
| GitHub API (vía backend) | Actividad pública de repos | Sección "Me gusta" |
| Backend propio (vía /api/chat) | Proxy del chatbot Cordada | Chatbot flotante |
| Backend propio (vía /api/news/ai) | Proxy de GNews | Página "Noticias IA" |

---

## 🏗️ Decisiones de arquitectura (ADR)

Un ADR (Architecture Decision Record) es un documento breve que explica por qué se tomó una decisión técnica.

**ADR 1 · Frontend y backend en repositorios separados.**
- *Situación.* La web necesitaba tener un formulario real, pero debía publicarse como web estática en GitHub Pages.
- *Decisión.* Separar en dos repositorios: `mi-web` (estático, GitHub Pages) y `portfolio-backend` (Node.js, Render).
- *Consecuencia.* Cada parte se despliega de forma independiente. Evita subir código sensible al repo público. El coste es mantener dos repositorios coordinados.

**ADR 2 · Stack del backend: Node.js + Express + MongoDB + Resend.**
- *Situación.* Necesitaba un backend que recibiera mensajes, los guardara y me avisara por email.
- *Decisión.* Node.js + Express (estándar), MongoDB Atlas (esquema flexible, plan gratuito) y Resend (emails fáciles).
- *Consecuencia.* Tener un backend real en un portfolio me diferencia del 90 % de la clase. Limitación: Render duerme el servicio tras 15 min sin uso.

**ADR 3 · Sistema de traducción propio en lugar de librería externa.**
- *Situación.* Quería que la web estuviera disponible en tres idiomas (ES/VA/EN).
- *Decisión.* Escribir un sistema propio en `language.js` que recorre el DOM y traduce textos y atributos, guardando la selección en `localStorage`.
- *Consecuencia.* El sistema pesa solo ~40 KB y entiendo cómo funciona por dentro. El chatbot reutiliza este mismo patrón.

**ADR 4 · Chatbot con árbol de decisión como base, IA como capa opcional.**
- *Situación.* Las APIs gratuitas de IA son inestables. Dos servicios gratuitos dejaron de funcionar durante el desarrollo.
- *Decisión.* Diseñar el chatbot con dos capas independientes: capa IA (opcional) y árbol de decisión (base).
- *Consecuencia.* El chatbot funciona siempre, aunque la IA esté caída. En la defensa puedo explicar con datos reales que el árbol cubrió las caídas.

**ADR 5 · Widget de noticias IA con GNews tras descartar GDELT y Horizon.**
- *Situación.* Quería mostrar titulares reales de IA.
- *Decisión.* Usar GNews API con el plan de estudiante (1.000 peticiones/día). Caché de 30 minutos en el backend.
- *Consecuencia.* El widget muestra noticias reales, en español, actualizadas a diario. Si GNews falla, el fallback silencioso mantiene la web intacta.

**ADR 6 · Una sola imagen vertical por ciudad en el juego.**
- *Situación.* El motor del juego necesitaba fondos de ciudad que se recorrieran al subir.
- *Decisión.* Usar una única imagen vertical (1080x1920) recorrida de abajo a arriba, en lugar de dos imágenes con crossfade.
- *Consecuencia.* Menos peso (la mitad de peticiones por ciudad), menos código y menos fallos visuales. Las 12 imágenes se piden en diferido: no al cargar la página, sino cuando el juego está a 600 px de entrar en pantalla (o al primer toque). Así no compiten con el CSS ni las fuentes en la carga inicial. Coste: si el visitante llega muy rápido al juego, los fondos pueden tardar un instante en aparecer (mientras tanto el juego usa solo el color de fondo).

**ADR 7 · El bucle del juego solo corre cuando es visible.**
- *Situación.* El `requestAnimationFrame` del juego consumía CPU incluso cuando el usuario estaba leyendo otras secciones.
- *Decisión.* Usar `IntersectionObserver` para arrancar el bucle solo cuando la sección `#juego` entra en el viewport, y pausarlo al salir.
- *Consecuencia.* Se elimina el bloqueo del hilo principal. En Lighthouse, el TBT bajó de 4830 ms a ~150 ms.

**ADR 8 · Scripts independientes y autocontenidos (IIFE).**
- *Situación.* La traducción ES/VA/EN, el cambio de skins y el chatbot se usan en varias páginas.
- *Decisión.* Cada uno vive en su propio fichero (`language.js`, `skin-picker.js`, `chatbot.js`) envuelto en una IIFE para no contaminar el ámbito global; `chatbot.js` y `skin-picker.js` inyectan su propia interfaz y estilos.
- *Consecuencia.* Se añaden a una página con una sola etiqueta `<script>` y no interfieren entre sí. Coste: la cabecera y el pie se repiten en cada HTML, porque es una web estática sin plantillas.

---

ADR 9 (opcional; va justo antes de "📊 Lighthouse"):

ADR 9 · Reforzar la seguridad del panel de administración del backend.

Situación. Durante una revisión de código asistida por IA se vio que el registro de passkeys no exigía sesión, que el login devolvía la contraseña del admin y que los límites de uso contaban por una IP interna del proxy de Render.
Decisión. Sesión con token firmado (8 h), registro de passkeys protegido, bloqueo de IP tras 8 intentos fallidos y una utilidad (utils/clientIp.js) que lee la IP real del visitante.
Consecuencia. La contraseña ya no viaja por la URL y los límites de uso se aplican por visitante. Quedan limitaciones documentadas (tokens sin revocación y contadores en memoria) en el informe del backend.

---

## 📊 Lighthouse

Medido sobre producción (gabi37smx.github.io/mi-web/, 18 oct 2026). Capturas en la carpeta [`docs/`](docs/).

| Perfil de medida | Rendimiento | Accesibilidad | Prácticas | SEO |
| --- | --- | --- | --- | --- |
| iPhone SE emulado (375x667) | 96 | 97 | 100 | 100 |
| Samsung Galaxy A55 emulado (360x800) | 98 | 97 | 100 | 100 |
| Escritorio (Surface Pro 10 emulado) | 97 | 97 | 100 | 100 |

*Nota: Lighthouse es una herramienta de simulación y sus resultados pueden variar ligeramente entre ejecuciones (se han registrado picos del 78 al 98 en escritorio por micro-pausas del sistema). El CLS (cambios de diseño) real es de 0.001, lo que garantiza una experiencia visual perfecta sin saltos.*

En cada informe, el último bloque indica con qué dispositivo se midió (por ejemplo "Moto G Power emulado"). Elegir "iPhone SE" o "Samsung" en la barra de dispositivos de Chrome cambia el tamaño de la ventana, pero Lighthouse mide con su propio perfil. Escribe en la tabla lo que ponga el pie y deja el 78 solo si lo capturaste de verdad (con su fecha).

**Mejoras aplicadas:**
- Bucle del juego solo cuando es visible (`IntersectionObserver`).
- Fondos del juego en diferido (3 MB menos en la carga inicial).
- Imágenes en WebP, fuentes sin bloquear el render y valores de contraste literales.
---

## 📁 Estructura de ficheros

```text
mi-web/
├── index.html · proyectos.html · contacto.html · presentacion.html · noticias.html
├── style.css               ← Estilos (variables, temas claro/oscuro, 4 skins)
├── script.js               ← Interacciones generales (tema, cursor, formulario, proyectos)
├── language.js             ← Sistema de traducción ES/VA/EN
├── skin-picker.js          ← Selector de skins (topo, omarchy, minecraft, matrix)
├── matrix-effects.js · omarchy-effects.js · easter-eggs.js   ← Efectos de cada skin
├── escalador.js            ← Escalador de la barra lateral
├── chatbot.js              ← Chatbot Cordada (burbuja, panel, árbol de decisión)
├── noticias.js             ← Widget de noticias IA
├── juego-escalada.js / .css ← Juego "Vía al Cielo"
├── favicon.svg
├── notas.txt               ← Instrucciones del bot, recorrido del dato y 10 pruebas trampa
├── prompts/                ← Órdenes clave a la IA, con resultado y commit
├── media/                  ← Vídeo demo, póster y subtítulos
├── image/                  ← Fotos (WebP), QR y fondos del juego
├── fonts/                  ← Tipografías de la skin Minecraft
├── .nojekyll · .gitignore
└── README.md
```

---

🧭 Proceso de trabajo
Commits: más de 120, con versión y decisión en el mensaje (v:36.15 arreglo botones salir y pantalla completa dentro del juego...).
Ramas: trabajo grande en rama (feature/skins-infraestructura, fix/mejoras-finales).
Issues: 8 issues planificados y cerrados (formulario, idiomas, QR, tiempo, terminal, casos, rendimiento y documentación final).
Pull requests: PR fusionada desde fix/mejoras-finales que cierra el issue #10 (documentación, subtítulos, capturas y registro de prompts).
Releases: v1 · Web publicada en Pages y v2.0 · Juego "Vía al Cielo" y skins.
Prompts archivados: carpeta prompts/ (muestra de 6 hitos) y notas.txt (instrucciones y pruebas del chatbot).
Seguridad: el backend tiene un informe propio en su repositorio (docs/auditoria-seguridad.md).
---

## 🚀 Cómo se publica

**Frontend → GitHub Pages**
- Rama publicada: `main`
- Carpeta: raíz (`/`)
- Fichero `.nojekyll`: en la raíz para desactivar el procesador Jekyll.
- URL final: https://gabi37smx.github.io/mi-web/

**Backend → Render**
- Servicio: `portfolio-backend` en https://render.com
- URL: https://portfolio-backend-m07q.onrender.com

---

## 🕰️ Historial de versiones

*El historial completo se puede consultar en la pestaña Commits del repositorio. Los mensajes siguen un esquema de versión semántica (vX.Y) y describen la decisión tomada.*

| Versión | Descripción |
| --- | --- |
| v1 | Primera web: estructura semántica básica |
| v2-v8 | Cursor personalizado, barra de escalada, formulario y foto personal |
| v13 | Backend online: formulario conectado a la API real |
| v15 | Selector de idiomas ES/VA/EN |
| v18 | Widget del tiempo en vivo (Open-Meteo) |
| v25 | Chatbot "Cordada" con backend propio y árbol de decisión |
| v26 | Página de noticias IA con proxy a GNews |
| v31 | Mini-juego "Vía de bloques" (Tetris) |
| v34 | 4 skins conmutables (topo, omarchy, minecraft, matrix) con selector, easter eggs y sonidos |
| v35-v36.12 | Juego "Vía al Cielo": pantallas, enemigos, ciudades, traducción ES/VA/EN y 17 pantallas |
| v36.13 | Joystick táctil en móvil (sustituye a los botones ← →) |
| v36.14 | Pantalla completa simulada en iPhone |
| v36.15 | Botones ☰ y ✕ dentro del canvas, sin tapar el marcador |
| v36.16 | Lighthouse: fondos del juego en diferido y fuentes sin bloquear |

---

## 👤 Autor

**Gabriel Vidal Badia**
- 🎓 1º DAM · IES Simarro (Xàtiva, Valencia)
- 🏅 Certificaciones Cisco: CCNA Intro, Ciberseguridad, Junior Cybersecurity Analyst Career Path
- 🎯 Enfoque: programación, inteligencia artificial y agentes
- 📫 Contacto: gabvidbad@alu.edu.gva.es
- 🐙 GitHub: @gabi37smx
- 💼 LinkedIn: gabriel-vidal-badia