# 🌐 Configuración del Frontend

## Conectar tu Sitio Web con el Backend

Una vez que tengas tu backend desplegado en Railway, necesitas actualizar tu frontend para que se conecte a la nueva API.

### 1. Obtener URL del Backend

Después del despliegue en Railway, obtendrás una URL como:
```
https://tu-proyecto-production.up.railway.app
```

### 2. Actualizar Variables de Entorno en Vercel

En tu proyecto de Vercel, ve a:
1. Settings → Environment Variables
2. Agrega:
   ```
   VITE_API_URL=https://tu-proyecto-production.up.railway.app
   ```

### 3. Actualizar Código del Frontend

Busca en tu código donde tengas la URL del backend y cámbiala:

```javascript
// Antes (desarrollo local)
const API_URL = 'http://localhost:3000';

// Después (producción)
const API_URL = import.meta.env.VITE_API_URL || 'https://tu-proyecto-production.up.railway.app';
```

### 4. Verificar CORS

Tu backend ya tiene CORS configurado para permitir peticiones desde cualquier origen. Si quieres restringirlo solo a tu dominio:

```javascript
// En src/server.js
app.use(cors({
  origin: [
    'https://tienda-navidena.vercel.app',
    'http://localhost:5173' // Para desarrollo
  ],
  credentials: true
}));
```

### 5. Probar la Conexión

Una vez configurado, puedes probar:
1. Ve a tu sitio web
2. Abre la consola del navegador
3. Haz una petición a tu API
4. Verifica que no haya errores de CORS

### 6. Actualizar URLs de Imágenes

Si tienes imágenes subidas, asegúrate de que las URLs apunten al backend desplegado:

```javascript
// Antes
const imageUrl = `http://localhost:3000/uploads/${filename}`;

// Después
const imageUrl = `${import.meta.env.VITE_API_URL}/uploads/${filename}`;
```

## Estructura de URLs de la API

Tu API estará disponible en estas rutas:

- **Autenticación**: `https://tu-backend.railway.app/api/auth`
- **Flores**: `https://tu-backend.railway.app/api/flores`
- **Floristerías**: `https://tu-backend.railway.app/api/floristerias`
- **Usuarios**: `https://tu-backend.railway.app/api/users`
- **Categorías**: `https://tu-backend.railway.app/api/categorias`
- **Documentación**: `https://tu-backend.railway.app/api-docs`

## Ejemplo de Uso

```javascript
// Función para obtener flores
async function getFlowers() {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/flores`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching flowers:', error);
    return [];
  }
}

// Función para login
async function login(credentials) {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
}
```

## Verificación Final

1. ✅ Backend desplegado en Railway
2. ✅ Base de datos MongoDB Atlas configurada
3. ✅ Variables de entorno configuradas
4. ✅ Frontend actualizado con la nueva URL
5. ✅ CORS configurado correctamente
6. ✅ API respondiendo correctamente

## Próximos Pasos

Una vez que todo esté funcionando:
1. Configura un dominio personalizado en Railway
2. Implementa HTTPS
3. Configura monitoreo y logs
4. Implementa backup automático de la base de datos
