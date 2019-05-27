'use strict';

const now = new Date();
const fs = require('fs');

const content = fs.readFileSync(`${__dirname}/../data/tag.json`);
let data = JSON.parse(content);

data = data.map(item => {
  item['createdAt'] = now;
  item['updatedAt'] = now;
  return item;
});

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Tag', data);
  },
  
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Tag', null);
  }
};
