# 🚀 Guía de Despliegue - Backend Tienda Navideña

## Despliegue en Railway

### 1. Preparación del Proyecto

Asegúrate de que tu proyecto esté en GitHub y que tengas todos los archivos necesarios:
- ✅ `package.json` con dependencias
- ✅ `railway.json` (configuración de Railway)
- ✅ `Procfile` (comando de inicio)
- ✅ `.gitignore` (excluir archivos sensibles)

### 2. Crear Cuenta en Railway

1. Ve a [railway.app](https://railway.app)
2. Inicia sesión con tu cuenta de GitHub
3. Haz clic en "New Project"

### 3. Conectar Repositorio

1. Selecciona "Deploy from GitHub repo"
2. Selecciona tu repositorio `tienda-backend`
3. Railway detectará automáticamente que es un proyecto Node.js

### 4. Configurar Variables de Entorno

En Railway, ve a la pestaña "Variables" y agrega:

```bash
PORT=3000
MONGODB_URI=mongodb+srv://tu_usuario:tu_password@tu_cluster.mongodb.net/tienda-navideña
JWT_SECRET=tu_jwt_secret_super_seguro_aqui
NODE_ENV=production
```

### 5. Configurar Base de Datos MongoDB

#### Opción A: MongoDB Atlas (Recomendado)
1. Ve a [mongodb.com/atlas](https://mongodb.com/atlas)
2. Crea una cuenta gratuita
3. Crea un nuevo cluster
4. Crea un usuario de base de datos
5. Obtén la URI de conexión
6. Agrega la URI en las variables de entorno de Railway

#### Opción B: MongoDB en Railway
1. En Railway, ve a "New Service"
2. Selecciona "Database" → "MongoDB"
3. Railway te dará automáticamente las variables de entorno

### 6. Desplegar

1. Railway detectará automáticamente los cambios
2. El build se ejecutará automáticamente
3. Tu API estará disponible en la URL que Railway te proporcione

### 7. Verificar Despliegue

1. Ve a la pestaña "Deployments"
2. Verifica que el build sea exitoso
3. Haz clic en la URL generada para probar tu API

### 8. Configurar Dominio Personalizado (Opcional)

1. Ve a la pestaña "Settings"
2. En "Domains", agrega tu dominio personalizado
3. Configura los registros DNS según las instrucciones

## Variables de Entorno Requeridas

```bash
# Puerto del servidor
PORT=3000

# URI de conexión a MongoDB
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/database

# Secreto para JWT
JWT_SECRET=tu_secreto_super_seguro

# Entorno
NODE_ENV=production
```

## Comandos Útiles

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Ejecutar en producción
npm start

# Ver logs en Railway
railway logs
```

## Solución de Problemas Comunes

### Error de Conexión a MongoDB
- Verifica que la URI de MongoDB sea correcta
- Asegúrate de que la IP de Railway esté en la whitelist de MongoDB Atlas

### Error de Puerto
- Railway asigna automáticamente el puerto, usa `process.env.PORT`

### Error de Build
- Verifica que todas las dependencias estén en `package.json`
- Asegúrate de que el script `start` esté definido

## Soporte

Si tienes problemas:
1. Revisa los logs en Railway
2. Verifica las variables de entorno
3. Asegúrate de que MongoDB esté funcionando
4. Revisa que todas las rutas estén correctamente definidas
