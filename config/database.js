// const Sequelize = require('sequelize');
//
// const sequelize = new Sequelize('todo-test', 'root', '',
//     {dialect: 'mysql', host: 'localhost'});
//
// module.exports = sequelize;

module.exports = {
    development: {
        username: 'root',
        password: '',
        database: 'todo-test',
        operatorsAliases: false,
        host: '127.0.0.1',
        dialect: 'mysql',
        // define: {
        //     charset: 'utf8mb4',
        //     collate: 'utf8mb4_general_ci'
        // }
    },
    test: {
        username: 'root',
        password: '',
        database: 'todo-test',
        host: '127.0.0.1',
        dialect: 'mysql'
    },
    production: {
        username: 'root',
        password: '',
        database: 'todo-test',
        host: '127.0.0.1',
        dialect: 'mysql'
    }
};

