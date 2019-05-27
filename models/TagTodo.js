/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('TagTodo', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    tagId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'Tag',
        key: 'id'
      }
    },
    todoId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'Todo',
        key: 'id'
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'TagTodo'
  });
};
