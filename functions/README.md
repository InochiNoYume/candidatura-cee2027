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

- Las solicitudes a Gemini tienen un timeout de 20 segundos y un máximo de tres intentos.
- Solo se reintentan errores transitorios de red y HTTP 408, 429, 500, 502, 503 y 504, con espera incremental breve.
- Los errores de autenticación, permisos, modelo y parámetros no se reintentan indefinidamente.
- Se valida el JSON, el alcance, el texto de respuesta y la presencia de fuentes oficiales antes de mostrar una respuesta.
- Los registros del servidor indican estado HTTP, modelo, tipo de fallo, cantidad de fuentes y duración; nunca deben registrar la clave ni la pregunta.
- El cliente espera hasta 55 segundos y muestra mensajes comprensibles si Gemini tarda o falla.

El límite básico de diez consultas por hora se mantiene en memoria por instancia de Function; no equivale a un límite global. Añade una regla de Rate Limiting administrada en Cloudflare para `/api/asistente` antes de publicar ampliamente.

## Pruebas automatizadas vigentes

El workflow `.github/workflows/site-checks.yml` ejecuta las pruebas de resiliencia de Gemini y el modo mantenimiento. La última ejecución completada de Site quality checks pasó ambas suites. La auditoría en vivo también comprueba la presencia, apertura/cierre y accesibilidad básica del asistente en los distintos tamaños de pantalla. El lanzador permanece en su posición inferior; «Volver arriba» queda por encima con al menos 8 px de separación y un `z-index` superior. La auditoría 227 encontró que `css/layout.css`, cargado después de `styles.css`, restablecía el `z-index` de la flecha a 90; el orden final se fija ahora al final de `layout.css` para que prevalezca en todos los viewports. La auditoría 230 en Preview confirmó el orden de capas en los seis viewports, 0 infracciones axe, 0 fallos bloqueantes y 72/72 capturas. Gemini superó 7/7 pruebas. La ejecución Site quality checks detectó dos expectativas desactualizadas que aún esperaban dos intentos; se corrigieron en `scripts/check-assistant.mjs` y `scripts/test-assistant-resilience.mjs`. La suite volvió a aprobarse en las ejecuciones 44765468423 y 44765488252.

## Seguridad y privacidad

No enviar datos personales, académicos, privados ni sensibles. En el nivel gratuito de Gemini API, Google puede utilizar los datos enviados para mejorar sus productos y los datos pueden ser revisados por personas. Consulta https://ai.google.dev/gemini-api/terms y https://ai.google.dev/gemini-api/docs/url-context.


### Orden de capas de los controles flotantes

- «Volver arriba» usa `z-index: 802`.
- El lanzador del Asistente CEE usa `z-index: 800`.
- El panel del asistente usa `z-index: 801`.

Así, la flecha queda físicamente por encima del lanzador, sin desplazarlo cuando aparece al hacer scroll; se exige una separación mínima de 8 px. El panel conserva una capa propia. La prueba automatizada comprueba geometría y orden de capas en móvil, tablet y escritorio; revisar también las capturas de Preview. El endpoint Gemini reintenta ahora hasta tres veces los estados HTTP transitorios con espera creciente.


### Carga de tipografías y diagnóstico de Lighthouse

En pages/proyecto.html, la hoja externa de Google Fonts ya no se declara como stylesheet bloqueante. js/main.js la precarga y cambia a stylesheet al terminar su descarga, solo en Proyecto. Se conservan DM Sans y Manrope; si JavaScript no se ejecuta, el CSS mantiene Arial como respaldo. Verificar visualmente el intercambio de fuente y repetir Lighthouse antes de extender el patrón a otras páginas. La auditoría 44765488112 completó 109 combinaciones responsive sin fallos bloqueantes ni infracciones axe; Proyecto escritorio obtuvo 72 en rendimiento y móvil 99. Lighthouse señaló la hoja de Google Fonts como recurso bloqueante, con ahorro estimado de 2,19 s. También registró un error CORS del beacon de Cloudflare Web Analytics en Preview; no cambiar la configuración de analítica sin verificar primero su causa.


### Auditoría Gemini en Preview · 20 de noviembre de 2026

La ejecución responsive/Lighthouse 44778879442 completó 7/7 pruebas del asistente Gemini con HTTP 200, respuestas del tema esperado y sin exponer metadatos internos. La misma auditoría recorrió 108 combinaciones de 18 rutas y seis viewports, sin infracciones axe ni fallos bloqueantes. Esto valida el comportamiento probado en Preview, no sustituye las comprobaciones manuales ni garantiza disponibilidad futura del proveedor.


## Auditoría responsive más reciente · 20 de noviembre de 2026

La ejecución [44783535294](https://github.com/InochiNoYume/candidatura-cee2027/actions/runs/44783535294) terminó correctamente sobre Preview de la PR #21:

- 108 combinaciones de rutas y viewports, 0 infracciones axe y 0 fallos bloqueantes.
- 72/72 capturas generadas; 7/7 pruebas Gemini aprobadas.
- Lighthouse: Inicio 94/100, Nuestra lista 99/99, Proyecto 100/100 y CEAT Te Escucha 100/100 (móvil/escritorio).
- Accesibilidad 100 y buenas prácticas 96 en las ocho mediciones.
- LCP móvil: Inicio 2,9 s; Nuestra lista 1,9 s; Proyecto 1,2 s; CEAT Te Escucha 1,1 s.

### Formulario CEAT Te Escucha y variables de Cloudflare

La página `pages/escucha.html` aún muestra un aviso de formulario externo pendiente y no implementa `<form>`, iframe, endpoint de envío ni lectura de configuración de formulario. Por tanto, **no se debe crear ninguna variable de entorno para el formulario por ahora**. Al recibir el enlace oficial de Google Forms, se incorporará como destino/enlace de la página estática y se probará manualmente. No almacenar una URL pública de formulario como Secret ni crear `GOOGLE_FORM_URL` hasta que exista código que la consuma.

Las variables actuales del proyecto siguen siendo independientes del formulario:
- `GEMINI_API_KEY`: Secret obligatorio para el asistente, en Preview y Production.
- `GEMINI_MODEL`: variable opcional para seleccionar el modelo.
- `CEE_MAINTENANCE_MODE`: variable operativa para mantenimiento, no relacionada con formularios.

La auditoría automatizada no prueba un envío real de Google Forms.


### Estado de interfaz y auditoría

La revisión de capturas 44783535294 mostró que el botón flotante podía cubrir texto en pantallas de hasta 560 px. Se ajustó a formato de icono compacto (48 px) en móvil, manteniendo el nombre accesible en `aria-label`. `scripts/audit-live-site.mjs` comprueba ahora que su ancho no supere 64 px y que la etiqueta visual se oculte en ese rango. La nueva ejecución debe aprobar antes de considerar validado este ajuste.


## Páginas personalizadas de error

El middleware global `functions/_middleware.js` gestiona los errores HTML con documentos propios: `403.html`, `404.html` y `500.html`. Mantiene los códigos HTTP correspondientes, devuelve `500.html` si una solicitud HTML de Pages Functions lanza una excepción y no transforma las respuestas JSON de `/api/*`. El modo mantenimiento sigue devolviendo `maintenance.html` con HTTP 503 y pausa la API con JSON 503.

Las páginas de error están marcadas `noindex,nofollow`, no se almacenan en caché y añaden `X-Content-Type-Options: nosniff`. Las reglas WAF o los errores de infraestructura que se produzcan antes de que la solicitud llegue a Pages Functions permanecen bajo el control de Cloudflare.

`scripts/test-maintenance-mode.mjs` ahora comprueba 403, 404, 500, excepciones HTML, cabeceras y conservación del tipo JSON en la API. `scripts/audit-live-site.mjs` incluye las páginas de error en las comprobaciones responsive y en las capturas.


## Alcance confirmado de seguridad · PR #21

El límite local por isolate se documenta como protección básica, no como límite global. La configuración de Rate Limiting global y WAF de Cloudflare queda **excluida** de esta PR por decisión del proyecto; no se configura ni se presenta como implementada. Si se necesita más adelante, deberá planificarse por separado y revisarse según las capacidades del plan de Cloudflare.
