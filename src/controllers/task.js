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

async function get(req, res) {
    console.log('Get With Filter UserID');

    try {
        let tasks = await Task.find({ user: req.user }).populate('project').populate('user');
        //ordeno por la fecha de creacion y filtro los que no estan activos
        tasks = tasks.filter(t => t.enabled).sort((x, y) => x.dt_Created > y.dt_Created ? -1 : 1);
        res.status(200).send({ tasks });
    } catch (err) {
        res.status(500).send({ message: `error al consultar las tareas: ${err}` });
    }
}

async function getByProjectId(req, res) {
    console.log('Get With Filter projectId');
    let projectId = req.query.id;

    try {
        let tasks = await Task.find({ project: projectId }).populate('project').populate('user');
        //ordeno por la fecha de creacion y filtro los que no estan activos
        tasks = tasks.filter(t => t.enabled).sort((x, y) => x.dt_Created > y.dt_Created ? -1 : 1);
        res.status(200).send({ tasks });
    } catch (err) {
        res.status(500).send({ message: `error al consultar las tareas: ${err}` });
    }
}

async function getById(req, res) {
    console.log('Get By Id');
    let taskId = req.query.id;

    console.log(`task id: ${taskId}`);

    try {
        const task = await Task.findById(taskId).populate('project').populate('user');
        if (!task) return res.status(404).send({ message: `la tarea no existe` });
        res.status(200).send({ task });
    } catch (err) {
        res.status(500).send({ message: `error al crear la tarea: ${err}` });
    }
}

async function save(req, res) {
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

    try {
        //validamos la existencia del proyecto
        const exist = await Project.exists({ _id: task.project });
        if (!exist) return res.status(404).send({ message: `el proyecto no existe` });

        console.log(task);
        const newTask = await task.save();
        console.log(newTask);
        res.status(200).send({ task: newTask });
    } catch (err) {
        res.status(500).send({ message: `error al guardar la tarea: ${err}` });
    }
}

async function update(req, res) {
    console.log('update');
    let taskId = req.query.id;
    let update = req.body;

    update.dt_Modified = Date.now();
    update.id_Modified = req.user;
    console.log(req.user);

    if (req.body.timeLife) update.timeLife = req.body.timeLife;
    console.log(req.body.status);
    if (req.body.status) update.status = req.body.status;

    try {
        //validamos la existencia del proyecto
        const exist = await Project.exists({ _id: update.project });
        if (!exist) return res.status(404).send({ message: `el proyecto no existe` });

        const task = await Task.findByIdAndUpdate(taskId, update);
        if (!task) return res.status(500).send({ message: 'No existe la tarea' });
        res.status(200).send({ task: task });
    } catch (err) {
        res.status(500).send({ message: `error al actualizar la tarea: ${err}` });
    }
}

async function remove(req, res) {
    console.log('delete');
    let taskId = req.query.id;

    try {
        const task = await Task.findById(taskId);
        if (!task) return res.status(500).send({ message: 'No existe la tarea' });

        await task.deleteOne();
        res.status(200).send({ message: 'la tarea ha sido eliminada' });
    } catch (err) {
        res.status(500).send({ message: `error al borrar la tarea: ${err}` });
    }
}


async function start(req, res) {
    console.log('start');
    let taskId = req.query.id;
    console.log(`start ${taskId}`);

    try {
        const task = await Task.findById(taskId);
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

        const taskUpdated = await Task.findByIdAndUpdate(taskId, task);
        if (!taskUpdated) return res.status(500).send({ message: 'No existe la tarea' });
        res.status(200).send({ task: task });
    } catch (err) {
        res.status(500).send({ message: `error al actualizar la tarea: ${err}` });
    }
}


async function pause(req, res) {
    console.log('pause');
    let taskId = req.query.id;
    console.log(`pause ${taskId}`);

    try {
        const task = await Task.findById(taskId);
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
        const taskUpdated = await Task.findByIdAndUpdate(taskId, task);
        if (!taskUpdated) return res.status(500).send({ message: 'No existe la tarea' });
        res.status(200).send({ task: task });
    } catch (err) {
        res.status(500).send({ message: `error al actualizar la tarea: ${err}` });
    }
}

async function stop(req, res) {
    console.log('stop');
    let taskId = req.query.id;
    console.log(`stop ${taskId}`);

    try {
        const task = await Task.findById(taskId);
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

        const taskUpdated = await Task.findByIdAndUpdate(taskId, task);
        if (!taskUpdated) return res.status(500).send({ message: 'No existe la tarea' });
        res.status(200).send({ task: task });
    } catch (err) {
        res.status(500).send({ message: `error al actualizar la tarea: ${err}` });
    }
}

module.exports = {
    get,
    save,
    remove,
    getById,
    getByProjectId,
    start,
    stop,
    pause,
    update
};