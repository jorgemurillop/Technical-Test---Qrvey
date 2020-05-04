'use strict'

const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs')
const uuid = require('node-uuid');
const Schema = mongoose.Schema;
//const { Schema } = mongoose;

//esquema de la entidad
const userSchema = new Schema({    
    /*
    id: {type:String, default: function getUUID(){
        return uuid.v1();
    }},*/
    email: { type: String, unique: true, lowercase: true, required: true },
    displayName: { type: String, lowercase: true, required: true },    
    password: { type: String, select: false, required: true },    
    dt_Created: { type: Date, default: Date.now() },
    dt_Modified: { type: Date, default: Date.now() },
    id_Created: String,
    id_Modified: String,
    enabled: { type: Boolean, default: true }
})

//creamos un metodo llamado encryptPassword
userSchema.pre('save', function (next) {
    let user = this;

    user.dt_Created = Date.now();
    user.dt_Modified = Date.now();

    if (!user.isModified('password')) return next();

    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, null, (err, hash) => {
            if (err) return next(err);

            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        cb(err, isMatch)
    });
}

//toma el esquema y crea usuarios en la bd, collection user
module.exports = mongoose.model('User', userSchema);