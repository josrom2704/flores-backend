// src/routes/categorias.js
const express = require('express');
const router = express.Router();
const Categoria = require('../models/Categoria');
const Floristeria = require('../models/floristeria.model');

/**
 * GET /api/categorias/floristeria/:floristeriaId
 * Obtiene todas las categorías de una floristería específica
 */
router.get('/floristeria/:floristeriaId', async (req, res) => {
  try {
    const { floristeriaId } = req.params;
    const categorias = await Categoria.find({ floristeria: floristeriaId });
    res.json(categorias);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener categorías', error: err.message });
  }
});

/**
 * GET /api/categorias
 * Obtiene todas las categorías (opcionalmente filtradas por floristeriaId o dominio)
 */
router.get('/', async (req, res) => {
  try {
    const { floristeriaId, dominio } = req.query;
    const filtro = {};

    if (floristeriaId) {
      filtro.floristeria = floristeriaId;
    } else if (dominio) {
      const floristeria = await Floristeria.findOne({ dominio: dominio.toLowerCase() });
      if (!floristeria) {
        return res.json([]);
      }
      filtro.floristeria = floristeria._id;
    }

    const categorias = await Categoria.find(filtro);
    res.json(categorias);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener categorías', error: err.message });
  }
});

/**
 * GET /api/categorias/:id
 * Obtiene una categoría específica por ID
 */
router.get('/:id', async (req, res) => {
  try {
    const categoria = await Categoria.findById(req.params.id);
    if (!categoria) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }
    res.json(categoria);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener categoría', error: err.message });
  }
});

/**
 * POST /api/categorias
 * Crea una nueva categoría
 */
router.post('/', async (req, res) => {
  try {
    const { nombre, slug, descripcion, icono, imagen, floristeria } = req.body;
    
    const nuevaCategoria = new Categoria({
      nombre,
      slug: slug || nombre.toLowerCase().replace(/\s+/g, '-'),
      descripcion: descripcion || `Categoría ${nombre}`,
      icono: icono || '🌸',
      imagen,
      floristeria
    });

    const categoriaGuardada = await nuevaCategoria.save();
    res.status(201).json(categoriaGuardada);
  } catch (err) {
    res.status(400).json({ message: 'Error al crear categoría', error: err.message });
  }
});

/**
 * PUT /api/categorias/:id
 * Actualiza una categoría existente
 */
router.put('/:id', async (req, res) => {
  try {
    const categoriaActualizada = await Categoria.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!categoriaActualizada) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }

    res.json(categoriaActualizada);
  } catch (err) {
    res.status(400).json({ message: 'Error al actualizar categoría', error: err.message });
  }
});

/**
 * DELETE /api/categorias/:id
 * Elimina una categoría
 */
router.delete('/:id', async (req, res) => {
  try {
    const categoriaEliminada = await Categoria.findByIdAndDelete(req.params.id);

    if (!categoriaEliminada) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }

    res.json({ message: 'Categoría eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar categoría', error: err.message });
  }
});

module.exports = router;