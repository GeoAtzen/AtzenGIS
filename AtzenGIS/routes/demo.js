var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("demo", { title: "Demo" });
});

router.post("/demoergebnis", function (req, res, next) {
  res.render("demoergebnis", { title: "Demo Ergebnisseite"})

});

module.exports = router;