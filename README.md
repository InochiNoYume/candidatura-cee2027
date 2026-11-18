# CEE 2027 · CEAT

Sitio informativo de la candidatura al Centro de Estudiantes del Liceo Mauricio Hochschild (CEAT).

**Eslogan:** Compromiso, Gestión y Acción Estudiantil.

## Sitio publicado

La versión pública se encuentra en [https://candidatura-cee2027.pages.dev/](https://candidatura-cee2027.pages.dev/).

El sitio se publica mediante **Cloudflare Pages**, conectado al repositorio GitHub. La rama de producción es `main`; al enviar cambios a esa rama, Pages puede desplegar automáticamente una nueva versión.

### Configuración de publicación

- Proveedor: Cloudflare Pages.
- Repositorio: `InochiNoYume/candidatura-cee2027`.
- Rama de producción: `main`.
- Directorio raíz: raíz del repositorio (`.`).
- Comando de compilación: vacío (sitio estático sin proceso de build).
- Directorio de salida: `.`.

## Estructura

- `index.html`: portada.
- `pages/`: páginas de lista, proyecto, agenda, transparencia, noticias, galería, CEAT Te Escucha y demás secciones informativas.
- `css/`: estilos y diseño adaptable.
- `js/`: menú móvil, búsqueda y mejoras de interacción.
- `assets/`: logotipo, iconos e ilustraciones.

## Pendientes de contenido

- Incorporar fotografías reales del equipo y actividades cuando sean proporcionadas y exista autorización para publicarlas.
- Añadir el enlace real de Google Forms en CEAT Te Escucha.
- Añadir o actualizar noticias, agenda y registros solo cuando existan datos confirmados.

El logotipo institucional ya está incorporado.

## Criterios editoriales y privacidad

Las propuestas no se presentan como logros realizados. Los estados de transparencia deben actualizarse únicamente con información verificable. Las fotografías de estudiantes requieren autorización para su publicación. Los canales de participación deben explicar con claridad cómo se reciben y utilizan las respuestas.

## Seguridad

Las cabeceras HTTP y la CSP para Cloudflare Pages están definidas en `_headers`. Las pautas de protección XSS y los ajustes recomendados de seguridad de la cuenta y del repositorio se documentan en [SECURITY.md](SECURITY.md). La validación automática se ejecuta mediante `scripts/check-security.mjs` en GitHub Actions.

## Tecnología

HTML5, CSS3 y JavaScript sin dependencias de compilación. Sitio estático preparado para Cloudflare Pages.
