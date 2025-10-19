// src/models/Categoria.js
const mongoose = require('mongoose');

const categoriaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  slug: { type: String },
  descripcion: { type: String },
  icono: { type: String },
  imagen: { type: String },
  floristeria: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Floristeria',
    required: true 
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Categoria', categoriaSchema);