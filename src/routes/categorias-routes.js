const router = require('express').Router(); 
const controlador = require('../controller/categoria-controller');

router.get('/', controlador.listarCategorias);
router.get('/:id', controlador.obtenerCategoriaPorId);
router.post('/agregarCategoria', controlador.agregarCategoria);
router.put('/editar', controlador.modificarCategoria); // <-- Cambiado de editarCategoria a editar
router.delete('/eliminar/:id', controlador.eliminarCategoria);
router.post('/buscar/keyword', controlador.buscarPorKeyword);
router.post('/buscar/vectorial', controlador.buscarVectorial);
router.post('/buscar/hibrida', controlador.buscarHibrida);
module.exports = router;