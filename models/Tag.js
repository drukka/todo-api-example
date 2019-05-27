/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  const Tag = sequelize.define('Tag', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
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
    tableName: 'Tag'
  });
  
  Tag.associate = (models) => {
    Tag.belongsToMany(models.Todo, {
      through: 'TagTodo',
      as: 'todo',
      foreignKey: 'tagId'
    });
  };
  
  return Tag;
};
