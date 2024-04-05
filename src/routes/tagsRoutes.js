const { Router } = require("express");

const tagsRoutes = Router();

const TagsController = require("../controllers/tagsController");
const tagsController = new TagsController();

tagsRoutes.get("/:user_id", tagsController.list);

module.exports = tagsRoutes;