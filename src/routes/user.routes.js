const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');

/**
 * Rutas para gestión de usuarios. Sólo el rol admin puede crear y listar usuarios.
 */

// Obtener todos los usuarios (admin)
router.get('/', authenticateToken, authorizeRoles('admin'), userController.getAllUsers);

// Crear nuevo usuario (admin)
router.post('/', authenticateToken, authorizeRoles('admin'), userController.createUser);

// Eliminar usuario (admin)
router.delete('/:id', authenticateToken, authorizeRoles('admin'), userController.deleteUser);

module.exports = router;