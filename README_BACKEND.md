# Backend ED-KNOWS - Guía de Instalación y Despliegue

## Estructura del Backend

El backend está en la carpeta `server/` y usa:
- **Node.js** con Express
- **PostgreSQL** como base de datos
- **JWT** para autenticación
- **bcryptjs** para hash de contraseñas

## Instalación Local

1. **Instalar dependencias del backend**:
```bash
cd server
npm install
```

2. **Configurar variables de entorno**:
Crea un archivo `.env` en la carpeta `server/` basado en `env.example`:
```env
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/edknows
JWT_SECRET=tu-secreto-super-seguro
FRONTEND_URL=http://localhost:5173
```

3. **Configurar PostgreSQL local** (opcional para desarrollo):
- Instala PostgreSQL
- Crea una base de datos: `createdb edknows`
- Actualiza `DATABASE_URL` en `.env`

4. **Iniciar el servidor**:
```bash
npm start
# O para desarrollo con auto-reload:
npm run dev
```

El servidor estará en `http://localhost:3000`

## Endpoints de la API

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Obtener usuario actual

### Posts
- `GET /api/posts` - Obtener todos los posts
- `POST /api/posts` - Crear post (requiere autenticación)
- `DELETE /api/posts/:id` - Eliminar post (requiere autenticación)
- `POST /api/posts/:id/like` - Dar/quitar like (requiere autenticación)
- `POST /api/posts/:id/comments` - Agregar comentario (requiere autenticación)
- `DELETE /api/posts/:postId/comments/:commentId` - Eliminar comentario (requiere autenticación)

### Temas
- `GET /api/topics` - Obtener todos los temas
- `POST /api/topics` - Crear tema (requiere admin)
- `PUT /api/topics/:id` - Actualizar tema (requiere admin)
- `DELETE /api/topics/:id` - Eliminar tema (requiere admin)
- `POST /api/topics/:topicId/levels` - Agregar nivel (requiere admin)
- `PUT /api/topics/:topicId/levels/:levelId` - Actualizar nivel (requiere admin)
- `DELETE /api/topics/:topicId/levels/:levelId` - Eliminar nivel (requiere admin)

## Despliegue en Render

El archivo `render.yaml` ya está configurado para desplegar:
1. **Frontend** (Static Site)
2. **Backend** (Web Service)
3. **Base de datos** (PostgreSQL)

### Pasos:

1. **Sube el código a GitHub** (ya hecho)

2. **En Render**:
   - Ve a tu dashboard
   - Render detectará automáticamente el `render.yaml`
   - Creará 3 servicios:
     - Frontend (Static Site)
     - Backend (Web Service)
     - Base de datos (PostgreSQL)

3. **Configuración automática**:
   - La base de datos se creará automáticamente
   - El backend se conectará automáticamente a la BD
   - Las variables de entorno se configurarán automáticamente

4. **Actualizar URL del frontend**:
   - Una vez desplegado, actualiza `VITE_API_URL` en el frontend con la URL del backend
   - O configura la variable de entorno en Render

## Variables de Entorno en Render

El backend necesita estas variables (ya configuradas en render.yaml):
- `DATABASE_URL` - Se conecta automáticamente a la BD
- `JWT_SECRET` - Se genera automáticamente
- `FRONTEND_URL` - URL del frontend
- `PORT` - Puerto del servidor (10000)

## Usuario Admin por Defecto

Al inicializar la base de datos, se crea automáticamente:
- **Usuario**: `admin`
- **Contraseña**: `admin123`
- **Rol**: `admin`

## Notas

- El backend crea las tablas automáticamente al iniciar
- Las imágenes se almacenan como base64 en la base de datos
- Para producción, considera usar un servicio de almacenamiento de imágenes (Cloudinary, S3, etc.)

