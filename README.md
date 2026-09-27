# 🧗 mi-web · Portfolio personal de Gabriel Vidal Badia

Portfolio personal con temática de escalada. Estudiante de **1º DAM** en el **IES Simarro** (Xàtiva, Valencia), en transición desde el mantenimiento industrial hacia la programación, la IA y los agentes.

> *"Resolver problemas con el cuerpo, igual que con el código."*

---

## 🚀 Demo

- **Web en vivo:** https://gabi37smx.github.io/mi-web/
- **Panel admin (mensajes):** https://portfolio-backend-m07q.onrender.com/admin
- **Backend API:** https://portfolio-backend-m07q.onrender.com/
- **Repos:**
  - Frontend: https://github.com/gabi37smx/mi-web
  - Backend: https://github.com/gabi37smx/portfolio-backend

---

## 🛠️ Tecnologías

### Frontend
- **HTML5** semántico
- **CSS3** puro (variables, grid, flexbox, animaciones, temas claro/oscuro)
- **JavaScript** vanilla (sin frameworks ni librerías externas)

### Backend
- **Node.js** + **Express**
- **MongoDB Atlas** (base de datos en la nube)
- **Resend** (envío de emails transaccionales)
- **Render** (hosting del backend)
- **GitHub Pages** (hosting del frontend)

---

## ✨ Características

### Frontend
- 🎨 **Tema claro/oscuro** con botón y persistencia en `localStorage`
- 🖐️ **Cursor personalizado** (mano abierta / cerrada) que solo se activa con ratón real
- ✍️ **Efecto máquina de escribir** en la frase de presentación
- 🧲 **Efecto magnético** en el título del hero
- 🧗 **Barra lateral de escalada**: presas que se iluminan por sección y escalador que sube al hacer scroll
- 💻 **Terminal decorativa** con el bucle `while (no_llegue_a_la_cima)`
- 🏔️ **Timeline temática**: "movimientos de la vía" (Reposo, Travesía, Crux, Reunión)
- 🏷️ **Grados de escalada V0–V6** con tooltips
- 📄 **Página de contacto** con formulario validado y opción "Quiero que me llames"
- 📁 **Página de proyectos** con filtros (Individual / Grupo / En curso / Próximamente)
- 🏅 **Sección de certificaciones** con títulos oficiales y certificados Cisco
- 📱 **Diseño responsive** y **accesibilidad** (`prefers-reduced-motion`, `aria-label`, `skip-link`)

### Backend
- 📬 **API REST** para recibir mensajes del formulario
- 💾 **Persistencia en MongoDB Atlas**
- 📧 **Notificación por email** vía Resend a cada mensaje recibido
- 🛡️ **Rate limiting** (máx. 5 envíos por IP cada 15 min)
- 🔐 **Panel admin** protegido por contraseña para ver los mensajes
- ✅ **Marcar mensajes como leídos**

---

## 🕰️ Evolución del proyecto

| Versión | Descripción | Commit |
|---|---|---|
| v1 | Primera versión, solo estructura y estilos básicos | [`fa287ca`](../../commit/fa287ca) |
| v2 | Cursor personalizado con dos círculos | [`bf4be4f`](../../commit/bf4be4f) |
| v3 | Efecto magnético en el título del hero | [`7ecccf`](../../commit/7ecccf) |
| v4 | Barra de escalada, cursor mano y grados V | [`8bced2e`](../../commit/8bced2e) |
| v5 | Formulario de contacto | [`fc03900`](../../commit/fc03900) |
| v6 | Certificaciones Cisco y títulos oficiales | [`6c398ed`](../../commit/6c398ed) |
| v7 | Rediseño del formulario + opción de llamada | [`c089be6`](../../commit/c089be6) |
| v8 | Foto personal en "Sobre mí" | [`d198653`](../../commit/d198653) |
| v9 | Nueva estética topo + Space Grotesk | [`ed11d55`](../../commit/ed11d55) |
| v10 | Página de proyectos con filtros | [`d0066c3`](../../commit/d0066c3) |
| v13 | Backend online: formulario conectado con API | [`d56c7bd`](../../commit/d56c7bd) |

---

## 📁 Estructura del proyecto

```
mi-web/                          ← Frontend (GitHub Pages)
├── index.html
├── contacto.html
├── proyectos.html
├── style.css
├── script.js
├── image/
│   └── gabriel.webp
└── README.md

portfolio-backend/               ← Backend (Render)
├── models/Message.js
├── routes/contact.js
├── middleware/auth.js
├── server.js
├── loadEnv.js
├── admin.html
├── package.json
├── .env.example
└── .gitignore
```

---

## 🎨 Identidad visual

**Estética:** guía de escalada / topo impreso.

**Paleta:**
- Modo claro (papel): `#f2ede3` fondo · `#1a1a1a` texto · `#c1272d` rojo óxido
- Modo oscuro: `#151310` fondo · `#f2ede3` texto · `#e04a4f` rojo
- Acentos secundarios: verde bosque `#3a5a40` · mostaza `#d4a017`

**Tipografía:**
- Títulos: **Space Grotesk**
- Cuerpo: **Inter**
- Código: **JetBrains Mono**

---

## 🧑‍💻 Cómo abrirlo en local

### Frontend
1. Clona el repo:
   ```bash
   git clone https://github.com/gabi37smx/mi-web.git
   ```
2. Entra en la carpeta y ábrelo con un servidor local:
   ```bash
   cd mi-web
   npx serve .
   ```

### Backend
1. Clona el repo:
   ```bash
   git clone https://github.com/gabi37smx/portfolio-backend.git
   ```
2. Instala dependencias:
   ```bash
   npm install
   ```
3. Crea el archivo `.env` (copia de `.env.example`) y rellena las variables.
4. Arranca:
   ```bash
   npm run dev
   ```

---

## 👤 Autor

**Gabriel Vidal Badia**
- 🎓 1º DAM · IES Simarro (Xàtiva, Valencia)
- 💼 Técnico Superior en Sistemas de Telecomunicación e Informáticos · CFGM SMR · 11 años de experiencia en mantenimiento industrial
- 🏅 Certificaciones Cisco: CCNA Intro, Ciberseguridad, Junior Cybersecurity Analyst Career Path
- 🎯 Enfoque: programación, inteligencia artificial y agentes
- 📫 Contacto: gabvidbad@alu.edu.gva.es
- 🐙 GitHub: [@gabi37smx](https://github.com/gabi37smx)

---

## 📄 Licencia

Proyecto personal con fines educativos. Todos los derechos reservados.
