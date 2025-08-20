const axios = require('axios');

// Controlador para Wompi - SOLO ARCHIVO NUEVO
class WompiController {
    async testConnection(req, res) {
        try {
            console.log('🧪 Probando conexión con Wompi...');

            const response = await axios.post('https://id.wompi.sv/connect/token',
                new URLSearchParams({
                    grant_type: 'client_credentials',
                    client_id: 'c9ba55f7-c614-4a74-8e54-0c5e00d376d0',
                    client_secret: 'bc6c4920-1da5-4ea5-b7db-12e9de63237c',
                    audience: 'wompi_api'
                }), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
            );

            res.json({
                success: true,
                message: 'Conexión con Wompi funcionando correctamente',
                token_type: 'Bearer',
                expires_in: 3600
            });

        } catch (error) {
            console.error('❌ Error en prueba de conexión:', error.message);
            res.status(500).json({
                success: false,
                error: error.message || 'Error en prueba de conexión'
            });
        }
    }

    async createPaymentLink(req, res) {
        try {
            console.log('🔗 Creando enlace de pago en Wompi...');

            const { amount_in_cents, currency, reference, customer_email, expires_at } = req.body;

            // Validar datos requeridos
            if (!amount_in_cents || !currency || !reference || !customer_email) {
                return res.status(400).json({
                    success: false,
                    error: 'Faltan datos requeridos: amount_in_cents, currency, reference, customer_email'
                });
            }

            // Obtener token de acceso
            const authResponse = await axios.post('https://id.wompi.sv/connect/token',
                new URLSearchParams({
                    grant_type: 'client_credentials',
                    client_id: 'c9ba55f7-c614-4a74-8e54-0c5e00d376d0',
                    client_secret: 'bc6c4920-1da5-4ea5-b7db-12e9de63237c',
                    audience: 'wompi_api'
                }), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
            );

            const accessToken = authResponse.data.access_token;

            // Crear enlace de pago - VOLVER AL ENDPOINT PRINCIPAL
            const paymentResponse = await axios.post('https://api.wompi.sv/EnlacePago', {
                amount_in_cents,
                currency,
                reference,
                customer_email,
                expires_at: expires_at || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                redirect_url: 'https://tienda-navidenau.vercel.app/',
                // CAMPOS OBLIGATORIOS AGREGADOS:
                nombre: `Pedido ${reference}`,
                identificador: `link_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            console.log('✅ Enlace de pago creado exitosamente:', paymentResponse.data);

            res.json({
                success: true,
                payment_url: paymentResponse.data.permalink || paymentResponse.data.payment_url,
                transaction_id: paymentResponse.data.id
            });

        } catch (error) {
            console.error('❌ Error creando enlace de pago:', error.response?.data || error.message);
            res.status(500).json({
                success: false,
                error: error.message || 'Error interno del servidor'
            });
        }
    }

    async debugWompi(req, res) {
        try {
            console.log('🔍 Debug: Probando endpoint principal con Wompi...');

            // Obtener token de acceso
            const authResponse = await axios.post('https://id.wompi.sv/connect/token',
                new URLSearchParams({
                    grant_type: 'client_credentials',
                    client_id: 'c9ba55f7-c614-4a74-8e54-0c5e00d376d0',
                    client_secret: 'bc6c4920-1da5-4ea5-b7db-12e9de63237c',
                    audience: 'wompi_api'
                }), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
            );

            const accessToken = authResponse.data.access_token;
            console.log('✅ Token obtenido:', accessToken);

            // Probar endpoint principal con parámetros específicos
            const testData = {
                nombre: 'Producto de Prueba',
                identificador: 'test_123',
                monto: 100,
                moneda: 'USD',
                referencia: 'TEST_REF',
                email: 'test@test.com',
                url_redireccion: 'https://tienda-navidenau.vercel.app/'
            };

            console.log('🧪 Probando endpoint principal:', testData);

            const response = await axios.post('https://api.wompi.sv/EnlacePago', testData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            console.log('✅ Respuesta exitosa:', response.data);

            res.json({
                success: true,
                message: 'Debug exitoso con endpoint principal',
                data: response.data
            });

        } catch (error) {
            console.error('❌ Error en debug:', error.response?.data || error.message);
            res.status(500).json({
                success: false,
                error: error.response?.data || error.message,
                message: 'Error en debug - revisar logs'
            });
        }
    }

    async exploreWompi(req, res) {
        try {
            console.log('🔍 Explorando endpoints disponibles de Wompi...');

            // Obtener token de acceso
            const authResponse = await axios.post('https://id.wompi.sv/connect/token',
                new URLSearchParams({
                    grant_type: 'client_credentials',
                    client_id: 'c9ba55f7-c614-4a74-8e54-0c5e00d376d0',
                    client_secret: 'bc6c4920-1da5-4ea5-b7db-12e9de63237c',
                    audience: 'wompi_api'
                }), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
            );

            const accessToken = authResponse.data.access_token;

            // Probar diferentes endpoints posibles
            const endpoints = [
                'https://api.wompi.sv/EnlacePago',
                'https://api.wompi.sv/EnlacePago/crear',  // ← NUEVO
                'https://api.wompi.sv/EnlacePago/create', // ← NUEVO
                'https://api.wompi.sv/crear-enlace',      // ← NUEVO
                'https://api.wompi.sv/create-link',       // ← NUEVO
                'https://api.wompi.sv/v1/payment_links',
                'https://api.wompi.sv/payment_links',
                'https://api.wompi.sv/enlaces',
                'https://api.wompi.sv/links'
            ];

            const results = {};

            for (const endpoint of endpoints) {
                try {
                    console.log(`🧪 Probando: ${endpoint}`);
                    const response = await axios.get(endpoint, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`
                        }
                    });
                    results[endpoint] = { status: response.status, data: response.data };
                } catch (error) {
                    results[endpoint] = { status: error.response?.status, error: error.message };
                }
            }

            console.log('✅ Resultados de exploración:', results);

            res.json({
                success: true,
                message: 'Exploración completada',
                results: results
            });

        } catch (error) {
            console.error('❌ Error en exploración:', error.message);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
}

module.exports = new WompiController();