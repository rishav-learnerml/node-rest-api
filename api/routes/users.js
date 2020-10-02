const express = require("express");
const router = express.Router();

const UserController = require("../controllers/user");
const checkAuth = require("../authMiddleware/check-auth");

//Handling routes coming to /users

router.post("/signup", UserController.users_signup);

router.post("/login", UserController.users_login);

router.delete("/:userId", checkAuth, UserController.users_delete);

module.exports = router;
