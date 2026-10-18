# 🧠 Registro de Prompts (Órdenes a la IA)

Esta carpeta contiene una **muestra representativa** de las órdenes (prompts) que he dado a la IA durante el desarrollo del proyecto, junto con un resumen del resultado obtenido y el commit donde se aplicó.

No es el historial exhaustivo (que ocupa miles de líneas a lo largo de varias semanas), sino los hitos que demuestran cómo se ha dirigido el desarrollo de principio a fin.

## 📂 Índice de Prompts

- **[2026-10-10-skin-matrix.md](2026-10-10-skin-matrix.md)**
  Creación del cuarto skin visual (Matrix). Implementación del cursor tipo terminal, efecto glitch, lluvia de código y sustitución del escalador por un Centinela (calamar) animado.

- **[2026-10-11-agrupacion-noticias-ia.md](2026-10-11-agrupacion-noticias-ia.md)**
  Rediseño de la página de noticias para agrupar por temas. Además, resolución de bugs de traducción (i18n) en los widgets de "Zonas de escalada" y "Actividad de GitHub" para los tres idiomas.

- **[2026-10-17-juego-movil.md](2026-10-17-juego-movil.md)**
  Mejora de la experiencia de juego en móviles. Sustitución de los botones de movimiento por un joystick táctil continuo (Pointer Events) compatible con Android e iOS.

- **[2026-10-17-video-y-subtitulos.md](2026-10-17-video-y-subtitulos.md)**
  Ajuste del vídeo demo a 35 segundos. Corrección de los tiempos del archivo `.vtt`, actualización de textos en ES/VA/EN y accesibilidad del vídeo.

- **[2026-10-18-seguridad-backend.md](2026-10-18-seguridad-backend.md)**
  Auditoría de seguridad. Detección de un fallo crítico de escalada de privilegios en las passkeys. Implementación de tokens HMAC, bloqueo por IP y detección de la IP real detrás del proxy de Render.

- **[2026-10-18-pruebas-chatbot.md](2026-10-18-pruebas-chatbot.md)**
  Validación del chatbot con Gemini. Diseño de 5 pruebas trampa (alucinaciones, inyección de prompt, privacidad, etc.) para verificar que la IA respeta las reglas del sistema.

---

*Documentar el proceso de trabajo con IA es parte fundamental del proyecto. La IA es una herramienta, pero el arquitecto y director del proyecto es el desarrollador.*