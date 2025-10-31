// src/controllers/flower.controller.js
const path = require('path');
const mongoose = require('mongoose');
const fs = require('fs');
const Flor = require('../models/flower.model');
const Floristeria = require('../models/floristeria.model');
const Categoria = require('../models/Categoria');
const cloudinary = require('../config/cloudinary');

/** Normaliza rutas de archivo (Windows \ -> /) */
function normalizeFilePath(p) {
  if (!p) return p;
  return path.normalize(p).replace(/\\/g, '/');
}

/** Convierte nombre de categoría a slug (para comparaciones flexibles) */
function slugify(str = '') {
  return String(str)
    .toLowerCase()
    .normalize('NFD').replace(/\p{Diacritic}/gu, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

/**
 * Sube imagen a Cloudinary usando buffer (memoryStorage)
 */
async function uploadToCloudinary(fileBuffer, folder = 'tienda-flores') {
  try {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          transformation: [
            { width: 800, height: 600, crop: 'limit' },
            { quality: 'auto' }
          ]
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result.secure_url);
        }
      );
      uploadStream.end(fileBuffer);
    });
  } catch (error) {
    console.error('Error subiendo a Cloudinary:', error);
    throw error;
  }
}

/**
 * Ya no es necesaria con memoryStorage, se deja por compatibilidad
 */
function cleanupTempFile(_filePath) {
  // No-op
}

/**
 * Valida y procesa categorías:
 * - Acepta: array|string, múltiples campos de FormData
 * - Interpreta ObjectIds válidos directamente
 * - Soporta strings tipo '["<id>"]' y extrae el id
 * - Si no es id, busca/crea por nombre en la floristería
 */
async function processCategories(categorias, floristeriaId) {
  try {
    if (!categorias || (Array.isArray(categorias) && categorias.length === 0)) {
      return [];
    }

    // Normalizar a array
    let categoriasArray;
    if (Array.isArray(categorias)) {
      categoriasArray = categorias;
    } else if (typeof categorias === 'string') {
      // Puede venir como JSON, id suelto, o nombre
      try {
        const parsed = JSON.parse(categorias);
        categoriasArray = Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        categoriasArray = [categorias];
      }
    } else {
      categoriasArray = [categorias];
    }

    const categoriasValidas = [];

    for (const categoria of categoriasArray) {
      // 1) Si parece ObjectId, usarlo
      if (mongoose.Types.ObjectId.isValid(categoria)) {
        const oid = new mongoose.Types.ObjectId(categoria);
        const existe = await Categoria.findById(oid);
        if (existe && String(existe.floristeria) === String(floristeriaId)) {
          categoriasValidas.push(oid);
          continue;
        }
      }

      // 2) Caso como '["<id>"]' o '"<id>"'
      if (typeof categoria === 'string') {
        const m = categoria.match(/^[\[\s"]*([a-f\d]{24})[\s"]*]?$/i);
        if (m && mongoose.Types.ObjectId.isValid(m[1])) {
          const oid = new mongoose.Types.ObjectId(m[1]);
          const existe = await Categoria.findById(oid);
          if (existe && String(existe.floristeria) === String(floristeriaId)) {
            categoriasValidas.push(oid);
            continue;
          }
        }
      }

      // 3) Tratar como nombre
      if (typeof categoria === 'string' && categoria.trim().length > 0) {
        const nombre = categoria.trim();
        let categoriaExistente = await Categoria.findOne({
          nombre: { $regex: new RegExp(`^${nombre}$`, 'i') },
          floristeria: floristeriaId
        });

        if (!categoriaExistente) {
          categoriaExistente = await Categoria.create({
            nombre,
            slug: slugify(nombre),
            descripcion: `Categoría ${nombre}`,
            icono: '🌸',
            floristeria: floristeriaId
          });
        }

        categoriasValidas.push(categoriaExistente._id);
      }
    }

    return categoriasValidas;
  } catch (error) {
    console.error('Error procesando categorías:', error);
    throw error;
  }
}

/**
 * GET /api/flores
 */
const getAllFlores = async (req, res) => {
  try {
    const { floristeriaId, url, categoria } = req.query;
    const query = {};

    // Resolver floristería
    if (floristeriaId) {
      query.floristeria = floristeriaId;
    } else if (url) {
      const f = await Floristeria.findOne({
        $or: [
          { url: String(url).toLowerCase() },
          { dominio: String(url).toLowerCase() }
        ]
      });
      if (!f) return res.json([]);
      query.floristeria = f._id;
    }

    // Filtro por categoría (por nombre)
    if (categoria) {
      const categoriasEncontradas = await Categoria.find({
        nombre: { $regex: new RegExp(categoria, 'i') }
      });

      if (categoriasEncontradas.length > 0) {
        query.categorias = { $in: categoriasEncontradas.map(c => c._id) };
      } else {
        // Compatibilidad hacia atrás
        query.categoria = categoria;
      }
    }

    const flores = await Flor.find(query)
      .populate('categorias', 'nombre slug descripcion icono')
      .sort({ createdAt: -1 });

    res.json(flores);
  } catch (error) {
    console.error('Error en getAllFlores:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET /api/flores/:id
 */
const getFlorById = async (req, res) => {
  try {
    const flor = await Flor.findById(req.params.id)
      .populate('categorias', 'nombre slug descripcion icono');

    if (!flor) return res.status(404).json({ message: 'Flor no encontrada' });
    res.json(flor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET /api/flores/floristeria/:floristeriaId
 */
const getFloresByFloristeria = async (req, res) => {
  const { floristeriaId } = req.params;
  try {
    const flores = await Flor.find({ floristeria: floristeriaId })
      .populate('categorias', 'nombre slug descripcion icono')
      .sort({ createdAt: -1 });
    res.json(flores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * POST /api/flores
 */
const createFlor = async (req, res) => {
  const { nombre, descripcion, precio, stock, categoria, floristeria } = req.body;

  try {
    if (!floristeria) {
      return res.status(400).json({ message: 'El campo "floristeria" es obligatorio' });
    }

    let imagenUrl;
    if (req.file) {
      try {
        imagenUrl = await uploadToCloudinary(req.file.buffer);
      } catch (uploadError) {
        return res.status(500).json({
          message: 'Error al procesar la imagen',
          error: uploadError.message
        });
      }
    }

    // Normalizar categorias desde multipart/form-data
    let rawCats = req.body.categorias;
    if (typeof rawCats === 'string') {
      try { rawCats = JSON.parse(rawCats); } catch { rawCats = [rawCats]; }
    }
    if (rawCats != null && !Array.isArray(rawCats)) rawCats = [rawCats];

    // Procesar categorías múltiples
    let categoriasProcesadas = [];
    if (rawCats && rawCats.length > 0) {
      categoriasProcesadas = await processCategories(rawCats, floristeria);
    } else if (categoria) {
      categoriasProcesadas = await processCategories([categoria], floristeria);
    }

    const nuevaFlor = new Flor({
      nombre,
      descripcion,
      precio: Number(precio),
      stock,
      categoria, // compatibilidad
      categorias: categoriasProcesadas,
      floristeria,
      imagen: imagenUrl
    });

    const florGuardada = await nuevaFlor.save();
    const florConCategorias = await Flor.findById(florGuardada._id)
      .populate('categorias', 'nombre slug descripcion icono');

    res.status(201).json(florConCategorias);
  } catch (error) {
    console.error('Error creando flor:', error);
    res.status(400).json({ message: error.message });
  }
};

/**
 * PUT /api/flores/:id
 */
const updateFlor = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.precio !== undefined) updates.precio = Number(updates.precio);

    if (req.file) {
      try {
        const imagenUrl = await uploadToCloudinary(req.file.buffer);
        updates.imagen = imagenUrl;
      } catch (uploadError) {
        return res.status(500).json({
          message: 'Error al procesar la imagen',
          error: uploadError.message
        });
      }
    }

    // Normalizar categorias desde multipart/form-data
    if (updates.categorias || updates.categoria) {
      const floristeriaId = updates.floristeria || (await Flor.findById(req.params.id))?.floristeria;

      let rawCats = updates.categorias ?? (updates.categoria ? [updates.categoria] : null);
      if (typeof rawCats === 'string') {
        try { rawCats = JSON.parse(rawCats); } catch { rawCats = [rawCats]; }
      }
      if (rawCats != null && !Array.isArray(rawCats)) rawCats = [rawCats];

      if (rawCats && rawCats.length > 0) {
        updates.categorias = await processCategories(rawCats, floristeriaId);
      }
    }

    const florActualizada = await Flor.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    });

    if (!florActualizada) return res.status(404).json({ message: 'Flor no encontrada' });

    const florConCategorias = await Flor.findById(florActualizada._id)
      .populate('categorias', 'nombre slug descripcion icono');

    res.json(florConCategorias);
  } catch (error) {
    console.error('Error actualizando flor:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * DELETE /api/flores/:id
 */
const deleteFlor = async (req, res) => {
  try {
    const florEliminada = await Flor.findByIdAndDelete(req.params.id);
    if (!florEliminada) {
      return res.status(404).json({ message: 'Flor no encontrada' });
    }

    res.json({
      message: 'Flor eliminada correctamente',
      deletedProduct: {
        id: florEliminada._id,
        nombre: florEliminada.nombre
      }
    });
  } catch (error) {
    console.error('Error eliminando flor:', error);
    res.status(500).json({
      message: 'Error al eliminar el producto',
      error: error.message
    });
  }
};

module.exports = {
  getAllFlores,
  getFlorById,
  getFloresByFloristeria,
  createFlor,
  updateFlor,
  deleteFlor
};