const {User, Todo} = require('../../models');
const companyConfig = require('../../config/company');
const promiseError = require('../../helpers/promiseErrorHandler');
const HTTPError = require('../../helpers/httpError');

const todoAndUserDataResponse = (todo) => {
    return {
        id: todo.id,
        title: todo.title,
        description: todo.description,
        status: todo.status,
        firstName: todo.User.firstName,
        lastName: todo.User.lastName,
    };
};

const todoDataResponse = (todo) => {
    return {
        id: todo.id,
        userId: todo.userId,
        title: todo.title,
        description: todo.description,
        status: todo.status,
    };
};

const getTodo = async (limit, offset) => {
    return await Todo.findAll({
        order: [['id', 'ASC']],
        limit,
        offset,
    });
};

const gerTodoAndUser = async (limit, offset) => {
    
    return await Todo.findAll({
        order: [['id', 'ASC']],
        include: [
            {
                model: User,
                attributes: ['firstName', 'lastName'],
            }],
        limit,
        offset,
    });
};

const findTodoById = async (id, includes = []) => {
    return await Todo.findOne({
        include: includes,
        where: {
            id: id,
        },
    });
};

const createTodo = async (data) => {
    return await Todo.create(data);
};

exports.listTodoAll = async (req, res, next) => {
    const todoData = await gerTodoAndUser(req.swagger.params.limit.value, req.swagger.params.offset.value);
    
    if(todoData){
        return res.json(todoData.map(todo => todoAndUserDataResponse(todo)));
    }
    
    if(!todoData){
        return res.status('203').send('Empty todo data.');
    }
};

exports.listTodo = async (req, res, next) => {
    const todoData = await getTodo(req.swagger.params.limit.value, req.swagger.params.offset.value);
    
    if(todoData) {
        return res.json(todoData.map(todo => todoDataResponse(todo)));
    }
    
    if(!todoData){
        return res.status('203').send('Empty todo data.');
    }
};

exports.getTodo = async (req, res, next) => {
    const todo = await findTodoById(req.swagger.params.todoId.value);
    
    if(todo){
        return res.json(todoDataResponse(todo));
    }
    
    if(!todo){
        return Promise.reject(new HTTPError(404));
    }
};

exports.updateTodo = async (req, res, next) => {
    const todo = await findTodoById(req.swagger.params.todoId.value);
    
    if(!todo){
        return Promise.reject(new HTTPError(404));
    }
    
    if(todo){
        const updated = await todo.update({
            title: req.body.title,
            description: req.body.description,
            status: req.body.status,
            updatedAt: new Date()
        });
    
        return res.status(201).json(todoDataResponse(updated));
    }
};

exports.updateTodoStatus = async (req, res, next) => {
    
    const todo = await findTodoById(req.swagger.params.todoId.value);
    
    if(!todo){
        return Promise.reject(new HTTPError(404));
    }
    
    if(todo){
        const updated = await todo.update({
            status: req.body.status,
            updatedAt: new Date()
        });
        
        return res.status(201).json(todoDataResponse(updated));
    }
};

exports.create = async (req, res, next) => {
    const date = new Date();
    req.body['status'] = companyConfig.todoDefaultStatus;
    req.body['createdAt'] = date;
    req.body['updatedAt'] = date;
    
    const todo = await createTodo(req.body);
    if(todo){
        return res.status(201).json(todoDataResponse(todo));
    }
    
    if(!todo){
        return promiseError.handle(res);
    }
};