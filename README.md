# CEE 2027 · CEAT

Sitio informativo de la candidatura al Centro de Estudiantes del Liceo Mauricio Hochschild (CEAT).

**Eslogan:** Compromiso, Gestión y Acción Estudiantil.

## Sitio
- Público: https://candidatura-cee2027.pages.dev/
- Repositorio: https://github.com/InochiNoYume/candidatura-cee2027
- Hosting: Cloudflare Pages; rama de producción: `main`.
- Sitio estático HTML, CSS y JavaScript.

## Estructura
- `index.html`: portada.
- `pages/`: páginas de candidatura, proyecto, agenda, transparencia, noticias, galería, participación, preguntas, contacto y documentos.
- `css/`: estilos y diseño responsive.
- `js/main.js`: navegación, filtros, efectos y asistente.
- `js/search.js`: búsqueda interna.
- `functions/api/asistente.js`: endpoint privado con Groq.
- `assets/`: recursos gráficos.
- `scripts/`: validaciones.
- `.github/workflows/`: CI.
- `_headers`: cabeceras HTTP.
- `SECURITY.md`: criterios de seguridad.

## Contenido
Se mantienen los cuatro ejes oficiales y el quinto eje complementario de bienestar, apoyo y participación. No presentar propuestas como logros ni inventar fechas o avances.

## Pendientes de contenido
Fotografías reales autorizadas, formulario CEAT Te Escucha, Instagram de candidatura, datos confirmados del equipo y profesores asesores.

## Auditoría
El workflow `.github/workflows/site-checks.yml` valida sintaxis, HTML, enlaces, cabeceras, renderizado seguro y el asistente. No sustituye pruebas visuales en navegador.

## Asistente IA
Usa Groq desde Cloudflare Pages Functions. Configura `GROQ_API_KEY` como secret. Modelo predeterminado: `openai/gpt-oss-20b`. Para ahorrar tokens: contexto compacto, sin historial, máximo 55 palabras por respuesta, 120 tokens de finalización y razonamiento bajo. Solo responde sobre la web CEE 2027. No guarda conversaciones. Ver [functions/README.md](functions/README.md) y [Privacidad](pages/privacidad.html).

## Seguridad
Cabeceras y CSP en `_headers`; pautas adicionales en `SECURITY.md`. Tecnología: HTML5, CSS3, JavaScript y Cloudflare Pages.
