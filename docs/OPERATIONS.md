# Operación del sitio CEE 2027 · CEAT

## Modo mantenimiento

El modo mantenimiento se controla mediante la variable de entorno `CEE_MAINTENANCE_MODE` en Cloudflare Pages.

- **Activar:** establecer `CEE_MAINTENANCE_MODE=true` en el entorno **Production** y desplegar el cambio de configuración.
- **Desactivar:** establecer `CEE_MAINTENANCE_MODE=false` (o retirar la variable) en **Production** y desplegar el cambio.
- El valor `true`, `1` u `on` activa el modo; otros valores lo mantienen desactivado.
- Las solicitudes a páginas HTML reciben la página `/maintenance.html` con estado HTTP 503, `Retry-After: 300`, `Cache-Control: no-store` y `X-Robots-Tag: noindex, nofollow`.
- Las solicitudes a `/api/*` reciben una respuesta JSON 503. Los recursos estáticos (CSS, imágenes y fuentes) siguen disponibles para que la página de mantenimiento se visualice correctamente.
- El contenido del sitio no se elimina ni se modifica al activar el modo.

### Vista administrativa durante el mantenimiento

Mantener `CEE_MAINTENANCE_MODE=false` en el entorno **Preview** para revisar el sitio mediante el despliegue de vista previa. Si ese despliegue debe ser exclusivo del equipo administrador, proteger su dominio de Preview con una política de Cloudflare Access que permita únicamente a las cuentas autorizadas. Esta protección se configura en Cloudflare y no se simula mediante una contraseña dentro del sitio.

### Canales de contacto

La página de mantenimiento enlaza al sitio institucional del CEAT. El Instagram y el soporte técnico se añadirán cuando se confirme el canal oficial y su destino definitivo.

## Limitación de solicitudes del Asistente CEE

La función `functions/api/asistente.js` conserva un respaldo local por instancia (isolate), que no garantiza un límite compartido. También reconoce un binding compatible llamado `CEE_RATE_LIMITER`, pero la documentación de Cloudflare Pages Functions enumera un subconjunto de bindings y no incluye el Rate Limiting API de Workers. No se debe dar por configurado ese binding en Pages sin confirmar soporte en el proyecto. La alternativa directa para Pages es revisar una regla WAF de limitación de solicitudes que coincida con `http.request.uri.path eq "/api/asistente"` y cuente por IP; las condiciones disponibles, períodos y cantidad de reglas dependen del plan de Cloudflare. Los contadores de Cloudflare son aproximados y pueden permitir solicitudes excedentes antes de aplicar la mitigación. Para un límite estricto entre ubicaciones se requiere un contador centralizado, por ejemplo con Durable Objects en un Worker dedicado.

## Estado de validación · 20 de noviembre de 2026

- La última ejecución completada de Site quality checks está aprobada. Incluye validación de 18 páginas, enlaces/anclas locales, sintaxis, seguridad, resiliencia Gemini y modo mantenimiento.
- Auditoría responsive 223 ([ejecución](https://github.com/InochiNoYume/candidatura-cee2027/actions/runs/44753206680)): completada con error sobre el HEAD `61b9954`; 109 combinaciones, seis infracciones axe `label-content-name-mismatch` en `maintenance.html` y 18 fallos bloqueantes por viewport. Lighthouse se omitió.
- El artefacto [cee-2027-site-audit](https://github.com/InochiNoYume/candidatura-cee2027/actions/runs/44753206680/artifacts/14639196925) contiene los informes y capturas.
- Causa persistente detectada en la auditoría 227: `css/layout.css` se carga después de `css/styles.css` y sobrescribía la flecha con `z-index: 90`, anulando el cambio previo. La jerarquía final se define ahora al final de `layout.css`: flecha 802, panel 801 y lanzador 800 (fuera del estado de menú abierto).
- Causa de accesibilidad: `maintenance.html` tenía un `aria-label` que no coincidía con el texto visible. Se retiró el atributo redundante y el enlace toma su nombre accesible de su contenido.
- La auditoría 227 confirmó 0 infracciones axe y 72/72 capturas; quedaron seis fallos de orden de capas y uno de Gemini (HTTP 503 en la prueba de integrantes). Se amplió el reintento de errores transitorios de Gemini a tres intentos con espera creciente. Las nuevas correcciones están en la rama de la PR #21; falta la nueva auditoría.
- No activar el modo mantenimiento en Production durante las pruebas. Mantener la variable desactivada en Preview salvo prueba controlada.

## Publicación

Las vistas previas y las ramas de trabajo no deben considerarse producción. No fusionar PR ni publicar cambios sin la aprobación explícita del responsable del proyecto. El PDF del proyecto no forma parte de los recursos publicables del sitio.


## Controles flotantes · 20 de noviembre de 2026

El lanzador del Asistente CEE permanece en su posición inferior habitual; «Volver arriba» (`z-index: 802`) queda sobre el lanzador (`z-index: 800`) con al menos 8 px de separación. El panel conserva `z-index: 801`. La prueba responsive comprueba la separación y el orden de capas en los seis viewports. No dar por terminada la revisión visual hasta comprobar las capturas de la nueva auditoría.


La hoja `css/layout.css` se carga después de `css/styles.css`. Los ajustes globales de capas flotantes deben mantenerse al final de `layout.css`, no solo en `styles.css`, para evitar que una regla posterior los sobrescriba.


## Resultado de auditoría 230 · 20 de noviembre de 2026

La ejecución [44761472248](https://github.com/InochiNoYume/candidatura-cee2027/actions/runs/44761472248) de la PR #21 finalizó correctamente sobre la vista previa:

- 109 combinaciones de página/viewport, 0 infracciones axe y 0 fallos bloqueantes.
- 72/72 capturas correctas.
- Gemini: 7/7 pruebas aprobadas con HTTP 200 y sin exposición de metadatos internos.
- La comprobación de orden de capas y separación de «Volver arriba» frente al lanzador del asistente pasó en todos los viewports.
- Lighthouse: rendimiento 83–100, accesibilidad 100, buenas prácticas 96 y SEO 66–69 en las cuatro páginas clave, en móvil y escritorio.

### Seguimiento de Lighthouse

Nuestra lista obtuvo 83 en rendimiento móvil y LCP de 4,7 s. Sin embargo, el mismo informe desglosa el LCP en 26 ms de respuesta inicial, 39 ms de demora de recurso, 45 ms de descarga y 72 ms de renderizado (aprox. 182 ms en total), por lo que las cifras no son coherentes entre sí. Repetir Lighthouse en varias ejecuciones antes de modificar la composición o retirar recursos visuales. El informe también registra un error CORS de Cloudflare Web Analytics (cloudflareinsights.com/cdn-cgi/rum) originado en el dominio temporal de Preview; verificarlo en una ejecución de dominio de producción antes de tocar la configuración de analítica.

El diagnóstico SEO de bloqueo de indexación corresponde al entorno de Preview y es intencional. No retirar noindex ni abrir el Preview a indexación para aumentar la puntuación SEO. La publicación debe llevar sus propios metadatos y canonical de producción.

### Suite de calidad

La ejecución [44761472071](https://github.com/InochiNoYume/candidatura-cee2027/actions/runs/44761472071) falló porque scripts/check-assistant.mjs seguía esperando PROVIDER_ATTEMPTS = 2 después de ampliar la función a tres intentos. Se actualizaron ambas expectativas: `scripts/check-assistant.mjs` exige tres intentos y `scripts/test-assistant-resilience.mjs` comprueba que el agotamiento se detiene tras tres llamadas. Cambios en los commits `6f128c35495234c1653c0f6e6a21cd0763e7e076` y `5161e542f65d19a10ccec88db1267a1dbcf5c176`. La suite Site quality checks volvió a aprobarse en las ejecuciones 44765468423 y 44765488252: contrato del asistente, resiliencia Gemini, mantenimiento, estructura/enlaces y seguridad.

Artefacto de auditoría: [cee-2027-site-audit · 14642776366](https://github.com/InochiNoYume/candidatura-cee2027/actions/runs/44761472248/artifacts/14642776366).

## Ajuste tipográfico de Proyecto · 20 de noviembre de 2026

La hoja de Google Fonts de `pages/proyecto.html` se carga mediante precarga no bloqueante desde `js/main.js`, solo en esa página. Al completar la descarga, el enlace pasa a `stylesheet`; se mantienen DM Sans y Manrope y el CSS conserva las fuentes de respaldo si JavaScript no se ejecuta. El objetivo es evitar que la hoja externa retrase el primer renderizado.

La validación queda pendiente hasta que termine la auditoría responsive/Lighthouse del commit `b590d6d7c829ba1d835f3e293eb06b4530a02dd0` (ejecución 44778879442). Revisar especialmente Proyecto en escritorio y móvil, posibles cambios de distribución al aplicar las fuentes y cualquier aviso de precarga no utilizada. No extender el patrón a otras páginas sin mediciones que lo justifiquen. El error CORS del beacon de Cloudflare Insights en Preview sigue en investigación; no modificar la configuración de analítica sin confirmar su causa.


## Auditoría final de Preview · ejecución 44778879442 · 20 de noviembre de 2026

La ejecución [44778879442](https://github.com/InochiNoYume/candidatura-cee2027/actions/runs/44778879442) finalizó correctamente sobre la rama de la PR #21:

- 108 combinaciones página/viewport (18 rutas × 6 viewports), 0 infracciones axe y 0 fallos bloqueantes; la ruta inexistente adicional devolvió HTTP 404.
- 72/72 capturas generadas; Gemini 7/7 pruebas aprobadas.
- Lighthouse (móvil/escritorio): Inicio 94/100, Nuestra lista 99/99, Proyecto 100/96 y CEAT Te Escucha 100/100. Accesibilidad 100 y buenas prácticas 96 en las ocho mediciones.
- Proyecto obtiene LCP de 1,2 s móvil y 1,4 s escritorio tras el cambio de carga tipográfica.

El log antiguo contaba la comprobación de ruta inexistente como si fuera una combinación página/viewport y mostraba 109. El JSON del informe confirma 108; se corrige el mensaje para informar por separado las rutas, viewports y el chequeo 404.

Cloudflare Web Analytics continúa registrando un CORS en `cloudflareinsights.com/cdn-cgi/rum` desde el hostname de Preview, seguido de `net::ERR_FAILED`. Es un error del beacon de analítica de Cloudflare, no un error de ejecución de la aplicación. Confirmar en un entorno de producción antes de modificar su configuración. Los resultados SEO 66–69 corresponden al `noindex` intencional del Preview; no quitarlo.

Inicio móvil merece seguimiento por LCP 2,9 s (rendimiento 94). Inspeccionar el elemento LCP y repetir medición antes de hacer cambios. Las sugerencias Lighthouse sobre logo/imágenes quedan fuera del alcance acordado y no se ejecutarán.

Artefacto de informes y capturas: [cee-2027-site-audit · 14651908965](https://github.com/InochiNoYume/candidatura-cee2027/actions/runs/44778879442/artifacts/14651908965). La revisión visual/funcional manual de formularios y estados especiales sigue pendiente. No fusionar ni publicar sin aprobación explícita.


## Seguimiento de auditoría y formulario · 20 de noviembre de 2026

La ejecución [44783535294](https://github.com/InochiNoYume/candidatura-cee2027/actions/runs/44783535294) terminó con éxito sobre Preview de la PR #21: 108/108 combinaciones de página/viewport, 0 infracciones axe, 0 fallos bloqueantes, 72/72 capturas y Gemini 7/7. Lighthouse: Inicio 94 móvil/100 escritorio, Nuestra lista 99/99, Proyecto 100/100 y CEAT Te Escucha 100/100. Accesibilidad 100 y buenas prácticas 96 en las ocho mediciones. LCP móvil: Inicio 2,9 s, Nuestra lista 1,9 s, Proyecto 1,2 s y CEAT Te Escucha 1,1 s.

### Configuración del formulario

La página `pages/escucha.html` todavía contiene solo el aviso de formulario externo pendiente; no hay formulario HTML, iframe, endpoint ni variable de entorno leída por el sitio. **No configurar una variable de Cloudflare para Google Forms en este momento.** Cuando se confirme el enlace oficial, integrar el enlace o iframe directamente en la página estática y comprobar manualmente que abre y permite enviar una respuesta de prueba. Una URL pública no debe guardarse como Secret. No inventar `GOOGLE_FORM_URL` sin implementar primero su lectura.

Variables existentes, independientes del formulario:
- `GEMINI_API_KEY`: Secret del asistente, configurado por separado en Preview y Production.
- `GEMINI_MODEL`: variable opcional del modelo Gemini.
- `CEE_MAINTENANCE_MODE`: control del modo mantenimiento; mantener desactivado en Production salvo mantenimiento real.

No se ha confirmado todavía el comportamiento del beacon de Cloudflare Web Analytics en producción; el CORS observado corresponde a Preview y no se debe cambiar la analítica sin una prueba específica. La PR #21 sigue abierta y no se fusiona ni publica sin autorización explícita.


## Ajuste móvil del asistente · 20 de noviembre de 2026

La inspección de capturas de la ejecución 44783535294 encontró que el lanzador flotante del asistente cubría parte del texto en algunas vistas móviles. Se redujo a un botón de icono de 48 px para anchos de hasta 560 px; el nombre accesible se conserva con `aria-label`. La prueba responsive ahora verifica el ancho y la etiqueta. Esperar la auditoría del commit más reciente antes de cerrar esta tarea.


## Auditoría responsive más reciente · ejecución 44787100347 · 20 de noviembre de 2026

La auditoría de Preview de la PR #21 terminó correctamente sobre el commit `9d81b640cb3aee1ee332ab0b0db5810f2e15f6e3`:

- 108 combinaciones de 18 rutas × 6 viewports; 0 infracciones axe y 0 fallos bloqueantes; la ruta inexistente de control devolvió HTTP 404.
- 72/72 capturas generadas; Gemini 7/7 pruebas aprobadas.
- El lanzador móvil compacto de 48 px (hasta 560 px) pasó su comprobación responsive y conserva el nombre accesible.
- Lighthouse (móvil/escritorio): Inicio 94/100, Nuestra lista 83/98, Proyecto 100/100 y CEAT Te Escucha 100/100. Accesibilidad 100 y buenas prácticas 96 en las ocho mediciones.

### Seguimiento de rendimiento y servicios externos

Nuestra lista obtuvo LCP móvil de 4,7 s, pero el desglose de la misma medición suma aproximadamente 223 ms entre TTFB, demora/descarga del recurso y renderizado. El elemento LCP fue la ilustración grupal SVG referencial, ya precargada, con prioridad alta y carga eager. Las cifras no son coherentes: no modificar recursos ni composición por esta única medición; repetir Lighthouse y comparar antes de atribuir causa. La optimización de logos e imágenes está expresamente fuera del alcance.

El SEO bajo en Preview corresponde al bloqueo de indexación intencional; no retirar noindex de Preview. El CORS de Cloudflare Web Analytics solo se observó en Preview; comprobar el dominio de producción antes de modificar analítica. La regla WAF/rate limiting para `/api/asistente` requiere acceso a la cuenta Cloudflare y no se ha aplicado desde el repositorio.

Ejecución: [44787100347](https://github.com/InochiNoYume/candidatura-cee2027/actions/runs/44787100347). Artefacto: [14655905852](https://github.com/InochiNoYume/candidatura-cee2027/actions/runs/44787100347/artifacts/14655905852).
