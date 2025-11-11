# Guía de Despliegue - ED-KNOWS

## Pasos para subir a GitHub

1. **Inicializar Git** (si no está inicializado):
```bash
git init
```

2. **Agregar todos los archivos**:
```bash
git add .
```

3. **Hacer commit inicial**:
```bash
git commit -m "Initial commit: ED-KNOWS platform"
```

4. **Crear repositorio en GitHub**:
   - Ve a https://github.com/new
   - Nombre del repositorio: `ED-KNOWS`
   - Descripción: "Plataforma educativa para el aprendizaje de ecuaciones diferenciales"
   - Elige si será público o privado
   - **NO** inicialices con README, .gitignore o licencia (ya los tenemos)

5. **Conectar y subir**:
```bash
git remote add origin https://github.com/JhonPC-hub/ED-KNOWS.git
git branch -M main
git push -u origin main
```

## Pasos para desplegar en Render

1. **Crear cuenta en Render**:
   - Ve a https://render.com
   - Regístrate con tu cuenta de GitHub (recomendado)

2. **Crear nuevo Web Service**:
   - En el dashboard, haz clic en "New +"
   - Selecciona "Web Service"
   - Conecta tu cuenta de GitHub si no lo has hecho
   - Selecciona el repositorio `ED-KNOWS`

3. **Configuración** (Render detectará automáticamente el `render.yaml`):
   - **Name**: `ed-knows` (o el que prefieras)
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build` (ya configurado)
   - **Start Command**: `npx serve -s dist -l 10000` (ya configurado)
   - **Plan**: Free (o el que prefieras)

4. **Desplegar**:
   - Haz clic en "Create Web Service"
   - Render construirá y desplegará automáticamente
   - Espera a que termine el build (puede tomar 5-10 minutos la primera vez)

5. **Obtener URL**:
   - Una vez desplegado, obtendrás una URL como: `https://ed-knows.onrender.com`
   - Esta URL estará disponible públicamente

## Notas Importantes

- **Plan Gratuito de Render**: 
  - El servicio puede "dormir" después de 15 minutos de inactividad
  - El primer acceso después de dormir puede tardar 30-60 segundos
  - Para producción, considera un plan de pago

- **Actualizaciones**:
  - Cada vez que hagas `git push` a GitHub, Render desplegará automáticamente
  - Los despliegues automáticos están habilitados por defecto

- **Variables de Entorno**:
  - Actualmente no se requieren variables de entorno
  - Si en el futuro necesitas agregar alguna, puedes hacerlo en la sección "Environment" del servicio en Render

## Solución de Problemas

### El build falla en Render
- Verifica que todas las dependencias estén en `package.json`
- Revisa los logs de build en Render para ver el error específico

### La aplicación no carga
- Verifica que el `startCommand` esté correcto
- Asegúrate de que el puerto sea 10000 (Render lo mapea automáticamente)

### Cambios no se reflejan
- Verifica que hayas hecho `git push` a GitHub
- Revisa que el despliegue automático esté habilitado en Render

