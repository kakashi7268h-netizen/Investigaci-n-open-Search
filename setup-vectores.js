const client = require('./src/repository/conexion');

async function configurarVectores() {
    const INDEX_VECTORIAL = 'categorias_vectoriales';

    try {
        console.log('1. Borrando índice anterior (si existe)...');
        await client.indices.delete({ index: INDEX_VECTORIAL, ignore_unavailable: true });

        console.log('2. Creando índice K-NN con motor Lucene...');
        await client.indices.create({
            index: INDEX_VECTORIAL,
            body: {
                settings: { "index.knn": true },
                mappings: {
                    properties: {
                        Nombre: { type: "text" },
                        Descripcion: { type: "text" },
                        vector_caracteristicas: {
                            type: "knn_vector",
                            dimension: 3, 
                            // Aquí está la corrección: engine cambiado a "lucene"
                            method: { name: "hnsw", space_type: "cosinesimil", engine: "lucene" }
                        }
                    }
                }
            }
        });

        console.log('3. Insertando datos de prueba con vectores...');
        const datos = [
            { Nombre: "Laptop Gamer", Descripcion: "Alta potencia", vector_caracteristicas: [0.9, 0.1, 0.5] },
            { Nombre: "PC de Oficina", Descripcion: "Bajo consumo", vector_caracteristicas: [0.1, 0.9, 0.2] },
            { Nombre: "Consola de Videojuegos", Descripcion: "Solo para jugar", vector_caracteristicas: [0.8, 0.2, 0.9] }
        ];

        for (let dato of datos) {
            await client.index({ index: INDEX_VECTORIAL, body: dato, refresh: true });
        }

        console.log('¡Entorno vectorial listo para probar en Postman!');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

configurarVectores();