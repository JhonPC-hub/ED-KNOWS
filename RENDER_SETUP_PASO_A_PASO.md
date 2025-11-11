# 🚀 Guía Paso a Paso: Desplegar ED-KNOWS en Render

## ⚠️ Importante: Render NO permite crear bases de datos desde Blueprints

Render no permite definir bases de datos PostgreSQL directamente en el archivo `render.yaml` de blueprints. Por eso, necesitamos crear la base de datos **manualmente** primero.

---

## 📋 Paso 1: Crear Base de Datos PostgreSQL

1. **Ve a Render Dashboard**: [dashboard.render.com](https://dashboard.render.com)
2. **Clic en "New +"** → **"PostgreSQL"**
3. **Configuración**:
   - **Name**: `ed-knows-db`
   - **Database**: `edknows` (o déjalo por defecto)
   - **User**: `edknows_user` (o déjalo por defecto)
   - **Region**: Elige la región más cercana
   - **PostgreSQL Version**: 15 (o la más reciente)
   - **Plan**: Free
4. **Clic en "Create Database"**
5. **Espera** a que se cree (2-3 minutos)
6. **Copia la "Internal Database URL"** (la necesitarás después)
   - Se ve así: `postgresql://user:password@dpg-xxxxx-a/edknows`

---

## 📋 Paso 2: Crear Blueprint para Frontend y Backend

1. **En Render Dashboard**, clic en **"New +"** → **"Blueprint"**
2. **Conecta tu repositorio**:
   - Selecciona **"ED-KNOWS"** de GitHub
   - Render detectará el archivo `render.yaml`
3. **Revisa la configuración**:
   - Verás que se crearán 2 servicios:
     - **ed-knows-frontend** (Static Site)
     - **ed-knows-backend** (Web Service)
4. **Clic en "Apply"**
5. **Espera** a que se desplieguen (5-10 minutos)

---

## 📋 Paso 3: Configurar Variables de Entorno

### 3.1. Backend - DATABASE_URL

1. **Ve al servicio "ed-knows-backend"** en Render
2. **Clic en "Environment"** (Variables de Entorno)
3. **Busca "DATABASE_URL"** o **"Add Environment Variable"**
4. **Agrega**:
   - **Key**: `DATABASE_URL`
   - **Value**: Pega la "Internal Database URL" que copiaste en el Paso 1
5. **Clic en "Save Changes"**
6. Render redeployará automáticamente el backend

### 3.2. Backend - FRONTEND_URL

1. **Ve al servicio "ed-knows-frontend"** en Render
2. **Copia la URL** (ej: `https://ed-knows-frontend-xxxx.onrender.com`)
3. **Ve al servicio "ed-knows-backend"**
4. **Actualiza la variable `FRONTEND_URL`**:
   - **Key**: `FRONTEND_URL`
   - **Value**: La URL del frontend que copiaste
5. **Clic en "Save Changes"**

### 3.3. Frontend - VITE_API_URL

1. **Ve al servicio "ed-knows-backend"** en Render
2. **Copia la URL** (ej: `https://ed-knows-backend-xxxx.onrender.com`)
3. **Ve al servicio "ed-knows-frontend"**
4. **Actualiza la variable `VITE_API_URL`**:
   - **Key**: `VITE_API_URL`
   - **Value**: La URL del backend + `/api` (ej: `https://ed-knows-backend-xxxx.onrender.com/api`)
5. **Clic en "Save Changes"**
6. Render redeployará automáticamente el frontend

---

## 📋 Paso 4: Verificar que Todo Funcione

### 4.1. Verificar Backend

1. **Abre en tu navegador**: `https://ed-knows-backend-xxxx.onrender.com/api/health`
2. **Deberías ver**: 
   ```json
   {
     "status": "ok",
     "message": "ED-KNOWS API está funcionando"
   }
   ```

### 4.2. Verificar Frontend

1. **Abre en tu navegador**: `https://ed-knows-frontend-xxxx.onrender.com`
2. **Deberías ver** la aplicación funcionando

### 4.3. Probar Registro/Login

1. **Ve a la página de registro**
2. **Crea un usuario de prueba**
3. **Inicia sesión**
4. **Verifica** que puedas ver los temas y posts

---

## 🔧 Solución de Problemas

### ❌ Error: "Database connection failed"

**Causa**: El backend no puede conectarse a la base de datos

**Solución**:
1. Verifica que `DATABASE_URL` esté configurada correctamente en el backend
2. Verifica que la base de datos esté creada y funcionando
3. Asegúrate de usar la "Internal Database URL" (no la pública)
4. Revisa los logs del backend en Render

### ❌ Error: "Failed to fetch" en el frontend

**Causa**: El frontend no puede conectarse al backend (CORS o URL incorrecta)

**Solución**:
1. Verifica que `VITE_API_URL` en el frontend sea correcta
2. Verifica que `FRONTEND_URL` en el backend sea correcta
3. Asegúrate de que el backend esté desplegado y funcionando
4. Verifica los logs del backend en Render

### ❌ Error: "Service is sleeping"

**Causa**: El servicio gratuito de Render se "duerme" después de 15 minutos de inactividad

**Solución**:
1. Espera 30-60 segundos y recarga la página
2. El servicio se "despertará" automáticamente
3. Para producción, considera actualizar a un plan de pago

---

## ✅ Checklist de Despliegue

- [ ] Base de datos PostgreSQL creada manualmente
- [ ] Internal Database URL copiada
- [ ] Blueprint aplicado (frontend y backend creados)
- [ ] `DATABASE_URL` configurada en backend
- [ ] `FRONTEND_URL` configurada en backend
- [ ] `VITE_API_URL` configurada en frontend
- [ ] Backend responde en `/api/health`
- [ ] Frontend carga correctamente
- [ ] Registro de usuario funciona
- [ ] Login funciona
- [ ] Posts se pueden crear y ver
- [ ] Temas se pueden ver

---

## 📊 Estructura Final en Render

```
Render Dashboard
├── ed-knows-db (PostgreSQL) - Creada manualmente
│   └── Internal Database URL
│
├── ed-knows-frontend (Static Site) - Creada desde Blueprint
│   ├── URL: https://ed-knows-frontend-xxxx.onrender.com
│   └── Variables:
│       └── VITE_API_URL
│
└── ed-knows-backend (Web Service) - Creada desde Blueprint
    ├── URL: https://ed-knows-backend-xxxx.onrender.com
    └── Variables:
        ├── DATABASE_URL (configurada manualmente)
        ├── JWT_SECRET (generada automáticamente)
        └── FRONTEND_URL
```

---

## 🎉 ¡Listo!

Tu aplicación está desplegada en Render. Ahora puedes:

1. Compartir la URL del frontend con tus usuarios
2. Hacer cambios y push a GitHub para actualizar automáticamente
3. Monitorear los logs en Render
4. Gestionar la base de datos desde Render

**¿Necesitas ayuda?** Revisa los logs en Render o consulta la documentación de Render.

