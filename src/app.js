const express = require("express");
const bodyParser = require("body-parser");
const {
  sequelize,
  Profile,
  Contract,
  Job,
} = require("./models/model");
const errorHandlingMiddleware = require("./middlewares/errorHandlingMiddleware");
const routes = require("./routes");
const app = express();

app.use(bodyParser.json());
app.set("sequelize", sequelize);
app.set("models", { Profile, Contract, Job });

app.use(routes);
app.use(errorHandlingMiddleware);

module.exports = app;
