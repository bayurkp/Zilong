const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/", userController.viewUser);
router.post("/", userController.addUser);
router.put("/:id", userController.editUser);
router.delete("/:id", userController.removeUser);

module.exports = router;
