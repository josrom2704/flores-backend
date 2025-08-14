// src/routes/categorias.js
const express = require('express');
const router = express.Router();
const Flor = require('../models/flower.model');
const Floristeria = require('../models/floristeria.model');

/**
 * GET /api/categorias?floristeriaId=...  ó  ?dominio=mi-sitio.vercel.app
 * Devuelve las categorías distintas registradas en los productos.
 */
router.get('/', async (req, res) => {
  try {
    const { floristeriaId, dominio } = req.query;
    const filtro = {};

    if (floristeriaId) {
      // Búsqueda directa por ID
      filtro.floristeria = floristeriaId;
    } else if (dominio) {
      // Buscar floristería por dominio registrado
      const floristeria = await Floristeria.findOne({ dominio: dominio.toLowerCase() });
      if (!floristeria) {
        return res.json([]);
      }
      filtro.floristeria = floristeria._id;
    }

    // Obtener categorías distintas de los productos que cumplan el filtro
    const categorias = await Flor.distinct('categoria', filtro);
    res.json(categorias);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener categorías', error: err.message });
  }
});

module.exports = router;
