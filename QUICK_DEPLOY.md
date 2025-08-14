# 🚀 Despliegue Rápido en Railway (Sin Git)

## Opción 1: Despliegue Directo (Recomendado)

Si no quieres configurar Git ahora, puedes hacer el despliegue directamente:

### 1. Crear Cuenta en Railway
1. Ve a [railway.app](https://railway.app)
2. Inicia sesión con tu cuenta de GitHub
3. Haz clic en "New Project"

### 2. Desplegar desde Archivos
1. Selecciona "Deploy from GitHub repo"
2. Si no tienes repositorio, selecciona "Deploy from template"
3. Elige "Node.js" como template
4. Sube manualmente tus archivos

### 3. Configurar Variables de Entorno
En Railway, ve a la pestaña "Variables" y agrega:
```bash
PORT=3000
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/tienda-navideña
JWT_SECRET=tu_secreto_super_seguro
NODE_ENV=production
```

## Opción 2: Usar GitHub Desktop (Más Fácil)

### 1. Instalar GitHub Desktop
1. Descarga desde [desktop.github.com](https://desktop.github.com)
2. Instala y configura con tu cuenta de GitHub

### 2. Crear Repositorio
1. Abre GitHub Desktop
2. "File" → "New Repository"
3. Nombre: `tienda-backend`
4. Local path: tu carpeta actual
5. Haz clic en "Create Repository"

### 3. Publicar en GitHub
1. Haz clic en "Publish repository"
2. Marca como público
3. Haz clic en "Publish Repository"

### 4. Conectar con Railway
1. Ve a [railway.app](https://railway.app)
2. "New Project"
3. "Deploy from GitHub repo"
4. Selecciona tu repositorio

## Opción 3: Despliegue Manual

### 1. Crear Proyecto en Railway
1. Ve a [railway.app](https://railway.app)
2. "New Project"
3. "Deploy from template"
4. Elige "Node.js"

### 2. Subir Archivos
1. En la pestaña "Files"
2. Sube todos tus archivos manualmente
3. Asegúrate de que estén en la raíz del proyecto

### 3. Configurar Build
1. En "Settings" → "Build"
2. Build Command: `npm install`
3. Start Command: `npm start`

## Configuración de MongoDB Atlas

### 1. Crear Cluster
1. Ve a [mongodb.com/atlas](https://mongodb.com/atlas)
2. Crea cuenta gratuita
3. Crea cluster gratuito
4. Crea usuario de base de datos

### 2. Obtener URI
1. Haz clic en "Connect"
2. "Connect your application"
3. Copia la URI
4. Reemplaza `<password>` y `<dbname>`

### 3. Configurar en Railway
1. Ve a "Variables"
2. Agrega `MONGODB_URI` con tu URI

## Verificar Despliegue

### 1. URLs de Prueba
- **API Principal**: `https://tu-proyecto.railway.app/`
- **Salud**: `https://tu-proyecto.railway.app/health`
- **Swagger**: `https://tu-proyecto.railway.app/api-docs`

### 2. Probar Endpoints
```bash
# Probar API principal
curl https://tu-proyecto.railway.app/

# Probar salud del sistema
curl https://tu-proyecto.railway.app/health

# Probar categorías
curl https://tu-proyecto.railway.app/api/categorias
```

## Solución de Problemas

### Build Falla
- Verifica que `package.json` esté presente
- Verifica que no haya errores de sintaxis
- Revisa los logs en Railway

### Error de Conexión
- Verifica la URI de MongoDB
- Verifica las variables de entorno
- Revisa los logs de Railway

### Error de Puerto
- Railway asigna el puerto automáticamente
- Usa `process.env.PORT` en tu código

## Próximos Pasos

1. ✅ Backend desplegado en Railway
2. ✅ Base de datos configurada
3. ✅ API funcionando
4. ✅ Conectar con tu frontend en Vercel
5. ✅ Actualizar URLs en el frontend

## Comandos de Verificación

Una vez desplegado, puedes probar:
```bash
# Verificar que la API responda
curl https://tu-proyecto.railway.app/

# Verificar salud del sistema
curl https://tu-proyecto.railway.app/health

# Verificar documentación
curl https://tu-proyecto.railway.app/api-docs
```
