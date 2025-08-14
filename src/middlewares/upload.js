const multer = require('multer');
const path = require('path');

/**
 * Configuración de Multer para almacenamiento de imágenes.
 * Las imágenes se almacenan en la carpeta `uploads/` en la raíz del proyecto.
 * El nombre del archivo se genera con un sufijo único para evitar colisiones.
 */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

module.exports = upload;