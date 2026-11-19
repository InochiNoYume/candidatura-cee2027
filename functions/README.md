# Asistente CEE 2027

## Configuración en Cloudflare Pages

En **Settings → Variables and Secrets**, configura estos secretos por separado en Preview y Production:

1. **`GEMINI_API_KEY`** (Secret): clave del motor principal.
2. **`GROQ_API_KEY`** (Secret): clave del motor de respaldo.
3. Opcional, **`GEMINI_MODEL`**: modelo Gemini; predeterminado `gemini-3.5-flash-lite`.
4. Opcional, **`GROQ_MODEL`**: modelo Groq; predeterminado `openai/gpt-oss-120b`.

Después de añadir o cambiar secretos, vuelve a desplegar el entorno correspondiente. Las claves se usan solo desde el servidor: Gemini mediante `x-goog-api-key` y Groq mediante `Authorization: Bearer`. Nunca las incluyas en HTML, JavaScript del navegador, commits, registros ni mensajes.

**Importante:** el respaldo no funcionará hasta que `GROQ_API_KEY` esté configurada en Cloudflare. No compartas las claves aquí.

## Fuentes y filtros

El asistente se limita a la web CEE 2027. La clasificación final la realiza el modelo con instrucciones compartidas; las consultas claramente ajenas reciben una respuesta fija y no activan el respaldo.

Gemini es el motor principal: el servidor selecciona páginas relacionadas y envía sus URL públicas a **URL Context**. Cada proveedor admite hasta dos intentos ante errores de red, timeout y respuestas HTTP temporales (408, 429 y 5xx), con espera incremental breve. Si Gemini falla, también por clave, permisos o modelo, se intenta Groq; así, un problema de configuración de Gemini no inutiliza un respaldo correctamente configurado. Los errores de entrada del usuario se validan antes de llamar a los proveedores.

Groq no dispone del URL Context de Gemini: cuando se activa, el servidor recupera las mismas páginas seleccionadas desde el propio sitio y entrega su texto al modelo. Los dos motores reciben las mismas reglas de alcance, precisión, fuentes y formato. Una respuesta válida de Gemini que clasifique la pregunta como `out_of_scope` termina el proceso sin llamar a Groq.

Las fuentes permitidas incluyen Inicio, Nuestra lista, Proyecto, Agenda, Transparencia, Noticias, Galería, CEAT Te Escucha, Preguntas frecuentes, Contacto, Actas, Informes, Comunidad TP, Memoria, Privacidad y Buscar. Las preguntas generales pueden consultar todas las secciones. La respuesta de Groq muestra las páginas que el servidor pudo recuperar; Gemini muestra las páginas que URL Context informa haber recuperado correctamente.

Ambos motores deben basarse solo en el contenido recuperado, no inventar datos y distinguir propuestas de actividades realizadas. Las respuestas son resúmenes en español de hasta 130 palabras. La generación está limitada a 420 tokens. No se envía historial.

## Seguridad y privacidad

El límite de diez preguntas por hora es por instancia y no equivale a un límite global. Añade una regla de Rate Limiting administrada en Cloudflare para el endpoint `/api/asistente` antes de publicar ampliamente. Los reintentos están acotados y el cliente espera hasta 70 segundos para cubrir el presupuesto de ambos proveedores.

En el nivel gratuito de Gemini API, Google puede utilizar los datos enviados para mejorar sus productos y los datos pueden ser revisados por personas. No enviar datos personales, académicos, privados ni sensibles. Consulta https://ai.google.dev/gemini-api/terms y https://ai.google.dev/gemini-api/docs/url-context.
