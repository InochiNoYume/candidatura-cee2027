# Mantenimiento del sitio CEE 2027 · CEAT

## Estructura

- `index.html`: portada.
- `pages/`: páginas internas.
- `css/styles.css`: estilos base y componentes generales.
- `css/layout.css`: capas de composición, responsive y refinamientos visuales.
- `js/main.js`: navegación, filtros, efectos y controles globales.
- `js/search.js`: buscador interno.
- `assets/images/`: ilustraciones, logotipo y recursos visuales.
- `scripts/check-site.mjs`: validación estática de estructura, rutas, HTML, CSS y sintaxis.
- `scripts/audit-live-site.mjs`: auditoría real con navegador, axe y pruebas funcionales.

## Comprobaciones automáticas

Cada cambio en `main` ejecuta:

1. **Site quality checks**: sintaxis JavaScript, estructura HTML, enlaces y anclas locales, recursos CSS, metadatos, navegación y requisitos básicos de accesibilidad.
2. **Live accessibility and performance audit**: 17 rutas en seis anchos de pantalla (móvil, tablet, portátil y escritorio), filtros, navegación, buscador, accesibilidad automatizada y Lighthouse en cuatro páginas clave.
3. **GitHub Pages deployment**: construcción y publicación.

No considerar un cambio terminado hasta que los tres flujos del commit correspondiente finalicen correctamente.

## Reglas para evitar regresiones

- Mantener las rutas relativas correctas: las páginas internas viven dentro de `pages/`.
- Al crear una página, añadirla a la navegación, al buscador, al sitemap y a las listas de pruebas.
- Conservar un único `main` por página, títulos descriptivos, meta description, canonical y texto alternativo para imágenes informativas.
- Los filtros deben conservar `data-filter-group`, `data-filter-item`, `data-category` y los estados `aria-pressed`.
- Mantener el soporte de `prefers-reduced-motion`; no añadir animaciones obligatorias.
- No eliminar ni reordenar reglas de `layout.css` sin comparar los resultados en móvil y escritorio: contiene refinamientos posteriores que complementan los estilos base.
- No publicar fechas, fotografías, resultados, responsables ni actividades que no hayan sido confirmados.
- Mantener los formularios, fotografías y asesores pendientes hasta recibir la información correspondiente.

## Línea base de rendimiento

Auditoría del commit `aeb51ec` (18-11-2026):

| Página | Rendimiento | Accesibilidad | Buenas prácticas | SEO |
|---|---:|---:|---:|---:|
| Inicio | 99 | 100 | 100 | 100 |
| Lista | 99 | 100 | 100 | 100 |
| Proyecto | 99 | 100 | 100 | 100 |
| Te Escucha | 99 | 100 | 100 | 100 |

La auditoría recorrió 34 combinaciones de página y dispositivo, registró cero infracciones de axe y verificó la respuesta 404 de una ruta inexistente. Estas cifras son una línea base, no una garantía permanente: deben repetirse tras cada cambio importante.

## Optimizaciones conocidas para una próxima pasada

- El logotipo institucional PNG ocupa aproximadamente 462 KB. Reducirlo únicamente a partir del archivo original y comparar transparencia, nitidez y colores antes de sustituirlo.
- Los estilos tienen capas y selectores repetidos por los sucesivos refinamientos visuales. Consolidarlos en una tarea aislada con capturas de referencia y auditoría responsive; no hacer una limpieza masiva junto con cambios funcionales.
- Mantener la vista previa social y revisar compatibilidad de imágenes Open Graph en las plataformas donde se comparta el sitio.


## Navbar y puntos de corte

- El menú horizontal se reserva para pantallas de más de 1240 px; hasta 1240 px se utiliza el menú desplegable para evitar que los grupos se compriman.
- Cada grupo del menú debe mostrar una sola flecha, proporcionada por el elemento `.nav-chevron` generado en `js/main.js`; no añadir una segunda flecha mediante pseudo-elementos.
- La auditoría responsive cubre 390, 768, 1024, 1240, 1280 y 1440 px. Revisar especialmente el salto entre 1240 y 1280 px.

 
## Asistente informativo y efectos visuales

- El asistente utiliza Google Gemini mediante una Pages Function en `functions/api/asistente.js`; no utiliza el binding Workers AI ni modelos Gemma.
- En Cloudflare Pages → Settings → Variables and Secrets, configura `GEMINI_API_KEY` como Secret. Debe existir por separado en Preview y Production, según el entorno que se vaya a probar.
- `GEMINI_MODEL` es opcional; el valor predeterminado es `gemini-3.5-flash-lite`. La clave se envía solo desde el servidor mediante `x-goog-api-key`; nunca incluirla en el navegador, repositorio o mensajes.
- El asistente limita cada pregunta a 500 caracteres, no persiste el historial y utiliza Gemini URL Context para recuperar páginas públicas del propio sitio. El inventario contiene 16 páginas; una pregunta general puede consultar las 16 (dentro del máximo de 20 URL por solicitud de la herramienta).
- La aplicación solo muestra como fuentes las URL que Gemini informa como recuperadas correctamente. Si no se recupera ninguna, no presenta una respuesta factual como si estuviera verificada.
- Las respuestas se limitan a 130 palabras y 420 tokens de generación. El filtro local debe reconocer variantes frecuentes como «ejes» y «elecciones», y rechazar consultas ajenas antes de llamar a Gemini.
- La limitación de diez preguntas por hora se mantiene en memoria por instancia; no equivale a un rate limit global. Para cuotas estrictas, configurar Rate Limiting en Cloudflare.
- Antes de publicar, probar `POST /api/asistente` desde la vista previa con `GEMINI_API_KEY` configurada en Preview y verificar preguntas dentro y fuera de ámbito, recuperación de fuentes y errores de cuota. Repetir en Production solo cuando se autorice el despliegue.
- El rastro de partículas se comparte entre páginas, usa pointer events para mouse y tacto, limita la cantidad de partículas y se desactiva con `prefers-reduced-motion`.
- Los degradados y controles visuales usan CSS local; no se incorporan librerías de terceros.
