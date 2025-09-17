// src/controllers/categoria.controller.js
const Categoria = require('../models/Categoria');

// GET /api/categorias - Obtener todas las categorías activas
const getAllCategorias = async (req, res) => {
  try {
    console.log('�� Obteniendo todas las categorías...');
    
    const categorias = await Categoria.find({})
      .populate('floristeria', 'nombre url')
      .sort({ nombre: 1 });
    
    console.log(`✅ Se encontraron ${categorias.length} categorías`);
    res.json(categorias);
  } catch (error) {
    console.error('❌ Error en getAllCategorias:', error);
    res.status(500).json({ message: error.message });
  }
};

// GET /api/categorias/:id - Obtener una categoría por ID
const getCategoriaById = async (req, res) => {
  try {
    const categoria = await Categoria.findById(req.params.id)
      .populate('floristeria', 'nombre url');
    
    if (!categoria) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }
    
    res.json(categoria);
  } catch (error) {
    console.error('❌ Error en getCategoriaById:', error);
    res.status(500).json({ message: error.message });
  }
};

// POST /api/categorias - Crear nueva categoría
const createCategoria = async (req, res) => {
  try {
    const { nombre, slug, descripcion, icono, imagen, floristeria } = req.body;
    
    console.log('�� Creando nueva categoría:', { nombre, slug, descripcion, icono });
    
    // Verificar si ya existe una categoría con ese nombre
    const categoriaExistente = await Categoria.findOne({ 
      nombre: { $regex: new RegExp(`^${nombre}$`, 'i') } 
    });
    
    if (categoriaExistente) {
      return res.status(400).json({ 
        message: 'Ya existe una categoría con ese nombre' 
      });
    }
    
    // Generar slug automáticamente si no se proporciona
    let categoriaSlug = slug;
    if (!categoriaSlug) {
      categoriaSlug = nombre
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // quita acentos
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
    }
    
    const nuevaCategoria = new Categoria({
      nombre,
      slug: categoriaSlug,
      descripcion,
      icono: icono || '🌸',
      imagen,
      floristeria
    });
    
    const categoriaGuardada = await nuevaCategoria.save();
    
    console.log('✅ Categoría creada exitosamente:', categoriaGuardada._id);
    res.status(201).json(categoriaGuardada);
  } catch (error) {
    console.error('❌ Error creando categoría:', error);
    res.status(400).json({ message: error.message });
  }
};

// PUT /api/categorias/:id - Actualizar categoría
const updateCategoria = async (req, res) => {
  try {
    const { nombre, slug, descripcion, icono, imagen, floristeria } = req.body;
    
    console.log('✏️ Actualizando categoría:', req.params.id);
    
    // Verificar si ya existe otra categoría con ese nombre
    if (nombre) {
      const categoriaExistente = await Categoria.findOne({ 
        nombre: { $regex: new RegExp(`^${nombre}$`, 'i') },
        _id: { $ne: req.params.id }
      });
      
      if (categoriaExistente) {
        return res.status(400).json({ 
          message: 'Ya existe una categoría con ese nombre' 
        });
      }
    }
    
    // Generar slug automáticamente si no se proporciona
    let categoriaSlug = slug;
    if (nombre && !categoriaSlug) {
      categoriaSlug = nombre
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // quita acentos
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
    }
    
    const categoriaActualizada = await Categoria.findByIdAndUpdate(
      req.params.id,
      { 
        nombre, 
        slug: categoriaSlug, 
        descripcion, 
        icono, 
        imagen, 
        floristeria 
      },
      { new: true, runValidators: true }
    );
    
    if (!categoriaActualizada) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }
    
    console.log('✅ Categoría actualizada exitosamente');
    res.json(categoriaActualizada);
  } catch (error) {
    console.error('❌ Error actualizando categoría:', error);
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/categorias/:id - Eliminar categoría
const deleteCategoria = async (req, res) => {
  try {
    console.log('🗑️ Eliminando categoría:', req.params.id);
    
    const categoriaEliminada = await Categoria.findByIdAndDelete(req.params.id);
    
    if (!categoriaEliminada) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }
    
    console.log('✅ Categoría eliminada exitosamente:', categoriaEliminada.nombre);
    res.json({ 
      message: 'Categoría eliminada correctamente',
      deletedCategory: {
        id: categoriaEliminada._id,
        nombre: categoriaEliminada.nombre
      }
    });
  } catch (error) {
    console.error('❌ Error eliminando categoría:', error);
    res.status(500).json({ message: error.message });
  }
};

// GET /api/categorias/floristeria/:floristeriaId - Obtener categorías por floristería
const getCategoriasByFloristeria = async (req, res) => {
  try {
    const { floristeriaId } = req.params;
    
    console.log('🔍 Obteniendo categorías para floristería:', floristeriaId);
    
    const categorias = await Categoria.find({ floristeria: floristeriaId })
      .populate('floristeria', 'nombre url')
      .sort({ nombre: 1 });
    
    console.log(`✅ Se encontraron ${categorias.length} categorías para la floristería`);
    res.json(categorias);
  } catch (error) {
    console.error('❌ Error en getCategoriasByFloristeria:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllCategorias,
  getCategoriaById,
  createCategoria,
  updateCategoria,
  deleteCategoria,
  getCategoriasByFloristeria
};