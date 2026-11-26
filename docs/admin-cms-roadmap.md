# CMS / panel CEE 2027 — diseño y hoja de ruta

## Objetivo
Gestionar contenido del sitio desde un panel privado y móvil, sin modificar archivos por cada actualización.

## Arquitectura
- UI estática en `admin/` con Pages.
- API en Cloudflare Pages Functions/Workers.
- Base de datos D1 dedicada al CMS.
- Autenticación validada en servidor; secretos solo en entorno de servidor.
- GitHub Actions para calidad y auditoría de preview.

## Modelo de datos
`admin_users`, `admin_sessions`, `cms_entries`, `cms_versions`, `cms_audit_log` en `database/schema.sql`.

Los campos flexibles de contenido se almacenan como JSON validado por esquemas específicos de sección. Los slugs son únicos dentro de cada sección. Las publicaciones y versiones se registran para permitir revisiones y auditoría.

## Seguridad antes de conectar
- No exponer contraseñas, claves de sesión ni hashes al cliente.
- Usar cookies `HttpOnly`, `Secure`, `SameSite` y expiración.
- Tokens de sesión aleatorios, guardar hash en D1, rotar/revocar y validar expiración en cada petición.
- Autorización por rol en cada endpoint; la UI no es un control de seguridad.
- Validar tipos, longitudes, IDs, slugs y contenido en el servidor.
- Protección CSRF en endpoints mutables.
- Limitar intentos de autenticación; evitar filtración de si un usuario existe.
- No permitir editar configuración crítica desde rol editor.
- Registrar cambios administrativos, sin secretos ni contenido sensible en logs.
- Separar Preview y Production; usar credenciales ficticias en tests.
- Copias de seguridad y procedimiento de restauración documentado.

## Etapas
1. Prototipo UI y esquema propuesto (esta primera etapa).
2. Pruebas locales, lint/HTML, schema validation.
3. Provisionamiento de D1 dedicado, con aprobación antes de crear recursos.
4. API de autenticación, sesiones y roles.
5. CRUD por módulo y gestión de borradores/publicaciones.
6. Conexión de las páginas públicas al CMS.
7. QA de seguridad, accesibilidad, responsive y auditoría Live.
8. Revisión PR; no fusionar sin autorización explícita.

## Alcance / restricciones
No reemplazar imágenes originales ni optimizarlas. Mantener cinco ejes. Sin PDF de proyecto. No incluye WAF ni Global Rate Limiting. El prototipo no afecta a la web pública ni crea infraestructura de producción.
