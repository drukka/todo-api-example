const {User} = require('../../models');
const encryptConfig = require('../../config/encrypt');
const companyConfig = require('../../config/company');

const bcrypt = require('bcrypt');

const countUsersWithEmail = async (email) => {
    return await User.count({
        where: {
            email: email,
        },
    });
};

const userDataResponse = (user) => {
    return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
    };
};

const findUserByEmail = async (email, includes = []) => {
    return await User.findOne({
        include: includes,
        where: {
            email: email,
        },
    });
};

const findUserById = async (id, includes = []) => {
    return await User.findOne({
        include: includes,
        where: {
            id: id,
        },
    });
};

const createUser = async (data) => {
    return await User.create(data);
};

const randomNumber = (power = 4) => {
    return Math.floor(Math.random() * Math.pow(10, power));
};

const getUsers = async (limit, offset) => {
    return await User.findAll({
        order: [['id', 'ASC']],
        limit,
        offset,
    });
};

exports.register = async (req, res, next) => {
    const userCount = await countUsersWithEmail(req.body.email);
    
    if(userCount > 0){
        return  res.status(409).send('Email address already in use');
    }
    
    const password = await bcrypt.hash(req.body.password, encryptConfig.saltRounds);
    req.body['password'] = password;
    
    const user = await createUser(req.body);
    
    if(user){
        return res.status(200).json(userDataResponse(user));
    }
    
    if(!user){
        return res.status(400).send('Bad request');
    }
};

exports.getUsers = async (req, res, next) => {
    const userData = await getUsers(req.swagger.params.limit.value, req.swagger.params.offset.value);
    
    if(userData){
        return res.json(userData.map(user => userDataResponse(user)));
    }
    
    if(!userData){
        return res.status(400).send('Bad request');
    }
}

exports.updateUser = async (req, res, next) => {
    const user = await findUserById(req.swagger.params.userId.value);
    
    if(user){
        const updated = await user.update({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            updatedAt: new Date()
        });
    
        return res.status(200).json(userDataResponse(updated));
    }
    
    if(!user){
        return res.status(404).send('Not found');
    }
};

exports.getUser = async (req, res, next) => {
    const user = await findUserById(req.swagger.params.userId.value);
    
    if(user){
        return res.status(200).json(userDataResponse(user));
    }
    
    if(!user){
        return res.status(404).send('Not found');
    }
};
