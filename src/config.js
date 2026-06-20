
module.exports = {
    // 1. Configuración de tu servidor Express (Esto es lo que faltaba y causó el crash)
    app: {
        port: process.env.PORT || 3000, // Usa el puerto que prefieras, usualmente 3000 o 4000
    },

    // 2. Configuración de OpenSearch que agregamos anteriormente
    opensearch: {
        node: process.env.OPENSEARCH_NODE || 'https://localhost:9200',
        user: process.env.OPENSEARCH_USER || 'admin',
        password: process.env.OPENSEARCH_PASSWORD || 'MaxiM!726'
    }
};