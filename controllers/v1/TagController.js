const {Todo, Tag} = require('../../models');
const promiseError = require('../../helpers/promiseErrorHandler');
const HTTPError = require('../../helpers/httpError');

const tagDataResponse = (tag) => {
    return {
        id: tag.id,
        name: tag.name,
    };
};

const getTag = async (limit, offset) => {
    return await Tag.findAll({
        order: [['name', 'ASC']],
        limit,
        offset,
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

const createTag = async (data) => {
    return await Tag.create(data);
};


exports.listTag = async (req, res, next) => {
    const tagData = await getTag(req.swagger.params.limit.value, req.swagger.params.offset.value);
    
    if (tagData) {
        return res.json(tagData.map(tag => tagDataResponse(tag)));
    }
    
    if(!tagData){
        return res.status('203').send('Empty tag data');
    }
};

exports.getTag = async (req, res, next) => {
    const tag = await findTagById(req.swagger.params.tagId.value);
    
    if(tag){
        return res.json(tagDataResponse(tag));
    }
    
    if(!tag){
        return res.sendStatus('404');
    }
};

exports.updateTag = async (req, res, next) => {
    const tag = await findTagById(req.swagger.params.tagId.value);
    
    if(!tag){
        return res.sendStatus('404');
    }
    
    if(tag){
        const updated = await tag.update({
            name: req.body.name,
            updatedAt: new Date()
        });
       
        return res.status(200).json(tagDataResponse(updated));
    }
};


exports.create = async (req, res, next) => {
    const date = new Date();
    req.body['createdAt'] = date;
    req.body['updatedAt'] = date;
    const tag = await createTag(req.body);
    if(tag){
        return res.status(200).json(tagDataResponse(tag));
    }
    
    if(!tag){
        return res.sendStatus('404');
    }
};