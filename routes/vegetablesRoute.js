const express = require("express");

const vegitablesController = require("../controller/vegitablesController");

const router = express.Router();

router
  .route("/specific-vitamins/:vitamine")
  .get(vegitablesController.containVitamine);

router
  .route("/")
  .get(authController.protect, vegitablesController.getAllVegitables)
  .post(vegitablesController.createVegitable);

router
  .route("/:id")
  .get(vegitablesController.getVegitable)
  .patch(vegitablesController.updateVegitable)
  .delete(
    authController.protect,
    authController.restrict("admin", "doctor"),
    vegitablesController.deleteVegitable
  );

module.exports = router;
