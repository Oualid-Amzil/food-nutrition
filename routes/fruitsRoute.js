const express = require("express");

const fruitesController = require("../controller/fruitesController");

const router = express.Router();

router
  .route("/")
  .get(fruitesController.getAllFruits)
  .post(fruitesController.createFruit);

router
  .route("/:id")
  .get(fruitesController.getFruit)
  .patch(fruitesController.updateFruit)
  .delete(fruitesController.deleteFruit);

module.exports = router;
