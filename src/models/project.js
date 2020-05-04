'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uuid = require('node-uuid');

const projectSchema = Schema({
    /*
    id: {type:String, default: function getUUID(){
        return uuid.v1();
    }},*/
    name: { type: String, unique: true, lowercase: true, required: true },    
    dt_Created: { type: Date, default: new Date },
    dt_Modified: { type: Date, default: new Date },
    id_Created: String,
    id_Modified: String,
    enabled: { type: Boolean, default: true },
    extended: {type: Object}
});

projectSchema.virtual('projectId').get(function () {
    return this._id;
});

//creamos un metodo llamado encryptPassword
projectSchema.pre('save', function (next) {
    let project = this;

    project.dt_Created = Date.now();
    project.dt_Modified = Date.now();

    next();
});

module.exports = mongoose.model('Project', projectSchema);


