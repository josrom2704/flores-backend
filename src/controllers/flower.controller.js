// src/controllers/flower.controller.js
const path = require('path');
const Flor = require('../models/flower.model');
const Floristeria = require('../models/floristeria.model');

/** Normaliza rutas de archivo (Windows \ -> /) */
function normalizeFilePath(p) {
  if (!p) return p;
  return path.normalize(p).replace(/\\/g, '/');
}

/** Convierte nombre de categoría a slug (para comparaciones flexibles) */
function slugify(str = '') {
  return String(str)
    .toLowerCase()
    .normalize('NFD').replace(/\p{Diacritic}/gu, '') // quita acentos
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

/**
 * GET /api/flores
 * Filtros:
 *  - ?floristeriaId=<ObjectId>
 *  - ?dominio=<host> (p.ej. localhost o canastasnavidenas.vercel.app)
 *  - ?categoria=<slug|nombre> (match flexible: slug o nombre, insensible a mayús/min)
 */
const getAllFlores = async (req, res) => {
  try {
    const { floristeriaId, dominio, categoria } = req.query;
    const query = {};

    console.log('🔍 getAllFlores - Query params:', { floristeriaId, dominio, categoria });

    // Resuelve floristería
    if (floristeriaId) {
      query.floristeria = floristeriaId;
    } else if (dominio) {
      console.log('�� Buscando floristería con dominio:', dominio);
      const f = await Floristeria.findOne({ dominio: String(dominio).toLowerCase() });
      console.log('�� Floristería encontrada:', f ? f._id : 'NO ENCONTRADA');
      if (!f) return res.json([]); // si no hay floristería para ese dominio: 0 productos
      query.floristeria = f._id;
    }

    console.log('🔍 Query final:', JSON.stringify(query));

    const flores = await Flor.find(query);
    console.log('🔍 Productos encontrados:', flores.length);
    
    res.json(flores);
  } catch (error) {
    console.error('❌ Error en getAllFlores:', error);
    res.status(500).json({ message: error.message });
  }
};

// GET /api/flores/:id
const getFlorById = async (req, res) => {
  try {
    const flor = await Flor.findById(req.params.id);
    if (!flor) return res.status(404).json({ message: 'Flor no encontrada' });
    res.json(flor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/flores/floristeria/:floristeriaId
const getFloresByFloristeria = async (req, res) => {
  const { floristeriaId } = req.params;
  try {
    const flores = await Flor.find({ floristeria: floristeriaId });
    res.json(flores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/flores
const createFlor = async (req, res) => {
  const { nombre, descripcion, precio, stock, categoria, floristeria } = req.body;
  try {
    if (!floristeria) {
      return res.status(400).json({ message: 'El campo "floristeria" es obligatorio' });
    }

    const nuevaFlor = new Flor({
      nombre,
      descripcion,
      precio: Number(precio),
      stock,
      categoria,
      floristeria,
      imagen: req.file ? normalizeFilePath(req.file.path) : undefined,
    });

    const florGuardada = await nuevaFlor.save();
    res.status(201).json(florGuardada);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// PUT /api/flores/:id
const updateFlor = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.precio !== undefined) updates.precio = Number(updates.precio);
    if (req.file) updates.imagen = normalizeFilePath(req.file.path);

    const florActualizada = await Flor.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!florActualizada) return res.status(404).json({ message: 'Flor no encontrada' });
    res.json(florActualizada);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE /api/flores/:id
const deleteFlor = async (req, res) => {
  try {
    const florEliminada = await Flor.findByIdAndDelete(req.params.id);
    if (!florEliminada) return res.status(404).json({ message: 'Flor no encontrada' });
    res.json({ message: 'Flor eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Exportar todas las funciones
module.exports = {
  getAllFlores,
  getFlorById,
  getFloresByFloristeria,
  createFlor,
  updateFlor,
  deleteFlor
};