'use strict'
const Project = require('../models/project');
const Task = require('../models/task');
const service = require('../services');


function getAlls(req, res) {
    console.log('Get All Not Filter');

    Project.find({}, (err, projects) => {
        if (err) return res.status(500).send({ message: `error al consultar los proyectos: ${err}` });
        if (!projects) return res.status(404).send({ message: `el proyecto no existe` });

        //ordeno por la fecha de creacion y filtro los que no estan activos
        projects.sort((x, y) => x.dt_Created > y.dt_Created ? -1 : 1);
        res.status(200).send({ projects });
    });
}

function get(req, res) {
    console.log('Get With Filter');

    Project.find({}, (err, projects) => {
        if (err) return res.status(500).send({ message: `error al consultar los proyectos: ${err}` });
        if (!projects) return res.status(404).send({ message: `el proyecto no existe` });

        //ordeno por la fecha de creacion y filtro los que no estan activos
        projects = projects.filter(p => p.enabled).sort((x, y) => x.dt_Created > y.dt_Created ? -1 : 1);
        res.status(200).send({ projects });
    });
}

function getById(req, res) {
    console.log('Get By Id');
    let projectId = req.params.projectId;
    Project.findById(projectId, (err, project) => {
        if (err) return res.status(500).send({ message: `error al crear el proyecto: ${err}` });
        if (!project) return res.status(404).send({ message: `el proyecto no existe` });

        res.status(200).send({ project });
    });
}

function save(req, res) {
    console.log('post');

    let project = new Project();
    project.name = req.body.name;
    project.id_Created = req.user;
    project.id_Modified = req.user;

    project.save((err, newProject) => {
        if (err) return res.status(500).send({ message: `error al salvar el proyecto: ${err}` });
        res.status(200).send({ project: newProject });
    });
}

function update(req, res) {
    console.log('update');
    let projectId = req.params.projectId;
    let update = req.body;

    update.dt_Modified = Date.now();
    update.id_Modified = req.user;
    console.log(req.user);

    Project.findByIdAndUpdate(projectId, update, (err, project) => {
        if (err) return res.status(500).send({ message: `error al actualizar el proyecto: ${err}` });
        if (!project) return res.status(500).send({ message: 'No existe el proyecto' });
        res.status(200).send({ project: project });
    });
}

function remove(req, res) {
    console.log('delete');
    let projectId = req.params.projectId;

    Project.findById(projectId, (err, project) => {
        if (err) return res.status(500).send({ message: `error al borrar el proyecto: ${err}` });
        if (!project) return res.status(500).send({ message: 'No existe el proyecto' });

        project.remove(err => {
            if (err) return res.status(500).send({ message: `error al borrar el proyecto: ${err}` });
            res.status(200).send({ message: 'El proyecto ha sido eliminado' });
        });
    });
}

function getMyTime(req, res) {
    var projects = [];

    Task.find({ user: req.user }, async (err, tasks) => {
        if (!tasks) return;

        var groups = tasks.groupBy('project');
        var projectGroups = Object.getOwnPropertyNames(groups);

        await service.asyncForEach(projectGroups, async function (projectId, idx, array) {
            await Project.findById((projectId), (err, project) => {
                if (err) return res.status(500).send({ message: `error al consultar los proyectos: ${err}` });
                if (!project) return res.status(404).send({ message: `el proyecto no existe` });

                project.extended = [{
                    userId: req.user,
                    timeLife: groups[projectId].sum("timeLife")
                }];

                projects.push(project);
            }).exec();
        });

        res.status(200).send(projects);
    });
}


async function getUsersTime(req, res) {
    var result = [];

    await Project.find({}, async (err, projects) => {
        if (err) return res.status(500).send({ message: `error al consultar los proyectos: ${err}` });
        if (!projects) return res.status(404).send({ message: `el proyecto no existe` });

        await service.asyncForEach(projects, async (project) => {
            var tasksExtended = [];
            await Task.find({ project: project.projectId }, async (err, tasks) => {
                if (!tasks) return;

                var groups = tasks.groupBy('user');
                var taskGroupsByUser = Object.getOwnPropertyNames(groups);

                await service.asyncForEach(taskGroupsByUser, async function (userId) {
                    tasksExtended.push({ userId: userId, timeLife: groups[userId].sum("timeLife") });
                });

                project.extended = tasksExtended;
                result.push(project);
            });
        });

        //ordeno por la fecha de creacion y filtro los que no estan activos
        result.sort((x, y) => x.dt_Created > y.dt_Created ? -1 : 1);
        res.status(200).send({ result });
    });
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
