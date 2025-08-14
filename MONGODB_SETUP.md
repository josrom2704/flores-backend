# 🗄️ Configuración de MongoDB Atlas

## Paso a Paso para Configurar MongoDB Atlas

### 1. Crear Cuenta en MongoDB Atlas
1. Ve a [mongodb.com/atlas](https://mongodb.com/atlas)
2. Haz clic en "Try Free"
3. Completa el formulario de registro

### 2. Crear Cluster
1. Selecciona "Shared" (Gratuito)
2. Elige el proveedor (AWS, Google Cloud, Azure)
3. Selecciona la región más cercana a El Salvador
4. Haz clic en "Create"

### 3. Configurar Seguridad
1. **Database Access**:
   - Haz clic en "Database Access"
   - "Add New Database User"
   - Username: `tienda-admin`
   - Password: Genera una contraseña segura
   - Role: "Atlas admin" o "Read and write to any database"
   - Haz clic en "Add User"

2. **Network Access**:
   - Haz clic en "Network Access"
   - "Add IP Address"
   - Para desarrollo: "Allow Access from Anywhere" (0.0.0.0/0)
   - Para producción: Agrega solo las IPs de Railway

### 4. Obtener URI de Conexión
1. Haz clic en "Connect"
2. Selecciona "Connect your application"
3. Copia la URI de conexión
4. Reemplaza `<password>` con la contraseña del usuario
5. Reemplaza `<dbname>` con `tienda-navideña`

### Ejemplo de URI:
```
mongodb+srv://tienda-admin:TuPassword123@cluster0.xxxxx.mongodb.net/tienda-navideña
```

### 5. Configurar en Railway
1. Ve a tu proyecto en Railway
2. Pestaña "Variables"
3. Agrega:
   ```
   MONGODB_URI=mongodb+srv://tienda-admin:TuPassword123@cluster0.xxxxx.mongodb.net/tienda-navideña
   ```

## Estructura de la Base de Datos

Tu base de datos se creará automáticamente con estas colecciones:
- `users` - Usuarios del sistema
- `flowers` - Productos de flores
- `floristerias` - Información de floristerías
- `categorias` - Categorías de productos

## Verificar Conexión

Una vez desplegado, puedes verificar la conexión:
1. Ve a tu API en Railway
2. Haz una petición GET a `/api/categorias`
3. Si devuelve datos o un array vacío, la conexión está funcionando

## Solución de Problemas

### Error: "MongoServerSelectionError"
- Verifica que la URI sea correcta
- Asegúrate de que el usuario tenga permisos
- Verifica que la IP esté en la whitelist

### Error: "Authentication failed"
- Verifica el usuario y contraseña
- Asegúrate de que el usuario tenga el rol correcto

### Error: "Connection timeout"
- Verifica la conectividad de red
- Asegúrate de que el cluster esté activo
