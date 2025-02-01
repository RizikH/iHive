const express = require("express");
const router = express.Router();
const controler = require("../controllers/userController");

router.get("/all", controler.getUsers);


module.exports = router;
