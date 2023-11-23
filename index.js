const express = require("express");
const User = require("./user");
const sequelize = require("./database");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const app = express();

app.use(express.json());

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "express for crud operation on mysql",
      version: "2.0",
    },
    servers: [
      {
        url: "http://localhost:3000/",
      },
    ],
  },
  apis: ["./server.js"],
};

const swaggerSpec = swaggerJsDoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("all models are synchronized successfully");
  })
  .catch((error) => {
    console.log("error occurred", error);
  });

/**
 * @swagger
 * /:
 *  get:
 *    summary: Get all user details
 *    description: Retrieve all user details from the server.
 *    responses:
 *      200:
 *        description: Successful response
 */

app.get("/", async (req, res) => {
  const users = await User.findAll();
  res.json({ message: "Successfully retrieved user details", data: { users } });
});

/**
 * @swagger
 * /user:
 *   post:
 *     summary: add new user
 *     description: add new user.
 *     requestBody:
 *       required:  true
 *       content:
 *         application/json:
 *          schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               department:
 *                 type: string
 *               dob:
 *                 type: string
 *             required:
 *              - name
 *              - email
 *     responses:
 *       200:
 *         description: Successful response
 */

app.post("/user", async (req, res) => {
  const { name, department, dob } = req.body;
  const newUser = await User.create({ name, department, dob });
  res.json(newUser);
});

/**
 * @swagger
 * paths:
 *   /user/{id}:
 *     put:
 *       summary: Update a user
 *       parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: string
 *           required: true
 *           description: id of the user to update
 *       description: Update a user.
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 department:
 *                   type: string
 *                 dob:
 *                   type: string
 *               required:
 *                 - name
 *                 - department
 *                 - dob
 *       responses:
 *         200:
 *           description: Successful response
 */

app.put("/user/:id", async (req, res) => {
  const { name, department, dob } = req.body;
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

/**
 * @swagger
 * paths:
 *   /user/{id}:
 *     delete:
 *       summary: delete a user
 *       parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: string
 *           required: true
 *           description: id of the user to delete
 *       description: delete a user.
 *       responses:
 *         200:
 *           description: Successful response
 */

app.delete("/user/:id", async (req, res) => {
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
