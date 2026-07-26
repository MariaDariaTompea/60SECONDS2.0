const express = require("express");
const route = express.Router();
const newsController = require("../controllers/newsController");

route.get('/get-news', newsController.getNews);

route.get('/get-all-news', newsController.getAllNews);

module.exports = route;