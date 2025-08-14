const mongoose = require('mongoose');

/**
 * Conecta a la base de datos MongoDB utilizando Mongoose.
 * La URI de conexión se lee desde la variable de entorno `MONGODB_URI`.
 *
 * En caso de error se muestra por consola y se termina el proceso.
 */
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Conexión a MongoDB establecida');
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error.message);
    process.exit(1);
  }
}

module.exports = connectDB;