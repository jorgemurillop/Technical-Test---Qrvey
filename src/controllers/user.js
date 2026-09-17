'use strict'

const mongoose = require('mongoose');
const User = require('../models/user');
const service = require('../services');

async function signUp(req, res) {
    console.log('Post signUp');

    const user = new User({
        email: req.body.email,
        displayName: req.body.displayName,
        password: req.body.password
    });

    try {
        await user.save();
        service.createToken(user);
        return res.status(201).send({ message: 'Usuario creado correctamente' });
    } catch (err) {
        return res.status(500).send({ message: `error al crear el usuario: ${err}` });
    }
}

async function signIn(req, res) {
    try {
        const user = await User.findOne({ email: req.body.email }).select('_id email +password');
        if (!user) return res.status(404).send({ msg: `no existe el usuario: ${req.body.email}` })

        return user.comparePassword(req.body.password, (err, isMatch) => {
            if (err) return res.status(500).send({ msg: `Error al ingresar: ${err}` })
            if (!isMatch) return res.status(404).send({ msg: `Error de contraseña: ${req.body.email}` })

            req.user = user
            return res.status(200).send({ msg: 'Te has logueado correctamente', token: service.createToken(user) })
        });
    } catch (err) {
        return res.status(500).send({ msg: `Error al ingresar: ${err}` })
    }
}

async function get(req, res) {
    console.log('Get Users');

    try {
        const users = await User.find({});
        res.status(200).send({ users });
    } catch (err) {
        res.status(500).send({ message: `error al consultar los usuarios: ${err}` });
    }
}


module.exports = {
    signIn,
    signUp,
    get
};