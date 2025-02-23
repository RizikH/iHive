const express = require("express");
const router = express.Router();
const controler = require("../controllers/userController");

router.get("/all", controler.getUsers);
<<<<<<< HEAD
=======
router.post("/new", controler.addUser);

router.get("/get/:id", controler.getUser);
router.post("/update/:id", controler.updateUser);

router.post("/delete/:id", controler.deleteUser);


>>>>>>> ad799857b41ed223965f1f08d12ef6e74912981f


module.exports = router;
