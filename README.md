📄 1. README.md de mi-web (completo, listo para sustituir)
markdown
# 🧗 mi-web · Portfolio personal de Gabriel Vidal Badia

Web personal de marca con temática de escalada. Estudiante de 1º DAM en el IES Simarro (Xàtiva, Valencia), en transición desde el mantenimiento industrial hacia la programación, la IA y los agentes.

> *"Resolver problemas con el cuerpo, igual que con el código."*

🌐 **Web en directo:** https://gabi37smx.github.io/mi-web/

---

## 📖 ¿Qué es este proyecto?

Este repositorio contiene mi portfolio personal, construido desde cero como proyecto de la asignatura **Programación con IA** del ciclo de **Desarrollo de Aplicaciones Multiplataforma (DAM)**.

**No es una plantilla.** Es una web pensada, escrita y desplegada por mí, con:

- **Frontend en HTML, CSS y JavaScript puros** (sin frameworks, sin librerías externas).
- **Backend propio** en Node.js + Express, con base de datos MongoDB y envío de emails mediante Resend.
- **Despliegue real en producción:** GitHub Pages (frontend) y Render (backend).
- **Chatbot propio ("Cordada")** que responde por mí a los visitantes.
- **Página de noticias IA** que se actualiza a diario con titulares reales.
- **Mini-juego "Vía de bloques"** (Tetris con metáfora de escalada).
- **Vídeo demo** de 30 segundos donde enseño cómo trabajo con la IA.

Todo el proceso está versionado con Git a lo largo de **más de 40 commits**, con mensajes honestos que cuentan las decisiones tomadas.

---

## 🗺️ Secciones de la web

| Sección | Contenido |
| --- | --- |
| Hero | Presentación + efecto máquina de escribir + efecto magnético en el título |
| Sobre mí | Retrato, biografía, terminal animada con bucle de aprendizaje, **vídeo demo de cómo trabajo** |
| Lo que he hecho | Formación, experiencia, timeline temática ("movimientos de la vía") |
| Proyectos | Casos de proyecto con formato problema → solución → resultado |
| Certificaciones | 2 títulos oficiales + 5 certificaciones Cisco Networking Academy |
| Me gusta | Montaña, escalada, tecnología, IA, música + widget del tiempo en directo + zonas de escalada + actividad de GitHub |
| **Juego** | **Mini-juego "Vía de bloques"** (Tetris con metáfora de escalada, 3 idiomas, récord en localStorage) |
| Contacto | Formulario real conectado a backend, panel de administración |
| Noticias IA | Titulares reales sobre IA de la última semana, vía backend propio (GNews) |

---

## 🎨 Identidad visual propia

Todo el sistema visual está hecho a mano, sin librerías externas:

- **Logo SVG inline** (`logo-svg` en el header): usa `currentColor` para adaptarse al tema claro/oscuro. Animación al hover con `prefers-reduced-motion` respetado.
- **Favicon SVG propio** (`favicon.svg`): el mismo símbolo, escalado a 16×16 píxeles.
- **4 iconos SVG de la misma familia** (trazo 2px, esquinas redondeadas) para las áreas de trabajo: Escalada, Programación e IA, Mantenimiento, Redes y ciberseguridad.
- **Cursor personalizado**: mano abierta/cerrada según el contexto (hover sobre elementos interactivos). Se desactiva en móvil y con `prefers-reduced-motion`.
- **Barra lateral de escalada**: escalador SVG que sube por la vía conforme haces scroll, con presas que se iluminan al pasar por su sección.
- **Microinteracciones con intención**:
  - Aparición al scroll (marca el inicio de cada sección).
  - Hover de botones (indica "esto se pulsa").
  - Contador animado en las stats del hero (convierte un dato en un momento).
  - Todas respetan `prefers-reduced-motion`.

---

## 🎥 Vídeo demo · Así trabajo

En la sección "Sobre mí" hay un **vídeo de 30 segundos** donde le pido una mejora a la IA, la integro en mi web y compruebo el resultado en el navegador.

- **Peso final**: 1,46 MB (comprimido con HandBrake, H.264, CRF 28, Optimize for Web).
- **Póster**: `media/poster.webp` (35 KB, WebP).
- **Atributos del `<video>`**: `controls`, `preload="none"`, `poster`, `playsinline`, `fetchpriority="high"`.
- **Sin audio** → sin subtítulos (justificado en la defensa).
- **Póster precargado** con `<link rel="preload" as="image">` para mejorar el LCP.

Lo que enseña el vídeo:
1. Le pido a la IA un mini-juego (el "Vía de bloques") con requisitos concretos.
2. La IA me devuelve el código y yo lo integro.
3. Compruebo en el navegador que funciona: muevo piezas, cierro líneas, subo de grado.

No es un vídeo promocional ni un tutorial. Es una **muestra del proceso de trabajo**.

---

## 🎮 Juego "Vía de bloques"

Un mini-juego tipo Tetris con metáfora de escalada que vive en la sección "Juego" del portfolio.

**Cómo funciona:**
- Encajas piezas, cierras líneas y subes de grado de escalada: **4 → 5 → 5+ → 6a → 6a+ → 6b → 6b+ → 6c → 6c+ → 7a → 7a+ → 7b**.
- Cada 5 líneas cerradas subes de grado. La gravedad aumenta con el grado.
- **Récord persistente** en `localStorage`.
- **Bolsa de 7 piezas** (reparto justo, sin aleatoriedad pura).
- **Fantasma de la pieza** (proyección al suelo) para planificar la caída.
- **Pausa automática** al perder el foco o al salir de la sección.

**Controles:**
- **Teclado**: `←` `→` mover, `↑` girar, `↓` bajar, `Espacio` caer del todo, `P` pausa.
- **Táctil**: botones en pantalla con repetición al mantener pulsado.
- **Botón de reinicio** (pide confirmación si hay partida en curso).

**Accesibilidad:**
- Textos en 3 idiomas (ES/VA/EN) con sistema propio de i18n.
- `aria-live` para anunciar cambios de estado.
- `aria-label` dinámico en el canvas con los marcadores actuales.
- **Respeta `prefers-reduced-motion`**: sin flash de línea, sin animación de toast, botones sin "hundirse".

**Fichero único**: `juego.js` (~9 KB). Sin librerías, sin red, todo dentro.

---

## 🤖 Chatbot "Cordada"

El chatbot Cordada es el asistente flotante que aparece en la esquina inferior derecha de las 4 páginas del portfolio. Responde a los visitantes sobre mí, mis estudios, mis proyectos y cómo contactarme.

### Cómo funciona (arquitectura de dos capas)

- **Capa 1 · IA externa (cuando está disponible):** La pregunta viaja al backend, que la envía a una API de IA externa. La IA genera una respuesta natural basada en mis instrucciones (`INSTRUCCIONES` en `chatbot.js`).
- **Capa 2 · Árbol de decisión (plan B, siempre activo):** Si la IA falla (timeout, error HTTP, servicio caído), el chatbot responde con frases literales escritas por mí, organizadas en **9 temas**: identidad, estudios, experiencia, proyectos, tecnologías, escalada, certificaciones, contacto e idiomas. Para preguntas fuera de esos temas, remite al canal de contacto.

**Ventajas de este diseño:**
- **Resiliencia:** el chatbot no depende de ninguna API externa para funcionar.
- **Privacidad:** la conversación vive solo en el navegador del visitante, nunca en el servidor.
- **Control:** el mensaje "no sé la respuesta" remite al contacto real.

### Ficheros del chatbot

| Fichero | Ubicación | Función |
| --- | --- | --- |
| `chatbot.js` | `mi-web/` | Frontend del chat (burbuja, panel, lógica, árbol) |
| `routes/chat.js` | `portfolio-backend/` | Proxy del backend (rate limit, caché, validación) |

### Aprendizajes del desarrollo

Durante el desarrollo del chatbot, dos APIs gratuitas de IA dejaron de funcionar:

- **Pollinations** (`text.pollinations.ai`) → cerró su endpoint legacy con error 500 ENOSPC.
- **KeylessAI** (`keylessai.thryx.workers.dev`) → el dominio dejó de existir (DNS_PROBE_FINISHED_NXDOMAIN).

**Conclusión:** los servicios gratuitos de IA no son fiables. Por eso el chatbot está diseñado con el árbol de decisión como base, y la IA como capa opcional. Cuando haya un servicio fiable disponible, se conectará sin tocar el árbol.

---

## 📰 Noticias IA

La página `noticias.html` muestra los últimos artículos sobre inteligencia artificial publicados en la última semana. Funcionalidad añadida en la versión **v26**.

### Cómo funciona

- El frontend llama al **backend propio** (`/api/news/ai`), nunca directamente a GNews.
- El backend consulta GNews, filtra por idioma `es`, ventana de 7 días, orden por fecha y limita a 10 resultados.
- El backend cachea la respuesta durante **30 minutos**.
- Cada titular abre el **artículo original** en una pestaña nueva.
- Si el backend falla o GNews no responde, se muestra "No hay noticias disponibles" sin romper la página.

### Detección de entorno

`noticias.js` detecta automáticamente dónde se está sirviendo la página:

- Si `location.hostname` es `localhost` o `127.0.0.1` → llama a `http://localhost:3000/api/news/ai`.
- Si no → llama a `https://portfolio-backend-m07q.onrender.com/api/news/ai`.

Sin tocar el código entre entornos. La web en producción y el desarrollo local funcionan igual.

### ⚠️ Servir por HTTP en local

El navegador bloquea `fetch()` cuando la página se abre como `file://`. Para probar el widget en local:

```bash
cd mi-web
python3 -m http.server 5500
# o Live Server de VS Code
Y abrir http://localhost:5500/noticias.html. Si abres el HTML como fichero local, verás "No se pudieron cargar las noticias".

🌐 APIs externas consumidas
El frontend consume directamente o a través del backend:

API	Uso	Dónde se usa
Open-Meteo	Tiempo actual + geocoding	Widget del tiempo (Me gusta)
OpenBeta (vía backend)	Zonas de escalada por ciudad	Widget del tiempo (Me gusta)
GitHub API (vía backend)	Actividad pública de repos	Sección "Me gusta"
Backend propio (vía /api/chat)	Proxy del chatbot Cordada	Chatbot flotante
Backend propio (vía /api/news/ai)	Proxy de GNews	Página "Noticias IA"
📁 Estructura de ficheros
Frontend (mi-web)
text
mi-web/
├── index.html              ← Página principal (portfolio)
├── contacto.html           ← Página de contacto con formulario
├── proyectos.html          ← Página de proyectos con casos y filtros
├── presentacion.html       ← Página de QR para presentar en clase
├── noticias.html           ← Página de noticias IA (v26)
├── style.css               ← Hoja de estilos completa (variables, temas, animaciones)
├── script.js               ← Interacciones (tema, cursor, escalada, formulario, proyectos)
├── language.js             ← Sistema de traducción ES/VA/EN
├── chatbot.js              ← Chatbot Cordada (burbuja, panel, árbol de decisión)
├── noticias.js             ← Widget de noticias IA (v26)
├── juego.js                ← Mini-juego "Vía de bloques" (v27)
├── favicon.svg             ← Favicon propio en SVG
├── notas.txt               ← Notas del proyecto (instrucciones del bot, pruebas trampa)
├── media/
│   ├── demo.mp4            ← Vídeo demo de 30 s (Tutorial 4)
│   └── poster.webp         ← Póster del vídeo (WebP, 35 KB)
├── image/
│   ├── gabriel.webp        ← Retrato personal (WebP, 45 KB)
│   ├── gabriel-560.webp    ← Retrato en resolución pequeña (WebP, 18 KB)
│   ├── escalada-roca.webp  ← Foto escalando en roca (WebP)
│   └── qr-web.webp         ← QR personalizado (WebP)
├── .nojekyll               ← Evita el procesado de Jekyll en GitHub Pages
├── .gitignore              ← Ficheros que nunca deben subirse
└── README.md               ← Este archivo
Backend (portfolio-backend, repo separado)
text
portfolio-backend/
├── models/Message.js       ← Esquema de MongoDB para mensajes del formulario
├── models/Passkey.js       ← Esquema de credenciales WebAuthn
├── routes/contact.js       ← Rutas API del formulario + logs
├── routes/passkey.js       ← Endpoints de WebAuthn (passkeys)
├── routes/chat.js          ← Proxy del chatbot (rate limit, caché, validación)
├── routes/news.js          ← Proxy de noticias IA con GNews (v12)
├── routes/climbing.js      ← Zonas de escalada (OpenBeta)
├── routes/github.js        ← Actividad de GitHub
├── middleware/auth.js      ← Autenticación del panel admin
├── server.js               ← Servidor Express principal
├── logger.js               ← Winston (consola + MongoDB)
├── loadEnv.js              ← Carga de variables de entorno
├── admin.html              ← Panel de administración con estética topo
├── package.json            ← Dependencias y scripts
├── .env.example            ← Plantilla de variables (sin secretos)
└── .gitignore              ← Evita subir .env y node_modules
🏗️ Decisiones de arquitectura (ADR)
Un ADR (Architecture Decision Record) es un documento breve que explica por qué se tomó una decisión técnica. Estos son los cinco ADR de este proyecto.

ADR 1 · Frontend y backend en repositorios separados
Situación. La web necesitaba tener un formulario real con backend, pero también debía publicarse como web estática y gratuita en internet. GitHub Pages solo sirve archivos estáticos.

Decisión. Separar el proyecto en dos repositorios:

mi-web (frontend estático) → desplegado en GitHub Pages.

portfolio-backend (backend Node.js) → desplegado en Render.

Consecuencia. Cada parte se despliega de forma independiente: cambiar el backend no toca el frontend y viceversa. Evita subir código sensible al mismo repo donde vive la web pública. El coste es mantener dos repositorios coordinados.

ADR 2 · Stack del backend: Node.js + Express + MongoDB + Resend
Situación. Necesitaba un backend que recibiera mensajes del formulario, los guardara y me avisara por email. No había hecho nunca un backend y necesitaba algo que pudiera aprender rápido y desplegar gratis.

Decisión. Elegí:

Node.js + Express por ser el estándar de la industria.

MongoDB Atlas porque el plan gratuito (512 MB) es suficiente y su esquema flexible encaja con un formulario.

Resend para emails, porque su plan gratuito (3.000 emails/mes) es suficiente y su API es de las más sencillas.

Consecuencia. Tener un backend real en un portfolio me diferencia del 90 % de la clase. El coste: MongoDB Atlas y Render en plan gratuito tienen limitaciones (Render duerme el servicio tras 15 min sin uso, tardando ~30 s en la primera petición).

ADR 3 · Sistema de traducción propio en lugar de librería externa
Situación. Quería que la web estuviera disponible en tres idiomas (castellano, valenciano e inglés).

Decisión. Escribir un sistema propio en language.js que recorre el DOM, traduce nodos de texto y atributos, y persiste la selección en localStorage. No usé ninguna librería como i18next.

Consecuencia. El sistema pesa solo ~40 KB y entiendo cómo funciona por dentro. El coste: no cubre casos complejos (pluralización, fechas), pero para este proyecto es suficiente. El chatbot reutiliza este mismo patrón (data-i18n + recorrido del DOM) para traducirse al instante al cambiar de idioma.

ADR 4 · Chatbot con árbol de decisión como base, IA como capa opcional
Situación. Quería añadir un chatbot al portfolio, pero las APIs gratuitas de IA son inestables. Durante el desarrollo, dos servicios gratuitos dejaron de funcionar (Pollinations, KeylessAI).

Decisión. Diseñar el chatbot con dos capas independientes:

Capa IA (opcional): consulta una API externa para generar respuestas naturales.

Capa árbol (base): frases literales escritas por mí, organizadas en 9 temas.

Si la IA falla, el chatbot cae automáticamente al árbol. El usuario nunca ve un error.

Consecuencia.

✅ El chatbot funciona siempre, aunque la IA externa esté caída.

✅ Las 10 pruebas trampa del proyecto se superaron en modo árbol (10/10 APTO).

✅ En la defensa puedo explicar la arquitectura con datos reales: "Durante el desarrollo, dos APIs de IA fallaron. El árbol las cubrió. Esto valida el diseño."

⚠️ Las respuestas del árbol son menos variadas que las de la IA. Pero son honestas y controladas.

Este es el enfoque que usan los productos serios: plan B siempre activo, IA como mejora, no como dependencia.

ADR 5 · Widget de noticias IA con GNews tras descartar GDELT y Horizon
Situación. Quería añadir una sección de noticias de IA con titulares reales y enlace al artículo original. La primera idea fue reutilizar alguna API gratuita de noticias, pero las tres opciones iniciales fallaron:

GDELT DOC 2.0: devuelve artículos reales, pero su infraestructura legacy está saturada. Aplica un rate limit de 1 petición cada 5 segundos y en pruebas desde red compartida (instituto) bloqueó casi todas las peticiones.

Horizon AI Intelligence: especializada en IA, sin API key, pero su endpoint público devuelve "movers" (empresas y modelos con momentum) sin URLs de artículos. Los clics acababan en búsquedas de Google, no en noticias reales.

NewsMCP: sin API key y sin límite, pero sin categoría "IA" (habría que filtrar por palabras clave, con falsos positivos).

Decisión. Usar GNews API con el plan de estudiante:

1.000 peticiones/día gratuitas (vs 100 del plan normal).

Devuelve title, url, source.name y publishedAt reales.

Filtro de idioma (lang=es), ventana temporal (from = últimos 7 días) y orden por fecha.

CORS habilitado para todos los orígenes (aunque no lo necesitamos porque va por el backend).

Consecuencia. El widget muestra noticias reales, en español, actualizadas a diario, con enlace directo al artículo. La caché de 30 minutos convierte 1.000 peticiones/día en margen más que suficiente. Si GNews falla, el fallback silencioso mantiene la web intacta. Toda la decisión queda documentada aquí, incluidas las alternativas descartadas y por qué.

🚀 Cómo se publica
Frontend → GitHub Pages
Rama publicada: main

Carpeta: raíz (/)

URL final: https://gabi37smx.github.io/mi-web/

Fichero .nojekyll: en la raíz. Desactiva el procesador Jekyll que GitHub Pages activa por defecto.

Cómo se activa: Settings → Pages → Deploy from a branch → main / (root) → Save.

Backend → Render
Servicio: portfolio-backend en https://render.com

Build Command: npm install

Start Command: npm start

Variables de entorno: configuradas en el panel de Render (ALLOWED_ORIGIN, GNEWS_API_KEY, etc.)

URL: https://portfolio-backend-m07q.onrender.com

🕰️ Historial de versiones
Versión	Descripción
v1	Primera web: estructura semántica básica
v2	Cursor personalizado con dos círculos
v3	Efecto magnético en el título del hero
v4	Barra de escalada, cursor mano y grados V
v5	Formulario de contacto
v6	Certificaciones Cisco y títulos oficiales
v7	Rediseño del formulario y opción "Quiero que me llames"
v8	Foto personal en "Sobre mí" con layout de dos columnas
v9	Nueva estética topo, tipografía Space Grotesk
v10	Página de proyectos con filtros y sección preview en el index
v13	Backend online: formulario conectado a la API real
v14	Panel admin con estética topo y loader del botón del formulario
v15	LinkedIn en toda la web y selector de idiomas ES/VA/EN
v16	QR personalizado en el footer y página de presentación
v17	Proyecto en fase de idea: facturación para electricistas
v18	Widget del tiempo en vivo con selector de ciudad (Open-Meteo)
v19	Terminal que se escribe sola en "Sobre mí"
v20	Casos de proyecto con problema, solución y resultado
v20.1	Perf: reduce pesos de fuente y aplaza los scripts (Lighthouse ≥94)
v21	Selección y detalles de zonas de escalada
v21.1	Cabecera roca/rocódromo según el tiempo
v22	Zonas de escalada con enlaces a theCrag y 27crags
v22.1	Render con búsqueda directa y enlaces theCrag/27crags
v22.2	Mensaje más honesto y añade TheTopo a los enlaces
v23	Zonas de escalada con OpenBeta API (sustituye OpenStreetMap)
v24	Bloque de actividad de GitHub en la sección "Me gusta"
v25	Chatbot "Cordada": burbuja flotante, backend propio y árbol de decisión
v25.1	Chatbot disponible en las 4 páginas del portfolio
v25.2	Notas del chatbot: instrucciones y estructura del árbol en notas.txt
v25.3	Fix cursor personalizado en el chatbot + mejora del i18n en caliente
v25.4	Fix fallback del chatbot: mensaje correcto para "no sé" + rama identidad + pruebas trampa (10/10 APTO)
v26	Página de noticias IA: nueva página noticias.html, widget noticias.js, endpoint /api/news/ai con proxy a GNews, caché 30 min, enlace "Noticias IA" en el nav de las 5 páginas. Documenta ADR 5.
v27	Logo SVG propio con currentColor + hover con prefers-reduced-motion. El logo de la cabecera pasa a ser un SVG inline hecho a mano, con el color heredado del texto del menú. Animación sutil al hover (giro de 5°, elevación de 2px) que se desactiva si el sistema pide menos movimiento.
v28	Vídeo demo de 30 segundos en la sección "Sobre mí". Grabado con Xbox Game Bar, comprimido con HandBrake (H.264, CRF 28, Optimize for Web) de 80 MB a 1,46 MB. Póster extraído y optimizado a WebP (35 KB). Atributos del <video>: controls, preload="none", playsinline, fetchpriority="high".
v29	Traducciones del vídeo + centrado responsive. Añadidas las traducciones del figcaption y del aria-label del vídeo en los 3 idiomas (ES/VA/EN) en language.js. El contenedor .work-demo se centra con margin: 3rem auto y se adapta a móvil.
v30	Optimización de imágenes a WebP. El póster del vídeo (517 KB → 35 KB) y el QR del footer (.png → .webp) se convierten con Squoosh. Todas las referencias en index.html, contacto.html y presentacion.html se actualizan. El retrato ya estaba en WebP.
v31	Mini-juego "Vía de bloques". Tetris con metáfora de escalada, 3 idiomas, récord en localStorage, respeta prefers-reduced-motion. Integrado en index.html como sección "06 · Juego" con un <div id="juego-root">. Fichero único juego.js (9 KB, sin librerías).
v32	Fix 404 de juego.js + accesibilidad ARIA. El fichero estaba como Juego.js (con mayúscula) y GitHub Pages lo buscaba en minúscula → 404 en consola. Se renombró a juego.js. Se corrigieron los atributos aria-current (a page en vez de true) y el aria-labelledby de la sección del juego (añadido role="region"). También se corrigieron los aria-* de los filtros de proyectos.
v32.1 → v32.5	Iteración sobre el contraste del chip de proyectos. Lighthouse marcaba .project-preview__tag como contraste insuficiente (por debajo de 4.5:1 en modo claro). Se probaron 5 combinaciones de color/fondo hasta dar con la que pasa WCAG AA con valores literales (blanco #ffffff sobre rojo #c1272d, contraste 6.4:1). Aprendizaje: Lighthouse tiene un falso positivo con las variables CSS; no resuelve var(--accent) al calcular el contraste. Hay que usar valores literales para las parejas fondo/texto donde importa el contraste.
v32.6 → v32.7	Preload de fuentes + scripts diferidos. Las Google Fonts bloqueaban el render. Se precargan con <link rel="preload"> y se cargan sin bloquear con media="print" onload="this.media='all'". También se aplazan los scripts y se corrige el orden de carga.
v33	Rediseño de la cabecera + escalador v2 + presas que se iluminan. El nombre del logo pasa a una sola línea (antes ocupaba dos). El escalador de la barra lateral gana detalle: más cuerpo, más movimientos y animación al desplazarse. Las presas activas del rail lateral cambian de color al pasar por su sección. Todo respeta prefers-reduced-motion.
📊 Lighthouse final
Estado del portfolio en producción (gabi37smx.github.io/mi-web/):

Categoría	Nota	Objetivo rúbrica
Performance	91	≥90 ✅
Accessibility	97	≥90 ✅
Best Practices	100	≥90 ✅
SEO	100	— ✅
Métricas clave:

FCP: 1,6 s

LCP: 2,0 s

TBT: 0 ms

CLS: 0,01

Cambios que subieron la nota:

Convertir el póster del vídeo a WebP con Squoosh (517 KB → 35 KB).

Preload de Google Fonts sin bloquear el render.

fetchpriority="high" + <link rel="preload" as="image"> para el póster.

Valores literales de color en .project-preview__tag (Lighthouse no resuelve variables CSS).

Avisos ignorados conscientemente:

Minify CSS/JS: la rúbrica premia el código legible para la defensa.

Cache lifetimes: GitHub Pages no permite configurar cabeceras.

CSP/HSTS/COOP: son config del servidor; GitHub Pages no las permite.

🙏 Créditos
Retrato personal: fotografía propia.

Icono de escalador (barra lateral): inspirado en referencias de SVGRepo, adaptado y modificado por mí.

Icono de nudo (chatbot): SVG dibujado a mano, inspirado en el nudo en ocho de escalada.

Emojis: tipos estándar del sistema.

Tipografías: Space Grotesk, Inter y JetBrains Mono, todas de Google Fonts.

API del tiempo: Open-Meteo, gratuita y sin clave API.

API de noticias: GNews, plan de estudiante, 1.000 peticiones/día.

Compresión de vídeo: HandBrake (open source).

Optimización de imágenes: Squoosh (open source, se ejecuta en el navegador).

👤 Autor
Gabriel Vidal Badia

🎓 1º DAM · IES Simarro (Xàtiva, Valencia)

💼 Técnico Superior en Sistemas de Telecomunicación e Informáticos · CFGM SMR · 11 años de experiencia en mantenimiento industrial

🏅 Certificaciones Cisco: CCNA Intro, Ciberseguridad, Junior Cybersecurity Analyst Career Path

🎯 Enfoque: programación, inteligencia artificial y agentes

📫 Contacto: gabvidbad@alu.edu.gva.es

🐙 GitHub: @gabi37smx

💼 LinkedIn: gabriel-vidal-badia

📄 Licencia
Proyecto personal con fines educativos. Todos los derechos reservados.

Última actualización: 8 de octubre de 2026.
