const repositorio = require('../repository/categoria-repository');
const respuesta = require('../util/respuesta');

async function listarCategorias(req, res){
	try{
      const categorias = await repositorio.listar();
      respuesta.success(req, res, categorias, 200);
    }catch(error){
  	respuesta.error(req, res, error.message, 500);
    }

}
async function obtenerCategoriaPorId(req, res){
 try{
 	  const id = req.params.id;
      const categoria = await repositorio.obtenerPorId(id);
      if(!categoria){

  	     respuesta.error(req, res, `Categoria con ID ${id} no encontrado`, 404);

      } 
      respuesta.success(req, res, categoria, 200);
    }catch(error){
  	respuesta.error(req, res, error.message, 500);
    }
}
async function agregarCategoria(req, res){
	try{
		const {Nombre, Descripcion} = req.body;

		if(!Nombre){
			return respuesta.error(req, res, 'El nombre de la categoria es requerido', 400);
		}

		const nuevaCategoria = await repositorio.agregar({
			Nombre,
			Descripcion: Descripcion || ''
		});

		respuesta.success(req, res, nuevaCategoria, 201);

	}catch(error){
		respuesta.error(req, res, error.message, 500);
	}
}

async function modificarCategoria(req, res){
	try{
		const {IdCategoria, Nombre, Descripcion} = req.body;

		if(!Nombre){
			return respuesta.error(req, res, 'El nombre de la categoria es requerido', 400);
		}
        const existe = await repositorio.obtenerPorId(IdCategoria);
        if(!existe){
            return respuesta.error(req, res, `La categoria a modificar no existe, ID ${IdCategoria} no encontrado`, 404);
        }
		await repositorio.editar({
            IdCategoria,
            Nombre,
            Descripcion: Descripcion || ''
		});
        // Corregido: repsuesta -> respuesta
		respuesta.success(req, res, 'Los datos se actualizaron con exito', 200);
	}catch(error){
		respuesta.error(req, res, error.message, 500);
	}
}

async function eliminarCategoria(req, res){
	try{
        const id = req.params.id;
        
        // Corregido: Se usa 'id' en lugar de 'IdCategoria'
		const existe = await repositorio.obtenerPorId(id); 
        if(!existe){
            // Corregido: Se usa 'id' y se cambió el texto a "eliminar"
            return respuesta.error(req, res, `La categoria a eliminar no existe, ID ${id} no encontrado`, 404);
        }

		await repositorio.eliminar(id);
		respuesta.success(req, res , `La categoria con ID ${id} fue eliminada correctamente`);

	}catch(error){
		respuesta.error(req, res, error.message, 500);
	}
}

async function eliminarCategoria(req, res){
	try{
		
        const id = req.params.id;
		const existe = await repositorio.obtenerPorId(IdCategoria);
        if(!existe){
        	return respuesta.error(req, res, `La categoria a modificar no existe ID ${IdCategoria} no encontrado`, 404);
        }

		await repositorio.eliminar(id);
		respuesta.success(req, res , `La categoria con ID ${id} fue eliminada correctamente`)

	}catch(error){
		respuesta.error(req, res, error.message, 500);
	}
}
async function buscarPorKeyword(req, res) {
    try {
        const { termino } = req.body;
        if (!termino) return respuesta.error(req, res, 'El termino de busqueda es requerido', 400);
        
        const resultados = await repositorio.busquedaKeyword(termino);
        respuesta.success(req, res, resultados, 200);
    } catch (error) {
        respuesta.error(req, res, error.message, 500);
    }
}


async function buscarVectorial(req, res) {
    try {
        const { vector } = req.body;
        if (!vector || !Array.isArray(vector)) return respuesta.error(req, res, 'Se requiere un array de vectores', 400);

        const response = await repositorio.busquedaVectorialPura(vector);
        
        const resultados = response.body.hits.hits.map(hit => ({
            score_similitud: hit._score, 
            Nombre: hit._source.Nombre
        }));
        
        respuesta.success(req, res, resultados, 200);
    } catch (error) {
        respuesta.error(req, res, error.message, 500);
    }
}

async function buscarHibrida(req, res) {
    try {
        const { termino, vector } = req.body;
        if (!termino || !vector) return respuesta.error(req, res, 'Se requiere el termino y el vector', 400);

        const response = await repositorio.busquedaHibridaPura(termino, vector);
        
        const resultados = response.body.hits.hits.map(hit => ({
            score_combinado: hit._score,
            Nombre: hit._source.Nombre
        }));
        
        respuesta.success(req, res, resultados, 200);
    } catch (error) {
        respuesta.error(req, res, error.message, 500);
    }
}
module.exports = {
	listarCategorias,
	obtenerCategoriaPorId,
	agregarCategoria,
	modificarCategoria,
	eliminarCategoria,buscarPorKeyword, buscarVectorial, buscarHibrida
};