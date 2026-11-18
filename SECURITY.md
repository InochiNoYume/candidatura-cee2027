# Seguridad del proyecto CEE 2027 · CEAT

Este proyecto es un sitio estático publicado en Cloudflare Pages. No ejecuta un servidor propio ni necesita abrir un puerto SSH. El tráfico público debe utilizar HTTPS.

## Protección web y XSS

La configuración de cabeceras de Cloudflare Pages está en `_headers` e incluye:

- Content Security Policy (CSP): limita scripts a recursos del mismo origen, bloquea scripts inline y objetos incrustados, y restringe las fuentes permitidas.
- `X-Content-Type-Options: nosniff`.
- `Referrer-Policy: strict-origin-when-cross-origin`.
- `Permissions-Policy` para deshabilitar cámara, micrófono y geolocalización, que el sitio no necesita.
- `X-Frame-Options: DENY` y `frame-ancestors 'none'` para impedir que otras páginas lo incrusten.
- HSTS para exigir HTTPS en navegadores compatibles.

El CSS inline está permitido porque el sitio utiliza algunos estilos inline existentes; los scripts inline y los manejadores de eventos HTML quedan bloqueados. Los datos que provengan de formularios o búsquedas deben insertarse como texto mediante `textContent` o nodos DOM, nunca concatenarse dentro de `innerHTML`, atributos HTML o código ejecutable. Si se incorpora un formulario externo o un servicio nuevo, revisar y actualizar la CSP solo para los dominios estrictamente necesarios.

## Protección SSH para GitHub

SSH protege la autenticación al operar con GitHub; no es un servicio que deba instalarse en Cloudflare Pages. Para proteger la cuenta que administra este repositorio:

1. Activa la autenticación en dos pasos (2FA) en GitHub.
2. Genera una clave personal Ed25519 con frase de contraseña en tu propio dispositivo: `ssh-keygen -t ed25519 -C "tu-correo"`.
3. Guarda la clave privada en tu dispositivo y añade únicamente la clave pública (`.pub`) en GitHub → Settings → SSH and GPG keys.
4. Carga la clave en el agente SSH de tu sistema y comprueba la conexión con `ssh -T git@github.com`.
5. Verifica la huella de la clave de host de GitHub con la documentación oficial antes de confiar en ella. No desactives `StrictHostKeyChecking`.
6. Nunca publiques, envíes ni subas la clave privada al repositorio, a incidencias o a mensajes. Si se pierde o queda expuesta, revócala en GitHub y crea otra.
7. Revisa periódicamente las claves autorizadas y elimina las que ya no utilices.

## Ajustes del repositorio que debe confirmar el propietario

En GitHub → Settings:

- En **Branches**, protege `main): exigir pull requests, exigir que pasen los checks de calidad y auditoría disponibles antes de integrar, bloquear force-push y eliminación de la rama.
- En **Code security and analysis**, mantener activados Secret scanning y Push protection cuando estén disponibles para el repositorio.
- Mantener los permisos de GitHub Actions en el mínimo necesario. Los workflows actuales declaran `contents: read`.

Estos ajustes de cuenta y repositorio requieren permisos del propietario y no se pueden activar desde un cambio de archivos del sitio. No se deben guardar claves SSH ni tokens en el código ni en archivos públicos.

## Revisión

Cada cambio de seguridad debe pasar los checks de GitHub Actions y una comprobación del sitio desplegado. Si una integración futura requiere nuevos dominios (por ejemplo, un formulario), añadir solo los orígenes imprescindibles a `_headers` y probar de nuevo la CSP.
