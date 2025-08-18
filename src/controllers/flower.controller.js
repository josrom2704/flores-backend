// src/controllers/flower.controller.js
const path = require('path');
const mongoose = require('mongoose');
const fs = require('fs');
const Flor = require('../models/flower.model');
const Floristeria = require('../models/floristeria.model');
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
 * Función auxiliar para subir imagen a Cloudinary
 * ✅ CORREGIDA: Ahora funciona con memoryStorage (buffer)
 */
async function uploadToCloudinary(fileBuffer, folder = 'tienda-flores') {
  try {
    console.log('☁️ Subiendo imagen a Cloudinary...');
    console.log('📁 Tamaño del buffer:', fileBuffer.length, 'bytes');
    
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          transformation: [
            { width: 800, height: 600, crop: 'limit' },
            { quality: 'auto' }
          ]
        },
        (error, result) => {
          if (error) {
            console.error('❌ Error subiendo a Cloudinary:', error);
            reject(error);
          } else {
            console.log('✅ Imagen subida exitosamente');
            console.log('🔗 URL:', result.secure_url);
            resolve(result.secure_url);
          }
        }
      );
      
      uploadStream.end(fileBuffer);
    });
  } catch (error) {
    console.error('❌ Error subiendo a Cloudinary:', error);
    throw error;
  }
}

/**
 * Función auxiliar para limpiar archivo temporal
 * ✅ CORREGIDA: Ya no es necesaria con memoryStorage
 */
function cleanupTempFile(filePath) {
  // ✅ Ya no es necesaria con memoryStorage
  // Los archivos se procesan en memoria y se eliminan automáticamente
  console.log('ℹ️ No es necesario limpiar archivos temporales con memoryStorage');
}

/**
 * GET /api/flores
 */
const getAllFlores = async (req, res) => {
  try {
    console.log('🔍 Conectando a MongoDB...');
    console.log(' URI de conexión:', process.env.MONGODB_URI);
    console.log(' Base de datos actual:', mongoose.connection.db.databaseName);
    console.log(' Colecciones disponibles:', await mongoose.connection.db.listCollections().toArray());
    console.log('🔍 Modelo Flor - Nombre:', Flor.modelName);
    console.log('�� Modelo Flor - Colección:', Flor.collection.name);
    console.log('�� Modelo Flor - Base de datos:', Flor.db.name);
    
    const { floristeriaId, url, categoria } = req.query;
    const query = {};

    console.log('🔍 getAllFlores - Query params:', { floristeriaId, url, categoria });

    // Resuelve floristería
    if (floristeriaId) {
      query.floristeria = floristeriaId;
    } else if (url) {
      console.log(' Buscando floristería con URL:', url);
      console.log(' URL normalizada:', String(url).toLowerCase());
      
      const todasLasFloristerias = await Floristeria.find({});
      console.log(' Todas las floristerías en la BD:', todasLasFloristerias.map(f => ({ 
        id: f._id, 
        nombre: f.nombre, 
        url: f.url 
      })));
      
      const f = await Floristeria.findOne({ url: String(url).toLowerCase() });
      console.log(' Floristería encontrada:', f ? f._id : 'NO ENCONTRADA');
      
      if (!f) {
        console.log('❌ No se encontró floristería para URL:', url);
        return res.json([]);
      }
      
      query.floristeria = f._id;
      console.log('✅ Floristería encontrada, ID:', f._id);
    }

    console.log('🔍 Query final:', JSON.stringify(query));

    const todosLosProductos = await Flor.find({});
    console.log('🔍 TODOS los productos en la BD:', todosLosProductos.map(f => ({ 
      id: f._id, 
      nombre: f.nombre, 
      floristeria: f.floristeria,
      tipoFloristeria: typeof f.floristeria 
    })));

    const flores = await Flor.find(query);
    console.log('🔍 Productos encontrados con query:', flores.length);
    
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

    let imagenUrl = undefined;
    
    // ✅ CORREGIDA: Subir imagen a Cloudinary si existe
    if (req.file) {
      try {
        // ✅ CAMBIO: Usar req.file.buffer en lugar de req.file.path
        imagenUrl = await uploadToCloudinary(req.file.buffer);
        console.log('✅ Imagen procesada y subida a Cloudinary');
      } catch (uploadError) {
        console.error('❌ Error procesando imagen:', uploadError);
        return res.status(500).json({ 
          message: 'Error al procesar la imagen',
          error: uploadError.message 
        });
      }
      // ✅ Ya no es necesario limpiar archivos temporales
    }

    const nuevaFlor = new Flor({
      nombre,
      descripcion,
      precio: Number(precio),
      stock,
      categoria,
      floristeria,
      imagen: imagenUrl, // ✅ Ahora guarda URL de Cloudinary
    });

    const florGuardada = await nuevaFlor.save();
    console.log('✅ Flor creada exitosamente con imagen:', imagenUrl ? 'Sí' : 'No');
    res.status(201).json(florGuardada);
  } catch (error) {
    console.error('❌ Error creando flor:', error);
    res.status(400).json({ message: error.message });
  }
};

// PUT /api/flores/:id
const updateFlor = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.precio !== undefined) updates.precio = Number(updates.precio);
    
    // ✅ CORREGIDA: Manejar imagen en actualización
    if (req.file) {
      try {
        // ✅ CAMBIO: Usar req.file.buffer en lugar de req.file.path
        const imagenUrl = await uploadToCloudinary(req.file.buffer);
        updates.imagen = imagenUrl;
        console.log('✅ Imagen actualizada en Cloudinary');
      } catch (uploadError) {
        console.error('❌ Error actualizando imagen:', uploadError);
        return res.status(500).json({ 
          message: 'Error al procesar la imagen',
          error: uploadError.message 
        });
      }
      // ✅ Ya no es necesario limpiar archivos temporales
    }

    const florActualizada = await Flor.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!florActualizada) return res.status(404).json({ message: 'Flor no encontrada' });
    res.json(florActualizada);
  } catch (error) {
    console.error('❌ Error actualizando flor:', error);
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/flores/:id
// DELETE /api/flores/:id
const deleteFlor = async (req, res) => {
  try {
    console.log('🗑️ Intentando eliminar producto:', req.params.id);
    
    // ✅ ELIMINACIÓN REAL: Usar findByIdAndDelete
    const florEliminada = await Flor.findByIdAndDelete(req.params.id);
    
    if (!florEliminada) {
      console.log('❌ Producto no encontrado');
      return res.status(404).json({ message: 'Flor no encontrada' });
    }
    
    console.log('✅ Producto eliminado realmente:', florEliminada._id);
    console.log('✅ Nombre del producto eliminado:', florEliminada.nombre);
    
    res.json({ 
      message: 'Flor eliminada correctamente',
      deletedProduct: {
        id: florEliminada._id,
        nombre: florEliminada.nombre
      }
    });
  } catch (error) {
    console.error('❌ Error eliminando flor:', error);
    res.status(500).json({ 
      message: 'Error al eliminar el producto',
      error: error.message 
    });
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