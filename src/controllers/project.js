'use strict'
const Project = require('../models/project');
const Task = require('../models/task');
const service = require('../services');


async function getAlls(req, res) {
    console.log('Get All Not Filter');

    try {
        const projects = await Project.find({});
        //ordeno por la fecha de creacion y filtro los que no estan activos
        projects.sort((x, y) => x.dt_Created > y.dt_Created ? -1 : 1);
        res.status(200).send({ projects });
    } catch (err) {
        res.status(500).send({ message: `error al consultar los proyectos: ${err}` });
    }
}

async function get(req, res) {
    console.log('Get With Filter');

    try {
        let projects = await Project.find({});
        //ordeno por la fecha de creacion y filtro los que no estan activos
        projects = projects.filter(p => p.enabled).sort((x, y) => x.dt_Created > y.dt_Created ? -1 : 1);
        res.status(200).send({ projects });
    } catch (err) {
        res.status(500).send({ message: `error al consultar los proyectos: ${err}` });
    }
}

async function getById(req, res) {
    console.log('Get By Id');
    let projectId = req.query.id;

    try {
        const project = await Project.findById(projectId);
        if (!project) return res.status(404).send({ message: `el proyecto no existe` });
        res.status(200).send({ project });
    } catch (err) {
        res.status(500).send({ message: `error al crear el proyecto: ${err}` });
    }
}

async function save(req, res) {
    console.log('post');

    let project = new Project();
    project.name = req.body.name;
    project.id_Created = req.user;
    project.id_Modified = req.user;

    try {
        const newProject = await project.save();
        res.status(200).send({ project: newProject });
    } catch (err) {
        res.status(500).send({ message: `error al salvar el proyecto: ${err}` });
    }
}

async function update(req, res) {
    let projectId = req.query.id;
    let update = req.body;
    console.log('update');
    console.log(req.body);

    update.dt_Modified = Date.now();
    update.id_Modified = req.user;

    try {
        const project = await Project.findByIdAndUpdate(projectId, update);
        if (!project) return res.status(500).send({ message: 'No existe el proyecto' });
        res.status(200).send({ project: update });
    } catch (err) {
        res.status(500).send({ message: `error al actualizar el proyecto: ${err}` });
    }
}

async function remove(req, res) {
    console.log('delete');
    let projectId = req.query.id;

    try {
        const project = await Project.findById(projectId);
        if (!project) return res.status(500).send({ message: 'No existe el proyecto' });

        await project.deleteOne();
        res.status(200).send({ message: 'El proyecto ha sido eliminado' });
    } catch (err) {
        res.status(500).send({ message: `error al borrar el proyecto: ${err}` });
    }
}

async function getMyTime(req, res) {
    var projects = [];

    try {
        const tasks = await Task.find({ user: req.user });
        if (!tasks) return res.status(200).send(projects);

        var groups = tasks.groupBy('project');
        var projectGroups = Object.getOwnPropertyNames(groups);

        await service.asyncForEach(projectGroups, async function (projectId, idx, array) {
            const project = await Project.findById(projectId);
            if (!project) return;

            project.extended = [{
                userId: req.user,
                timeLife: groups[projectId].sum("timeLife")
            }];

            projects.push(project);
        });

        res.status(200).send(projects);
    } catch (err) {
        res.status(500).send({ message: `error al consultar los proyectos: ${err}` });
    }
}


async function getUsersTime(req, res) {
    var result = [];

    try {
        const projects = await Project.find({});

        await service.asyncForEach(projects, async (project) => {
            var tasksExtended = [];
            const tasks = await Task.find({ project: project.projectId });
            if (!tasks) return;

            var groups = tasks.groupBy('user');
            var taskGroupsByUser = Object.getOwnPropertyNames(groups);

            await service.asyncForEach(taskGroupsByUser, async function (userId) {
                tasksExtended.push({ userId: userId, timeLife: groups[userId].sum("timeLife") });
            });

            project.extended = tasksExtended;
            result.push(project);
        });

        //ordeno por la fecha de creacion y filtro los que no estan activos
        result.sort((x, y) => x.dt_Created > y.dt_Created ? -1 : 1);
        res.status(200).send({ result });
    } catch (err) {
        res.status(500).send({ message: `error al consultar los proyectos: ${err}` });
    }
}


module.exports = {
    get,
    getAlls,
    getById,
    save,
    update,
    remove,
    getMyTime,
    getUsersTime
};
