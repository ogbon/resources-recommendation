'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Recommendation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Recommendation.belongsTo(models.User, {foreignKey: 'user_id', onDelete: 'CASCADE'})
    }
  };
  Recommendation.init({
    type: {
      allowNull: false,
      type: DataTypes.ENUM('book', 'video', 'audio', 'website', 'others')
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rating: {
      allowNull: false,
      type: DataTypes.ENUM('5', '4', '3', '2', '1')
    },
    howItHelpedYou: {
      allowNull: false,
      type: DataTypes.TEXT
    }
  }, {
    sequelize,
    modelName: 'Recommendation',
  });
  return Recommendation;
};