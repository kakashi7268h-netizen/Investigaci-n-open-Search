const express = require('express');
const config = require('./config');
const app = express();

//importacion de rutas
const rutasCategoria = require('./routes/categorias-routes.js');
// uso de categorias

//permite leer datos json que se envian en el cuerpo de las peticiones.
app.use(express.json());

//permite leer los datos enviados desde un formulario html
app.use(express.urlencoded({extend:true}));
app.use('/categoria', rutasCategoria);
app.set('port', config.app.port);

module.exports = app;