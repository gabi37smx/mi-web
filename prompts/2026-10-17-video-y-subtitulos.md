Prompt: vídeo demo y subtítulos (17-18 oct 2026)

Mis órdenes a la IA (mensajes reales):

"Ahí está el video y los subtítulos; si no te gustan, me los preparas mejor escritos y sin faltas y más profesionales. Actualízame las notas txt si hace falta y me dices qué nos falta para el 100% y vamos resolviendo."

"te paso el index que tengo y así tú lo dejas niquelado"

Qué hizo la IA:

Analizó el vídeo (35 s, sin sonido, 1920x1080, aprox. 1 MB) y comparó fotogramas con los tiempos del demo.vtt: Noticias IA empieza hacia el segundo 13 y Experiencia hacia el 18,5.
Reescribió demo.vtt con esos tiempos, con "Cordada" y "Gemini" bien escritos y sin faltas.
Detectó que el pie y el aria-label del vídeo seguían diciendo "30 segundos" y que ya no describían el vídeo (ahora es un recorrido por la web); actualizó los textos en ES/VA/EN (language.js) y en index.html.
Al revisar mi index.html encontró que el alt de mi foto principal se había quedado en "..." y que faltaba loading="lazy" en una imagen.

Qué hice yo: grabé y comprimí el vídeo, revisé los subtítulos, sustituí los ficheros y comprobé en la web publicada que ponía "35 segundos".

Commit asociado: a6ac66a docs: actualiza subtítulos, READMEs, notas y añade registro de prompts (PR fusionada desde fix/mejoras-finales).