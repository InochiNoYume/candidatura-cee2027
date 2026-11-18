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
- `js/main.js`: navegación global, pie de página, menú adaptable, filtros y efectos de entrada.
- `js/search.js`: búsqueda interna.
- `functions/api/asistente.js`: endpoint privado del asistente con Gemini API.
- `assets/`: imágenes, ilustraciones, iconos y recursos gráficos.
- `scripts/`: validaciones automáticas del sitio y de seguridad.
- `.github/workflows/`: flujos de integración continua.
- `_headers`: cabeceras HTTP para Cloudflare Pages.
- `SECURITY.md`: criterios de seguridad web y del repositorio.

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

El workflow `.github/workflows/site-checks.yml` ejecuta comprobaciones de sintaxis JavaScript, estructura HTML, enlaces locales, cabeceras, renderizado seguro y validación del asistente. Estos checks no sustituyen una revisión visual en navegador.

## Asistente IA

El asistente utiliza Gemini API desde una Pages Function. Configura `GEMINI_API_KEY` como secret en Cloudflare Pages; nunca la expongas en el navegador ni en el repositorio. El endpoint filtra preguntas fuera del ámbito CEE y responde exclusivamente con el contexto oficial. La configuración y los límites están documentados en [functions/README.md](functions/README.md). No se guarda el historial de preguntas; evita introducir datos personales. En el nivel gratuito, Google indica que el contenido puede utilizarse para mejorar sus productos.

## Seguridad

Las cabeceras y la política CSP para Cloudflare Pages están en `_headers`. Las pautas de seguridad se documentan en [SECURITY.md](SECURITY.md). El sitio es estático y no requiere administrar un servidor propio.

## Tecnología

HTML5, CSS3, JavaScript y Cloudflare Pages. No hay framework ni proceso de compilación.
