const { Router } = require("express");
const { getAuthorById } = require('../controllers/authorController');

const authorRouter = Router();

authorRouter.get("/:authorId", getAuthorById);

module.exports = authorRouter;