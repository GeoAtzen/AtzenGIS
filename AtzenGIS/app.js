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
var request = require("request");


var app = express();

// error handler
const handleError = (err, res) => {
    res
        .status(500)
        .contentType("text/plain")
        .end("Oops! Something went wrong!");
};

const upload = multer({
    dest: "mydockerdata"
    // you might also want to set some limits: https://github.com/expressjs/multer#limits
});

app.post(
    "/zurueck",
    (req, res) => {
        res.render("anwendungsseite", {
            title: "Anwendungsseite"
        });
    }
);

app.post(
    "/uploadsentinel",
    upload.single("file"),
    (req, res) => {

        const tempPath = req.file.path;
        const targetPath = path.join(__dirname, "mydockerdata/usersentineldata.tif");

        if (path.extname(req.file.originalname).toLowerCase() === ".tif") {
            fs.rename(tempPath, targetPath, err => {
                if (err) return handleError(err, res);

                res
                    .status(200)
                    .render("fileupload", {
                        title: "Fileupload"
                    });

            });
        } else {
            fs.unlink(tempPath, err => {
                if (err) return handleError(err, res);

                res
                    .status(403)
                    .render("fileuploaderror", {
                        title: "Uploadfehler"
                    });

            });
        }
    }
);

// Uploading data handler for trainingsdata here
app.post(
    "/uploadtrainingsdata",
    upload.single("file"),
    (req, res) => {
        const tempPath = req.file.path;
        const targetPathgpkg = path.join(__dirname, "mydockerdata/usertrainingspolygonegpkg.gpkg");
        const targetPathgjson = path.join(__dirname, "mydockerdata/usertrainingspolygonegjson.geojson");

        if (path.extname(req.file.originalname).toLowerCase() === ".gpkg") {
            fs.rename(tempPath, targetPathgpkg, err => {
                if (err) return handleError(err, res);

                res
                    .status(200)
                    .render("fileupload", {
                        title: "Fileupload"
                    })
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

                res
                    .status(200)
                    .render("fileupload", {
                        title: "Fileupload"
                    })
            });
        } else {
            fs.unlink(tempPath, err => {
                if (err) return handleError(err, res);

                res
                    .status(403)
                    .render("fileuploaderror", {
                        title: "Uploadfehler"
                    });
            });
        }
    }
);

// Uploading data handler for trainingsdata as shapefile (.zip)
app.post(
    "/uploadtrainingsdatashp",
    upload.single("file"),
    (req, res) => {
        const tempPath = req.file.path;
        const targetPath = path.join(__dirname, "mydockerdata/usertrainingsdatashp.zip");

        if (path.extname(req.file.originalname).toLowerCase() === ".zip") {
            fs.rename(tempPath, targetPath, err => {
                if (err) return handleError(err, res);

                res
                    .status(200)
                    .render("fileupload", {
                        title: "Fileupload"
                    })
            });
        } else {
            fs.unlink(tempPath, err => {
                if (err) return handleError(err, res);

                res
                    .status(403)
                    .render("fileuploaderror", {
                        title: "Uploadfehler"
                    });
            });
        }
    }
);


// Uploading data handler for trained model here
app.post(
    "/uploadmodel",
    upload.single("file"),
    (req, res) => {
        const tempPath = req.file.path;
        const targetPath = path.join(__dirname, "mydockerdata/usertrainedmodel.rds");

        if (path.extname(req.file.originalname).toLowerCase() === ".rds") {
            fs.rename(tempPath, targetPath, err => {
                if (err) return handleError(err, res);

                res
                    .status(200)
                    .render("fileupload", {
                        title: "Fileupload"
                    })
            });
        } else {
            fs.unlink(tempPath, err => {
                if (err) return handleError(err, res);

                res
                    .status(403)
                    .render("fileuploaderror", {
                        title: "Uploadfehler"
                    });
            });
        }
    }
);

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


//app.use("/ergebnisseite", ergebnisseiteRouter);
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