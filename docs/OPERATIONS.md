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
- Causa del solapamiento: el lanzador se elevaba al aparecer «Volver arriba», pero la separación era insuficiente. Se eliminó ese desplazamiento; la flecha queda arriba con al menos 8 px de separación y `z-index` superior.
- Causa de accesibilidad: `maintenance.html` tenía un `aria-label` que no coincidía con el texto visible. Se retiró el atributo redundante y el enlace toma su nombre accesible de su contenido.
- Las correcciones y una aserción responsive más estricta están en la rama de la PR #21. La nueva auditoría de ese HEAD y la revisión de capturas siguen pendientes.
- No activar el modo mantenimiento en Production durante las pruebas. Mantener la variable desactivada en Preview salvo prueba controlada.

## Publicación

Las vistas previas y las ramas de trabajo no deben considerarse producción. No fusionar PR ni publicar cambios sin la aprobación explícita del responsable del proyecto. El PDF del proyecto no forma parte de los recursos publicables del sitio.


## Controles flotantes · 20 de noviembre de 2026

El lanzador del Asistente CEE permanece en su posición inferior habitual; «Volver arriba» (`z-index: 802`) queda sobre el lanzador (`z-index: 800`) con al menos 8 px de separación. El panel conserva `z-index: 801`. La prueba responsive comprueba la separación y el orden de capas en los seis viewports. No dar por terminada la revisión visual hasta comprobar las capturas de la nueva auditoría.
