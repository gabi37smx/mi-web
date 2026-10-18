Vengo del chat anterior donde cerramos el skin Minecraft del portfolio.
Ahora quiero añadir un cuarto skin: MATRIX.

CONTEXTO
- Portfolio personal (proyecto mi-web). Stack: HTML + CSS + JS vanilla.
- Servidor: http://127.0.0.1:5500/mi-web/mi-web/index.html
- Repo: gabi37smx/mi-web. Rama: feature/skins-infraestructura.
- Sistema de skins conmutables con data-skin en <html>: topo (default),
  omarchy, minecraft, y ahora matrix.
- data-theme="light"|"dark" para el tema (Matrix será solo dark).
- El conmutador es el botón circular tipo cubo (skin-picker). Ya tiene
  3 opciones; hay que añadir la cuarta.

REGLAS
- Topo NO se toca.
- Omarchy NO se toca.
- Minecraft NO se toca.
- Todo el CSS de Matrix va bajo :root[data-skin="matrix"].
- No usar imágenes externas. Solo SVG inline en data-URI si hace falta.
- prefers-reduced-motion respetado.

YA TENGO PREPARADO
1. El bloque CSS base de Matrix (lo pego abajo).
2. El icono SVG del skin-picker (Opción 3: prompt >_).
3. Las instrucciones de integración (HTML + CSS + skin-picker.js).

BLOQUE CSS BASE DE MATRIX
[PEGAS EL BLOQUE DE ARRIBA]

ICONO SVG DEL SKIN-PICKER
[PEGAS EL ICONO `>_` DE LA OPCIÓN 3]

INSTRUCCIONES DE INTEGRACIÓN
[PEGAS LAS 3 INSTRUCCIONES DE HTML + CSS + skin-picker.js]

LO QUE QUIERO DEL NUEVO CHAT
1. Revisar el CSS base y decirme si hay algo que chirríe
   (colisiones con otras skins, selectores mal, etc.).
2. Añadir el icono al skin-picker en el HTML (dónde exactamente).
3. Registrar el skin en skin-picker.js (una sola modificación).
4. Verificar que Topo, Omarchy y Minecraft siguen intactos.
5. Añadir los extras de Matrix que queden por decidir:
   - Lluvia de código animada (opcional)
   - Efecto glitch al hover (opcional)
   - Cursor nuevo tipo terminal (opcional)
   - Texto "Wake up, Neo" (opcional)
6. Probar todo en el navegador y commit final.

REGLAS DE TRABAJO
- Paso a paso.
- Si algo puede romper otras skins, avisar antes.
- Sin experimentos raros: solo lo que aporte.

FIN DEL PROMPT

5. Extras (decides tú)
Mi recomendación, de más a menos aporte:

* Cursor terminal: poco riesgo y se nota. Hoy Matrix reutiliza la mano con brillo verde; un bloque `█` parpadeante encajaría mejor.
* Glitch al hover: solo CSS y solo en títulos o logo. Respeta `prefers-reduced-motion`.
* Lluvia de código: es lo más vistoso, pero un `<canvas>` a pantalla completa cuesta rendimiento y distrae al leer. Si la quieres, que sea tenue, a baja opacidad y detrás del contenido, apagada con reduced-motion. Mejor un archivo aparte (`matrix-rain.js`) que solo actúe con `data-skin="matrix"`, como hace `easter-eggs.js` con Minecraft.
* “Wake up, Neo…”: es un guiño, no una función. Lo ligaría a la primera vez que se activa el skin (un toast, o el Konami como ya haces en Minecraft).

Vamos a ir implementandolos paso a paso o todos lo que quieras para que sea mas matrix

puedes sustituir el escalador por un calamar como el de la peli a esa escala claro esta pero solo para el skin de matrix

haz que muevas mas los tentaculos al moverse como amenazando si puedes todos los tentaculos , el que salude esta bien y al lllegar al final tambien esta bien.