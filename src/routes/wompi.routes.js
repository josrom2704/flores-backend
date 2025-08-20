const express = require('express');
const wompiController = require('../controllers/wompi.controller');

const router = express.Router();

// Ruta de prueba de conexión
router.get('/test', wompiController.testConnection);

// Ruta para crear enlace de pago
router.post('/create-payment', wompiController.createPaymentLink);

// Ruta de estado del API
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API Wompi funcionando correctamente',
    timestamp: new Date().toISOString(),
    endpoints: {
      'GET /test': 'Probar conexión con Wompi',
      'POST /create-payment': 'Crear enlace de pago',
      'GET /health': 'Estado del API'
    }
  });
});

module.exports = router;