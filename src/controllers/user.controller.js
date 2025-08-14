const User = require('../models/user.model');
const bcrypt = require('bcryptjs');

/**
 * Controladores para gestionar usuarios.
 * Permiten crear nuevos usuarios y listar los existentes. Sólo los
 * administradores pueden crear y ver usuarios.
 */

// Obtener todos los usuarios (sólo admin)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .populate('floristeria', 'nombre');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Crear un nuevo usuario
exports.createUser = async (req, res) => {
  const { username, password, role, floristeria } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Usuario y contraseña requeridos' });
  }
  try {
    // Verificar si ya existe un usuario con el mismo username
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: 'El nombre de usuario ya está en uso' });
    }
    const newUser = new User({ username, password, role, floristeria });
    const savedUser = await newUser.save();
    // No devolver la contraseña en respuesta
    const userObj = savedUser.toObject();
    delete userObj.password;
    res.status(201).json(userObj);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Eliminar usuario
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userDeleted = await User.findByIdAndDelete(id);
    if (!userDeleted) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};