# Plataforma de Formación con IA

Una plataforma moderna de formación en tecnologías de desarrollo con integración de inteligencia artificial para acelerar el aprendizaje.

## 🚀 Características

- **Dashboard de Cursos**: Lista completa de cursos disponibles con información detallada
- **Reproductor de Videos**: Sistema integrado para reproducir videos de los cursos
- **Autenticación**: Sistema de login y registro de usuarios
- **Diseño Moderno**: Interfaz elegante con Tailwind CSS y shadcn/ui
- **Base de Datos MongoDB**: Almacenamiento robusto de cursos y videos
- **Responsive**: Diseño adaptativo para todos los dispositivos

## 📚 Cursos Disponibles

- **JavaScript Moderno**: ES6+, async/await, módulos
- **SQL Avanzado**: Consultas complejas y optimización
- **React.js**: Construcción de aplicaciones modernas
- **Node.js y Express**: Desarrollo backend
- **TypeScript**: Desarrollo tipado
- **MongoDB**: Bases de datos NoSQL
- **Docker**: Containerización
- **Git y GitHub**: Control de versiones

## 🛠️ Tecnologías

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Base de Datos**: MongoDB
- **Autenticación**: JWT
- **Deployment**: Vercel

## 🚀 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd formacion
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env.local
   ```
   
   Editar `.env.local` con tus credenciales:
   ```
   MONGODB_URI=mongodb://localhost:27017/formacion
   JWT_SECRET=tu-secreto-jwt
   ```

4. **Poblar la base de datos**
   ```bash
   npm run seed
   ```

5. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```

## 📖 Uso

### Para Usuarios

1. **Registro/Login**: Accede a `/auth` para crear una cuenta o iniciar sesión
2. **Dashboard**: Una vez autenticado, ve a `/dashboard` para ver todos los cursos
3. **Explorar Cursos**: Haz clic en cualquier curso para ver su contenido
4. **Ver Videos**: Dentro de cada curso, puedes ver la lista de videos disponibles
5. **Reproducir**: Haz clic en "Reproducir" para ver el video en el reproductor integrado

### Estructura de Navegación

```
/                    → Página principal
/auth               → Login/Registro
/dashboard          → Lista de cursos
/courses/[id]       → Detalle del curso
/player/[id]        → Reproductor de video
```

## 🗄️ Estructura de la Base de Datos

### Colección: `cursos`
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  module: String,
  duration: String,
  level: String,
  students: Number,
  imageUrl: String,
  tags: [String],
  videos: [Video]
}
```

### Colección: `videos`
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  url: String,
  duration: String,
  order: Number,
  courseId: String
}
```

## 🎨 Componentes Principales

- **Dashboard**: Muestra estadísticas y lista de cursos
- **CourseCard**: Tarjeta individual de cada curso
- **VideoPlayer**: Reproductor integrado de videos
- **AuthContext**: Gestión de estado de autenticación
- **Header**: Navegación principal

## 🔧 Scripts Disponibles

- `npm run dev`: Ejecutar en modo desarrollo
- `npm run build`: Construir para producción
- `npm run start`: Ejecutar en modo producción
- `npm run lint`: Ejecutar linter
- `npm run seed`: Poblar base de datos con datos de ejemplo

## 📱 Características Responsive

- Diseño adaptativo para móviles, tablets y desktop
- Navegación optimizada para touch
- Reproductor de video responsive
- Cards de cursos con layout flexible

## 🔒 Seguridad

- Autenticación JWT
- Rutas protegidas
- Validación de datos
- Sanitización de inputs

## 🚀 Deployment

1. **Vercel** (Recomendado)
   ```bash
   npm run build
   vercel --prod
   ```

2. **Configurar variables de entorno en Vercel**:
   - `MONGODB_URI`
   - `JWT_SECRET`

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 📞 Soporte

Si tienes alguna pregunta o problema, por favor abre un issue en el repositorio.
