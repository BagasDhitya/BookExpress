const express = require("express");
const userController = require("../controllers/user.controller");
const { signup, login, user } = userController;
const userAuth = require("../middleware/userAuth");

const router = express.Router();

router.post("/signup", userAuth.saveUser, signup);

router.post("/login", login);

router.get("/user", user);

module.exports = router;
