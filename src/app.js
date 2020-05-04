'use strict'
//requiero el framework de express
const express = require('express');
//para poder invocar las vistas (motor)
const engine = require('ejs-mate');
//requiero a morgan para visualizar las peticiones por consola
const morgan = require('morgan');
//requiero el modulo path
const path = require('path');

// Initializations
//lo guardo en una constante app
const app = express();
const api = require('./routes');

//settings 
//__dirname: direccion del archivo que se ejecuta
const path_views = path.join(__dirname, 'views');
app.set('views', path_views);
app.engine('ejs', engine);
//establecemos el motor de plantillas
app.set('view engine', 'ejs');

//middlewares - dev=corta   /combine = el mensaje es mas largo
//los middleware se deben ejecutar antes de pasar a las rutas
app.use(morgan('dev')); 
//datos de formularios, texto, input, no imagenes
app.use(express.urlencoded({ extended: false }));
//recibir formatos json y entenderlos
app.use(express.json());

//importar codigo
//invocamos o llamamos el index
app.use('/', require('./controllers/index.js'));
app.use('/api', api);

module.exports = app;