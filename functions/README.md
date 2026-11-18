# Configuración del asistente CEE 2027

1. En Cloudflare Dashboard → Workers & Pages → candidatura-cee2027 → Settings → Variables and Secrets.
2. Añade **GEMINI_API_KEY** como secret (no como variable pública).
3. Opcionalmente, define **GEMINI_MODEL** como variable de texto; el valor predeterminado del código es `gemini-3.8-flash`.
4. Ejecuta un nuevo despliegue de Pages.
5. Comprueba que `POST /api/asistente` responde con JSON y prueba preguntas dentro y fuera del ámbito.

La Function llama a Gemini desde el servidor mediante la cabecera `x-goog-api-key`. La clave nunca debe incluirse en HTML, JavaScript del navegador, commits, issues ni mensajes. No compartas la clave en el chat.

El asistente clasifica cada pregunta como `in_scope` o `out_of_scope` mediante salida JSON estructurada. Si es ajena al sitio, el servidor devuelve un mensaje fijo; no se utiliza la respuesta libre del modelo para esa situación. El modelo solo puede contestar con el contexto oficial incluido en la Function.

La limitación actual de diez consultas por hora se mantiene en memoria por instancia y es solo una barrera básica; no representa un límite global fiable. Para imponer cuotas globales, configura una regla de Rate Limiting de Cloudflare antes de abrir el asistente al público. Las preguntas no se persisten en la web.

Importante: en el nivel gratuito de Gemini API, Google indica que el contenido puede utilizarse para mejorar sus productos. No se deben enviar datos personales, académicos privados, confidenciales ni sensibles. Revisa las condiciones y el nivel de uso aplicable antes de activar el servicio.
