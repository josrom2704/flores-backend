const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');

/**
 * Controlador de autenticación para el login de administrador.
 * Las credenciales se comprueban contra valores definidos en variables de entorno.
 */
exports.login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Usuario y contraseña requeridos' });
  }
  try {
    // Buscar usuario en la base de datos
    const user = await User.findOne({ username });
    if (user) {
      // Comparar contraseña encriptada
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
      }
      // Generar token con rol y floristería
      const token = jwt.sign(
        {
          id: user._id,
          username: user.username,
          role: user.role,
          floristeria: user.floristeria
        },
        process.env.JWT_SECRET,
        { expiresIn: '4h' }
      );
      const userData = user.toObject();
      delete userData.password;
      return res.json({ token, user: userData });
    }
    // Si no hay usuario en BD, permitimos login utilizando credenciales fijas de admin
    const adminUser = process.env.ADMIN_USER;
    const adminPass = process.env.ADMIN_PASS;
    if (username === adminUser && password === adminPass) {
      const token = jwt.sign(
        { username: adminUser, role: 'admin' },
        process.env.JWT_SECRET,
        { expiresIn: '4h' }
      );
      return res.json({ token, user: { username: adminUser, role: 'admin' } });
    }
    return res.status(401).json({ message: 'Credenciales inválidas' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};