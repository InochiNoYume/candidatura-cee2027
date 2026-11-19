# Asistente CEE 2027

1. En Cloudflare Pages → Settings → Variables and Secrets, añade **GEMINI_API_KEY** como Secret.
2. Opcional: define **GEMINI_MODEL**. Predeterminado: `gemini-3.5-flash-lite`.
3. Guarda el secreto en el entorno correspondiente (Preview para despliegues de prueba y Production para el sitio público) y vuelve a desplegar ese entorno.
4. Prueba `POST /api/asistente`.

La clave se usa solo en el servidor mediante la cabecera `x-goog-api-key`. Nunca la incluyas en HTML, JavaScript, commits o mensajes.

Para reducir consumo: solo se envía la pregunta actual (sin historial), el contexto está resumido, las respuestas tienen un máximo de 55 palabras y la generación está limitada a 160 tokens. Las preguntas claramente ajenas al sitio reciben una respuesta fija del servidor sin llamar a Gemini.

El límite de diez preguntas por hora es por instancia y no equivale a un límite global. Añade Rate Limiting global en Cloudflare antes de publicar ampliamente.

**Privacidad:** en el nivel gratuito de Gemini API, Google puede utilizar los datos enviados para mejorar sus productos y los datos pueden ser revisados por personas. No enviar datos personales, académicos, privados ni sensibles. Consulta las condiciones de uso de Gemini API: https://ai.google.dev/gemini-api/terms
