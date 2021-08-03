const express = require("express");
const authController = require("./../controller/authController");

const Router = express.Router();

Router.route("/sign-up").post(authController.signUp);
Router.route("/log-in").post(authController.logIn);

Router.route("/forgot-password").post(authController.forgotPassword);

module.exports = Router;
