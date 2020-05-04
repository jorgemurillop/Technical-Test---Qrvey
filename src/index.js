//nuevo tipos de variables, buenas practicas
'use strict'
//modulo para interaccion con mongo 
const mongoose = require('mongoose');
//referenciamos el app.js
const app = require('./app');
//como keys es un objeto puedo acceder a una de sus propiedades, ejemplo mongodb
const config = require('./config');

//conectamos a la base de datos
mongoose.connect(config.db,{useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true }, (err, res) => {
    if (err) {
        return console.log(`error al conectar a la base de datos: ${err}`);
    }
    console.log('Conexión establecida');

    //iniciando el server
    //aplicacion en escucha
    app.listen(config.port, () => {
        console.log(`Server on port ${config.port}`)        
    })
});









