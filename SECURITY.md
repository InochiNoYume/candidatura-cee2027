# Seguridad del proyecto CEE 2027 · CEAT

Este proyecto es un sitio estático publicado en Cloudflare Pages. No requiere administrar un servidor propio. El tráfico público debe utilizar HTTPS.

## Protección web y XSS

La configuración de cabeceras de Cloudflare Pages está en `_headers` e incluye:

- Content Security Policy (CSP): limita scripts a recursos del mismo origen, bloquea scripts inline y objetos incrustados, y restringe las fuentes permitidas.
- `X-Content-Type-Options: nosniff`.
- `Referrer-Policy: strict-origin-when-cross-origin`.
- `Permissions-Policy` para deshabilitar cámara, micrófono y geolocalización, que el sitio no necesita.
- `X-Frame-Options: DENY` y `frame-ancestors 'none'` para impedir que otras páginas lo incrusten.
- HSTS para exigir HTTPS en navegadores compatibles.

El CSS inline está permitido porque el sitio utiliza algunos estilos inline existentes; los scripts inline y los manejadores de eventos HTML quedan bloqueados. Los datos que provengan de formularios o búsquedas deben insertarse como texto mediante `textContent` o nodos DOM, nunca concatenarse dentro de `innerHTML`, atributos HTML o código ejecutable. Si se incorpora un formulario externo o un servicio nuevo, revisar y actualizar la CSP solo para los dominios estrictamente necesarios.

## Seguridad de la cuenta y del repositorio

En GitHub → Settings, el propietario debe revisar:

- Activar y mantener la autenticación en dos pasos (2FA).
- En **Branches**, proteger `main`: exigir pull requests, exigir que pasen los checks de calidad y auditoría disponibles antes de integrar, bloquear force-push y eliminación de la rama.
- En **Code security and analysis**, mantener activados Secret scanning y Push protection cuando estén disponibles para el repositorio.
- Mantener los permisos de GitHub Actions en el mínimo necesario. Los workflows actuales declaran `contents: read`.

Estos ajustes requieren permisos del propietario y no se pueden activar desde un cambio de archivos del sitio. No se deben guardar contraseñas, tokens ni claves privadas en el código ni en archivos públicos.

## Revisión

Cada cambio de seguridad debe pasar los checks de GitHub Actions y una comprobación del sitio desplegado. Si una integración futura requiere nuevos dominios (por ejemplo, un formulario), añadir solo los orígenes imprescindibles a `_headers` y probar de nuevo la CSP.
