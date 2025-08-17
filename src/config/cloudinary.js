// src/config/cloudinary.js
const cloudinary = require('cloudinary').v2;

// Usar la variable CLOUDINARY_URL que te dio Cloudinary
if (process.env.CLOUDINARY_URL) {
  cloudinary.config({
    cloudinary_url: process.env.CLOUDINARY_URL
  });
  console.log('✅ Cloudinary configurado con CLOUDINARY_URL');
} else {
  // Fallback a variables individuales (por si acaso)
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log('✅ Cloudinary configurado con variables individuales');
}

module.exports = cloudinary;