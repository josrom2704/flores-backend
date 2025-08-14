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
exports.getAllFlores = async (req, res) => {
  try {
    const { floristeriaId, dominio, categoria } = req.query;
    const query = {};

    // Resuelve floristería
    if (floristeriaId) {
      query.floristeria = floristeriaId;
    } else if (dominio) {
      const f = await Floristeria.findOne({ dominio: String(dominio).toLowerCase() });
      if (!f) return res.json([]); // si no hay floristería para ese dominio: 0 productos
      query.floristeria = f._id;
    }

    // Filtro por categoría (acepta slug o nombre)
    if (categoria) {
      const catSlug = slugify(categoria);
      // Intento 1: exacto (insensible a mayúsculas)
      // Intento 2: slug equivalente (si guardas nombres con espacios)
      query.$or = [
        { categoria: { $regex: new RegExp(`^${categoria}$`, 'i') } },
        { categoria: { $regex: new RegExp(`^${catSlug.replace(/-/g, ' ')}$`, 'i') } },
      ];
    }

    const flores = await Flor.find(query);
    res.json(flores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/flores/:id
exports.getFlorById = async (req, res) => {
  try {
    const flor = await Flor.findById(req.params.id);
    if (!flor) return res.status(404).json({ message: 'Flor no encontrada' });
    res.json(flor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/flores/floristeria/:floristeriaId
exports.getFloresByFloristeria = async (req, res) => {
  const { floristeriaId } = req.params;
  try {
    const flores = await Flor.find({ floristeria: floristeriaId });
    res.json(flores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/flores
exports.createFlor = async (req, res) => {
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
exports.updateFlor = async (req, res) => {
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
exports.deleteFlor = async (req, res) => {
  try {
    const florEliminada = await Flor.findByIdAndDelete(req.params.id);
    if (!florEliminada) return res.status(404).json({ message: 'Flor no encontrada' });
    res.json({ message: 'Flor eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
