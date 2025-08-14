const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * Esquema para usuarios del sistema.
 * Incluye nombre de usuario único, contraseña encriptada, rol (admin o usuario)
 * y una referencia opcional a la floristería a la que pertenece el usuario.
 */
const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['admin', 'usuario'],
      default: 'usuario'
    },
    floristeria: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Floristeria',
      default: null
    }
  },
  { timestamps: true }
);

// Antes de guardar, encriptamos la contraseña si ha sido modificada
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('User', UserSchema);