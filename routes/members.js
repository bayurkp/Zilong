const express = require("express");
const router = express.Router();

router.get("/", function (req, res, next) {
    res.render("members", { title: "Members" });
});

module.exports = router;
