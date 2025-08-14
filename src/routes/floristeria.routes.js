const express = require('express');
const router = express.Router();
const floristeriaController = require('../controllers/floristeria.controller');
const upload = require('../middlewares/upload');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');

/**
 * Rutas para gestionar floristerías.
 * Sólo los administradores pueden crear, actualizar o eliminar floristerías.
 */

// Obtener todas las floristerías
router.get('/', authenticateToken, authorizeRoles('admin', 'usuario'), floristeriaController.getAllFloristerias);

// Obtener una floristería por ID
router.get('/:id', authenticateToken, authorizeRoles('admin', 'usuario'), floristeriaController.getFloristeriaById);

// Crear una nueva floristería (admin)
router.post('/', authenticateToken, authorizeRoles('admin'), upload.single('logo'), floristeriaController.createFloristeria);

// Actualizar una floristería existente (admin)
router.put('/:id', authenticateToken, authorizeRoles('admin'), upload.single('logo'), floristeriaController.updateFloristeria);

// Eliminar una floristería (admin)
router.delete('/:id', authenticateToken, authorizeRoles('admin'), floristeriaController.deleteFloristeria);

module.exports = router;