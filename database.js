const { Sequelize } = require("sequelize");
const dotEnv = require("dotenv");
dotEnv.config();
console.log(process.env.user);
console.log(process.env.password);
const sequelize = new Sequelize(
  process.env.myDB,
  process.env.user,
  process.env.password,
  {
    host: process.env.host,
    dialect: process.env.dialect,
  }
);
sequelize
  .authenticate()
  .then(() => {
    console.log("connection established successfully");
  })
  .catch((err) => {
    console.log("unable to connect", err);
  });

module.exports = sequelize;
