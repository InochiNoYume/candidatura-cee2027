# Panel de administración — CEE 2027

## Estado
Prototipo de interfaz con CRUD demostrativo en memoria (crear, editar y eliminar). Sin autenticación ni persistencia. Los cambios desaparecen al recargar y nunca se publican.

## Abrir localmente
Abrir `admin/index.html` en un navegador. No requiere build ni dependencias.

## Módulos planificados
- Resumen
- Noticias
- Nuestra lista
- Ejes programáticos (mantener los 5)
- Agenda
- Transparencia
- Galería
- Memoria
- Comunidad TP
- Contacto y enlaces
- Ajustes del sitio

## Próximas etapas
1. Crear una instancia D1 dedicada (separada de cualquier base de producción).
2. Revisar y aplicar `database/schema.sql`.
3. Implementar API de Workers/Pages Functions con validación, autenticación y autorización en servidor.
4. Crear sesiones con tokens aleatorios guardando solo hash, cookie HttpOnly/Secure/SameSite, expiración y revocación.
5. Configurar secretos de producción y preview por separado.
6. Implementar CRUD y borradores/publicación; conectar gradualmente los módulos a la web pública.
7. Añadir pruebas de API, controles de seguridad, accesibilidad, y auditorías de preview.

**No ingresar credenciales reales en esta versión.**