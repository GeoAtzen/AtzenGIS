var express = require("express");
var router = express.Router();
const decompress = require("decompress");
const multer = require("multer");
const fs = require("fs");
var request = require("request");
const path = require("path");
const jsonlint = require("jsonlint");
const geojsonMerge = require('@mapbox/geojson-merge');
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
  res.render("anwendungsseite", {
    title: "Anwendungsseite"
  });
});

router.post("/ergebnisseitemodel", function (req, res, next) {
  // Code zum ausführen des R Skripts
  let url = "http://172.17.0.1:8000/";

  let aoiSplit = "";
  console.log("aoi: " + req.body.aoibbmdl);

  if (req.body.aoibbmdl != "") {
    aoiSplit = req.body.aoibbmdl.split(",");
  }
  aoiSplit != "" ?
    (url +=
      "tiffmodel?ymin=" +
      aoiSplit[2] +
      "&ymax=" +
      aoiSplit[3] +
      "&xmin=" +
      aoiSplit[0] +
      "&xmax=" +
      aoiSplit[1]) :
    (url += "tiffmodel");
  console.log(url);

  request(url, {
    json: true
  }, (err, res2, body) => {
    if (err) {
      return console.log(err);
    }
    res.render("ergebnisseite", {
      title: "Ergebnisseite"
    });
  });
  //res.render("ergebnisseite", { title: "Ergebnisseite", ueblink: "http://172.17.0.1:8000/tiffmodel" })

});

router.post("/ergebnisseitegpkg", function (req, res, next) {
  // Code zum ausführen des R Skripts
  let url = "http://172.17.0.1:8000/";

  let aoiSplit = "";
  console.log("aoi: " + req.body.aoibbgpkg);
  console.log("algorithm: " + req.body.algorithms);
  var algorithm = req.body.algorithms

  if (req.body.aoibbgpkg != "") {
    aoiSplit = req.body.aoibbgpkg.split(",");
  }
  if (algorithm == undefined) {
    aoiSplit != "" ?
      (url +=
        "tiffgpkg?ymin=" +
        aoiSplit[2] +
        "&ymax=" +
        aoiSplit[3] +
        "&xmin=" +
        aoiSplit[0] +
        "&xmax=" +
        aoiSplit[1]) :
      (url += "tiffgpkg");
  } else {
    aoiSplit != "" ?
      (url +=
        "tiffgpkg?ymin=" +
        aoiSplit[2] +
        "&ymax=" +
        aoiSplit[3] +
        "&xmin=" +
        aoiSplit[0] +
        "&xmax=" +
        aoiSplit[1] +
        "&alg=" +
        algorithm) :
      (url += "tiffgpkg" + "?alg=" + algorithm);
    console.log(url);
  }

  request(url, {
    json: true
  }, (err, res2, body) => {
    if (err) {
      return console.log(err);
    }
    res.render("ergebnisseite", {
      title: "Ergebnisseite"
    });
  });
  //res.render("ergebnisseite", { title: "Ergebnisseite", ueblink: "http://172.17.0.1:8000/tiffgpkg" })

});

router.post("/ergebnisseiteshape", function (req, res, next) {
  // Code zum ausführen des R Skripts

  let url = "http://172.17.0.1:8000/";
  let aoiSplit = "";
  console.log("aoi: " + req.body.aoibbshp)
  console.log("algorithm: " + req.body.algorithms);
  var algorithm = req.body.algorithms

  if (req.body.aoibbshp != "") {
    aoiSplit = req.body.aoibbshp.split(",");
  }
  if (algorithm == undefined) {
    aoiSplit != "" ?
      (url +=
        "tiffshape?ymin=" +
        aoiSplit[2] +
        "&ymax=" +
        aoiSplit[3] +
        "&xmin=" +
        aoiSplit[0] +
        "&xmax=" +
        aoiSplit[1]) :
      (url += "tiffshape");
  } else {
    aoiSplit != "" ?
      (url +=
        "tiffshape?ymin=" +
        aoiSplit[2] +
        "&ymax=" +
        aoiSplit[3] +
        "&xmin=" +
        aoiSplit[0] +
        "&xmax=" +
        aoiSplit[1] +
        "&alg=" +
        algorithm) :
      (url += "tiffshape" + "?alg=" + algorithm);
    console.log(url);
  }

  request(url, {
    json: true
  }, (err, res2, body) => {
    if (err) {
      return console.log(err);
    }
    res.render("ergebnisseite", {
      title: "Ergebnisseite"
    });
  });

  //res.render("ergebnisseite", { title: "Ergebnisseite", ueblink: "http://172.17.0.1:8000/tiffshape" })

});

router.post("/ergebnisseitegjson", function (req, res, next) {
  // Code zum ausführen des R Skripts
  let url = "http://172.17.0.1:8000/";
  let aoiSplit = "";
  console.log("aoi: " + req.body.aoibbgjson);
  console.log("algorithm: " + req.body.algorithms);
  var algorithm = req.body.algorithms

  if (req.body.aoibbgjson != "") {
    aoiSplit = req.body.aoibbgjson.split(",");
  }
  if (algorithm == undefined) {
    aoiSplit != "" ?
      (url +=
        "tiffgjson?ymin=" +
        aoiSplit[2] +
        "&ymax=" +
        aoiSplit[3] +
        "&xmin=" +
        aoiSplit[0] +
        "&xmax=" +
        aoiSplit[1]) :
      (url += "tiffgjson");
    console.log(url);
  } else {
    aoiSplit != "" ?
      (url +=
        "tiffgjson?ymin=" +
        aoiSplit[2] +
        "&ymax=" +
        aoiSplit[3] +
        "&xmin=" +
        aoiSplit[0] +
        "&xmax=" +
        aoiSplit[1] +
        "&alg=" +
        algorithm) :
      (url += "tiffgjson" + "?alg=" + algorithm);
    console.log(url);
  }



  request(url, {
    json: true
  }, (err, res2, body) => {
    if (err) {
      return console.log(err);
    }
    res.render("ergebnisseite", {
      title: "Ergebnisseite"
    });
  });

  //res.render("ergebnisseite", { title: "Ergebnisseite", ueblink: "http://172.17.0.1:8000/tiffgjson" })

});

// Zurück zur Anwendungsseite und im optimalfall mergen der beiden geojson FeatureCollections
router.post("/mergegeojson", (req, res, next) => {
  drawnpolygons = req.body.polygons
  console.log(drawnpolygons)

  fs.writeFile('mydockerdata/drawnpolygonsformerge.geojson', drawnpolygons, (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
  });

  fs.stat('mydockerdata/usertrainingspolygonegpkg.geojson', function (err, stat) {
    if (err == null) {
      console.log('File exists: usertrainingspolygonegpkg.geojson');
      var mergedStream = geojsonMerge.mergeFeatureCollectionStream([
        'mydockerdata/usertrainingspolygonegpkg.geojson',
        'mydockerdata/drawnpolygonsformerge.geojson'
      ]);
  
      var writeStream = fs.createWriteStream('mydockerdata/mergedgeojsonfile.geojson');
  
      mergedStream.pipe(writeStream);
  
      writeStream.on('finish', function () {
        console.log('The merged file has been saved!');
        var file = 'mydockerdata/mergedgeojsonfile.geojson';
        res.download(file);
      });
    } else if (err.code === 'ENOENT') {
      console.log('File does not exists: usertrainingspolygonegpkg.geojson');
      fs.stat('mydockerdata/usertrainingspolygonegjson.geojson', function (err, stat) {
        if (err == null) {
          console.log('File exists: usertrainingspolygonegjson.geojson');
          var mergedStream = geojsonMerge.mergeFeatureCollectionStream([
            'mydockerdata/usertrainingspolygonegjson.geojson',
            'mydockerdata/drawnpolygonsformerge.geojson'
          ]);
      
          var writeStream = fs.createWriteStream('mydockerdata/mergedgeojsonfile.geojson');
      
          mergedStream.pipe(writeStream);
      
          writeStream.on('finish', function () {
            console.log('The merged file has been saved!');
            var file = 'mydockerdata/mergedgeojsonfile.geojson';
            res.download(file);
          });
        } else if (err.code === 'ENOENT') {
          console.log('File does not exists: usertrainingspolygonegjson.geojson');
          console.log('Error: Both files do not exists');
        } else {
          console.log('Error:', err.code);
        }
      });
    } else {
      console.log('Error:', err.code);
    }
  });
});


module.exports = router;