// src/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const flowerRoutes = require('./routes/flower.routes');
const floristeriaRoutes = require('./routes/floristeria.routes');
const userRoutes = require('./routes/user.routes');
const authRoutes = require('./routes/auth.routes');
const categoriaRoutes = require('./routes/categorias'); // ← require, no import
const healthRoutes = require('./routes/health');
const { swaggerUi, swaggerSpec } = require('./swagger');
const wompiRoutes = require('./routes/wompi.routes');

// Cargar variables de entorno desde .env
dotenv.config({ path: path.join(__dirname, '../.env') });

// Conectar a la base de datos
connectDB();

// Inicializar app
const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ❌ ELIMINADO: app.use('/uploads', express.static(...));
// ✅ Las imágenes se servirán desde Cloudinary

// Rutas
app.use('/api/flores', flowerRoutes);
app.use('/api/floristerias', floristeriaRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/health', healthRoutes);

// Documentación Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Ruta raíz simple
app.get('/', (req, res) => {
  res.send('API Tienda Navideña en funcionamiento');
});
app.use('/api/wompi', wompiRoutes);
// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor escuchando en puerto ${PORT}`);
  console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`☁️ Cloudinary configurado para: ${process.env.CLOUDINARY_CLOUD_NAME}`);
});
