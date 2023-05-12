'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Expense extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Expense.init({
    user_id: DataTypes.STRING,
    category: DataTypes.STRING,
    amount: DataTypes.STRING,
    description: DataTypes.STRING,
    date: DataTypes.DATE,
    starting_balance: DataTypes.STRING,
    current_balance: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Expense',
  });
  return Expense;
};