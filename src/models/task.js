'use strict'

const mongoose = require('mongoose');
const uuid = require('node-uuid');
const Schema = mongoose.Schema;

const taskSchema = Schema({    
    /*
    id: {type:String, default: function getUUID(){
        return uuid.v1();
    }},*/    
    name: { type: String, unique: true, lowercase: true },
    //indicar que se manejan minutos
    scheduledTime: { type: Number, required: true },
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    startTime: { type: Date, default: new Date },
    status: {type:String, enum: ['Created','Started','Stopped','Paused']},
    timeLife: {type: Number, default: 0},
    dt_Created: { type: Date, default: new Date },
    dt_Modified: { type: Date, default: new Date },
    id_Created: String,
    id_Modified: String,
    enabled: { type: Boolean, default: true }
});
//donde project es la llave foranea

taskSchema.pre('save', function (next) {
    let task = this;

    task.startTime = Date.now();
    
    //auditoria
    task.dt_Created = Date.now();
    task.dt_Modified = Date.now();

    next();
});

module.exports = mongoose.model('Task', taskSchema);
