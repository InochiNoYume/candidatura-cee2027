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
2. **Live accessibility and performance audit**: 17 rutas en móvil y escritorio, filtros, navegación, buscador, accesibilidad automatizada y Lighthouse en cuatro páginas clave.
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
