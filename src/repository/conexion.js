const { Client } = require('@opensearch-project/opensearch');
const config = require('../config.js');

// 1. Inicializar el cliente usando tu archivo de configuración
const client = new Client({
    node: config.opensearch.node, 
    auth: {
        username: config.opensearch.user,
        password: config.opensearch.password
    },
    ssl: {
        rejectUnauthorized: false // Fundamental para que funcione con tu contenedor local
    }
});

// 2. Verificar la conexión (equivalente a tu conexion.connect)
// Usamos client.info() para asegurarnos de que el motor responde correctamente.
client.info()
    .then((response) => {
        console.log(`Conectado a OpenSearch exitosamente. Clúster: ${response.body.cluster_name}`);
    })
    .catch((error) => {
        console.error('Error de conexión a OpenSearch:');
        if (error.meta) {
            console.error('- Código de estado:', error.meta.statusCode);
            console.error('- Detalles:', error.meta.body);
        } else {
            console.error(error);
        }
    });

module.exports = client;