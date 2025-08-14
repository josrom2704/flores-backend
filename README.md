# Tienda Navideña API

Este repositorio contiene el backend de una tienda online de canastas navideñas y flores. Está desarrollado en **Node.js** con **Express** y utiliza **MongoDB** como base de datos mediante Mongoose. La API ofrece un CRUD completo para el modelo `Flor` y un sistema básico de autenticación para el administrador mediante JWT. Además, la documentación de la API está generada con Swagger.

## Funcionalidades principales

- **CRUD de flores**: permite crear, leer, actualizar y eliminar flores.
- **Autenticación JWT**: para acceder a las operaciones que modifican datos se requiere autenticación.
- **Subida de imágenes**: las flores pueden incluir una imagen asociada.
- **Documentación con Swagger**: la documentación interactiva está disponible en `/api-docs` una vez levantado el servidor.

## Estructura de carpetas

- `src/`: contiene el código fuente de la aplicación
  - `config/`: conexión a la base de datos
  - `models/`: definición de los modelos de datos (Mongoose)
  - `controllers/`: lógica de negocio para cada recurso
  - `routes/`: rutas de Express
  - `middlewares/`: middlewares personalizados (authenticación y subida de archivos)
  - `swagger.js`: configuración de Swagger
  - `server.js`: archivo de inicio de la aplicación
- `uploads/`: carpeta donde se almacenan las imágenes subidas
- `.env`: variables de entorno (no se debe subir a repositorios públicos)

## Instalación y ejecución

1. **Clonar el repositorio**

   ```bash
   git clone <URL-del-repo>
   cd tienda-backend
   ```

2. **Instalar dependencias**

   Ejecuta el siguiente comando para instalar todas las dependencias listadas en `package.json`:

   ```bash
   npm install
   ```

3. **Configurar variables de entorno**

   Crea un archivo `.env` en la raíz con las siguientes variables (adaptándolas según tu entorno):

   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/tienda
   JWT_SECRET=una_clave_secreta
   ADMIN_USER=admin
   ADMIN_PASS=admin123
   ```

4. **Ejecutar el servidor**

   Para iniciar el servidor en modo de desarrollo puedes usar `nodemon` (asegúrate de tenerlo instalado globalmente):

   ```bash
   npm run dev
   ```

   O bien, puedes iniciar el servidor con Node directamente:

   ```bash
   npm start
   ```

   El servidor quedará escuchando por defecto en el puerto definido en la variable `PORT`. Por ejemplo, si `PORT=3000`, la API estará disponible en `http://localhost:3000`.

5. **Acceder a la documentación Swagger**

   Una vez iniciado el servidor, puedes abrir `http://localhost:3000/api-docs` en tu navegador para ver la documentación interactiva de la API generada con Swagger.

## Endpoints principales

### Autenticación

| Método | Endpoint        | Descripción                         |
|-------:|-----------------|-------------------------------------|
| `POST` | `/api/auth/login` | Inicia sesión con las credenciales del administrador y devuelve un token JWT. |

### Flores

| Método | Endpoint              | Descripción                                       | Autenticación |
|-------:|-----------------------|---------------------------------------------------|---------------|
| `GET`  | `/api/flores`         | Obtiene todas las flores                          | No            |
| `GET`  | `/api/flores/{id}`    | Obtiene una flor por su ID                        | No            |
| `POST` | `/api/flores`         | Crea una nueva flor (con imagen opcional)         | Sí            |
| `PUT`  | `/api/flores/{id}`    | Actualiza una flor existente                      | Sí            |
| `DELETE` | `/api/flores/{id}`  | Elimina una flor por su ID                        | Sí            |

## Notas

- Este proyecto está preparado para integrarse con un frontend desarrollado en React (por ejemplo con Vite). Solo necesitas consumir los endpoints RESTful provistos por este backend.
- La autenticación es muy básica y está pensada como un ejemplo. En un entorno de producción deberías implementar gestión de usuarios, hashing de contraseñas y roles.
- Puedes extender el proyecto añadiendo modelos y rutas para canastas, usuarios, pedidos, etc., siguiendo la misma estructura empleada para las flores.