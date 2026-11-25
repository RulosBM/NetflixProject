# StreamFlix — Plataforma de Streaming Tipo Netflix

StreamFlix es una aplicación web full-stack inspirada en Netflix desarrollada con Vue 3, Pinia, Vue Router, Node.js, Express, MongoDB Atlas, Mongoose, Passport y JWT.

---

## 📋 Requisitos Previos

- **Node.js**: v18.0.0 o superior
- **MongoDB**: Instancia local de MongoDB en ejecucion (`mongodb://127.0.0.1:27017/streamflix`) o un Cluster de **MongoDB Atlas**.

---

## 🛠️ Instalación y Configuración

### 1. Backend

1. Navegar a la carpeta backend:
   ```bash
   cd backend
   ```
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Configurar variables de entorno en `.env`:
   ```env
   PORT=5000
   URI_LINK=mongodb://127.0.0.1:27017/streamflix
   JWT_SECRET=super_secret_streamflix_key_2026
   ```

### 2. Frontend

1. Navegar a la carpeta frontend:
   ```bash
   cd frontend
   ```
2. Instalar dependencias:
   ```bash
   npm install
   ```

---

## 🚀 Poblar Base de Datos de Prueba (Seed)

Para poblar MongoDB con categorías (Acción, Comedia, Drama, Ciencia Ficción, Documentales) y películas de prueba con imágenes y tráilers funcionales:

```bash
cd backend
npm run seed
```

---

## ⚡ Ejecución en Desarrollo

### 1. Iniciar Backend (Puerto 5000)
```bash
cd backend
npm run dev
```

### 2. Iniciar Frontend (Puerto 3000)
```bash
cd frontend
npm run dev
```

Abre tu navegador en `http://localhost:3000` para disfrutar de la experiencia StreamFlix.

---

## 📡 Endpoints de la API REST

### Categorías (`/api/categories`)
- `GET /api/categories`: Obtener todas las categorías.
- `POST /api/categories`: Crear una nueva categoría.
- `PUT /api/categories/:id`: Actualizar categoría.
- `DELETE /api/categories/:id`: Eliminar categoría.

### Películas (`/api/movies`)
- `GET /api/movies`: Obtener películas (soporta `?title=...`, `?category=...`, `?page=1&limit=10`).
- `GET /api/movies/:id`: Obtener detalle de película por ID (con populate de categoría).
- `POST /api/movies`: Crear una nueva película.
- `PUT /api/movies/:id`: Actualizar película.
- `DELETE /api/movies/:id`: Eliminar película.

### Usuarios y Autenticación (`/api/users`)
- `POST /api/users/signup`: Registro de usuario (Validado con Joi, hash bcryptjs).
- `POST /api/users/signin`: Inicio de sesión (Devuelve token JWT).
- `GET /api/users/profile`: Obtener perfil autenticado.

### Mi Lista (Protegidos mediante JWT + Passport)
- `GET /api/users/mylist`: Obtener películas guardadas en Mi Lista.
- `POST /api/users/mylist/:movieId`: Agregar película a Mi Lista.
- `DELETE /api/users/mylist/:movieId`: Eliminar película de Mi Lista.
