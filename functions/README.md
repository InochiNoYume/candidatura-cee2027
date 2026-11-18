# Configuración del asistente CEE 2027

1. Abre Cloudflare Dashboard → Workers & Pages → candidatura-cee2027.
2. Entra en Settings → Functions → Workers AI bindings.
3. Añade un binding con variable **AI** y guarda.
4. Ejecuta un nuevo despliegue de Pages.
5. Comprueba que `POST /api/asistente` responde con JSON.

La Function utiliza el modelo `@cf/meta/llama-3.1-8b-instruct`. El modelo y el binding se ejecutan del lado del servidor; no añadas credenciales al repositorio ni al JavaScript del navegador.

La limitación de diez consultas por hora se mantiene en memoria por instancia y es solo una barrera básica; no representa un límite global fiable. Para imponer cuotas globales, crea una regla de Rate Limiting en Cloudflare antes de abrir el asistente al público. Las preguntas no se persisten en la web.