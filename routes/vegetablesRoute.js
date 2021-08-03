const express = require("express");

const vegetablesController = require("../controller/vegetablesController");
const authController = require("./../controller/authController");

const router = express.Router();

router
  .route("/specific-vitamins/:vitamine")
  .get(vegetablesController.containVitamine);

router
  .route("/")
  .get(vegetablesController.getAllVegetables)
  .post(vegetablesController.createVegetable);

router
  .route("/:id")
  .get(vegetablesController.getVegetable)
  .patch(vegetablesController.updateVegetable)
  .delete(
    authController.protect,
    authController.restrictTo("user"),
    vegetablesController.deleteVegetable
  );

module.exports = router;
