// src/routes/flower.routes.js
const express = require('express');
const router = express.Router();

const florController = require('../controllers/flower.controller');
const upload = require('../middlewares/upload');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');

/**
 * Rutas de catálogo (LECTURA PÚBLICA)
 * - Estas deben ser accesibles sin token para que el storefront (Next.js) pueda leer productos.
 */

// Listado / búsqueda (?dominio=<host>&categoria=<slug|nombre>)
router.get('/', florController.getAllFlores);

// Productos por floristería (útil para panel admin; lectura pública)
router.get('/floristeria/:floristeriaId', florController.getFloresByFloristeria);

// Detalle por ID
router.get('/:id', florController.getFlorById);

/**
 * Rutas de gestión (ESCRITURA PROTEGIDA)
 * - Requieren JWT y rol autorizado.
 */

// Crear producto
router.post(
  '/',
  authenticateToken,
  authorizeRoles('admin', 'usuario'),
  upload.single('imagen'),
  florController.createFlor
);

// Actualizar producto
router.put(
  '/:id',
  authenticateToken,
  authorizeRoles('admin', 'usuario'),
  upload.single('imagen'),
  florController.updateFlor
);

// Eliminar producto
router.delete(
  '/:id',
  authenticateToken,
  authorizeRoles('admin', 'usuario'),
  florController.deleteFlor
);

module.exports = router;
