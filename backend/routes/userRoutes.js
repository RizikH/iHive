const express = require("express");
const router = express.Router();
const controler = require("../controllers/userController");

router.get("/all", controler.getUsers);
router.post("/new", controler.addUser);

router.get("/get/:id", controler.getUser);
router.post("/update/:id", controler.updateUser);

router.post("/delete/:id", controler.deleteUser);




module.exports = router;
