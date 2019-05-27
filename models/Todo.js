/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  const Todo = sequelize.define('Todo', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('pending','completed','failed'),
      allowNull: true,
      defaultValue: 'pending'
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
    tableName: 'Todo'
  });
  
  Todo.associate = (models) => {
    Todo.belongsTo(models.User, {
      foreignKey: 'userId'
    });
    
    Todo.belongsToMany(models.Tag, {
      through: 'TagTodo',
      as: 'tag',
      foreignKey: 'todoId'
    });
  };
  
  return Todo;
};
