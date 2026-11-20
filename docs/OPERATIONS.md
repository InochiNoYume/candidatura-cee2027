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

La función `functions/api/asistente.js` utiliza el binding `CEE_RATE_LIMITER` cuando está disponible. Si no está configurado, utiliza un respaldo local por instancia (isolate), que no garantiza un límite compartido entre todas las instancias. La configuración definitiva del binding debe completarse en Cloudflare antes de considerar activo el límite global.

## Publicación

Las vistas previas y las ramas de trabajo no deben considerarse producción. No fusionar PR ni publicar cambios sin la aprobación explícita del responsable del proyecto. El PDF del proyecto no forma parte de los recursos publicables del sitio.
