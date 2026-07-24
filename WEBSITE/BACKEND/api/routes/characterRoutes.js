const express = require("express");
const route = express.Router();
const characterController = require("../controllers/characterController");

route.get('/get-all-character', characterController.getAllCharacter);

route.get('/get-character/:id', characterController.getCharacter);

route.get('/get-names', characterController.getNames);

module.exports = route;