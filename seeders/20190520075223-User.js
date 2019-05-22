'use strict';

const now = new Date();
const fs = require('fs');

const content = fs.readFileSync(`${__dirname}/../data/user.json`);
let data = JSON.parse(content);

data = data.map(item => {
  item['createdAt'] = now;
  item['updatedAt'] = now;
  return item;
});

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('User', data);
  },
  
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('User', null);
  }
};
