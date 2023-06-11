const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");

router.get("/", transactionController.viewTransaction);
router.post("/", transactionController.addTransaction);
router.put("/:id", transactionController.editTransaction);
router.delete("/:id", transactionController.removeTransaction);

module.exports = router;
