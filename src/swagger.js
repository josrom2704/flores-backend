const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

/**
 * Configuración para generar documentación OpenAPI con swagger-jsdoc.
 * Define la información básica de la API y en qué archivos buscar anotaciones.
 */
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Tienda Navideña',
      version: '1.0.0',
      description: 'API para la tienda de canastas navideñas y flores'
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Servidor de desarrollo'
      }
    ]
  },
  // Archivos que contienen anotaciones de la API
  apis: [
    './src/routes/*.js',
    './src/models/*.js'
  ]
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = { swaggerUi, swaggerSpec };