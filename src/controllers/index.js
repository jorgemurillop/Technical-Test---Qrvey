'use strict'
//en este caso no utilizo el frame para crear un servidor
//llamamos su metodo router
const { Router } = require('express');
//utilizamos su metodo router
const router = Router();
//tambien se puede declarar asi: 
//const express = require('express');
//const router = express.Router();

router.get('/', (req, res, next) => {
    //render a la vista views: index.ejs
    res.render('index');
});

module.exports = router;