# ED-KNOWS

Plataforma educativa para el aprendizaje de ecuaciones diferenciales con contenido validado por docentes expertos.

## Descripción

ED-KNOWS es una aplicación web diseñada para estudiantes de ecuaciones diferenciales que necesitan encontrar videos y ejercicios detallados y autorizados por docentes. La plataforma ofrece un sistema de aprendizaje estructurado y gamificado similar a Duolingo, con animaciones y un diseño moderno.

## Características Principales

### Para Estudiantes
- **Landing Page**: Presentación de la plataforma, propósito, opiniones de usuarios y docentes colaboradores
- **Sistema de Autenticación**: Registro e inicio de sesión con usuario y contraseña
- **Menú de Temas**: Acceso a diferentes temas de ecuaciones diferenciales (Bernoulli, aplicaciones, orden superior, homogéneas, etc.)
- **Sistema de Niveles**: 
  - Nivel 0: Video tutorial sobre cómo resolver el tema
  - Niveles 1-5: Ejercicios prácticos con imágenes
- **Cronómetro de Ejercicios**: 
  - Botón "Iniciar" para comenzar
  - Botón "Parar" que reinicia el contador
  - Botón "Finalizar" que detiene el cronómetro
- **Verificación de Respuestas**: 
  - Visualización de la solución del ejercicio
  - Confirmación si la respuesta coincide
  - Video explicativo si la respuesta no coincide
- **Sistema de Preferencias**: 
  - Cambio de foto de perfil
  - Actualización de usuario y contraseña
  - Configuraciones personalizadas
- **Sistema de Progreso**: 
  - Nivel de progreso por tema
  - Logros desbloqueados
  - Tiempo total en la aplicación
  - Gráfica lineal de avances durante los últimos 7 días
- **Sistema de Logros**: Logros tipo videojuego que se desbloquean al completar objetivos

### Para Administradores
- **Panel de Administración**: 
  - Visualización de usuarios conectados
  - Lista de usuarios creados con todos sus datos
  - Subir lecciones
  - Editar lecciones
  - Eliminar lecciones

### Diseño y UX
- **Modo Nocturno/Claro**: Botón de acceso rápido con animaciones de transición (sol/luna)
- **Tema de Colores**: Blanco y morado como colores principales
- **Animaciones**: Transiciones suaves y animaciones tipo Duolingo
- **Sin Emojis**: Uso de imágenes de dominio público e íconos en su lugar

## Tecnologías Utilizadas

- **React 18**: Biblioteca de JavaScript para construir interfaces de usuario
- **TypeScript**: Superset de JavaScript con tipado estático
- **Vite**: Herramienta de construcción rápida
- **React Router**: Enrutamiento para aplicaciones React
- **Framer Motion**: Biblioteca de animaciones para React
- **Chart.js**: Biblioteca para gráficos
- **Lucide React**: Iconos modernos
- **CSS3**: Estilos personalizados con variables CSS

## Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/JhonPC-hub/ED-KNOWS.git
cd ED-KNOWS
```

2. Instala las dependencias:
```bash
npm install
```

3. Inicia el servidor de desarrollo:
```bash
npm run dev
```

4. Abre tu navegador en `http://localhost:5173`

## Despliegue

### GitHub

1. Crea un nuevo repositorio en GitHub con el nombre `ED-KNOWS`
2. Inicializa git en tu proyecto (si no lo has hecho):
```bash
git init
git add .
git commit -m "Initial commit"
```

3. Conecta tu repositorio local con GitHub:
```bash
git remote add origin https://github.com/JhonPC-hub/ED-KNOWS.git
git branch -M main
git push -u origin main
```

### Render

Este proyecto está configurado para desplegarse automáticamente en Render:

1. **Crear cuenta en Render**: Ve a [render.com](https://render.com) y crea una cuenta gratuita

2. **Conectar con GitHub**:
   - En el dashboard de Render, haz clic en "New +" y selecciona "Web Service"
   - Conecta tu cuenta de GitHub y selecciona el repositorio `ED-KNOWS`
   - Render detectará automáticamente el archivo `render.yaml`

3. **Configuración automática**:
   - El archivo `render.yaml` ya está configurado con:
     - **Build Command**: `npm install && npm run build`
     - **Start Command**: `npx serve -s dist -l 10000`
     - **Environment**: Node.js 20.x

4. **Despliegue**:
   - Render construirá y desplegará automáticamente tu aplicación
   - Obtendrás una URL pública (ej: `https://ed-knows.onrender.com`)

**Nota**: El plan gratuito de Render puede tener tiempos de inicio más lentos después de períodos de inactividad. Para producción, considera actualizar a un plan de pago.

## Estructura del Proyecto

```
ED-KNOWS/
├── src/
│   ├── components/       # Componentes reutilizables
│   │   ├── Layout.tsx
│   │   └── Layout.css
│   ├── context/          # Contextos de React (Auth, Theme, Data)
│   │   ├── AuthContext.tsx
│   │   ├── ThemeContext.tsx
│   │   └── DataContext.tsx
│   ├── pages/            # Páginas de la aplicación
│   │   ├── LandingPage.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Topics.tsx
│   │   ├── TopicDetail.tsx
│   │   ├── Exercise.tsx
│   │   ├── Profile.tsx
│   │   ├── Progress.tsx
│   │   ├── AdminPanel.tsx
│   │   └── About.tsx
│   ├── types/            # Definiciones de tipos TypeScript
│   │   └── index.ts
│   ├── App.tsx           # Componente principal
│   ├── main.tsx          # Punto de entrada
│   └── index.css         # Estilos globales
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── render.yaml          # Configuración para Render
└── .gitignore
```

## Usuarios por Defecto

### Administrador
- Usuario: `admin`
- Contraseña: `admin123`

## Docentes Colaboradores

- **Profesora Judith Bermúdez**: Profesora del Área de Matemáticas, Universidad Simón Bolívar
- **Profesor Cristian Castro**: Profesor del Área de Matemáticas, Universidad Simón Bolívar

## Desarrollador

- **Nombre**: Jhon F. Pérez Castro
- **Email**: jhon.perezc@unisimon.edu.co
- **Institución**: Universidad Simón Bolívar

## Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo
- `npm run build`: Construye la aplicación para producción
- `npm run preview`: Previsualiza la construcción de producción
- `npm start`: Inicia el servidor de producción (usado por Render)
- `npm run lint`: Ejecuta el linter

## Características de Diseño

- **Colores Principales**: 
  - Morado: `#7B2CBF`
  - Blanco: `#FFFFFF`
- **Modo Oscuro**: Soporte completo con transiciones suaves
- **Responsive**: Diseño adaptable a diferentes tamaños de pantalla
- **Animaciones**: Transiciones suaves con Framer Motion

## Funcionalidades Futuras

- Integración con backend para almacenamiento persistente
- Sistema de comentarios y foros
- Más temas y ejercicios
- Exportación de progreso
- Certificados de finalización

## Licencia

Este proyecto es propiedad de Jhon F. Pérez Castro y la Universidad Simón Bolívar.

## Contacto

Para más información, contacta a:
- Email: jhon.perezc@unisimon.edu.co

