const { Sequelize, DataTypes, UUIDV4 } = require("sequelize");
const sequelize = require("../database");
const uuid = require("uuid");
const User = sequelize.define("User", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  department: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dob: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: () => uuid.v4(),
    autoIncrement: true,
  },
});
module.exports = User;
