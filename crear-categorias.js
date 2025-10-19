// crear-categorias.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Cargar variables de entorno
dotenv.config({ path: path.join(__dirname, '.env') });

const Categoria = require('./src/models/Categoria');

async function crearCategoriasBasicas() {
  try {
    console.log('🔗 Conectando a MongoDB...');
    
    // ✅ URI hardcodeada para evitar problemas de codificación
    await mongoose.connect('mongodb+srv://admin:manzana21%24@tienda.lyxloro.mongodb.net/tienda-navideña?retryWrites=true&w=majority&appName=tienda');
    console.log('✅ Conexión a MongoDB establecida');
    
    // ID de la floristería que veo en tus datos
    const floristeriaId = '68a125df2097950ec3ff19fa';
    
    // Categorías basadas en los datos existentes
    const categoriasBasicas = [
      { 
        nombre: 'Detalles pequeños', 
        slug: 'detalles-pequenos', 
        descripcion: 'Detalles pequeños y delicados', 
        icono: '🌸', 
        floristeria: floristeriaId 
      },
      { 
        nombre: 'Canastas con vino', 
        slug: 'canastas-con-vino', 
        descripcion: 'Canastas que incluyen vino', 
        icono: '🍷', 
        floristeria: floristeriaId 
      },
      { 
        nombre: 'Flores', 
        slug: 'flores', 
        descripcion: 'Arreglos florales', 
        icono: '🌹', 
        floristeria: floristeriaId 
      },
      { 
        nombre: 'Ramos', 
        slug: 'ramos', 
        descripcion: 'Ramos de flores', 
        icono: '🌺', 
        floristeria: floristeriaId 
      },
      { 
        nombre: 'Regalos', 
        slug: 'regalos', 
        descripcion: 'Regalos especiales', 
        icono: '🎁', 
        floristeria: floristeriaId 
      },
      { 
        nombre: 'Navideños', 
        slug: 'navidenos', 
        descripcion: 'Productos navideños', 
        icono: '🎄', 
        floristeria: floristeriaId 
      }
    ];
    
    for (const categoria of categoriasBasicas) {
      // Verificar si ya existe
      const existe = await Categoria.findOne({ 
        nombre: categoria.nombre, 
        floristeria: floristeriaId 
      });
      
      if (!existe) {
        const nuevaCategoria = new Categoria(categoria);
        await nuevaCategoria.save();
        console.log('✅ Categoría creada:', categoria.nombre);
      } else {
        console.log('ℹ️ Categoría ya existe:', categoria.nombre);
      }
    }
    
    console.log('✅ Proceso completado');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

crearCategoriasBasicas();