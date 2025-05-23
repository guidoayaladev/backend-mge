
# CMS Vehicular - MGE

Sistema backend construido con NestJS para la gestión de transferencias de vehículos, incluyendo la administración de proyectos, unidades organizativas, vehículos y control de acceso mediante roles y permisos.

## 📊 Objetivo

Desarrollar un módulo CRUD para la gestión de transferencias de vehículos en un CMS vehicular. Este módulo implementa roles, permisos y unidades organizativas, asegurando que cada usuario solo acceda a los datos del proyecto y unidades organizativas a los que pertenece.

## 🧱 Tecnologías

- **Backend**: NestJS (con Helmet, JWT, cookies seguras)
- **Base de Datos**: PostgreSQL (TypeORM)
- **Infraestructura**: Render (plan Hobby)
- **Repositorio**: GitHub

## 📆 Instalación

```bash
# Clonar repositorio
$ git clone https://github.com/tu-org/backend-mge.git

# Entrar al proyecto
$ cd backend-mge

# Instalar dependencias
$ npm install
```

## 📁 Variables de Entorno

Crear un archivo `.env` basado en `.env.example`:

```env
PORT=3000
DATABASE_URL=postgres://postgres:admin@localhost:5432/mge_db
JWT_SECRET=MGE-TEST-BACK
JWT_EXPIRES=6h
CORS_ORIGIN=*
STAGE=dev
```

## ⚖️ Comandos

```bash
# Desarrollo
$ npm run start:dev

# Compilación
$ npm run build

# Producción
$ npm run start:prod
```

## 🔧 Scripts adicionales

```bash
# Ejecutar migraciones
$ npm run migration:run

# Ejecutar seeders (usuarios, roles, permisos, etc.)
$ npm run seed
```

## 👶 Usuarios iniciales

```json
[
  { "email": "admin@demo.com", "password": "Admin#2024!", "roles": ["admin"] },
  { "email": "operator1@demo.com", "password": "Operator#2024!", "roles": ["operator"] },
  { "email": "viewer1@demo.com", "password": "Viewer#2024!", "roles": ["viewer"] }
]
```

## 🏃‍♂️ Flujo de prueba

Utiliza la colección Postman incluida. Contiene:

- Login con admin, operator y viewer
- CRUD de proyectos, unidades, vehículos y transferencias
- Asignación de usuarios a proyectos/unidades

📥 [Descargar colección Postman - CMS Vehicular](sandbox:/mnt/data/CMSVehicular-MGE.postman_collection.json)

## 🌎 Despliegue

Este backend está desplegado en:

```
https://backend-mge.onrender.com
```

## ✅ Permisos soportados

```ts
const permissionList = [
  'view_transfers', 'create_transfers', 'edit_transfers', 'delete_transfers',
  'manage_users',
  'view_vehicles', 'create_vehicles', 'edit_vehicles', 'delete_vehicles',
  'view_projects', 'create_projects', 'edit_projects', 'delete_projects',
  'view_organizational_units', 'create_organizational_units',
  'edit_organizational_units', 'delete_organizational_units'
];
```

## 🔒 Seguridad

- JWT con expiración de 6h
- Cookies seguras habilitadas con `cookie-parser`
- Seguridad HTTP con Helmet
- Guards personalizados con decoradores `@Permissions()` y `@User()`

## 🔍 Rutas principales

Consulta en la colección Postman todas las rutas activas:

- `/auth/login`, `/auth/me`, `/auth/logout`
- `/transfers`, `/vehicles`, `/projects`, `/organizational-units`
- `/admin/users`, `/admin/roles`, `/admin/permissions`

## 📄 Licencia

Este proyecto está licenciado bajo MIT.
