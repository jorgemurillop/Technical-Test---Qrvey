'use strict'

const mongoose = require('mongoose');
const User = require('../models/user');
const service = require('../services');

function signUp(req, res) {
    console.log('Post signUp');

    const user = new User({
        email: req.body.email,
        displayName: req.body.displayName,
        password: req.body.password
    });

    user.save((err) => {
        if (err) return res.status(500).send({ message: `error al crear el usuario: ${err}` });
        service.createToken(user);
        return res.status(201).send({ message: 'Usuario creado correctamente' });
    });
}

function signIn(req, res) {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (err) return res.status(500).send({ msg: `Error al ingresar: ${err}` })
        if (!user) return res.status(404).send({ msg: `no existe el usuario: ${req.body.email}` })

        return user.comparePassword(req.body.password, (err, isMatch) => {
            if (err) return res.status(500).send({ msg: `Error al ingresar: ${err}` })
            if (!isMatch) return res.status(404).send({ msg: `Error de contraseña: ${req.body.email}` })

            req.user = user   
            return res.status(200).send({ msg: 'Te has logueado correctamente', token: service.createToken(user) })
        });

    }).select('_id email + password');
}

function get(req, res) {
    console.log('Get Users');

    User.find({}, (err, users) => {
        if (err) return res.status(500).send({ message: `error al consultar los usuarios: ${err}` });
        if (!users) return res.status(404).send({ message: `los usuarios no existen` });

        res.status(200).send({ users });
    });
}


module.exports = {
    signIn,
    signUp,
    get
};