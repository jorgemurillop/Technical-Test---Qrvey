'use strict'
const Task = require('../models/task');
const Project = require('../models/project');
const service = require('../services');

const Status = {
    Created: 'Created',
    Started: 'Started',
    Stopped: 'Stopped',
    Paused: 'Paused'
}

function get(req, res) {
    console.log('Get With Filter UserID');

    Task.find({ user: req.user }, (err, tasks) => {
        if (err) return res.status(500).send({ message: `error al consultar las tareas: ${err}` });
        if (!tasks) return res.status(404).send({ message: `la tarea no existe` });

        //ordeno por la fecha de creacion y filtro los que no estan activos
        tasks = tasks.filter(t => t.enabled).sort((x, y) => x.dt_Created > y.dt_Created ? -1 : 1);

        res.status(200).send({ tasks });
    })
        .populate('project')
        .populate('user');
}

function getById(req, res) {
    console.log('Get By Id');
    let taskId = req.params.taskId;

    console.log(`sesion usuario: ${req.user}`);

    Task.findById(taskId)
        .populate('project')
        .populate('user')
        .exec(function (err, task) {
            if (err) return res.status(500).send({ message: `error al crear la tarea: ${err}` });
            if (!task) return res.status(404).send({ message: `la tarea no existe` });

            res.status(200).send({ task });
        });
}

function save(req, res) {
    console.log(req.body);

    //asiganmos los valores del body
    let task = new Task();
    task.name = req.body.name;
    task.scheduledTime = req.body.scheduledTime;
    task.project = req.body.project;
    task.user = req.user;
    task.id_Created = req.user;
    task.id_Modified = req.user;
    task.status = 'Created';
    task.timeLife = 0;

    if (req.body.timeLife) task.timeLife = req.body.timeLife;
    console.log(req.body.status);
    if (req.body.status) task.status = req.body.status;

    //validamos la existencia del proyecto
    Project.exists({ _id: task.project }, (err, exist) => {
        if (err) return res.status(500).send({ message: `error al crear la tarea: ${err}` });
        if (!exist) return res.status(404).send({ message: `el proyecto no existe` });

        console.log(task);
        task.save((err, newTask) => {
            if (err) return res.status(500).send({ message: `error al guardar la tarea: ${err}` });
            console.log(newTask);
            res.status(200).send({ task: newTask });
        });
    });
}

function update(req, res) {
    console.log('update');
    let taskId = req.params.taskId;
    let update = req.body;

    update.dt_Modified = Date.now();
    update.id_Modified = req.user;
    console.log(req.user);

    if (req.body.timeLife) update.timeLife = req.body.timeLife;
    console.log(req.body.status);
    if (req.body.status) update.status = req.body.status;

    //validamos la existencia del proyecto
    Project.exists({ _id: task.project }, (err, exist) => {
        if (err) return res.status(500).send({ message: `error al crear la tarea: ${err}` });
        if (!exist) return res.status(404).send({ message: `el proyecto no existe` });

        Task.findByIdAndUpdate(taskId, update, (err, task) => {
            if (err) return res.status(500).send({ message: `error al actualizar la tarea: ${err}` });
            if (!task) return res.status(500).send({ message: 'No existe la tarea' });
            res.status(200).send({ task: task });
        });
    });
}

function remove(req, res) {
    console.log('delete');
    let taskId = req.params.taskId;

    Task.findById(taskId, (err, task) => {
        if (err) return res.status(500).send({ message: `error al borrar la tarea: ${err}` });
        if (!task) return res.status(500).send({ message: 'No existe la tarea' });

        task.remove(err => {
            if (err) return res.status(500).send({ message: `error al borrar la tarea: ${err}` });
            res.status(200).send({ message: 'la tarea ha sido eliminada' });
        });
    });
}


function start(req, res) {
    console.log('start');
    let taskId = req.body.id;
    console.log(`start ${taskId}`);

    Task.findById(taskId, (err, task) => {
        if (err) return res.status(500).send({ message: `error al actualizar la tarea: ${err}` });
        if (!task) return res.status(500).send({ message: 'No existe la tarea' });

        task.dt_Modified = Date.now();
        task.id_Modified = req.user;

        console.log(`start - estado inicial: ${task.status}`);
        //'Created','Started','Stopped','Paused'
        if (task.status != Status.Started) {
            console.log('start - actualizacion de fecha');
            task.startTime = Date.now();
            console.log(`start - actualizacion de fecha: ${task.startTime}`);
        }

        task.status = Status.Started;
        console.log(`start - estado final: ${task.status}`);

        Task.findByIdAndUpdate(taskId, task, (err, taskUpdated) => {
            if (err) return res.status(500).send({ message: `error al actualizar la tarea: ${err}` });
            if (!taskUpdated) return res.status(500).send({ message: 'No existe la tarea' });
            res.status(200).send({ task: task });
        });

    });
}


function pause(req, res) {
    console.log('pause');
    let taskId = req.body.id;
    console.log(`pause ${taskId}`);

    Task.findById(taskId, (err, task) => {
        if (err) return res.status(500).send({ message: `error al actualizar la tarea: ${err}` });
        if (!task) return res.status(500).send({ message: 'No existe la tarea' });

        task.dt_Modified = Date.now();
        task.id_Modified = req.user;

        console.log(`start - estado inicial: ${task.status}`);
        //'Created','Started','Stopped','Paused'
        if (task.status == Status.Started) {
            console.log('calculo del tiempo pasado');
            const diff = service.diff_minutes(new Date(), task.startTime);
            console.log(`pause - diferencia entre fechas ${diff}`);
            task.timeLife += diff;
        }
        task.status = Status.Paused;
        console.log(`start - estado final: ${task.status}`);

        console.log({ task: task });
        Task.findByIdAndUpdate(taskId, task, (err, taskUpdated) => {
            if (err) return res.status(500).send({ message: `error al actualizar la tarea: ${err}` });
            if (!taskUpdated) return res.status(500).send({ message: 'No existe la tarea' });
            res.status(200).send({ task: task });
        });
    });
}

function stop(req, res) {
    console.log('stop');
    let taskId = req.body.id;
    console.log(`stop ${taskId}`);

    Task.findById(taskId, (err, task) => {
        if (err) return res.status(500).send({ message: `error al actualizar la tarea: ${err}` });
        if (!task) return res.status(500).send({ message: 'No existe la tarea' });

        task.dt_Modified = Date.now();
        task.id_Modified = req.user;

        console.log(`start - estado inicial: ${task.status}`);
        //'Created','Started','Stopped','Paused'
        if (task.status == Status.Started) {
            console.log('calculo del tiempo pasado');
            const diff = service.diff_minutes(new Date(), task.startTime);
            console.log(`pause - diferencia entre fechas ${diff}`);
            task.timeLife += diff;
        }
        task.status = Status.Stopped;
        console.log(`start - estado final: ${task.status}`);

        Task.findByIdAndUpdate(taskId, task, (err, taskUpdated) => {
            if (err) return res.status(500).send({ message: `error al actualizar la tarea: ${err}` });
            if (!taskUpdated) return res.status(500).send({ message: 'No existe la tarea' });
            res.status(200).send({ task: task });
        });

    });
}

module.exports = {
    get,
    save,
    remove,
    getById,
    start,
    stop,
    pause,
    update
};