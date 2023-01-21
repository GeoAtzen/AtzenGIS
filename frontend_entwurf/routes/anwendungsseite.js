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
  let url = "http://172.17.0.1:8000/";

  let aoiSplit = "";
  console.log("aoi: " + req.body.aoibbmdl);

  if (req.body.aoibbmdl != "") {
    aoiSplit = req.body.aoibbmdl.split(",");
  }
  aoiSplit != ""
        ? (url +=
            "tiffmodel?ymin=" +
            aoiSplit[2] +
            "&ymax=" +
            aoiSplit[3] +
            "&xmin=" +
            aoiSplit[0] +
            "&xmax=" +
            aoiSplit[1])
        : (url += "tiffmodel");
  console.log(url);

  request(url, { json: true }, (err, res2, body) => {
    if (err) {
      return console.log(err);
    }
    res.render("ergebnisseite", { title: "Ergebnisseite" });
  });
  //res.render("ergebnisseite", { title: "Ergebnisseite", ueblink: "http://172.17.0.1:8000/tiffmodel" })
  
});

router.post("/ergebnisseitegpkg", function (req, res, next) {
  // Code zum ausführen des R Skripts
  let url = "http://172.17.0.1:8000/";

  let aoiSplit = "";
  console.log("aoi: " + req.body.aoibbgpkg);

  if (req.body.aoibbgpkg != "") {
    aoiSplit = req.body.aoibbgpkg.split(",");
  }
  aoiSplit != ""
        ? (url +=
            "tiffgpkg?ymin=" +
            aoiSplit[2] +
            "&ymax=" +
            aoiSplit[3] +
            "&xmin=" +
            aoiSplit[0] +
            "&xmax=" +
            aoiSplit[1])
        : (url += "tiffgpkg");
  console.log(url);


  request(url, { json: true }, (err, res2, body) => {
    if (err) {
      return console.log(err);
    }
    res.render("ergebnisseite", { title: "Ergebnisseite" });
  });
  //res.render("ergebnisseite", { title: "Ergebnisseite", ueblink: "http://172.17.0.1:8000/tiffgpkg" })
  
});

router.post("/ergebnisseiteshape", function (req, res, next) {
  // Code zum ausführen des R Skripts
  
  let url = "http://172.17.0.1:8000/";
  let aoiSplit = "";
  console.log("aoi: " + req.body.aoibbshp)

  if (req.body.aoibbshp != "") {
    aoiSplit = req.body.aoibbshp.split(",");
  }
  aoiSplit != ""
        ? (url +=
            "tiffshape?ymin=" +
            aoiSplit[2] +
            "&ymax=" +
            aoiSplit[3] +
            "&xmin=" +
            aoiSplit[0] +
            "&xmax=" +
            aoiSplit[1])
        : (url += "tiffshape");
  console.log(url);

  request(url, { json: true }, (err, res2, body) => {
    if (err) {
      return console.log(err);
    }
    res.render("ergebnisseite", { title: "Ergebnisseite" });
  });
  
  //res.render("ergebnisseite", { title: "Ergebnisseite", ueblink: "http://172.17.0.1:8000/tiffshape" })
  
});

router.post("/ergebnisseitegjson", function (req, res, next) {
  // Code zum ausführen des R Skripts
  let url = "http://172.17.0.1:8000/";
  let aoiSplit = "";
  console.log("aoi: " + req.body.aoibbgjson);

  if (req.body.aoibbgjson != "") {
    aoiSplit = req.body.aoibbgjson.split(",");
  }
  aoiSplit != ""
        ? (url +=
            "tiffgjson?ymin=" +
            aoiSplit[2] +
            "&ymax=" +
            aoiSplit[3] +
            "&xmin=" +
            aoiSplit[0] +
            "&xmax=" +
            aoiSplit[1])
        : (url += "tiffgjson");
  console.log(url);


  request(url, { json: true }, (err, res2, body) => {
    if (err) {
      return console.log(err);
    }
    res.render("ergebnisseite", { title: "Ergebnisseite" });
  });
  
  //res.render("ergebnisseite", { title: "Ergebnisseite", ueblink: "http://172.17.0.1:8000/tiffgjson" })
  
});


module.exports = router;
