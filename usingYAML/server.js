const express = require("express");
const User = require("../models./user");
const sequelize = require("../database");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

const swaggerJsDoc = YAML.load("./api.yaml");
const app = express();
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerJsDoc));

sequelize
  .sync({force:false})
  .then(() => {
    console.log("all models are synchronized successfully");
  })
  .catch((error) => {
    console.log("error occurred", error);
  });

app.get("/", async(req, res) => {
  const users = await User.findAll();
  res.json({ message: "Successfully retrieved user details", data: { users } });
});

app.post("/user", async (req, res) => {
  const {name,department,dob} = req.body;
  const newUser = await User.create({ name, department, dob });
  res.json(newUser);
});

app.put("/user/:id", async(req, res) => {
  const {name,department,dob} = req.body;
  const user = await User.findByPk(req.params.id);
  if (user) {
    user.name = name;
    user.department = department;
    user.dob = dob;
    await user.save();
    return res.send("user updated successfully");
  }
  res.send("user doesn't exist");
});

app.delete("/user/:id", async(req, res) => {
  const user = await User.findByPk(req.params.id);
  if (user) {
    user.destroy();
    return res.send("user deleted successfully");
  }
  res.send("user doesn't exist");
});

app.listen("3000", () => {
  console.log("server started on port 3000");
});
