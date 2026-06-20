const client = require('./conexion'); // Ahora esta conexión debe exportar el cliente de OpenSearch
const INDEX_NAME = 'categoria'; // Tu "tabla" en OpenSearch

async function listar() {
    try {
        console.log('entro al repositorio');
        const response = await client.search({
            index: INDEX_NAME,
            body: {
                query: { match_all: {} }
            }
        });

        // Mapeamos los resultados para devolver el mismo formato que esperaba tu SQL
        const categorias = response.body.hits.hits.map(hit => ({
            idCategoria: hit._id,
            Nombre: hit._source.Nombre,
            Descripcion: hit._source.Descripcion
        }));

        return categorias;
    } catch (error) {
        throw error;
    }
}

async function obtenerPorId(id) {
    try {
        console.log('entro al repositorio');
        const response = await client.get({
            index: INDEX_NAME,
            id: id
        });

        return {
            idCategoria: response.body._id,
            Nombre: response.body._source.Nombre,
            Descripcion: response.body._source.Descripcion
        };
    } catch (error) {
        // OpenSearch lanza un error 404 si no encuentra el ID, devolvemos null como hacías en SQL
        if (error.meta && error.meta.statusCode === 404) {
            return null;
        }
        throw error;
    }
}

async function agregar(datos) {
    try {
        // En OpenSearch usamos 'index' para insertar un nuevo documento
        const response = await client.index({
            index: INDEX_NAME,
            body: {
                Nombre: datos.Nombre,
                Descripcion: datos.Descripcion
            },
            refresh: true // Fuerza a que el dato esté disponible para buscarse inmediatamente
        });

        // Devolvemos el ID generado automáticamente por OpenSearch junto con los datos
        return {
            IdCategoria: response.body._id,
            ...datos
        };
    } catch (error) {
        throw error;
    }
}

async function editar(datos) {
    try {
        const response = await client.update({
            index: INDEX_NAME,
            id: datos.IdCategoria,
            body: {
                doc: {
                    Nombre: datos.Nombre,
                    Descripcion: datos.Descripcion
                }
            },
            refresh: true
        });

        return response.body;
    } catch (error) {
        throw error;
    }
}

async function eliminar(id) {
    try {
        const response = await client.delete({
            index: INDEX_NAME,
            id: id,
            refresh: true
        });

        return response.body;
    } catch (error) {
        throw error;
    }
}
// --- BÚSQUEDA LÉXICA (KEYWORD) ---
// Busca coincidencias exactas o parciales de texto usando BM25
async function busquedaKeyword(termino) {
    try {
        const response = await client.search({
            index: INDEX_NAME,
            body: {
                query: {
                    multi_match: {
                        query: termino,
                        fields: ["Nombre", "Descripcion"]
                    }
                }
            }
        });

        return response.body.hits.hits.map(hit => ({
            idCategoria: hit._id,
            score: hit._score, // Muestra la relevancia del resultado
            Nombre: hit._source.Nombre,
            Descripcion: hit._source.Descripcion
        }));
    } catch (error) {
        throw error;
    }
}

// --- BÚSQUEDA VECTORIAL (k-NN) ---
// Busca por similitud matemática usando vectores
const INDEX_VECTORIAL = 'categorias_vectoriales';

async function busquedaVectorialPura(vectorQuery) {
    return await client.search({
        index: INDEX_VECTORIAL,
        body: {
            size: 2, // Traer los 2 más parecidos
            query: {
                knn: {
                    vector_caracteristicas: {
                        vector: vectorQuery,
                        k: 2
                    }
                }
            }
        }
    });
}

async function busquedaHibridaPura(termino, vectorQuery) {
    return await client.search({
        index: INDEX_VECTORIAL,
        body: {
            query: {
                bool: {
                    should: [
                        { multi_match: { query: termino, fields: ["Nombre", "Descripcion"] } },
                        { knn: { vector_caracteristicas: { vector: vectorQuery, k: 2 } } }
                    ]
                }
            }
        }
    });
}
module.exports = {
    listar, obtenerPorId, agregar, editar, eliminar,
    busquedaVectorialPura, busquedaHibridaPura
}