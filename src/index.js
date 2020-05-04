//nuevo tipos de variables, buenas practicas
'use strict'

//modulo para interaccion con mongo 
const mongoose = require('mongoose');
//referenciamos el app.js
const app = require('./app');
//como keys es un objeto puedo acceder a una de sus propiedades, ejemplo mongodb
const config = require('./config');

console.log('Data Base');
console.log(config.db);
console.log('Puerto');
console.log(config.port);

//conectamos a la base de datos
mongoose.connect(config.db, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true }, (err, res) => {
    if (err) {
        return console.log(`Error al conectar a la base de datos: ${err}`);
    }
    console.log('Conexión establecida');
   
    //iniciando el server
    //aplicacion en escucha
    app.listen(config.port, (err) => {
        if (err) {
            console.log(`Error en el listen - ${err}`);
        }

        console.log(`Server on port ${config.port}`)
    })
});









