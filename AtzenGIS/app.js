// required dependencies and libaries
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const fs = require("fs");
const http = require("http");
const multer = require("multer");
const decompress = require("decompress");
var geojsonMerge = require('@mapbox/geojson-merge');
var cors = require("cors");
const archiver = require("archiver");
var request = require("request");
var app = express();

app.post(
    "/zurueck",
    (req, res) => {
        res.render("demo", {
            title: "Anwendungsseite"
        });
    }
);

app.post(
    "/erneut",
    (req, res) => {
        res.render("demoergebnis", {
            title: "Demorgebnisseite"
        });
    }
);

// error handler
const handleError = (err, res) => {
    res
        .status(500)
        .contentType("text/plain")
        .end("Oops! Something went wrong!");
};

// Upload handling for all our used Data using Multer and fs:
// Source: https://stackoverflow.com/questions/15772394/how-to-upload-display-and-save-images-using-node-js-and-express
// Source: https://github.com/expressjs/multer#limits

const upload = multer({
    dest: "mydockerdata"
});



app.post(
  "/uploadsentinel",
  upload.single("file"),
  (req, res) => {
    const tempPath = req.file.path;
    const targetPath = path.join(__dirname, "mydockerdata/usersentineldata.tif");

    if (path.extname(req.file.originalname).toLowerCase() === ".tif") {
      fs.rename(tempPath, targetPath, (err) => {
        if (err) return handleError(err, res);
        res.status(200).send();
      });
    } else {
      fs.unlink(tempPath, (err) => {
        if (err) return handleError(err, res);
        res.status(403).send();
      });
    }
  }
);

// Uploading data handler for all trainingsdata 
app.post(
    "/uploadtrainingsdata",
    upload.single("file"),
    (req, res) => {
        const tempPath = req.file.path;
        const targetPathgpkg = path.join(__dirname, "mydockerdata/usertrainingspolygonegpkg.gpkg");
        const targetPathgjson = path.join(__dirname, "mydockerdata/usertrainingspolygonegjson.geojson");
        const targetPathshp = path.join(__dirname, "mydockerdata/usertrainingsdatashp.zip");

        if (path.extname(req.file.originalname).toLowerCase() === ".gpkg") {
            fs.rename(tempPath, targetPathgpkg, err => {
                if (err) return handleError(err, res);

                res.status(200).send();
            });
            request(
                "http://172.17.0.1:8000/gpkgtogjson", {
                    json: true
                },
                (err, res2, body) => {
                    if (err) {
                        return console.log(err);
                    }
                })
        } else if (path.extname(req.file.originalname).toLowerCase() === ".geojson") {
            fs.rename(tempPath, targetPathgjson, err => {
                if (err) return handleError(err, res);

                res.status(200).send();
            });
        } else if (path.extname(req.file.originalname).toLowerCase() === ".zip") {
            fs.rename(tempPath, targetPathshp, err => {
                if (err) return handleError(err, res);

                res.status(200).send();
            });
        }
        else {
            fs.unlink(tempPath, err => {
                if (err) return handleError(err, res);

                res.status(403).send();
            });
        }
    }
);


// Uploading data handler for trained model
app.post(
    "/uploadmodel",
    upload.single("file"),
    (req, res) => {
        const tempPath = req.file.path;
        const targetPath = path.join(__dirname, "mydockerdata/usertrainedmodel.rds");

        if (path.extname(req.file.originalname).toLowerCase() === ".rds") {
        fs.rename(tempPath, targetPath, err => {
            if (err) return handleError(err, res);

            res.status(200).send();
        });
    } else {
        fs.unlink(tempPath, err => {
            if (err) return handleError(err, res);

            res.status(403).send();
        });
        }
    }
);


// download route for shapefile as zip folder
app.get("/downloadtrainingsdatashp", (req, res) => {
    const file = path.join(__dirname, "mydockerdata/usertrainingsdatashp.zip");
    res.download(file, "uploadedtrainingsdatashp.zip");
});

// download route for all data as zip folder
app.get("/downloadmydockerdata", (req, res) => {
    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", "attachment; filename=mydockerdata.zip");

    const archive = archiver("zip", {
        zlib: { level: 9 }
    });

    archive.pipe(res);
    archive.directory("mydockerdata/", false);
    archive.finalize();
});


// app.js route configurations
app.post("/anwendungsseite", function (req, res, next) {
    res.render("anwendungsseite", {
        title: "Anwendungsseite"
    });
});

var startRouter = require("./routes/start");
app.use("/", startRouter);
//var ergebnisseiteRouter = require("../ergebnisseite");
var anwendungsseiteRouter = require("./routes/anwendungsseite");
var impressumRouter = require("./routes/impressum");
var demoRouter = require("./routes/demo");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "mydockerdata")));



app.use("/anwendungsseite", anwendungsseiteRouter);
app.use("/impressum", impressumRouter);
app.use("/demo", demoRouter);



// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});


app.use(cors());
module.exports = app;