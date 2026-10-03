📄 README.md — completo
Sustituye tu README.md actual por este:

markdown
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

Todo el proceso está versionado con Git a lo largo de más de 20 commits, con mensajes honestos que cuentan las decisiones tomadas.

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

## 🌐 APIs externas consumidas

El frontend consume directamente o a través del backend:

| API | Uso | Dónde se usa |
|---|---|---|
| **Open-Meteo** | Tiempo actual + geocoding | Widget del tiempo (Me gusta) |
| **OpenBeta** (vía backend) | Zonas de escalada por ciudad | Widget del tiempo (Me gusta) |
| **GitHub API** (vía backend) | Actividad pública de repos | Sección "Me gusta" |

## 📁 Estructura de ficheros

### Frontend (`mi-web`)

```
mi-web/
├── index.html              ← Página principal (portfolio)
├── contacto.html           ← Página de contacto con formulario
├── proyectos.html          ← Página de proyectos con casos y filtros
├── presentacion.html       ← Página de QR para presentar en clase
├── style.css               ← Hoja de estilos completa (variables, temas, animaciones)
├── script.js               ← Interacciones (tema, cursor, escalada, formulario, proyectos)
├── language.js             ← Sistema de traducción ES/VA/EN
├── image/
│   ├── gabriel.webp        ← Retrato personal (optimizado a WebP, 45 KB)
│   └── qr-web.png          ← QR personalizado con mi foto
├── .nojekyll               ← Evita el procesado de Jekyll en GitHub Pages
├── .gitignore              ← Ficheros que nunca deben subirse
└── README.md               ← Este archivo
```

### Backend (`portfolio-backend`, repo separado)

```
portfolio-backend/
├── models/Message.js       ← Esquema de MongoDB para mensajes del formulario
├── routes/contact.js       ← Rutas API (POST formulario, GET mensajes, PATCH leído)
├── middleware/auth.js      ← Autenticación del panel admin
├── server.js               ← Servidor Express principal
├── loadEnv.js              ← Carga de variables de entorno antes que nada
├── admin.html              ← Panel de administración con estética topo
├── package.json            ← Dependencias y scripts
├── .env.example            ← Plantilla de variables (sin secretos)
└── .gitignore              ← Evita subir .env y node_modules
```

---

## 🏗️ Decisiones de arquitectura (ADR)

Un ADR (Architecture Decision Record) es un documento breve que explica **por qué** se tomó una decisión técnica. Estos son los tres ADR de este proyecto, con formato *situación → decisión → consecuencia*.

### ADR 1 · Frontend y backend en repositorios separados

**Situación.** La web necesitaba tener un formulario real con backend, pero también debía publicarse como web estática y gratuita en internet. GitHub Pages solo sirve archivos estáticos.

**Decisión.** Separar el proyecto en dos repositorios:

- `mi-web` (frontend estático) → desplegado en **GitHub Pages**.
- `portfolio-backend` (backend Node.js) → desplegado en **Render**.

Ambos se comunican mediante `fetch()` con CORS restringido al dominio de GitHub Pages.

**Consecuencia.** Cada parte se despliega de forma independiente: cambiar el backend no toca el frontend y viceversa. Además, evita subir código sensible (`.env`, dependencias) al mismo repo donde vive la web pública. El coste es tener que mantener dos repositorios coordinados.

---

### ADR 2 · Stack del backend: Node.js + Express + MongoDB + Resend

**Situación.** Necesitaba un backend que recibiera mensajes del formulario, los guardara y me avisara por email. Yo no había hecho nunca un backend y necesitaba algo que pudiera aprender rápido y desplegar gratis.

**Decisión.** Elegí:

- **Node.js + Express** por ser el estándar de la industria, con miles de ejemplos y documentación clara.
- **MongoDB Atlas** como base de datos porque el plan gratuito (512 MB) es más que suficiente para un portfolio y su esquema flexible encaja bien con un formulario.
- **Resend** para el envío de emails, porque su plan gratuito (3.000 emails/mes) es más que suficiente y su API es de las más sencillas del mercado.

**Consecuencia.** Tener un backend real en un portfolio de estudiante me diferencia del 90% de la clase. El coste: MongoDB Atlas y Render en plan gratuito tienen limitaciones (la base de datos tiene 512 MB y Render duerme el servicio tras 15 min sin uso, tardando ~30 segundos en responder la primera petición).

---

### ADR 3 · Sistema de traducción propio en lugar de librería externa

**Situación.** Quería que la web estuviera disponible en tres idiomas (castellano, valenciano e inglés) como proyecto personal, ya que soy de Valencia y estudio en un centro donde el valenciano es relevante.

**Decisión.** Escribir un sistema propio en `language.js` que recorre el DOM, traduce nodos de texto y atributos, y persiste la selección en `localStorage`. No usé ninguna librería como i18next o similar.

**Consecuencia.** El sistema pesa solo ~40 KB (vs. librerías que pesan más y añaden dependencias). Además, entiendo cómo funciona por dentro y puedo modificarlo cuando quiera. El coste: es un sistema sencillo que no cubre casos complejos (pluralización, fechas, números), pero para este proyecto es más que suficiente.

---

## 🚀 Cómo se publica

### Frontend → GitHub Pages

- **Rama publicada:** `main`
- **Carpeta:** raíz (`/`)
- **URL final:** https://gabi37smx.github.io/mi-web/
- **Fichero `.nojekyll`:** en la raíz. Desactiva el procesador Jekyll que GitHub Pages activa por defecto y que ignora ficheros que empiezan por `_` o por punto. Con HTML + CSS + JS puros, no lo necesito, pero lo pongo para publicar exactamente lo que tengo.

**Cómo se activa:** `Settings → Pages → Deploy from a branch → main / (root) → Save`.

### Backend → Render

- **Servicio:** `portfolio-backend` en https://render.com
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Variables de entorno:** configuradas en el panel de Render (no en el código)
- **URL:** https://portfolio-backend-m07q.onrender.com

---

## 🕰️ Historial de versiones

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
| **v24** | **Bloque de actividad de GitHub** en la sección "Me gusta" (consume `/api/github/activity`). **Última versión.** |

---

## 🙏 Créditos

- **Retrato personal:** fotografía propia.
- **Icono de escalador (barra lateral):** inspirado en referencias de SVGRepo, adaptado y modificado por mí.
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

*Última actualización: 29 de septiembre de 2026.*
