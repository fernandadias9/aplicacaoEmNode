const { Router } = require('express');
const routes = Router();

const userRoutes = require("./userRoutes");
const noteRouter = require("./movieNotesRoutes");
const tagsRouter = require("./tagsRoutes");

routes.use("/users", userRoutes);
routes.use("/notes", noteRouter);
routes.use("/tags", tagsRouter);

module.exports = routes;