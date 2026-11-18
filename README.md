# CEE 2027 · CEAT

Sitio informativo de la candidatura al Centro de Estudiantes del Liceo Mauricio Hochschild (CEAT).

**Eslogan:** Compromiso, Gestión y Acción Estudiantil.

## Sitio y publicación

- Sitio público: https://candidatura-cee2027.pages.dev/
- Repositorio: https://github.com/InochiNoYume/candidatura-cee2027
- Hosting: Cloudflare Pages.
- Rama de producción: `main`.
- Tipo de proyecto: sitio estático HTML, CSS y JavaScript; no requiere servidor ni compilación.
- Directorio de salida de Pages: raíz del repositorio (`.`).

Los cambios enviados a `main` pueden activar el despliegue de producción. Los pull requests generan vistas previas de Cloudflare Pages; una vista previa correcta no significa que el cambio ya esté publicado en producción.

## Estructura del repositorio

- `index.html`: portada.
- `pages/`: páginas informativas de candidatura, proyecto, agenda, transparencia, noticias, galería, participación, preguntas, contacto y documentos.
- `css/styles.css`: estilos base y componentes visuales.
- `css/layout.css`: ajustes compartidos de estructura, navegación, tarjetas y diseño responsive.
- `js/main.js`: genera la navegación global y el pie de página, controla el menú adaptable, estados activos, filtros y efectos de entrada.
- `js/search.js`: búsqueda interna.
- `functions/api/asistente.js`: endpoint privado de servidor para el asistente con Workers AI.
- `assets/images/logo/`: logotipo institucional.
- `assets/images/illustrations/`: ilustraciones conceptuales en SVG.
- `assets/images/actividades/`, `grupo/` e `integrantes/`: espacios reservados para fotografías reales autorizadas.
- `assets/icons/` y `assets/images/og/`: favicon y recurso de vista previa al compartir.
- `scripts/`: validaciones automáticas del sitio y de seguridad.
- `.github/workflows/`: flujos de integración continua.
- `_headers`: cabeceras HTTP para Cloudflare Pages.
- `SECURITY.md`: criterios de seguridad web y del repositorio.

## Navegación y diseño adaptable

La barra de navegación y los grupos del pie se construyen desde `js/main.js`; por eso las páginas mantienen una estructura común. En escritorio los grupos se muestran como menús desplegables. En anchos menores se utiliza el botón de menú para evitar comprimir los enlaces. Los estilos responsive se mantienen en `css/layout.css` y `css/styles.css`.

Al modificar los enlaces globales, revisa tanto la navegación como el pie y prueba las páginas desde la portada y desde una URL dentro de `/pages/`.

## Contenido programático

El proyecto conserva los cuatro ejes del documento oficial y un quinto eje complementario para bienestar, apoyo y participación estudiantil. Las propuestas no deben presentarse como logros ya realizados. Fechas, noticias, avances y estados de transparencia solo se actualizan con información confirmada.

## Pendientes de contenido

- Incorporar fotografías reales del equipo y de actividades cuando sean entregadas y exista autorización para publicarlas.
- Conectar el formulario real de CEAT Te Escucha cuando se confirme el enlace.
- Confirmar los datos de contacto propios de la candidatura y completar la información del equipo cuando corresponda.

Los espacios reservados de fotografías no deben rellenarse con imágenes ficticias o de otras personas.

## Privacidad y publicación

Las fotografías de estudiantes requieren autorización para su difusión. Los formularios deben explicar qué información se recopila y para qué se utiliza. No publicar datos personales innecesarios. Los estados de transparencia deben reflejar únicamente gestiones verificables.

## Integración continua y auditoría

El workflow `.github/workflows/site-checks.yml` ejecuta:

1. Comprobación de sintaxis JavaScript con Node.js.
2. Validación de estructura HTML y enlaces locales mediante `scripts/check-site.mjs`.
3. Comprobaciones de cabeceras, renderizado seguro del buscador y ausencia de material de claves privadas versionado mediante `scripts/check-security.mjs`.

Estos checks no sustituyen una revisión visual en navegador. Después de cambios de CSS o navegación, comprueba escritorio, tablet y móvil, además de revisar la vista previa de Cloudflare y los comentarios del pull request.

## Asistente IA

El asistente informativo utiliza Cloudflare Workers AI desde una Pages Function. En Cloudflare Pages configura el binding **Workers AI** con nombre **AI** en Settings → Functions → Workers AI bindings y vuelve a desplegar. El modelo se ejecuta en el servidor; no se requiere exponer claves en el navegador. Sin el binding, el asistente muestra un aviso de servicio no activado. No se guarda el historial de preguntas; evita introducir datos personales.

## Seguridad

Las cabeceras y la política CSP para Cloudflare Pages están en `_headers`. Las pautas de seguridad se documentan en [SECURITY.md](SECURITY.md). El sitio es estático y no requiere administrar un servidor propio.

## Tecnología

HTML5, CSS3, JavaScript y Cloudflare Pages. No hay framework ni proceso de compilación.
