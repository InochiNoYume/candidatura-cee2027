# Asistente CEE 2027

1. En Cloudflare Pages → Settings → Variables and Secrets, añade **GEMINI_API_KEY** como Secret.
2. Opcional: define **GEMINI_MODEL**. Predeterminado: `gemini-3.5-flash-lite`.
3. Guarda el secreto en el entorno correspondiente (Preview para despliegues de prueba y Production para el sitio público) y vuelve a desplegar ese entorno.
4. Prueba `POST /api/asistente`.

La clave se usa solo en el servidor mediante la cabecera `x-goog-api-key`. Nunca la incluyas en HTML, JavaScript, commits o mensajes.

## Fuentes y filtros

El asistente se limita a la web CEE 2027. Un filtro local reconoce consultas relacionadas con la candidatura y sus secciones; las consultas claramente ajenas reciben una respuesta fija sin llamar a Gemini.

Para preguntas pertinentes, el servidor selecciona páginas relacionadas y envía sus URL públicas a la herramienta **URL Context** de Gemini. Las fuentes permitidas incluyen Inicio, Nuestra lista, Proyecto, Agenda, Transparencia, Noticias, Galería, CEAT Te Escucha, Preguntas frecuentes, Contacto, Actas, Informes, Comunidad TP, Memoria, Privacidad y Buscar. Las preguntas generales pueden consultar todas las secciones. La interfaz muestra enlaces a las páginas que Gemini informa haber recuperado correctamente.

Gemini debe basarse en el contenido recuperado, no inventar datos y distinguir propuestas de actividades realizadas. Las respuestas son resúmenes detallados en español de hasta 130 palabras. La generación está limitada a 420 tokens. No se envía historial.

## Seguridad y privacidad

El límite de diez preguntas por hora es por instancia y no equivale a un límite global. Añade Rate Limiting global en Cloudflare antes de publicar ampliamente.

En el nivel gratuito de Gemini API, Google puede utilizar los datos enviados para mejorar sus productos y los datos pueden ser revisados por personas. No enviar datos personales, académicos, privados ni sensibles. Consulta https://ai.google.dev/gemini-api/terms y https://ai.google.dev/gemini-api/docs/url-context.
