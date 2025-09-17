const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Flor:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID autogenerado de la flor
 *         nombre:
 *           type: string
 *         descripcion:
 *           type: string
 *         precio:
 *           type: number
 *         imagen:
 *           type: string
 *           description: Ruta de la imagen almacenada
 *         stock:
 *           type: integer
 *         categorias:
 *           type: array
 *           items:
 *             type: string
 *           description: Array de IDs de categorías
 *         categoria:
 *           type: string
 *           description: Categoría única (compatibilidad hacia atrás)
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * Definición del esquema para una Flor.
 * Incluye campos básicos como nombre, descripción, precio, imagen, stock y categorías múltiples.
 * `timestamps: true` agrega automáticamente createdAt y updatedAt.
 */
const FlowerSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true },
    precio: { type: Number, required: true },
    imagen: { type: String },
    stock: { type: Number, required: true, default: 0 },
    
    // ✨ NUEVO: Categorías múltiples como array de ObjectIds
    categorias: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Categoria',
      required: false
    }],
    
    // ✅ MANTENIDO: Categoría única para compatibilidad hacia atrás
    categoria: { type: String },
    
    // Referencia a la floristería a la que pertenece el producto. Este campo es
    // obligatorio para poder asociar los arreglos con una tienda determinada.
    floristeria: {
      type: String,  // ✅ CAMBIADO: de ObjectId a String
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Flor', FlowerSchema, 'flores'); // ✅ AGREGADO: 'flores' como tercer parámetro