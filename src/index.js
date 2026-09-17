//nuevo tipos de variables, buenas practicas
'use strict'

//modulo para interaccion con mongo 
const mongoose = require('mongoose');
//referenciamos el app.js
const app = require('./app');
//como keys es un objeto puedo acceder a una de sus propiedades, ejemplo mongodb
const config = require('./config');

console.log('Data Base');
console.log(config.DB);
console.log('Puerto');
console.log(config.PORT); 
console.log('enviroment');
console.log(config.ENV);


//conectamos a la base de datos
//a partir de mongoose 6, connect() ya no acepta callback ni las opciones
//useCreateIndex/useNewUrlParser/useUnifiedTopology (son el comportamiento por defecto)
mongoose.connect(config.DB)
    .then(() => {
        console.log('Conexión establecida');

        //iniciando el server
        //aplicacion en escucha
        app.listen(config.PORT, () => {
            console.log(`Server on port ${config.PORT}`)
        });
    })
    .catch((err) => console.log(`Error al conectar a la base de datos: ${err}`));









