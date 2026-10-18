# 🛡️ Informe de seguridad del backend (v14)

Este documento registra los fallos de seguridad encontrados en el backend del portfolio y las medidas aplicadas. Se detectaron durante una **revisión de código asistida por IA**; las pruebas, el despliegue y la verificación en producción los hice yo.

---

## 🚨 1. Registro de passkeys sin autenticación (crítico)
**Debilidad:** acceso sin autenticación a una función crítica (CWE-306 / CWE-287).

- **Situación.** `POST /api/passkey/register/options` y `/register/verify` no exigían sesión, y la página `/admin` es pública.
- **Impacto.** Cualquier visitante podía registrar su propia passkey desde la página del panel y después entrar con ella, con acceso total.
- **Solución.** Se añadió el middleware `adminAuth` a los dos endpoints de registro: ahora solo se puede registrar una passkey nueva con una sesión de admin ya iniciada.

## 🚨 2. Contraseña devuelta al navegador y enviada por la URL (grave)
**Debilidad:** exposición de información sensible (CWE-598).

- **Situación.** Tras validar una passkey, el servidor devolvía la contraseña del admin al navegador, y el panel la enviaba en cada petición como `?password=...`.
- **Impacto.** La contraseña quedaba en los logs de Render y en el historial del navegador.
- **Solución.** El login con contraseña (`POST /api/session`) y el login con passkey devuelven un **token de sesión firmado con HMAC-SHA256** que caduca a las 8 horas. El panel lo guarda en `sessionStorage` y lo envía en `Authorization: Bearer`. La contraseña solo viaja una vez, en el cuerpo del login, y ya no se acepta por la URL. La comparación de contraseñas es en tiempo constante.

## 🚨 3. Sin límite de intentos de contraseña
**Debilidad:** protección insuficiente contra fuerza bruta (CWE-307).

- **Situación.** Se podían probar contraseñas sin límite.
- **Solución.** Si una IP acumula **8 intentos fallidos en 15 minutos**, se bloquea (`429`) y se registra un aviso en los logs.

## 🚨 4. IP interna del proxy de Render en los límites de uso
**Debilidad:** se usaba como identificador una IP que no era la del visitante (CWE-348).

- **Situación.** `req.ip` devolvía una IP interna del proxy (10.x). Los límites del chat (6 preguntas por minuto y 40 al día) y del formulario (5 envíos cada 15 minutos) contaban por esa IP.
- **Impacto.** Todos los visitantes compartían el mismo contador.
- **Solución.** `utils/clientIp.js` busca la IP real en `cf-connecting-ip`, `true-client-ip` y `x-forwarded-for` (saltando IPs privadas) y usa `req.ip` solo como último recurso.

## ➕ 5. Botón "Cerrar sesión" y caducidad automática en el panel
- El panel tiene un botón **Cerrar sesión** que borra el token, vacía los datos de la pantalla y vuelve al login.
- La sesión se cierra sola cuando caduca el token, o si el servidor responde `401`.
- Se corrigió un fallo de orden al recargar el panel con la sesión abierta (se intentaban cargar datos antes de definir las variables).

---

## ✅ Validaciones

**Pruebas automáticas (en local, 14 comprobaciones):** la contraseña por URL ya no sirve; la contraseña por cabecera y por `POST /api/session` funcionan; un token manipulado, con la firma alterada o caducado se rechaza; 8 fallos bloquean la IP y otra IP no se ve afectada; `ipCliente` prioriza Cloudflare y `x-forwarded-for` y salta IPs privadas. El botón de cerrar sesión se probó con 9 comprobaciones sobre el HTML del panel.

**Pruebas manuales en producción:**
1. Login con contraseña: emite token y no expone la contraseña en la URL.
2. Login con passkey (iPhone y Samsung): Face ID y huella validan y emiten el token.
3. Bloqueo tras 8 intentos fallidos: aparece "Demasiados intentos" y queda aviso `warn` en los logs de Render.
4. Registro de passkey sin sesión: debe devolver `401`. Comprobación: `Invoke-WebRequest -Method POST https://portfolio-backend-m07q.onrender.com/api/passkey/register/options` (en PowerShell, el error `401` es el resultado esperado).
5. IP real: desde el móvil con datos, `/api/chat/health` devuelve la IP pública y `"fuente":"cf-connecting-ip"`.

---

## ⚠️ Limitaciones conocidas
- Los tokens son **sin estado**: "Cerrar sesión" los descarta en el navegador, pero no se pueden revocar en el servidor antes de caducar. Cambiar `ADMIN_PASSWORD` o `SESSION_SECRET` invalida todos.
- El bloqueo de intentos y los límites del chat están **en memoria**: se reinician cuando Render reinicia el servicio.
- Si no existen las cabeceras `cf-connecting-ip` ni `true-client-ip`, se usa `x-forwarded-for`, que un cliente podría falsear; por eso hay además un tope global diario en el chat.
- La contraseña vive en variables de entorno de Render, no en el repositorio.

---

## 🏗️ Decisión de arquitectura relacionada

**ADR 7 · Sesión con token firmado en lugar de reenviar la contraseña.** Token sin estado firmado con HMAC-SHA256 usando `crypto` de Node.js (sin dependencias nuevas), con caducidad de 8 horas. Detalle en el README del backend.