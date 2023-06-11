const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");

router.get("/", bookController.viewBook);
router.post("/", bookController.addBook);
router.put("/:id", bookController.editBook);
router.delete("/:id", bookController.removeBook);

module.exports = router;
