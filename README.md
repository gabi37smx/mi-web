# 🧗 mi-web · Portfolio personal de Gabriel Vidal Badia

Web personal de marca con temática de escalada. Estudiante de **1º DAM** en el **IES Simarro** (Xàtiva, Valencia), en transición desde el mantenimiento industrial hacia la programación, la IA y los agentes.

> *"Resolver problemas con el cuerpo, igual que con el código."*

🌐 **Web en directo:** https://gabi37smx.github.io/mi-web/

---

## 📖 ¿Qué es este proyecto?

Este repositorio contiene mi portfolio personal, construido **desde cero** como proyecto de la asignatura *Programación con IA* del ciclo de **Desarrollo de Aplicaciones Multiplataforma (DAM)**.

No es una plantilla. Es una web pensada, escrita y desplegada por mí, con:

- **Frontend** en HTML, CSS y JavaScript puros (sin frameworks, sin librerías externas).
- **Backend** propio en Node.js + Express, con base de datos MongoDB y envío de emails mediante Resend.
- **Despliegue real** en producción: GitHub Pages (frontend) y Render (backend).
- **Chatbot propio** ("Cordada") que responde por mí a los visitantes.

Todo el proceso está versionado con Git a lo largo de más de 30 commits, con mensajes honestos que cuentan las decisiones tomadas.

---

## 🗺️ Secciones de la web

| Sección | Contenido |
|---|---|
| **Hero** | Presentación + efecto máquina de escribir + efecto magnético en el título |
| **Sobre mí** | Retrato, biografía, terminal animada con bucle de aprendizaje |
| **Lo que he hecho** | Formación, experiencia, timeline temática ("movimientos de la vía") |
| **Proyectos** | Casos de proyecto con formato problema → solución → resultado |
| **Certificaciones** | 2 títulos oficiales + 5 certificaciones Cisco Networking Academy |
| **Me gusta** | Montaña, escalada, tecnología, IA, música + widget del tiempo en directo |
| **Contacto** | Formulario real conectado a backend, panel de administración |

---

## 🤖 Chatbot "Cordada"

El chatbot **Cordada** es el asistente flotante que aparece en la esquina inferior derecha de las 4 páginas del portfolio. Responde a los visitantes sobre mí, mis estudios, mis proyectos y cómo contactarme.

### Cómo funciona (arquitectura de dos capas)

**Capa 1 · IA externa (cuando está disponible):**
La pregunta viaja al backend, que la envía a una API de IA externa. La IA genera una respuesta natural basada en mis instrucciones (`INSTRUCCIONES` en `chatbot.js`).

**Capa 2 · Árbol de decisión (plan B, siempre activo):**
Si la IA falla (timeout, error HTTP, servicio caído), el chatbot responde con frases literales escritas por mí, organizadas en 9 temas: identidad, estudios, experiencia, proyectos, tecnologías, escalada, certificaciones, contacto e idiomas. Para preguntas fuera de esos temas, remite al canal de contacto.

**Ventajas de este diseño:**
- **Resiliencia**: el chatbot no depende de ninguna API externa para funcionar.
- **Privacidad**: la conversación vive solo en el navegador del visitante, nunca en el servidor.
- **Control**: el mensaje "no sé la respuesta" remite al contacto real.

### Ficheros del chatbot

| Fichero | Ubicación | Función |
|---|---|---|
| `chatbot.js` | `mi-web/` | Frontend del chat (burbuja, panel, lógica, árbol) |
| `routes/chat.js` | `portfolio-backend/` | Proxy del backend (rate limit, caché, validación) |

### Aprendizajes del desarrollo

Durante el desarrollo del chatbot, **dos APIs gratuitas de IA dejaron de funcionar**:

1. **Pollinations** (`text.pollinations.ai`) → cerró su endpoint legacy con error 500 `ENOSPC`.
2. **KeylessAI** (`keylessai.thryx.workers.dev`) → el dominio dejó de existir (`DNS_PROBE_FINISHED_NXDOMAIN`).

**Conclusión**: los servicios gratuitos de IA no son fiables. Por eso el chatbot está diseñado con el árbol de decisión como base, y la IA como capa opcional. Cuando haya un servicio fiable disponible, se conectará sin tocar el árbol.

---

## 🌐 APIs externas consumidas

El frontend consume directamente o a través del backend:

| API | Uso | Dónde se usa |
|---|---|---|
| **Open-Meteo** | Tiempo actual + geocoding | Widget del tiempo (Me gusta) |
| **OpenBeta** (vía backend) | Zonas de escalada por ciudad | Widget del tiempo (Me gusta) |
| **GitHub API** (vía backend) | Actividad pública de repos | Sección "Me gusta" |
| **Backend propio** (vía `/api/chat`) | Proxy del chatbot Cordada | Chatbot flotante |

---

## 📁 Estructura de ficheros

### Frontend (`mi-web`)
mi-web/
├── index.html ← Página principal (portfolio)
├── contacto.html ← Página de contacto con formulario
├── proyectos.html ← Página de proyectos con casos y filtros
├── presentacion.html ← Página de QR para presentar en clase
├── style.css ← Hoja de estilos completa (variables, temas, animaciones)
├── script.js ← Interacciones (tema, cursor, escalada, formulario, proyectos)
├── language.js ← Sistema de traducción ES/VA/EN
├── chatbot.js ← Chatbot Cordada (burbuja, panel, árbol de decisión)
├── notas.txt ← Notas del proyecto (instrucciones del bot, pruebas trampa)
├── image/
│ ├── gabriel.webp ← Retrato personal (optimizado a WebP, 45 KB)
│ └── qr-web.png ← QR personalizado con mi foto
├── .nojekyll ← Evita el procesado de Jekyll en GitHub Pages
├── .gitignore ← Ficheros que nunca deben subirse
└── README.md ← Este archivo

text

### Backend (`portfolio-backend`, repo separado)
portfolio-backend/
├── models/Message.js ← Esquema de MongoDB para mensajes del formulario
├── models/Passkey.js ← Esquema de credenciales WebAuthn
├── routes/contact.js ← Rutas API del formulario + logs
├── routes/passkey.js ← Endpoints de WebAuthn (passkeys)
├── routes/chat.js ← Proxy del chatbot (rate limit, caché, validación)
├── routes/climbing.js ← Zonas de escalada (OpenBeta)
├── routes/github.js ← Actividad de GitHub
├── middleware/auth.js ← Autenticación del panel admin
├── server.js ← Servidor Express principal
├── logger.js ← Winston (consola + MongoDB)
├── loadEnv.js ← Carga de variables de entorno
├── admin.html ← Panel de administración con estética topo
├── package.json ← Dependencias y scripts
├── .env.example ← Plantilla de variables (sin secretos)
└── .gitignore ← Evita subir .env y node_modules

text

---

## 🏗️ Decisiones de arquitectura (ADR)

Un ADR (Architecture Decision Record) es un documento breve que explica **por qué** se tomó una decisión técnica. Estos son los cuatro ADR de este proyecto.

### ADR 1 · Frontend y backend en repositorios separados

**Situación.** La web necesitaba tener un formulario real con backend, pero también debía publicarse como web estática y gratuita en internet. GitHub Pages solo sirve archivos estáticos.

**Decisión.** Separar el proyecto en dos repositorios:
- `mi-web` (frontend estático) → desplegado en **GitHub Pages**.
- `portfolio-backend` (backend Node.js) → desplegado en **Render**.

**Consecuencia.** Cada parte se despliega de forma independiente: cambiar el backend no toca el frontend y viceversa. Evita subir código sensible al mismo repo donde vive la web pública. El coste es mantener dos repositorios coordinados.

---

### ADR 2 · Stack del backend: Node.js + Express + MongoDB + Resend

**Situación.** Necesitaba un backend que recibiera mensajes del formulario, los guardara y me avisara por email. No había hecho nunca un backend y necesitaba algo que pudiera aprender rápido y desplegar gratis.

**Decisión.** Elegí:
- **Node.js + Express** por ser el estándar de la industria.
- **MongoDB Atlas** porque el plan gratuito (512 MB) es suficiente y su esquema flexible encaja con un formulario.
- **Resend** para emails, porque su plan gratuito (3.000 emails/mes) es suficiente y su API es de las más sencillas.

**Consecuencia.** Tener un backend real en un portfolio me diferencia del 90 % de la clase. El coste: MongoDB Atlas y Render en plan gratuito tienen limitaciones (Render duerme el servicio tras 15 min sin uso, tardando ~30 s en la primera petición).

---

### ADR 3 · Sistema de traducción propio en lugar de librería externa

**Situación.** Quería que la web estuviera disponible en tres idiomas (castellano, valenciano e inglés).

**Decisión.** Escribir un sistema propio en `language.js` que recorre el DOM, traduce nodos de texto y atributos, y persiste la selección en `localStorage`. No usé ninguna librería como i18next.

**Consecuencia.** El sistema pesa solo ~40 KB y entiendo cómo funciona por dentro. El coste: no cubre casos complejos (pluralización, fechas), pero para este proyecto es suficiente. **El chatbot reutiliza este mismo patrón** (`data-i18n` + recorrido del DOM) para traducirse al instante al cambiar de idioma.

---

### ADR 4 · Chatbot con árbol de decisión como base, IA como capa opcional

**Situación.** Quería añadir un chatbot al portfolio, pero las APIs gratuitas de IA son inestables. Durante el desarrollo, dos servicios gratuitos dejaron de funcionar (Pollinations, KeylessAI).

**Decisión.** Diseñar el chatbot con **dos capas independientes**:
1. **Capa IA** (opcional): consulta una API externa para generar respuestas naturales.
2. **Capa árbol** (base): frases literales escritas por mí, organizadas en 9 temas.

Si la IA falla, el chatbot cae automáticamente al árbol. **El usuario nunca ve un error.**

**Consecuencia.**
- ✅ El chatbot funciona **siempre**, aunque la IA externa esté caída.
- ✅ Las 10 pruebas trampa del proyecto se superaron en modo árbol (10/10 APTO).
- ✅ En la defensa puedo explicar la arquitectura con datos reales: *"Durante el desarrollo, dos APIs de IA fallaron. El árbol las cubrió. Esto valida el diseño."*
- ⚠️ Las respuestas del árbol son menos variadas que las de la IA. Pero son **honestas y controladas**.

Este es el enfoque que usan los productos serios: **plan B siempre activo, IA como mejora, no como dependencia**.

---

## 🚀 Cómo se publica

### Frontend → GitHub Pages

- **Rama publicada:** `main`
- **Carpeta:** raíz (`/`)
- **URL final:** https://gabi37smx.github.io/mi-web/
- **Fichero `.nojekyll`:** en la raíz. Desactiva el procesador Jekyll que GitHub Pages activa por defecto.

**Cómo se activa:** `Settings → Pages → Deploy from a branch → main / (root) → Save`.

### Backend → Render

- **Servicio:** `portfolio-backend` en https://render.com
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Variables de entorno:** configuradas en el panel de Render
- **URL:** https://portfolio-backend-m07q.onrender.com

---

## 🕰️ Historial de versiones

| Versión | Descripción |
|---|---|
| v1 | Primera web: estructura semántica básica |
| v2 | Cursor personalizado con dos círculos |
| v3 | Efecto magnético en el título del hero |
| v4 | Barra de escalada, cursor mano y grados V |
| v5 | Formulario de contacto |
| v6 | Certificaciones Cisco y títulos oficiales |
| v7 | Rediseño del formulario y opción "Quiero que me llames" |
| v8 | Foto personal en "Sobre mí" con layout de dos columnas |
| v9 | Nueva estética topo, tipografía Space Grotesk |
| v10 | Página de proyectos con filtros y sección preview en el index |
| v13 | Backend online: formulario conectado a la API real |
| v14 | Panel admin con estética topo y loader del botón del formulario |
| v15 | LinkedIn en toda la web y selector de idiomas ES/VA/EN |
| v16 | QR personalizado en el footer y página de presentación |
| v17 | Proyecto en fase de idea: facturación para electricistas |
| v18 | Widget del tiempo en vivo con selector de ciudad (Open-Meteo) |
| v19 | Terminal que se escribe sola en "Sobre mí" |
| v20 | Casos de proyecto con problema, solución y resultado |
| v20.1 | Perf: reduce pesos de fuente y aplaza los scripts (Lighthouse ≥94) |
| v21 | Selección y detalles de zonas de escalada |
| v21.1 | Cabecera roca/rocódromo según el tiempo |
| v22 | Zonas de escalada con enlaces a theCrag y 27crags |
| v22.1 | Render con búsqueda directa y enlaces theCrag/27crags |
| v22.2 | Mensaje más honesto y añade TheTopo a los enlaces |
| v23 | Zonas de escalada con **OpenBeta API** (sustituye OpenStreetMap) |
| v24 | **Bloque de actividad de GitHub** en la sección "Me gusta" |
| **v25** | **Chatbot "Cordada"**: burbuja flotante, backend propio y árbol de decisión |
| **v25.1** | **Chatbot disponible en las 4 páginas** del portfolio |
| **v25.2** | Notas del chatbot: instrucciones y estructura del árbol en `notas.txt` |
| **v25.3** | **Fix cursor personalizado** en el chatbot + mejora del i18n en caliente |
| **v25.4** | **Fix fallback del chatbot**: mensaje correcto para "no sé" + rama identidad + pruebas trampa (10/10 APTO) |

---

## 🙏 Créditos

- **Retrato personal:** fotografía propia.
- **Icono de escalador (barra lateral):** inspirado en referencias de SVGRepo, adaptado y modificado por mí.
- **Icono de nudo (chatbot):** SVG dibujado a mano, inspirado en el nudo en ocho de escalada.
- **Emojis:** tipos estándar del sistema.
- **Tipografías:** [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk), [Inter](https://fonts.google.com/specimen/Inter) y [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono), todas de Google Fonts.
- **API del tiempo:** [Open-Meteo](https://open-meteo.com/), gratuita y sin clave API.

---

## 👤 Autor

**Gabriel Vidal Badia**

- 🎓 1º DAM · IES Simarro (Xàtiva, Valencia)
- 💼 Técnico Superior en Sistemas de Telecomunicación e Informáticos · CFGM SMR · 11 años de experiencia en mantenimiento industrial
- 🏅 Certificaciones Cisco: CCNA Intro, Ciberseguridad, Junior Cybersecurity Analyst Career Path
- 🎯 Enfoque: programación, inteligencia artificial y agentes
- 📫 Contacto: gabvidbad@alu.edu.gva.es
- 🐙 GitHub: [@gabi37smx](https://github.com/gabi37smx)
- 💼 LinkedIn: [gabriel-vidal-badia](https://www.linkedin.com/in/gabriel-vidal-badia-19122a43b)

---

## 📄 Licencia

Proyecto personal con fines educativos. Todos los derechos reservados.

---

*Última actualización: 4 de octubre de 2026.*

🎯 Qué destacan los nuevos READMEs
Frontend
✅ Sección "Chatbot Cordada" con arquitectura de dos capas.

✅ Tabla de APIs externas ampliada con el backend propio.

✅ ADR 4 sobre el diseño del chatbot.

✅ Estructura de ficheros actualizada.

✅ Historial de versiones v25 a v25.4.

✅ Créditos con el icono de nudo.