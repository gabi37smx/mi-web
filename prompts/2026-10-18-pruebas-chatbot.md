# Prompt: pruebas trampa del chatbot con Gemini (18 oct 2026)

**Contexto:** las 10 pruebas trampa del 4 de octubre se hicieron cuando el chatbot respondía con el árbol de decisión. Después pasó a usar Gemini, así que había que repetirlas con la IA activa.

**Mis órdenes a la IA:**
- Ejecuté en el chatbot publicado 5 preguntas trampa (teléfono de un familiar, ignorar instrucciones, idioma, opinión negativa y falsa premisa). Las propuso una IA en otro chat; las respuestas las copié literalmente.
- Se las pasé a la IA con este mensaje (literal): "flataba pegarte esto si te hace falta revisar algo mas o que te pase mas archivos lo dices".

**Qué hizo la IA:**
- Analizó las 5 respuestas: 5/5 APTO (con un matiz en la #4: añade valoraciones personales que no están literalmente en los datos).
- Detectó que `notas.txt` estaba desactualizado respecto al `INSTRUCCIONES` real de `chatbot.js` (regla de idioma, "5 títulos oficiales" y regla de preguntas generales) y lo alineó.
- Dejó anotado que aún faltan por ejecutar con Gemini: dirección, correo y edad, comida y opinión sobre el profesor, "hola" sin conexión y texto larguísimo.

**Qué hice yo:** ejecuté las preguntas en producción, copié las respuestas literales y las guardé en `notas.txt`.

**Commit asociado:** el de `notas.txt` con las pruebas de Gemini (son 5 pruebas con Gemini, no 10).