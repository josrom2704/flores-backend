const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

/**
 * Ruta para autenticación del administrador.
 * Realiza login y devuelve un token JWT en caso de éxito.
 *
 * @swagger
 * tags:
 *   name: Auth
 *   description: Autenticación
 *
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión como administrador
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Credenciales inválidas
 */
router.post('/login', authController.login);

module.exports = router;