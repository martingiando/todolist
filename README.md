# Task Manager App

## Descripción

Task Manager es una aplicación sencilla para gestionar tareas. Permite a los usuarios agregar, visualizar, editar, eliminar y marcar tareas como completadas. La aplicación está construida usando **Next.js** para el frontend y backend, y la persistencia de datos se maneja a través de una base de datos (puedes usar MongoDB u otra base de datos).

## Tecnologías Utilizadas

- **Frontend y Backend**: Next.js (utilizando API Routes para el backend)
- **Estilos**: Tailwind CSS
- **Base de Datos**: MongoDB (o cualquier otra base de datos que elijas)
- **Iconos**: React Icons (para los iconos de las tareas)
- **Gestión de Estado**: React `useState`, `useEffect`, y `react-hook-form` para la gestión de formularios
- **Dark Mode/Light Mode**: Implementado con localStorage para persistencia del tema

## Funcionalidades

### 🏠 Home (Vista Principal)
- Visualiza el listado de todas las tareas.
- Las tareas pueden ser filtradas por su estado (completada o pendiente).
  
### 📝 Formulario (Crear y Editar Tarea)
- Crear una nueva tarea.
- Editar una tarea existente.
- Validación de formulario para asegurar que el título es obligatorio.

### 🔨 CRUD (Operaciones sobre Tareas)
- **Crear**: Agregar nuevas tareas.
- **Leer**: Ver la lista de todas las tareas.
- **Actualizar**: Editar tareas existentes.
- **Eliminar**: Borrar tareas de la lista.
- **Completar/Desmarcar**: Cambiar el estado de las tareas entre "Pendiente" y "Completada".

### 🌒/🌞 Dark Mode / Light Mode
- Permite al usuario cambiar entre los modos oscuro y claro.
- El tema seleccionado se guarda en `localStorage` para persistencia entre sesiones.

### 💾 Persistencia de Datos
- Los datos se guardan de manera persistente usando una base de datos (MongoDB o la que prefieras).
- Las operaciones CRUD se realizan a través de las rutas de la API en **Next.js**.

## 🚀 Cómo ejecutar el proyecto localmente

1. Clona el repositorio:
   ```bash
   git clone https://github.com/martingiando/todolist.git
   cd todo-app
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Configura tu base de datos (MongoDB o la que elijas) y actualiza las variables de entorno en un archivo `.env.local`:
   ```bash
   MONGODB_URI=tu_uri_de_mongodb
   ```
4. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
5. Abre tu navegador y ve a `http://localhost:3000`.