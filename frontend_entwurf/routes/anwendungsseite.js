var express = require("express");
var router = express.Router();
const decompress = require("decompress");
const multer = require("multer");
const fs = require("fs");
var request = require("request");
const path = require("path");
// error handler
const handleError = (err, res) => {
    res
        .status(500)
        .contentType("text/plain")
        .end("Oops! Something went wrong!");
};


/**
 * GET Befehl für die Messungen ansehen Seite
 */
/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("anwendungsseite", { title: "Anwendungsseite" });
});

router.post("/ergebnisseitemodel", function (req, res, next) {
  // Code zum ausführen des R Skripts
  url = "http://172.17.0.1:7001/tiffmodel";

  request(url, { json: true }, (err, res2, body) => {
    if (err) {
      return console.log(err);
    }
    res.render("ergebnisseite", { title: "Ergebnisseite" });
  });
  //res.render("ergebnisseite", { title: "Ergebnisseite", ueblink: "http://172.17.0.1:7001/tiffmodel" })
  
});

router.post("/ergebnisseitegpkg", function (req, res, next) {
  // Code zum ausführen des R Skripts
  url = "http://172.17.0.1:7001/tiffgpkg";

  request(url, { json: true }, (err, res2, body) => {
    if (err) {
      return console.log(err);
    }
    res.render("ergebnisseite", { title: "Ergebnisseite" });
  });
  //res.render("ergebnisseite", { title: "Ergebnisseite", ueblink: "http://172.17.0.1:7001/tiffgpkg" })
  
});

router.post("/ergebnisseiteshape", function (req, res, next) {
  // Code zum ausführen des R Skripts
  
  url = "http://172.17.0.1:7001/tiffshape";

  request(url, { json: true }, (err, res2, body) => {
    if (err) {
      return console.log(err);
    }
    res.render("ergebnisseite", { title: "Ergebnisseite" });
  });
  
  //res.render("ergebnisseite", { title: "Ergebnisseite", ueblink: "http://172.17.0.1:7001/tiffshape" })
  
});

router.post("/ergebnisseitegjson", function (req, res, next) {
  // Code zum ausführen des R Skripts
  url = "http://172.17.0.1:7001/tiffgjson";

  request(url, { json: true }, (err, res2, body) => {
    if (err) {
      return console.log(err);
    }
    res.render("ergebnisseite", { title: "Ergebnisseite" });
  });
  
  //res.render("ergebnisseite", { title: "Ergebnisseite", ueblink: "http://172.17.0.1:7001/tiffgjson" })
  
});


module.exports = router;
