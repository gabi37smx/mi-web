# Prompt: Auditoría de seguridad y mitigación de fallos (18 oct 2026)

**Orden a la IA:**
"Actúa como un auditor de seguridad web. Revisa este código de backend (`passkey.js`, `auth.js`, `server.js`) y dime cuáles son los fallos de seguridad críticos. Si un usuario no está logueado, ¿puede registrar una passkey? ¿La contraseña viaja por la URL? ¿El rate limit usa la IP real detrás del proxy de Render? Dame el código refactorizado para implementar tokens HMAC y un archivo `clientIp.js`."

**Resultado obtenido:**
- Detección del fallo de registro libre de passkeys (CWE-287).
- Implementación de tokens HMAC (bearer) en lugar de contraseña en URL.
- Creación de `utils/clientIp.js` para leer cabeceras `cf-connecting-ip`.
- Sistema de bloqueo por IP tras 8 fallos.
- Todo documentado en `docs/auditoria-seguridad.md`.

**Commit asociado:** `feat(seguridad): sesión con token, protege registro de passkeys y detecta IP real`
