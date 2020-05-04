'use strict'

const services = require('../services');
const BEARER = 'Bearer ';

function isAuth(req, res, next) {
    console.log('seguimiento authorization');
    if (!req.headers.authorization) {
        return res.status(403).send({ message: 'no tiene autorización' });
    }
        
    const token = req.headers.authorization.split(BEARER)[1];
    services.decodeToken(token)
        .then(response => {        
            req.user = response.sub;      
                              
            next();
        })
        .catch(response => {            
            res.status(500).send(response)
        });
}

module.exports = isAuth;
