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

- Site quality checks, ejecución 336: aprobada. Incluye validación de 18 páginas, enlaces/anclas locales, sintaxis, seguridad, resiliencia Gemini y modo mantenimiento.
- Auditoría responsive 209: encontró seis infracciones axe del mismo tipo en el enlace de marca de mantenimiento; se corrigió el texto accesible.
- Auditorías responsive 210 y 213: sustituidas por commits posteriores de documentación y ajustes de interfaz antes de completar el recorrido.
- Se corrigió el solapamiento potencial entre el botón flotante del Asistente CEE y «Volver arriba»: el asistente se eleva cuando el desplazamiento supera 420 px, y su panel se desplaza junto al lanzador.
- Auditoría responsive 214: iniciada sobre la vista previa del código actualizado; sus resultados de accesibilidad, capturas y Lighthouse aún deben confirmarse.
- No activar el modo mantenimiento en Production durante las pruebas. Mantener la variable desactivada en Preview salvo prueba controlada.

## Publicación

Las vistas previas y las ramas de trabajo no deben considerarse producción. No fusionar PR ni publicar cambios sin la aprobación explícita del responsable del proyecto. El PDF del proyecto no forma parte de los recursos publicables del sitio.
