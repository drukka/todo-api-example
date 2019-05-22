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

const getTodo = (limit, offset) => {
    return Todo.findAll({
        order: [['id', 'ASC']],
        limit,
        offset,
    });
};

const gerTodoAndUser = (limit, offset) => {
    
    return Todo.findAll({
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

const findTodoById = (id, includes = []) => {
    return Todo.findOne({
        include: includes,
        where: {
            id: id,
        },
    });
};

const createTodo = (data) => {
    return Todo.create(data).then(todo => {
        return todo;
    }).catch(error => console.log(error));
};

exports.listTodoAll = (req, res, next) => {
    gerTodoAndUser(req.swagger.params.limit.value,
        req.swagger.params.offset.value,
    )
        .then(
            todoData => res.json(todoData.map(todo => todoAndUserDataResponse(todo))))
        .catch(promiseError.handle(res));
};

exports.listTodo = (req, res, next) => {
    getTodo(req.swagger.params.limit.value, req.swagger.params.offset.value)
        .then(todoData => res.json(todoData.map(todo => todoDataResponse(todo))))
        .catch(promiseError.handle(res));
};

exports.getTodo = (req, res, next) => {
    findTodoById(req.swagger.params.todoId.value)
        .then(todo => !todo ? Promise.reject(new HTTPError(404)) : res.json(
            todoDataResponse(todo)))
        .catch(promiseError.handle(res));
};

exports.updateTodo = (req, res, next) => {
    findTodoById(req.swagger.params.todoId.value)
        .then(todo => {
            if (!todo) {
                return Promise.reject(new HTTPError(404));
            }
            todo.title = req.body.title
            todo.description = req.body.description
            todo.status = req.body.status
            todo.updatedAt = new Date();
            return todo.save()
                .then(result => {
                    return res.status(201).json(todoDataResponse(result));
                })
                .catch(err => console(err));
        })
        .catch(promiseError.handle(res));
};

exports.updateTodoStatus = (req, res, next) => {
    findTodoById(req.swagger.params.todoId.value)
        .then(todo => {
            if (!todo) {
                return Promise.reject(new HTTPError(404));
            }
            todo.status = req.body.status
            todo.updatedAt = new Date();
            return todo.save()
                .then(result => {
                    return res.status(201).json(todoDataResponse(result));
                })
                .catch(err => console(err));
        })
        .catch(promiseError.handle(res));
};

exports.create = (req, res, next) => {
    const date = new Date();
    req.body['status'] = companyConfig.todoDefaultStatus;
    req.body['createdAt'] = date;
    req.body['updatedAt'] = date;
    createTodo(req.body).then(response => {
        return res.status(201).json(todoDataResponse(response));
    }).catch(promiseError.handle(res));
};