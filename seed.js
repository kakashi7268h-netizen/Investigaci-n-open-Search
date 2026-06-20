const repositorio = require('./src/repository/categoria-repository');

// Combinaremos 10 categorías base con 10 subtipos para generar exactamente 100 registros
const categoriasBase = ['Electrónica', 'Hogar', 'Oficina', 'Ferretería', 'Juguetes', 'Deportes', 'Moda', 'Alimentos', 'Salud', 'Automotriz'];
const subTipos = ['Básica', 'Avanzada', 'Premium', 'Económica', 'Industrial', 'Profesional', 'Infantil', 'Digital', 'Mecánica', 'Inteligente'];

async function insertarCienCategorias() {
    console.log('Iniciando la inserción de 100 categorías en OpenSearch...');
    let contador = 1;

    // Recorremos las combinaciones
    for (let i = 0; i < categoriasBase.length; i++) {
        for (let j = 0; j < subTipos.length; j++) {
            const nombre = `${categoriasBase[i]} ${subTipos[j]}`;
            const descripcion = `Artículos y productos de la línea ${nombre.toLowerCase()} para distribución general.`;

            try {
                // Usamos la misma función que ya tienes programada y funcionando
                await repositorio.agregar({ Nombre: nombre, Descripcion: descripcion });
                console.log(`[${contador}/100] Insertada: ${nombre}`);
                contador++;
            } catch (error) {
                console.error(`Error al insertar ${nombre}:`, error.message);
            }
        }
    }

    console.log('\n¡Las 100 categorías han sido insertadas con éxito!');
    process.exit(0); // Apaga el script automáticamente al terminar
}

insertarCienCategorias();