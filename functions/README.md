# Asistente CEE 2027

1. En Cloudflare Pages → Settings → Variables and Secrets, añade **GROQ_API_KEY** como secret.
2. Opcional: define **GROQ_MODEL**. Predeterminado: \`openai/gpt-oss-20b\`.
3. Despliega y prueba \`POST /api/asistente\`.

La clave se usa solo en el servidor mediante \`Authorization: Bearer\`. Nunca la incluyas en HTML, JavaScript, commits o mensajes.

Para ahorrar tokens: solo se envía la pregunta actual (sin historial), el contexto está resumido, las respuestas tienen un máximo de 55 palabras, el máximo de finalización es 120 tokens y el razonamiento se limita a nivel bajo. Las preguntas fuera de tema reciben una respuesta fija del servidor.

El límite de diez preguntas por hora es por instancia y no equivale a un límite global. Añade Rate Limiting global en Cloudflare antes de publicar ampliamente.

Groq indica que las solicitudes normales de inferencia no se conservan por defecto; puede registrar temporalmente entradas y salidas por fiabilidad o abuso hasta 30 días. Declara que no utiliza datos de clientes para entrenar modelos. No enviar datos personales, privados ni sensibles. Más información: https://console.groq.com/docs/your-data
