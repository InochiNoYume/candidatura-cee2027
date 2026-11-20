# Asistente CEE 2027

## Configuración en Cloudflare Pages

En **Settings → Variables and Secrets**, configura estos valores por separado en Preview y Production:

1. **`GEMINI_API_KEY`** (Secret): clave de Gemini API.
2. Opcional, **`GEMINI_MODEL`**: identificador del modelo Gemini; predeterminado `gemini-3.5-flash-lite`.

El asistente utiliza exclusivamente Gemini. No requiere claves ni servicios de respaldo. Después de añadir o cambiar el secreto, vuelve a desplegar el entorno correspondiente. La clave se utiliza solo desde el servidor mediante el encabezado `x-goog-api-key`; nunca la incluyas en HTML, JavaScript del navegador, commits, registros ni mensajes.

## Fuentes y comportamiento

El asistente se limita a la web CEE 2027. El servidor selecciona páginas oficiales relacionadas con la pregunta y Gemini las consulta mediante **URL Context**. La clasificación final considera el sentido de la consulta: las preguntas claramente ajenas reciben una respuesta de alcance fijo; si la pregunta parece relacionada pero falta información, el asistente debe reconocerlo y no inventar datos.

Las fuentes permitidas incluyen Inicio, Nuestra lista, Proyecto, Agenda, Transparencia, Noticias, Galería, CEAT Te Escucha, Preguntas frecuentes, Contacto, Actas, Informes, Comunidad TP, Memoria, Privacidad y Buscar. Las preguntas generales pueden consultar todas las secciones.

Gemini debe basarse exclusivamente en el contenido recuperado, no inventar nombres, fechas, compromisos ni resultados, y distinguir propuestas de actividades realizadas. Las respuestas se entregan en español y tienen un máximo de 130 palabras. La generación está limitada a 420 tokens. No se envía historial de conversación.

## Estabilidad y diagnóstico

- Las solicitudes a Gemini tienen un timeout de 20 segundos y un máximo de dos intentos.
- Solo se reintentan errores transitorios de red y HTTP 408, 429, 500, 502, 503 y 504, con espera incremental breve.
- Los errores de autenticación, permisos, modelo y parámetros no se reintentan indefinidamente.
- Se valida el JSON, el alcance, el texto de respuesta y la presencia de fuentes oficiales antes de mostrar una respuesta.
- Los registros del servidor indican estado HTTP, modelo, tipo de fallo, cantidad de fuentes y duración; nunca deben registrar la clave ni la pregunta.
- El cliente espera hasta 55 segundos y muestra mensajes comprensibles si Gemini tarda o falla.

El límite básico de diez consultas por hora se mantiene en memoria por instancia de Function; no equivale a un límite global. Añade una regla de Rate Limiting administrada en Cloudflare para `/api/asistente` antes de publicar ampliamente.

## Pruebas automatizadas vigentes

El workflow `.github/workflows/site-checks.yml` ejecuta las pruebas de resiliencia de Gemini y el modo mantenimiento. La última ejecución completada de Site quality checks pasó ambas suites. La auditoría en vivo también comprueba la presencia, apertura/cierre y accesibilidad básica del asistente en los distintos tamaños de pantalla. El lanzador permanece en su posición inferior; «Volver arriba» queda por encima con al menos 8 px de separación y un `z-index` superior. La auditoría 227 encontró que `css/layout.css`, cargado después de `styles.css`, restablecía el `z-index` de la flecha a 90; el orden final se fija ahora al final de `layout.css` para que prevalezca en todos los viewports. La nueva ejecución en Preview debe confirmarlo.

## Seguridad y privacidad

No enviar datos personales, académicos, privados ni sensibles. En el nivel gratuito de Gemini API, Google puede utilizar los datos enviados para mejorar sus productos y los datos pueden ser revisados por personas. Consulta https://ai.google.dev/gemini-api/terms y https://ai.google.dev/gemini-api/docs/url-context.


### Orden de capas de los controles flotantes

- «Volver arriba» usa `z-index: 802`.
- El lanzador del Asistente CEE usa `z-index: 800`.
- El panel del asistente usa `z-index: 801`.

Así, la flecha queda físicamente por encima del lanzador, sin desplazarlo cuando aparece al hacer scroll; se exige una separación mínima de 8 px. El panel conserva una capa propia. La prueba automatizada comprueba geometría y orden de capas en móvil, tablet y escritorio; revisar también las capturas de Preview. El endpoint Gemini reintenta ahora hasta tres veces los estados HTTP transitorios con espera creciente.
