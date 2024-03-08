const { Router } = require('express');
const routes = Router();

const userRoutes = require('./userRoutes');

routes.use("/users", userRoutes);

module.exports = routes;