// src/middlewares/upload.js
const multer = require('multer');

/**
 * Configuración de Multer para procesamiento de imágenes en memoria.
 * Las imágenes se procesan en memoria y se envían directamente a Cloudinary.
 * NO se guardan localmente en el servidor.
 */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB máximo
  },
  fileFilter: (req, file, cb) => {
    // Solo permitir imágenes
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de imagen'), false);
    }
  }
});

module.exports = upload;