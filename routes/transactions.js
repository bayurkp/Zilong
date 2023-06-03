const express = require("express");
const router = express.Router();

router.get("/", function (req, res, next) {
    res.render("transactions", { title: "Transactions" });
});

module.exports = router;
