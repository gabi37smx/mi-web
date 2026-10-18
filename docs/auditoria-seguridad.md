# 🛡️ Auditoría de Seguridad y Corrección de Vulnerabilidades

Este documento registra la auditoría de seguridad realizada sobre el backend del portfolio (v14) y las medidas de mitigación implementadas. Se detectó y solucionó un fallo crítico de escalada de privilegios, además de varias fugas de información y debilidades en el control de acceso.

---

## 🚨 1. El fallo crítico: Registro de Passkeys sin autenticación
**Vulnerabilidad:** Elevación de privilegios (CWE-287).
**Situación:** El endpoint `POST /api/passkey/register/options` (el que genera las opciones para crear una nueva passkey) no exigía ningún tipo de sesión o token. La página `/admin` es pública.
**Impacto:** Cualquier visitante podía abrir la página de login, inyectar código en la consola o usar herramientas como Postman para pedir las opciones de registro, registrar su propia huella/Face ID y obtener acceso total al panel de administración. Esto anulaba por completo la seguridad del login híbrido.
**Solución:** Se añadió el middleware `adminAuth` a los endpoints `register/options` y `register/verify`. Ahora, para registrar una nueva passkey, el usuario **debe estar previamente autenticado** con contraseña o con otra passkey.

## 🚨 2. El fallo grave: Contraseña expuesta en el tráfico y en la URL
**Vulnerabilidad:** Exposición de información sensible (CWE-598).
**Situación:** Tras validar una passkey con éxito, el servidor devolvía la contraseña del administrador en texto plano al navegador. El panel web la guardaba y la enviaba en cada petición posterior a través de la URL (`?password=...`) o en una cabecera simple.
**Impacto:** La contraseña viajaba por la red en cada petición, quedaba registrada en los logs de Render y en el historial del navegador. Si alguien interceptaba una sola petición (o miraba los logs), obtenía la contraseña maestra.
**Solución:** Se eliminó el envío de la contraseña. Ahora, tanto el login por contraseña (`POST /api/session`) como el login por passkey devuelven un **token de sesión firmado (HMAC)** que caduca a las 8 horas. El panel guarda este token en `sessionStorage` y lo envía en la cabecera `Authorization: Bearer <token>`. La contraseña solo viaja una vez, en el cuerpo de la petición de login (nunca por la URL).

## 🚨 3. El fallo de fuerza bruta: Falta de bloqueo de intentos
**Vulnerabilidad:** Protección insuficiente contra ataques de fuerza bruta (CWE-307).
**Situación:** El endpoint de login (`/api/session`) permitía intentos ilimitados de contraseña.
**Impacto:** Un atacante podía automatizar peticiones y probar miles de contraseñas por segundo hasta dar con la correcta.
**Solución:** Se implementó un sistema de bloqueo temporal en `middleware/auth.js`. Si una misma IP acumula **8 intentos fallidos en 15 minutos**, se le bloquea el acceso devolviendo un `429 Too Many Requests` y se registra un aviso en los logs (`warn: IP bloqueada por demasiados intentos`). El bloqueo se limpia automáticamente al caducar la ventana de 15 minutos.

## 🚨 4. El fallo de red: IP falsa detrás del proxy de Render
**Vulnerabilidad:** Bypass de Rate Limiting (CWE-770).
**Situación:** En el entorno de producción de Render, `req.ip` devolvía la IP interna del proxy de la plataforma (algo como `10.195.x.x`), no la IP del visitante. Los límites del chatbot (6 preguntas por minuto y 40 al día) y del formulario (5 envíos cada 15 min) usaban esta IP para contar.
**Impacto:** Todos los visitantes de la web compartían el mismo contador global. Si un usuario agotaba el límite del chat (por ejemplo, haciendo pruebas), el resto de visitantes (y el propio administrador) quedaban bloqueados al instante. Además, el bloqueo por fuerza bruta era inútil porque todos compartían la misma IP.
**Solución:** Se creó el archivo `utils/clientIp.js`. Este módulo inspecciona las cabeceras del proxy (`cf-connecting-ip`, `true-client-ip`, `x-forwarded-for`) para buscar la IP pública real. Si no las encuentra, hace un fallback a `req.ip`. Se ha validado en producción que, desde un móvil con datos, el endpoint `/api/chat/health` devuelve la IP pública real del visitante y detecta correctamente la fuente (`cf-connecting-ip`).

---

## ✅ Validaciones realizadas tras el parche

1. **Login con contraseña:** Funciona, emite un token de 8h y no expone la contraseña en la URL.
2. **Login con passkey (iPhone y Samsung):** Face ID / Huella validan correctamente y emiten el token sin revelar la contraseña.
3. **Bloqueo por intentos (Local y Producción):** Se comprobó que 8 intentos fallidos bloquean la IP y muestran el mensaje "Demasiados intentos". La terminal de Render registró los avisos de `warn` correctamente.
4. **Registro de passkey protegido:** Se comprobó que sin token de sesión, el servidor rechaza la petición de registro (cerrando la brecha de escalada de privilegios).
5. **IP Real (Producción):** Probado desde un iPhone con datos móviles (5G). El endpoint `/api/chat/health` devolvió `{"detectada":"31.4.137.122","fuente":"cf-connecting-ip"}`, demostrando que el rate limit ahora es individual y no global.

---

## 🏗️ Actualización de ADRs (Decisiones de Arquitectura)

Para reflejar este trabajo de seguridad, se han añadido/actualizado las siguientes decisiones en el README del backend:

- **ADR 7 · Sesión con token firmado en lugar de reenviar la contraseña.**
  La contraseña ya no sale del servidor ni viaja por la URL. Se genera un token sin estado (stateless) firmado con HMAC SHA-256 usando `crypto` nativo de Node.js, evitando dependencias externas como JWT. El token caduca solo a las 8 horas y se invalida si se cambia la contraseña o el secreto.