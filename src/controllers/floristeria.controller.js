const Floristeria = require('../models/floristeria.model');

/**
 * Controlador para gestionar floristerías (multi-tenant).
 * - Crea/edita con URL pública; el modelo autogenera "dominio".
 * - Lista, obtiene por id y elimina.
 */

// Obtener todas las floristerías
exports.getAllFloristerias = async (req, res) => {
  try {
    const floristerias = await Floristeria.find().sort({ createdAt: -1 });
    res.json(floristerias);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener una floristería por ID
exports.getFloristeriaById = async (req, res) => {
  try {
    const floristeria = await Floristeria.findById(req.params.id);
    if (!floristeria) return res.status(404).json({ message: 'Floristería no encontrada' });
    res.json(floristeria);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Crear una nueva floristería (dominio se autocalcula desde url por el modelo)
exports.createFloristeria = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.logo = req.file.path;

    const nueva = await Floristeria.create(data);
    res.status(201).json(nueva);
  } catch (error) {
    // Duplicado de dominio
    if (error.code === 11000 && error.keyPattern?.dominio) {
      return res.status(409).json({ message: 'Ese dominio ya está registrado' });
    }
    res.status(400).json({ message: error.message });
  }
};

// Actualizar una floristería existente
exports.updateFloristeria = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (req.file) updates.logo = req.file.path;

    const updated = await Floristeria.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'Floristería no encontrada' });
    res.json(updated);
  } catch (error) {
    if (error.code === 11000 && error.keyPattern?.dominio) {
      return res.status(409).json({ message: 'Ese dominio ya está registrado' });
    }
    res.status(400).json({ message: error.message });
  }
};

// Eliminar una floristería
exports.deleteFloristeria = async (req, res) => {
  try {
    const floristeriaEliminada = await Floristeria.findByIdAndDelete(req.params.id);
    if (!floristeriaEliminada) return res.status(404).json({ message: 'Floristería no encontrada' });
    res.json({ message: 'Floristería eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
