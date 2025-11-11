# Requisitos para Backend - ED-KNOWS

## Situación Actual
Tu aplicación actualmente usa **localStorage**, lo que significa:
- ❌ Cada usuario tiene datos independientes
- ❌ El contenido del admin no se comparte
- ❌ Límite de almacenamiento (5-10MB)
- ❌ Los datos se pierden si se limpia el navegador

## Solución: Backend con Base de Datos

### Opción A: Render (Recomendado - Todo en un lugar)

#### 1. **Web Service (Frontend)** - Ya lo tienes
- Tipo: Static Site
- Build: `npm install && npm run build`
- Start: `npx serve -s dist -l 10000`

#### 2. **Web Service (Backend)** - Nuevo
- Tipo: Web Service
- Runtime: Node.js
- Build: `npm install`
- Start: `node server.js` o `npm start`
- **Variables de Entorno**:
  - `DATABASE_URL` (para PostgreSQL)
  - `JWT_SECRET` (para autenticación)
  - `PORT` (puerto del servidor)

#### 3. **PostgreSQL Database** - Nuevo
- Tipo: PostgreSQL
- Plan: Free (o Starter)
- **Disco**: Incluido automáticamente
- Almacenará: topics, posts, comments, users, etc.

#### 4. **Persistent Disk** (Opcional)
- Solo si necesitas almacenar archivos grandes
- Alternativa: Usar servicios como Cloudinary, AWS S3, o ImgBB

### Opción B: Servicios Separados

#### Frontend: Render (Static Site)
- Ya configurado

#### Backend: Render (Web Service)
- Node.js/Express o Python/Flask
- Variables de entorno para conexión a BD

#### Base de Datos: Render PostgreSQL
- Incluye disco automáticamente

#### Almacenamiento de Imágenes:
- **Opción 1**: Persistent Disk en Render (para archivos)
- **Opción 2**: Cloudinary (gratis hasta 25GB)
- **Opción 3**: AWS S3 (pago por uso)
- **Opción 4**: ImgBB API (gratis)

## Estructura de Base de Datos Sugerida

```sql
-- Usuarios
users (
  id, username, email, password_hash, role, 
  profile_picture, created_at, last_login
)

-- Temas
topics (
  id, name, description, icon, image_url, created_at
)

-- Niveles
levels (
  id, topic_id, level_number, type, description,
  video_url, exercise_image_url, solution_image_url, 
  explanation_video_url, created_at
)

-- Posts
posts (
  id, user_id, type, content, images_urls, 
  achievement_id, created_at
)

-- Comentarios
comments (
  id, post_id, user_id, content, created_at
)

-- Likes
likes (
  post_id, user_id
)

-- Testimonios
testimonials (
  id, user_id, content, approved, created_at
)

-- Solicitudes
requests (
  id, user_id, content, status, created_at
)
```

## Variables de Entorno Necesarias

```env
# Base de Datos
DATABASE_URL=postgresql://user:password@host:5432/dbname

# Autenticación
JWT_SECRET=tu-secreto-super-seguro-aqui

# Servidor
PORT=3000
NODE_ENV=production

# Almacenamiento (si usas servicio externo)
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
# O
AWS_ACCESS_KEY_ID=tu-key
AWS_SECRET_ACCESS_KEY=tu-secret
AWS_S3_BUCKET=tu-bucket
```

## Costos Estimados en Render (Plan Free)

- ✅ Frontend (Static Site): **GRATIS**
- ✅ Backend (Web Service): **GRATIS** (con limitaciones)
- ✅ PostgreSQL: **GRATIS** (hasta 90 días, luego $7/mes)
- ⚠️ Persistent Disk: **$0.25/GB/mes** (solo si necesitas almacenar archivos)

## Pasos Siguientes

1. **Decidir arquitectura**: ¿Backend propio o servicios externos?
2. **Elegir stack**: Node.js/Express, Python/Flask, etc.
3. **Configurar base de datos**: PostgreSQL en Render
4. **Implementar API**: Endpoints para CRUD operations
5. **Migrar frontend**: Cambiar de localStorage a llamadas API
6. **Configurar almacenamiento**: Disco o servicio de imágenes

## Recomendación Rápida

Para empezar rápido:
1. **Backend**: Node.js/Express en Render
2. **Base de Datos**: PostgreSQL en Render (free tier)
3. **Imágenes**: Cloudinary (gratis) o base64 en BD (limitado)

¿Quieres que te ayude a implementar el backend?

