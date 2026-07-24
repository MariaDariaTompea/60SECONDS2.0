const express = require("express");
const route = express.Router();
const itemController = require("../controllers/itemController");

route.get('/get-all-item', itemController.getAllItem);

route.get('/get-item/:id', itemController.getItem);

module.exports = route;