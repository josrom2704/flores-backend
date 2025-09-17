// src/routes/categorias.js
const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoria.controller');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');

/**
 * Rutas de categorías
 * - GET /api/categorias - Listar todas las categorías
 * - GET /api/categorias/:id - Obtener categoría por ID
 * - POST /api/categorias - Crear nueva categoría (requiere autenticación)
 * - PUT /api/categorias/:id - Actualizar categoría (requiere autenticación)
 * - DELETE /api/categorias/:id - Eliminar categoría (requiere autenticación)
 * - GET /api/categorias/floristeria/:floristeriaId - Obtener categorías por floristería
 */

// Rutas públicas (lectura)
router.get('/', categoriaController.getAllCategorias);
router.get('/:id', categoriaController.getCategoriaById);
router.get('/floristeria/:floristeriaId', categoriaController.getCategoriasByFloristeria);

// Rutas protegidas (escritura)
router.post(
  '/',
  authenticateToken,
  authorizeRoles('admin', 'usuario'),
  categoriaController.createCategoria
);

router.put(
  '/:id',
  authenticateToken,
  authorizeRoles('admin', 'usuario'),
  categoriaController.updateCategoria
);

router.delete(
  '/:id',
  authenticateToken,
  authorizeRoles('admin', 'usuario'),
  categoriaController.deleteCategoria
);

module.exports = router;