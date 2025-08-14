# ✅ Checklist de Despliegue

## Antes del Despliegue

### 1. Verificar Archivos del Proyecto
- [ ] `package.json` con todas las dependencias
- [ ] `railway.json` configurado
- [ ] `Procfile` creado
- [ ] `.gitignore` configurado
- [ ] `src/server.js` actualizado
- [ ] Ruta de salud `/health` agregada

### 2. Verificar Código
- [ ] Todas las rutas funcionan localmente
- [ ] Conexión a MongoDB funciona
- [ ] Middlewares de autenticación funcionan
- [ ] Subida de archivos funciona
- [ ] Swagger está configurado

### 3. Preparar Repositorio
- [ ] Código subido a GitHub
- [ ] Último commit realizado
- [ ] Branch principal actualizado

## Durante el Despliegue

### 1. Railway
- [ ] Cuenta creada en [railway.app](https://railway.app)
- [ ] Proyecto nuevo creado
- [ ] Repositorio conectado
- [ ] Build exitoso
- [ ] Variables de entorno configuradas

### 2. MongoDB Atlas
- [ ] Cuenta creada en [mongodb.com/atlas](https://mongodb.com/atlas)
- [ ] Cluster creado
- [ ] Usuario de base de datos creado
- [ ] IPs de Railway en whitelist
- [ ] URI de conexión obtenida

### 3. Variables de Entorno
- [ ] `PORT=3000`
- [ ] `MONGODB_URI=mongodb+srv://...`
- [ ] `JWT_SECRET=tu_secreto_seguro`
- [ ] `NODE_ENV=production`

## Después del Despliegue

### 1. Verificar Funcionamiento
- [ ] API responde en `/`
- [ ] Ruta de salud funciona `/health`
- [ ] Base de datos conectada
- [ ] Swagger accesible `/api-docs`
- [ ] Todas las rutas de la API funcionan

### 2. Probar Endpoints
- [ ] `GET /api/categorias` - Lista categorías
- [ ] `GET /api/flores` - Lista flores
- [ ] `POST /api/auth/login` - Login funciona
- [ ] `GET /api/users` - Usuarios (con auth)

### 3. Configurar Frontend
- [ ] URL del backend obtenida
- [ ] Variables de entorno en Vercel
- [ ] Código del frontend actualizado
- [ ] CORS funcionando
- [ ] Conexión entre frontend y backend

## URLs de Verificación

Una vez desplegado, verifica estas URLs:

- **API Principal**: `https://tu-proyecto.railway.app/`
- **Salud del Sistema**: `https://tu-proyecto.railway.app/health`
- **Documentación**: `https://tu-proyecto.railway.app/api-docs`
- **Categorías**: `https://tu-proyecto.railway.app/api/categorias`
- **Flores**: `https://tu-proyecto.railway.app/api/flores`

## Comandos de Verificación

```bash
# Verificar que el servidor funcione localmente
npm run dev

# Verificar build
npm run build

# Verificar que no haya errores de sintaxis
node -c src/server.js

# Verificar dependencias
npm audit
```

## Solución de Problemas Comunes

### Build Falla
- Verificar que todas las dependencias estén en `package.json`
- Verificar que no haya errores de sintaxis
- Verificar que el script `start` esté definido

### Error de Conexión a MongoDB
- Verificar URI de conexión
- Verificar credenciales del usuario
- Verificar whitelist de IPs

### Error de Puerto
- Railway asigna automáticamente el puerto
- Usar `process.env.PORT` en el código

### Error de CORS
- Verificar configuración de CORS en el servidor
- Verificar que el frontend esté en la lista de orígenes permitidos
