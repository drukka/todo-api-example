const {Todo, Tag, TagTodo} = require('../../models');
const HTTPError = require('../../helpers/httpError');

const tagDataResponse = (tag) => {
    return {
        id: tag.id,
        name: tag.name,
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

const getTagByName = async (name) => {
    return await Tag.findOne({
        where: {
            name: name,
        },
    });
};

const getTodoByTitle = async (title) => {
    return await Todo.findOne({
        where: {
            title: title,
        },
    });
};

const createTodoTag = async (todoId, tagId) => {
    return await TagTodo.create({
        tagId: tagId,
        todoId: todoId,
    });
};

const addOneTag = async (todo, tagName) => {
    const tagOne = await getTagByName(tagName);
    
    if (!tagOne) {
        return '';
    }
    
    if (tagOne) {
        const tagTodo = await getTagAndTodo(todo.id, tagOne.id);
        
        if (tagTodo) {
            return tagTodo;
        }
        const newTagTodo = await createTodoTag(todo.id, tagOne.id);
        
        if (newTagTodo) {
            return newTagTodo;
        }
        
        if (!newTagTodo) {
            return '404';
        }
    }
};

const addOneTodo = async (tag, todoTitle) => {
    const todoOne = await getTodoByTitle(todoTitle);
    
    if (!todoOne) {
        return '';
    }
    
    if (todoOne) {
        const todoTag = await getTagAndTodo(todoOne.id, tag.id);
        
        if (todoTag) {
            return todoTag;
        }
        const newTagTodo = await createTodoTag(todoOne.id, tag.id);
        
        if (newTagTodo) {
            return newTagTodo;
        }
        
        if (!newTagTodo) {
            return '404';
        }
    }
};

const addTags = async (todo, data) => {
    const resArray = data.name.map(async tagName => {
        const tagData = await addOneTag(todo, tagName);
        
        return tagData;
    });
    
    const response = await Promise.all(resArray);
    
    return response;
};

const addTodo = async (tag, data) => {
    const resArray = data.title.map(async tagName => {
        const todoData = await addOneTodo(tag, tagName);
        
        return todoData;
    });
    const response = await Promise.all(resArray);
    
    return response;
};

const getTagAndTodo = async (todoId, tagId) => {
    
    return await TagTodo.findOne({
        where: {
            todoId: todoId,
            tagId: tagId,
        },
    });
};

const findTagById = async (id, includes = []) => {
    return await Tag.findOne({
        include: includes,
        where: {
            id: id,
        },
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

const deleteTodoTag = async (todoId) => {
    return await TagTodo.destroy({
        where: {
            todoId: todoId,
        },
    });
};

const deleteTagTodo = async (tagId) => {
    return await TagTodo.destroy({
        where: {
            tagId: tagId,
        },
    });
};

const getTodoTag = async (id) => {
    return await Todo.findOne({
        include: [
            {
                model: Tag,
                as: 'tag',
                attributes: ['id', 'name'],
            }],
        where: {
            id: id,
        },
    });
};

const getTagTodo = async (id) => {
    return await Tag.findOne({
        include: [
            {
                model: Todo,
                as: 'todo',
            }],
        where: {
            id: id,
        },
    });
};

const deleteEmptyItems = (arrayData) => {
    if (arrayData.length > 0) {
        let filtered = arrayData.filter(function(el) {
            return Object.keys(el).length > 0;
        });
        console.log(filtered);
        return filtered;
    }
    
    return [];
};

exports.getTags = async (req, res, next) => {
    const tagData = await getTodoTag(req.swagger.params.todoId.value);
    
    if (tagData) {
        res.status(200).json(tagData.tag.map(tag => {
            return tagDataResponse(tag);
        }));
    }
    
    if (!tagData) {
        res.status(203).send('Empty tag data');
    }
};

exports.addNewTag = async (req, res, next) => {
    const todo = await findTodoById(req.swagger.params.todoId.value);
    
    if (!todo) {
        return res.status(404).send();
    }
    
    if (todo) {
        const tagData = await addTags(todo, req.body);
        
        if (tagData) {
            const newTagData = deleteEmptyItems(tagData);
            
            if (newTagData.length > 0) {
                res.status(200).json(newTagData.map(tag => {
                    return tagDataResponse(tag);
                }));
            }
            
            return res.status(404).send('Empty data.');
        }
        
        return res.status(404).send('Empty data.');
    }
};

exports.updateTag = async (req, res, next) => {
    const todo = await findTodoById(req.swagger.params.todoId.value);
    
    if (!todo) {
        return res.sendStatus('404');
    }
    
    if (todo) {
        const deletedTodoTag = await deleteTodoTag(todo.id);
        
        if (!deletedTodoTag) {
            return res.sendStatus('404');
        }
        
        if (deletedTodoTag) {
            const tagData = await addTags(todo, req.body);
            
            if (tagData) {
                res.status(200).json(tagData.map(tag => {
                    return tagDataResponse(tag);
                }));
            }
            
            if (!tagData) {
                return res.sendStatus('404');
            }
        }
    }
};

exports.getTodos = async (req, res, next) => {
    const todoData = await getTagTodo(req.swagger.params.tagId.value);
    
    if (todoData) {
        res.status(200).json(todoData.todo.map(todo => {
            return todoDataResponse(todo);
        }));
    }
    
    if (!todoData) {
        res.status(203).send('Empty tag data');
    }
};

exports.addNewTodo = async (req, res, next) => {
    const tag = await findTagById(req.swagger.params.tagId.value);
    
    if (!tag) {
        return res.status(404).send();
    }
    
    if (tag) {
        const todoData = await addTodo(tag, req.body);
        
        if (todoData) {
    
            const newTodoData = deleteEmptyItems(todoData);
    
            if (newTodoData.length > 0) {
                res.status(200).json(newTodoData.map(todo => {
                    return tagDataResponse(todo);
                }));
            }
    
            return res.status(404).send('Empty data.');
        }
        
        if (!todoData) {
            return res.sendStatus('404');
        }
    }
};

exports.updateTodo = async (req, res, next) => {
    const tag = await findTagById(req.swagger.params.tagId.value);
    
    if (!tag) {
        return res.sendStatus('404');
    }
    
    if (tag) {
        const deletedTodoTag = await deleteTagTodo(tag.id);
        
        if (!deletedTodoTag) {
            return res.sendStatus('404');
        }
        
        if (deletedTodoTag) {
            const todoData = await addTodo(tag, req.body);
            
            if (todoData) {
                res.status(200).json(todoData.map(todo => {
                    return todoDataResponse(todo);
                }));
            }
            
            if (!tagData) {
                return res.sendStatus('404');
            }
        }
    }
};