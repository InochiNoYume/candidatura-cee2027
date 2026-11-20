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
- El timeout del proveedor es de 20 segundos, con hasta tres intentos ante fallos transitorios.
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

### Auditoría de la PR #21 · 20 de noviembre de 2026

La auditoría responsive [ejecución 223](https://github.com/InochiNoYume/candidatura-cee2027/actions/runs/44753206680) se completó con error sobre el HEAD `61b9954` de la vista previa de la PR #21, no sobre producción:

- Se recorrieron 109 combinaciones de página y viewport.
- Se detectaron seis infracciones axe `label-content-name-mismatch`, una en `maintenance.html` por cada viewport.
- Se registraron 18 fallos bloqueantes: dos relacionados con la superposición/orden visual de «Asistente CEE» y «Volver arriba» por viewport, y una infracción de mantenimiento por viewport.
- Lighthouse se omitió porque el recorrido responsive terminó con error.
- Los [73 archivos de resultados y capturas](https://github.com/InochiNoYume/candidatura-cee2027/actions/runs/44753206680/artifacts/14639196925) permiten revisar el detalle.

La revisión del código identificó las causas iniciales: el lanzador se desplazaba al aparecer la flecha y el enlace de mantenimiento declaraba un `aria-label` que no coincidía con el texto visible. La auditoría 227 confirmó que el ajuste de mantenimiento resolvió las seis infracciones axe, pero también reveló que `css/layout.css`, cargado después de `css/styles.css`, sobrescribía el `z-index` de la flecha a 90. Por eso el ajuste anterior en `styles.css` no tenía efecto final. La corrección vigente fija el orden de capas al final de `layout.css`, con prioridad explícita, y mantiene el lanzador en su posición inferior. También se amplió el reintento de errores transitorios de Gemini a tres intentos con espera creciente.

La auditoría 227 registró 0 infracciones axe y 72/72 capturas; falló por seis comprobaciones del orden de capas y una respuesta Gemini 503 en la pregunta de integrantes. Las nuevas correcciones están en la rama de la PR #21. La auditoría sobre el nuevo HEAD todavía debe ejecutarse y aprobarse; no se declaran resueltas hasta verificar sus resultados y capturas.

La PR #21 permanece abierta y sin fusionar. La vista previa no sustituye una aprobación de producción.

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


### Ajuste de controles flotantes · 20 de noviembre de 2026

El lanzador del Asistente CEE permanece en su posición inferior habitual. «Volver arriba» conserva una posición superior con separación mínima de 8 px y una capa visual mayor que el lanzador; el panel del asistente mantiene su capa independiente. La prueba responsive verifica geometría y `z-index` en los seis viewports. La confirmación final depende de la nueva auditoría y de revisar sus capturas.


### Segunda corrección de auditoría · 20 de noviembre de 2026

La ejecución 227 confirmó que `css/layout.css` se carga después de `css/styles.css` y sobrescribía `.back-to-top` con `z-index: 90`. La jerarquía final de los tres controles se establece ahora al final de `layout.css` para evitar que el archivo posterior revierta el orden: flecha 802, panel 801 y lanzador 800 (excepto mientras el menú está abierto). Además, Gemini ahora reintenta hasta tres veces los estados transitorios 408/429/500/502/503/504, con esperas crecientes. Pendiente ejecutar nuevamente auditoría responsive y Gemini.


### Auditoría responsive y rendimiento · 20 de noviembre de 2026 · ejecución 230

La auditoría de la vista previa de la PR #21 terminó correctamente sobre el commit `6375aa677af22790b37cc7a521ce06af07ef5865`:

- 109 combinaciones de página y viewport evaluadas; 0 infracciones axe y 0 fallos bloqueantes.
- 72/72 capturas de referencia correctas.
- Asistente Gemini: 7/7 pruebas correctas, todas con HTTP 200 y tema esperado; no se expusieron metadatos internos.
- La flecha «Volver arriba» superó las comprobaciones de separación y jerarquía visual frente al Asistente CEE.
- Lighthouse en las cuatro páginas clave, escritorio y móvil: rendimiento entre 83 y 100; accesibilidad 100 en todas; buenas prácticas 96; SEO 66–69.

La puntuación de rendimiento móvil de Nuestra lista fue 83 y requiere una medición de seguimiento. Su LCP de laboratorio fue 4,7 s, aunque el desglose del mismo informe atribuyó solo unos 182 ms a las fases de carga y renderizado del recurso LCP; se debe repetir la medición antes de atribuirlo a un recurso concreto. El informe de Lighthouse también registra un error CORS del beacon de Cloudflare Web Analytics en el dominio de Preview. La vista previa está bloqueada para indexación deliberadamente, por lo que el diagnóstico SEO «Page is blocked from indexing» no se debe corregir quitando el noindex de Preview.

Ejecución: [Live accessibility and performance audit · run 44761472248](https://github.com/InochiNoYume/candidatura-cee2027/actions/runs/44761472248). El artefacto [cee-2027-site-audit · 14642776366](https://github.com/InochiNoYume/candidatura-cee2027/actions/runs/44761472248/artifacts/14642776366) conserva informes y capturas.

La suite «Site quality checks» del mismo commit detectó que `scripts/check-assistant.mjs` aún exigía dos intentos, aunque la función ya permite tres. Se actualizaron la aserción del contrato y la prueba de agotamiento a tres intentos. Site quality checks volvió a aprobarse en la ejecución 44765468423 y en el HEAD documental posterior, ejecución 44765488252.


### Ajuste de carga tipográfica en Proyecto · 20 de noviembre de 2026

La auditoría 44765488112 completó 109 combinaciones responsive con 0 infracciones axe y 0 fallos bloqueantes. Lighthouse obtuvo 72 de rendimiento en Proyecto escritorio, frente a 99 en móvil. El diagnóstico identificó la hoja de Google Fonts como recurso bloqueante (ahorro estimado de 2,19 s en esa ejecución); el LCP fue 2,5 s, el TBT 0 ms y el CLS 0,001. Se cambió únicamente Proyecto para precargar la hoja tipográfica y aplicarla después de descargarla, evitando que bloquee el primer renderizado. Las fuentes mantienen sus familias y pesos; si JavaScript no está disponible, el diseño conserva las fuentes de respaldo del CSS. Se debe repetir Lighthouse y revisar que no haya destello tipográfico ni cambios de distribución. El error CORS de Cloudflare Web Analytics aparece también en consola de Preview y requiere validación separada; no se modifica su configuración sin confirmar primero el origen.

Ejecución: [auditoría responsive y Lighthouse · run 44765488112](https://github.com/InochiNoYume/candidatura-cee2027/actions/runs/44765488112). [Artefacto de 81 informes y capturas](https://github.com/InochiNoYume/candidatura-cee2027/actions/runs/44765488112/artifacts/14644863755).


### Auditoría responsive y Lighthouse · 20 de noviembre de 2026 · ejecución 44778879442

La auditoría de la vista previa de la PR #21 terminó con éxito sobre el commit `b590d6d7c829ba1d835f3e293eb06b4530a02dd0`:

- 108 combinaciones reales de página y viewport (18 rutas × 6 viewports), 0 infracciones axe y 0 fallos bloqueantes. La comprobación adicional de una ruta inexistente también devolvió HTTP 404. El mensaje antiguo del log sumaba esa comprobación adicional y mostraba 109; se ajusta el resumen para distinguirla.
- 72/72 capturas generadas (18 páginas × móvil, tablet, escritorio y escritorio ancho).
- Gemini: 7/7 pruebas aprobadas, HTTP 200 y sin exposición de metadatos internos.
- Ocho informes Lighthouse: rendimiento Inicio 94 móvil/100 escritorio; Nuestra lista 99/99; Proyecto 100/96; CEAT Te Escucha 100/100. Accesibilidad 100 y buenas prácticas 96 en los ocho informes.
- La carga tipográfica de Proyecto queda validada en esta medición: 96 escritorio y 100 móvil; LCP 1,4 s escritorio y 1,2 s móvil.

El seguimiento pendiente es específico: Inicio móvil registra LCP de 2,9 s y rendimiento 94; conviene revisar el elemento LCP antes de cambiar nada. Los ocho informes registran el error de consola de Cloudflare Web Analytics: la solicitud a `https://cloudflareinsights.com/cdn-cgi/rum` desde el dominio temporal de Preview se bloquea por CORS y después aparece `net::ERR_FAILED`. El error corresponde al beacon de Cloudflare, no a una excepción JavaScript del sitio. No modificar ni desactivar la analítica sin verificar primero el comportamiento en producción.

SEO 66–69 se debe al bloqueo de indexación del Preview (`noindex`), que es intencional. No retirar esa protección. Lighthouse también sugiere oportunidades de CSS/recursos visuales; no se harán optimizaciones de logo o imágenes, que quedaron expresamente fuera del alcance.

Ejecución: [Live accessibility and performance audit · run 44778879442](https://github.com/InochiNoYume/candidatura-cee2027/actions/runs/44778879442). Artefacto: [cee-2027-site-audit · 14651908965](https://github.com/InochiNoYume/candidatura-cee2027/actions/runs/44778879442/artifacts/14651908965).

La auditoría automatizada no sustituye la revisión visual/funcional manual de formularios y estados especiales. La PR #21 permanece abierta y sin fusionar.


## Auditoría de Preview · 20 de noviembre de 2026 · ejecución 44783535294

La auditoría más reciente de la PR #21 terminó correctamente sobre el commit `4eaa5264c052762cbae5d65191ef08106f268d16`:

- 108 combinaciones de 18 rutas × 6 viewports; 0 infracciones axe y 0 fallos bloqueantes.
- La ruta inexistente adicional devolvió HTTP 404.
- 72/72 capturas generadas.
- Asistente Gemini: 7/7 pruebas aprobadas.
- Lighthouse: Inicio 94 móvil/100 escritorio; Nuestra lista 99/99; Proyecto 100/100; CEAT Te Escucha 100/100.
- Accesibilidad 100 y buenas prácticas 96 en las ocho mediciones.
- LCP: Inicio móvil 2,9 s; Nuestra lista móvil 1,9 s; Proyecto móvil 1,2 s; CEAT Te Escucha móvil 1,1 s.

El LCP de Inicio móvil sigue siendo el principal indicador de rendimiento a vigilar; no se hará ningún cambio visual o de recursos sin identificar primero el elemento LCP. La puntuación SEO de Preview (66–69) está afectada por el `noindex` intencional del entorno protegido y no justifica retirar esa protección.

El formulario CEAT Te Escucha continúa siendo un espacio de espera: `pages/escucha.html` no contiene todavía un formulario, iframe ni URL de Google Forms. **No existe una variable de entorno de formulario que debas configurar ahora.** Cuando se confirme el enlace oficial, se integrará directamente en la página estática y se probará el destino. No crear una variable ficticia como `GOOGLE_FORM_URL` sin implementar un mecanismo que la lea.

La auditoría automatizada no envía respuestas reales al formulario. La comprobación funcional final queda pendiente hasta integrar el enlace oficial.


## Ajuste final de interfaz móvil · 20 de noviembre de 2026

La revisión de las capturas de la auditoría 44783535294 detectó que el lanzador flotante del asistente podía cubrir texto en pantallas pequeñas. Se compactó a un botón de icono de 48 px hasta 560 px de ancho; su nombre accesible «Abrir Asistente CEE» se conserva mediante `aria-label`. La auditoría ahora verifica el ancho y que la etiqueta visual esté oculta en móvil. Se mantienen el lanzador completo en escritorio y el orden de capas existente. Pendiente validar el nuevo cambio en las ejecuciones CI y la auditoría responsive generadas por este commit.


### Auditoría responsive más reciente · 20 de noviembre de 2026 · ejecución 44787100347

La auditoría de Preview de la PR #21 terminó correctamente sobre el commit `9d81b640cb3aee1ee332ab0b0db5810f2e15f6e3`:

- 108 combinaciones de 18 rutas × 6 viewports; 0 infracciones axe y 0 fallos bloqueantes. La ruta inexistente de control respondió HTTP 404.
- 72/72 capturas generadas; Gemini 7/7 pruebas aprobadas.
- El lanzador móvil compacto (48 px hasta 560 px) pasó la comprobación de anchura y conservación del nombre accesible.
- Lighthouse (móvil/escritorio): Inicio 94/100, Nuestra lista 83/98, Proyecto 100/100 y CEAT Te Escucha 100/100. Accesibilidad 100 y buenas prácticas 96 en las ocho mediciones.

Nuestra lista obtuvo LCP de laboratorio de 4,7 s en móvil, pero el desglose de la misma medición suma aproximadamente 223 ms entre TTFB, demora/descarga del recurso y renderizado. El recurso LCP fue la ilustración grupal SVG referencial, ya precargada con `fetchpriority=high` y carga eager. Como las cifras del LCP no son coherentes entre sí, no se atribuye el resultado a un archivo concreto ni se modifica la composición. Se repetirá la medición en una auditoría posterior para confirmar si es variabilidad del laboratorio. Las optimizaciones de logos e imágenes siguen fuera del alcance acordado.

El diagnóstico SEO de Preview (bloqueo de indexación) es intencional. Cloudflare Web Analytics sigue pendiente de verificación en un dominio de producción; el error CORS observado en Preview no justifica cambiar la configuración de analítica. La auditoría no verifica ni configura reglas WAF de la cuenta Cloudflare.

Ejecución: [44787100347](https://github.com/InochiNoYume/candidatura-cee2027/actions/runs/44787100347). Artefacto de informes y capturas: [14655905852](https://github.com/InochiNoYume/candidatura-cee2027/actions/runs/44787100347/artifacts/14655905852).


### Auditoría de seguimiento confirmada · 20 de noviembre de 2026 · ejecución 44789469220

La auditoría de Preview de la PR #21 terminó correctamente sobre el HEAD documental `5e5602c826a71b5985ba5a2e2d608a9c0de87bb0`:

- 108 combinaciones de 18 rutas × 6 viewports; 0 infracciones axe, 0 errores de página y 0 desbordamientos horizontales.
- 72/72 capturas generadas; 7/7 pruebas del asistente Gemini aprobadas, sin exposición de metadatos internos.
- La ruta de control inexistente respondió HTTP 404, como corresponde.
- Lighthouse (móvil/escritorio): Inicio 99/100, Nuestra lista 99/98, Proyecto 100/100 y CEAT Te Escucha 100/100. Accesibilidad 100 y buenas prácticas 96 en las ocho mediciones.
- LCP móvil: Inicio 1,7 s; Nuestra lista 1,8 s; Proyecto 1,2 s; CEAT Te Escucha 1,1 s. El LCP móvil de Nuestra lista bajó de 4,7 s a 1,8 s en esta repetición; el rendimiento subió de 83 a 99. Esto confirma que la medición anterior era inestable y no justificaba cambios de recursos.

La auditoría queda aprobada. El SEO de Preview sigue mostrando 66–69 por el bloqueo de indexación deliberado; no retirar el noindex. El CORS de Cloudflare Web Analytics continúa siendo un asunto externo del dominio de Preview, sin evidencia en esta auditoría que justifique modificar la aplicación. La regla WAF de Cloudflare requiere configuración de cuenta y sigue fuera de las comprobaciones del repositorio.

Ejecución: [44789469220](https://github.com/InochiNoYume/candidatura-cee2027/actions/runs/44789469220). Artefacto: [14656402567](https://github.com/InochiNoYume/candidatura-cee2027/actions/runs/44789469220/artifacts/14656402567).
