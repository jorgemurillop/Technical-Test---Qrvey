'use strict'
//requiero el framework de express
const express = require('express');
const projectControllers = require('../controllers/project');
const userControllers = require('../controllers/user');
const taskControllers = require('../controllers/task');
const auth = require('../middlewares/auth');
const api = express.Router();

//AllowAnonymous
api.get('/project', projectControllers.get);
//Authorize
api.get('/project/alls', auth, projectControllers.getAlls);
api.get('/project/myTime', auth, projectControllers.getMyTime);
api.get('/project/usersTime', auth, projectControllers.getUsersTime);
//AllowAnonymous
api.get('/project/getById', projectControllers.getById);
//Authorize
api.post('/project', auth, projectControllers.save);
api.put('/project', auth, projectControllers.update);
api.delete('/project', auth, projectControllers.remove);


//Authorize
api.get('/user', auth, userControllers.get);
//AllowAnonymous
api.post('/signUp', userControllers.signUp);
api.post('/signin', userControllers.signIn);


//Authorize
api.get('/task', auth, taskControllers.get);
api.get('/task/getById', auth, taskControllers.getById);
api.get('/task/getByProjectId', auth, taskControllers.getByProjectId);
api.put('/task', auth, taskControllers.update);
api.post('/task', auth, taskControllers.save);
api.delete('/task', auth, taskControllers.remove);
api.post('/task/start', auth, taskControllers.start);
api.post('/task/stop', auth, taskControllers.stop);
api.post('/task/pause', auth, taskControllers.pause);

module.exports = api;