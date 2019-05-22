const {User} = require('../../models');
const encryptConfig = require('../../config/encrypt');
const companyConfig = require('../../config/company');
const promiseError = require('../../helpers/promiseErrorHandler');
const HTTPError = require('../../helpers/httpError');

const bcrypt = require('bcrypt');


/**
 * helpers
 */
const countUsersWithEmail = (email) => {
    return User.count({
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

const findUserByEmail = (email, includes = []) => {
    return User.findOne({
        include: includes,
        where: {
            email: email,
        },
    });
};

const findUserById = (id, includes = []) => {
    return User.findOne({
        include: includes,
        where: {
            id: id,
        },
    });
};

const createUser = (data) => {
    return User.create(data)
        .then(user => {
            return user;
        }).catch(err => console(err));
};


const randomNumber = (power = 4) => {
    return Math.floor(Math.random() * Math.pow(10, power));
};



const getUsers = (limit, offset) => {
    const userData = User.findAll({
        order: [['id', 'ASC']],
        limit,
        offset,
    });
    //console.log(userData);
    return userData;
};

/**
 * controllers
 */
exports.register = (req, res) => {
    countUsersWithEmail(req.body.email).then(count => {
        if (count > 0) {
            return Promise.reject(new HTTPError(409));
        }
        
        return bcrypt.hash(req.body.password, encryptConfig.saltRounds);
    }).then(hash => {
        req.body['password'] = hash;
        return createUser(req.body);
    }).then(response => {
        res.status(201).json(response);
    }).catch(promiseError.handle(res));
};

exports.updateUser = (req, res) => {
    findUserById(req.swagger.params.userId.value).then(user => {
        if (!user) {
            return Promise.reject(new HTTPError(400));
        }
        
        return user.update(req.body);
    }).then(user => {
        res.json(userDataResponse(user));
    }).catch(promiseError.handle(res));
};

exports.listUsers = (req, res) => {
    getUsers(req.swagger.params.limit.value, req.swagger.params.offset.value)
        .then(users => res.json(users.map(user => userDataResponse(user))))
        .catch(promiseError.handle(res));
};

exports.getUser = (req, res) => {
    findUserById(req.swagger.params.userId.value)
        .then(user => !user ? Promise.reject(new HTTPError(404)) : res.json(
            userDataResponse(user)))
        .catch(promiseError.handle(res));
};
