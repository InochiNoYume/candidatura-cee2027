# CEE 2027 · CEAT

Sitio informativo de la candidatura al Centro de Estudiantes del Liceo Mauricio Hochschild (CEAT).

**Eslogan:** Compromiso, Gestión y Acción Estudiantil.

> Este repositorio contiene el sitio de la candidatura y su documentación técnica. Las propuestas se presentan como compromisos de trabajo, no como resultados ya conseguidos.

## Sitio y repositorio

- **Sitio público:** https://candidatura-cee2027.pages.dev/
- **Repositorio:** https://github.com/InochiNoYume/candidatura-cee2027
- **Plataforma:** Cloudflare Pages.
- **Rama de producción:** `main`.
- **Arquitectura:** sitio estático HTML, CSS y JavaScript, con una Cloudflare Pages Function para el asistente informativo.

## Tecnologías

- HTML5 semántico.
- CSS3 con diseño responsive y preferencias de movimiento reducido.
- JavaScript del navegador, sin framework de interfaz.
- Cloudflare Pages y Pages Functions.
- Google Gemini API como único motor del asistente mediante una función del servidor.
- GitHub Actions para validaciones y auditorías automatizadas.
- Playwright, axe-core y Lighthouse para pruebas.

## Estructura del repositorio

| Ruta | Propósito |
| --- | --- |
| `index.html` | Portada del sitio. |
| `pages/` | Páginas informativas y de participación. |
| `css/styles.css` | Estilos generales y componentes visuales. |
| `css/layout.css` | Ajustes compartidos de estructura y responsive. |
| `js/main.js` | Navegación, filtros, efectos y asistente. |
| `js/search.js` | Buscador interno del sitio. |
| `functions/api/asistente.js` | Endpoint del asistente Gemini. |
| `functions/README.md` | Configuración, fuentes y límites del asistente. |
| `assets/` | Logotipo, iconos, ilustraciones y recursos visuales. |
| `scripts/` | Validaciones de estructura, seguridad y auditoría. |
| `.github/workflows/` | Automatizaciones de CI y auditoría del sitio. |
| `_headers` | Cabeceras HTTP y Content Security Policy (CSP). |
| `SECURITY.md` | Recomendaciones de seguridad del repositorio. |

## Páginas del sitio

- Inicio: `/`
- Nuestra lista: `/pages/lista`
- Proyecto y ejes: `/pages/proyecto`
- Agenda: `/pages/agenda`
- Transparencia: `/pages/transparencia`
- Noticias: `/pages/noticias`
- Galería: `/pages/galeria`
- CEAT Te Escucha: `/pages/escucha`
- Preguntas frecuentes: `/pages/preguntas`
- Contacto: `/pages/contacto`
- Actas y acuerdos: `/pages/actas`
- Informes de gestión: `/pages/informes`
- Comunidad TP: `/pages/comunidad-tp`
- Memoria de actividades: `/pages/memoria`
- Privacidad: `/pages/privacidad`
- Búsqueda: `/pages/buscar`
- Página no encontrada: `/404.html`

Cloudflare Pages aplica URLs limpias: las rutas públicas se pueden abrir sin la extensión `.html`. La auditoría de rendimiento usa las rutas canónicas sin extensión para evitar medir una redirección de normalización como si fuera tiempo propio de la página.

## Proyecto y contenido

La propuesta se organiza en cinco ejes. Los cuatro primeros corresponden a los ejes oficiales de la candidatura; el quinto es complementario.

1. **Medio Ambiente y Sustentabilidad Escolar.**
2. **Cuidado de Infraestructura y Convivencia Escolar.**
3. **Deportes, Recreación y Vida Saludable.**
4. **Identidad y Vinculación Técnico-Profesional (TP).**
5. **Bienestar, Apoyo y Participación Estudiantil** (eje complementario):
   - Red de Apoyo Académico entre Estudiantes.
   - Voz Estudiantil y Seguimiento de Propuestas.
   - Información de Oportunidades para el Alumnado.
   - Reconocimiento e Integración Estudiantil.

### Agenda publicada

- **23–26 de noviembre de 2026:** inscripción de listas ante la Junta Electoral.
- **27 de noviembre–4 de diciembre:** difusión de campaña y propuestas.
- **30 de noviembre y 1 de diciembre:** presentaciones de listas en el auditorio.
- **10 de diciembre:** votación y elección del Centro de Estudiantes.
- **11 de diciembre:** ceremonia de traspaso con presidentes de curso.

Las fechas y los contenidos deben mantenerse alineados con la documentación oficial. No agregar nombres, cargos, resultados, actividades realizadas ni compromisos que no estén confirmados.

## Fotografías e identidad visual

Las cinco imágenes JPEG de los ejes están integradas en `pages/proyecto.html` como material estrictamente referencial y llevan un aviso visible que indica que fueron localizadas mediante Google Imágenes y que se actualizarán próximamente. Google Imágenes es un buscador, no el autor ni una licencia de uso: antes de mantener estas imágenes en producción se deben verificar sus fuentes y permisos, o reemplazarlas por fotografías propias autorizadas del CEAT. Las ilustraciones SVG de `assets/images/illustrations/` se conservan como respaldo dentro de cada elemento `<picture>`. La portada y el bloque «Tu voz también construye» siguen pendientes de fotografías reales autorizadas.

### Carpetas y nombres para las próximas imágenes

Cada carpeta contiene un `README.md` con instrucciones y nombres exactos. Resumen:

| Sección / uso | Carpeta | Nombre previsto | Necesidad |
| --- | --- | --- | --- |
| Inicio · imagen principal | `assets/images/inicio/` | `portada-inicio.webp` | Recomendada; reemplazará la ilustración de portada. |
| Inicio · «Tu voz también construye» | `assets/images/inicio/` | `tu-voz-tambien-construye.webp` | Recomendada; reemplazará la ilustración actual de participación. |
| Nuestra lista · retratos | `assets/images/integrantes/` | Nombre por cargo, detallado en su README | Solo si hay retratos autorizados. |
| Nuestra lista · foto grupal | `assets/images/grupo/` | `lista-cee-2027-completa-01.jpg` | Opcional, con autorización de todas las personas identificables. |
| Proyecto · ejes 1 al 5 | `assets/images/ejes/` | Cinco JPEG ya subidos: nombres exactos en su README | Pendiente revisión visual e integración; las ilustraciones siguen como respaldo. |
| Noticias | `assets/images/noticias/` | `AAAA-MM-DD-titulo-noticia.webp` | Opcional por noticia. |
| Galería y Memoria | `assets/images/actividades/` | `AAAA-MM-DD-nombre-de-actividad-01.webp` | Solo para registros reales autorizados. |
| Comunidad TP | `assets/images/comunidad-tp/` | Nombres por proyecto o especialidad, detallados en su README | Opcional, cuando existan proyectos o experiencias reales. |

Agenda, Transparencia, Actas, Informes, Contacto y Preguntas no necesitan fotografías para funcionar correctamente. La Galería y la Memoria reutilizan las fotografías de `actividades/` y `grupo/`; no requieren carpetas duplicadas.

**Formato:** WebP optimizado como primera opción; JPG/JPEG cuando corresponda. Conserva siempre la extensión real del archivo y usa minúsculas, sin tildes ni espacios. No renombres un archivo para simular otro formato.

Las fotografías de estudiantes deben contar con las autorizaciones correspondientes antes de publicarse. Al recibir las imágenes definitivas, se revisarán recorte, proporción, resolución, peso, texto alternativo y adaptación a móvil y escritorio. Añadir archivos a estas carpetas no los conecta automáticamente con el sitio: también habrá que actualizar las referencias HTML/CSS y comprobar la visualización en escritorio y móvil.

## Asistente informativo

El asistente de la web utiliza **únicamente Google Gemini** desde `functions/api/asistente.js`.

- Se configura mediante el Secret `GEMINI_API_KEY`; el modelo predeterminado es `gemini-3.5-flash-lite` y puede sobrescribirse con `GEMINI_MODEL`.
- Utiliza URL Context para consultar páginas públicas del propio sitio.
- Selecciona páginas según el tema de la pregunta y puede consultar todas las secciones para preguntas generales.
- Está limitado a consultas relacionadas con la web CEE 2027.
- No mantiene historial de conversación en el sitio.
- Máximo de 500 caracteres por pregunta, 130 palabras por respuesta y 420 tokens de salida.
- El timeout del proveedor es de 20 segundos, con hasta dos intentos ante fallos transitorios.
- El límite básico de diez consultas por hora se mantiene en memoria por instancia de Function; no equivale a un límite global.
- Si Gemini falla, el asistente informa el problema de forma segura; no utiliza otro proveedor.

No incluir la clave API en el código del navegador, archivos versionados, commits, registros ni documentación. No enviar datos personales, sensibles, privados o académicos al asistente. El tratamiento de las consultas y las condiciones de Gemini se explican en [Privacidad](pages/privacidad.html).

Más detalles: [functions/README.md](functions/README.md).

## Seguridad

- La política CSP y las cabeceras HTTP se mantienen en `_headers`.
- La clave de Gemini solo se utiliza desde el servidor.
- El buscador construye sus resultados con nodos DOM y `textContent`.
- La función valida origen, tipo y tamaño de la solicitud, longitud de la pregunta y límites de uso.
- No se deben registrar ni mostrar claves, secretos o respuestas técnicas sensibles.
- La limitación de consultas por instancia no reemplaza un servicio de Rate Limiting global de Cloudflare si el tráfico aumenta.

Antes de modificar CSP, comprobar los dominios estrictamente necesarios para las funciones utilizadas y mantener las demás directivas restrictivas.

## Pruebas y auditorías

### Automatizaciones

- `.github/workflows/site-checks.yml`: sintaxis JavaScript, comprobaciones del asistente, estructura HTML, enlaces locales y controles de seguridad.
- `.github/workflows/live-site-audit.yml`: revisión responsive de páginas, navegación, filtros, accesibilidad y puntuaciones Lighthouse.

### Última auditoría registrada

**19 de noviembre de 2026**, sobre el sitio público. Se registraron dos ejecuciones relevantes: la auditoría base tras PR #18 y otra posterior al nuevo despliegue con los cinco JPEG de ejes:

- 103 combinaciones de página y viewport comprobadas.
- 0 infracciones detectadas por axe.
- 0 fallos bloqueantes en la auditoría responsive.
- Lighthouse en las páginas revisadas:

| Página | Rendimiento | Accesibilidad | Buenas prácticas | SEO |
| --- | ---: | ---: | ---: | ---: |
| Inicio | 94 | 100 | 92 | 100 |
| CEAT Te Escucha | 81 | 100 | 92 | 100 |
| Nuestra lista | 99 | 100 | 92 | 100 |
| Proyecto | 99 | 100 | 92 | 100 |

En la segunda ejecución, el rendimiento de CEAT Te Escucha subió de 81 a 99 y las cuatro páginas evaluadas marcaron 99 en rendimiento, 100 en accesibilidad y 100 en SEO. El 92 de buenas prácticas se mantuvo en esa medición.

La revisión inicial relacionó el 92 de buenas prácticas con un error de consola: el beacon de Cloudflare Web Analytics intentaba conectarse a `cloudflareinsights.com`, pero `connect-src` solo permitía el mismo origen. El cambio de CSP ya fue integrado en `main` mediante el PR #19. La auditoría posterior al despliegue, ejecución [44528118319](https://github.com/InochiNoYume/candidatura-cee2027/actions/runs/44528118319), confirmó **100/100 en buenas prácticas para las cuatro páginas evaluadas**, además de 100 en accesibilidad y SEO. El rendimiento registrado fue 95 en Inicio, 100 en CEAT Te Escucha y 99 en Nuestra lista y Proyecto.

Los resultados de Lighthouse pueden variar entre ejecuciones; conviene comparar mediciones posteriores y no tratar un único puntaje como garantía permanente.

- Auditoría base: [GitHub Actions · ejecución 44520081909](https://github.com/InochiNoYume/candidatura-cee2027/actions/runs/44520081909).
- Auditoría posterior: [GitHub Actions · ejecución 44523480582](https://github.com/InochiNoYume/candidatura-cee2027/actions/runs/44523480582).
- Auditoría tras la corrección CSP de PR #19: [GitHub Actions · ejecución 44528118319](https://github.com/InochiNoYume/candidatura-cee2027/actions/runs/44528118319).

### Verificación manual pendiente

- Revisar visualmente las páginas en teléfonos, tabletas y escritorio.
- Repetir Lighthouse después de los cambios y comparar varias ejecuciones.
- Probar el asistente en producción con preguntas normales y errores controlados, sin exponer secretos ni generar solicitudes innecesarias.
- Confirmar los enlaces definitivos y el Instagram de la candidatura.
- Revisar el formulario externo antes de publicarlo.
- Incorporar las fotografías reales autorizadas y repetir la auditoría final.

Las pruebas automatizadas no sustituyen la revisión visual ni garantizan por sí solas el comportamiento de servicios externos como Gemini.

## Desarrollo y publicación

1. Crear una rama de trabajo desde `main`.
2. Realizar cambios pequeños y relacionados.
3. Ejecutar las validaciones locales disponibles.
4. Abrir un Pull Request y revisar los checks y el preview.
5. Integrar a `main` solo después de aprobar los cambios.
6. Confirmar el resultado del despliegue y volver a ejecutar las auditorías públicas.

No se debe afirmar que un cambio está en producción hasta comprobar el despliegue correspondiente.
