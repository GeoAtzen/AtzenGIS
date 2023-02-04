/**
Function to create a leaflet map with OpenStreetMap as the base layer and set the default view to [52, 7.8] at zoom level 12.
@type {L.Map}
*/
var map = L.map("ergebnismap").setView([52, 7.8], 12);

/**
Function to create an instance of OpenStreetMap tile layer.
@type {L.TileLayer}
*/
var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap',
    maxZoom: 19,
}).addTo(map);

/**
Function to create an instance of Google satellite tile layer.
@type {L.TileLayer}
*/
var googlesat = L.tileLayer('https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}');

/**
Function to add DrawControl to the map.
@type {L.FeatureGroup}
*/
var drawnItems = new L.FeatureGroup()
map.addLayer(drawnItems)

var drawControl = new L.Control.Draw({
    draw: {
        marker: false,
        circle: false,
        polyline: false,
        circlemarker: false,
        rectangle: true,
        poylgon: true,
    },
    edit: {
        featureGroup: drawnItems
    }
})

// adding drawControl
map.addControl(drawControl)

// assigning a label to the drawn Polygon via prompt
var getLabel = function (layer) {
    var Label = prompt("Label des Polygons", "Label");
    return Label;
};

// assigning a ClassID to the drawn Polygon via prompt
var getclassID = function (layer) {
    var ClassID = prompt("ClassID des Polygons", "ClassID");
    return ClassID;
};

// Global array to store the drawn polygons as GeoJSON
var polygonsgeojson = [];

/** 
Declaring your own features for the drawn polygon to store them in the geojson
@author https://stackoverflow.com/questions/29736345/adding-properties-to-a-leaflet-layer-that-will-become-geojson-options
*/
document.addEventListener('DOMContentLoaded', function () {
    // only add the label and classid when the polygon option is chosen
    map.on(L.Draw.Event.CREATED, function (e) {
        var type = e.layerType
        var layer = e.layer
        if (type === 'polygon') {
            feature = layer.feature = layer.feature || {};
            feature.type = feature.type || "Feature";

            var Label = getLabel(layer);
            var ClassID = getclassID(layer);
            // assining the attributes entered in the prompt to be the features of the geojson
            var props = (feature.properties = feature.properties || {});
            props.Label = Label;
            props.ClassID = ClassID;
        } else {
            // Do not show the label and classID prompt for rectangle
        }
        // adding the drawn polygons to the layer
        drawnItems.addLayer(layer);

        if (Label == "Label") {
            layer.bindPopup("Kein Label angegeben");
        } else if (Label == "") {
            layer.bindPopup("Kein Label angegeben");
        } else {
            layer.bindPopup("Label: " + Label + "<br>" + "ClassID: " + ClassID).openPopup();
        }

        document.querySelector('#add-polygon-btn').addEventListener('click', function () {
            let newFeatureCollection = {
                type: 'FeatureCollection',
                features: []
            };
            let features = drawnItems.toGeoJSON().features;
            for (let i = 0; i < features.length; i++) {
                newFeatureCollection.features.push(features[i]);
            }
            document.querySelector('#polygons').innerHTML = JSON.stringify(newFeatureCollection);
            console.log("Selbstgezeichnete Polygone: ", document.querySelector('#polygons').innerHTML);
        });
    });
});


/**  
 * @function exportGeoJSON
 * @description Export drawn polygons to a valid GeoJSON File
 * Source: https://stackoverflow.com/questions/58126090/leaflet-draw-saving-data-with-geojson
 */
function exportGeoJSON() {

    // test GeoJSON validity by logging the data to the console for chacking it 
    console.log(drawnItems.toGeoJSON());
    console.log(JSON.stringify(drawnItems.toGeoJSON()));

    // save drawn Polygons as GeoJSON in drawnpolygonsjson
    let drawnpolygonsjson = JSON.stringify(drawnItems.toGeoJSON());

    // telling javascript to export drawnpolygonsjson as JSON format
    let dataUri =
        "data:text/json;charset=utf-8," + encodeURIComponent(drawnpolygonsjson /* geht nicht da invalides geojson + useruploadedgeojson */ );

    // declaring the export name
    let fileexportname = "digitalized_usertrainingspolygons" + ".geojson";

    // download via DOM
    let linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", fileexportname);

    // if polygon is empty give out error
    let emptypolygon = '{"type":"FeatureCollection","features":[]}';
    if (drawnpolygonsjson == emptypolygon) {
        alert("Sie haben noch keine Polygone gezeichnet!");
    } else {
        linkElement.click();
    }
}

/**
@function
Adds the draw function and updates the coordinates to the DOM element with id "aoibbgjson".
The updated value is given to server side javascript modules via body parser.
*/
const areaofinterestTextgjson = document.getElementById("aoibbgjson");
areaofinterestTextgjson.value = "";

var aoigjson;
map.on("draw:created", function (e) {
    var areaofinterestgjson = e.layer;
    aoigjson = [
        areaofinterestgjson._bounds._southWest.lng,
        areaofinterestgjson._bounds._northEast.lng,
        areaofinterestgjson._bounds._southWest.lat,
        areaofinterestgjson._bounds._northEast.lat,
    ];
    console.log(aoigjson);
    areaofinterestTextgjson.value = aoigjson;
    console.log(areaofinterestTextgjson.value);
});

map.on(L.Draw.Event.DRAWSTART, function (e) {
    if (aoigjson != null) {
        map.removeLayer(aoigjson);
        areaofinterestTextgjson.value = "";
    }
});

map.on("draw:deleted", function (e) {
    aoigjson = null;
    areaofinterestTextgjson.value = "";
});


/**
Adds the uploaded shapefile to the map with styling and a popup displaying its properties.
@param {L.Shapefile} usershapefile - the Shapefile layer to be added to the map
@param {String} http://localhost:3000/usertrainingsdatashp.zip - the URL for the shapefile
@param {Object} onEachFeature - a function that will be called on each feature in the layer,
displaying its properties in a popup
@param {Object} style - a function that styles the features based on the value of the "Label" property
*/
var usershapefile = new L.Shapefile("http://localhost:3000/usertrainingsdatashp.zip", {
    onEachFeature: function (feature, layer) {
        if (feature.properties) {
            layer.bindPopup(Object.keys(feature.properties).map(function (k) {
                return k + ": " + feature.properties[k];
            }).join("<br />"), {
                maxHeight: 200
            });
        }
    },
    style: function (feature) {
        switch (feature.properties.Label) {
            case "Acker":
                return {
                    color: "#d18b2c"
                };
            case "Acker_bepflanzt":
                return {
                    color: "#70843a"
                };
            case "Bahnschiene":
                return {
                    color: "#613232"
                };
            case "Baumgruppe":
                return {
                    color: "#18471e"
                };
            case "Binnengewaesser":
                return {
                    color: "#0a1cb1"
                };
            case "Industrie":
                return {
                    color: "#696969"
                };
            case "Innenstadt":
                return {
                    color: "#F5F5F5"
                };
            case "Kunstrasen":
                return {
                    color: "#92e597"
                };
            case "Laubwald":
                return {
                    color: "#03ad1d"
                };
            case "Mischwald":
                return {
                    color: "#11671e"
                };
            case "Parklandschaft":
                return {
                    color: "#92e597"
                };
            case "Siedlung":
                return {
                    color: "#B22222"
                };
            case "Strand":
                return {
                    color: "#ffff00"
                };
            case "Versiegelt":
                return {
                    color: "#141414"
                };
            case "Wiese":
                return {
                    color: "#00FF00"
                };
            default:
                return {
                    color: "#000000"
                };
        }
    },
}).addTo(map);


/**
Adds the uploaded geojson file to the map with styling and pop-up for its properties.
@constructor L.GeoJSON.AJAX
@param {string} url - The URL of the GeoJSON file.
@param {Object} options - The options for the GeoJSON layer.
@param {function} options.onEachFeature - A function that is called on each feature of the GeoJSON data.
@param {function} options.style - A function that returns the style for each feature based on its properties.
@property {string} url - The URL of the GeoJSON file.
@property {function} onEachFeature - A function that is called on each feature of the GeoJSON data.
@property {function} style - A function that returns the style for each feature based on its properties.
*/
var geojsondata = new L.GeoJSON.AJAX("http://localhost:3000/usertrainingspolygonegjson.geojson", {
    onEachFeature: function (feature, layer) {
        if (feature.properties) {
            layer.bindPopup(Object.keys(feature.properties).map(function (k) {
                return k + ": " + feature.properties[k];
            }).join("<br />"), {
                maxHeight: 200
            });
        }
    },
    style: function (feature) {
        switch (feature.properties.Label) {
            case "Acker":
                return {
                    color: "#d18b2c"
                };
            case "Acker_bepflanzt":
                return {
                    color: "#70843a"
                };
            case "Bahnschiene":
                return {
                    color: "#613232"
                };
            case "Baumgruppe":
                return {
                    color: "#18471e"
                };
            case "Binnengewaesser":
                return {
                    color: "#0a1cb1"
                };
            case "Industrie":
                return {
                    color: "#696969"
                };
            case "Innenstadt":
                return {
                    color: "#F5F5F5"
                };
            case "Kunstrasen":
                return {
                    color: "#92e597"
                };
            case "Laubwald":
                return {
                    color: "#03ad1d"
                };
            case "Mischwald":
                return {
                    color: "#11671e"
                };
            case "Parklandschaft":
                return {
                    color: "#92e597"
                };
            case "Siedlung":
                return {
                    color: "#B22222"
                };
            case "Strand":
                return {
                    color: "#ffff00"
                };
            case "Versiegelt":
                return {
                    color: "#141414"
                };
            case "Wiese":
                return {
                    color: "#00FF00"
                };
            default:
                return {
                    color: "#000000"
                };
        }
    },
}).addTo(map);

/**
Adds the converted GeoPackage as GeoJSON to the map with styling and pop-up for its properties.
@constructor L.GeoJSON.AJAX
@param {string} url - The URL of the GeoJSON file.
@param {Object} options - The options for the GeoJSON layer.
@param {function} options.onEachFeature - A function that is called on each feature of the GeoJSON data.
@param {function} options.style - A function that returns the style for each feature based on its properties.
@property {string} url - The URL of the GeoJSON file.
@property {function} onEachFeature - A function that is called on each feature of the GeoJSON data.
@property {function} style - A function that returns the style for each feature based on its properties.
*/
var gpkgtogeojsondata = new L.GeoJSON.AJAX("http://localhost:3000/usertrainingspolygonegpkg.geojson", {
    onEachFeature: function (feature, layer) {
        if (feature.properties) {
            layer.bindPopup(Object.keys(feature.properties).map(function (k) {
                return k + ": " + feature.properties[k];
            }).join("<br />"), {
                maxHeight: 200
            });
        }
    },
    style: function (feature) {
        switch (feature.properties.Label) {
            case "Acker":
                return {
                    color: "#d18b2c"
                };
            case "Acker_bepflanzt":
                return {
                    color: "#70843a"
                };
            case "Bahnschiene":
                return {
                    color: "#613232"
                };
            case "Baumgruppe":
                return {
                    color: "#18471e"
                };
            case "Binnengewaesser":
                return {
                    color: "#0a1cb1"
                };
            case "Industrie":
                return {
                    color: "#696969"
                };
            case "Innenstadt":
                return {
                    color: "#F5F5F5"
                };
            case "Kunstrasen":
                return {
                    color: "#92e597"
                };
            case "Laubwald":
                return {
                    color: "#03ad1d"
                };
            case "Mischwald":
                return {
                    color: "#11671e"
                };
            case "Parklandschaft":
                return {
                    color: "#92e597"
                };
            case "Siedlung":
                return {
                    color: "#B22222"
                };
            case "Strand":
                return {
                    color: "#ffff00"
                };
            case "Versiegelt":
                return {
                    color: "#141414"
                };
            case "Wiese":
                return {
                    color: "#00FF00"
                };
            default:
                return {
                    color: "#000000"
                };
        }
    },
}).addTo(map);

/**
Adds the merged GeoJSON file to the map with styling and a popup displaying its properties.
@param {L.GeoJSON.AJAX} mergedgeojson - the GeoJSON layer to be added to the map
@param {String} http://localhost:3000/mergedgeojsonfile.geojson - the URL for the GeoJSON file
@param {Object} onEachFeature - a function that will be called on each feature in the layer,
displaying its properties in a popup
@param {Object} style - a function that styles the features based on the value of the "Label" property
*/
var mergedgeojson = new L.GeoJSON.AJAX("http://localhost:3000/mergedgeojsonfile.geojson", {
    onEachFeature: function (feature, layer) {
        if (feature.properties) {
            layer.bindPopup(Object.keys(feature.properties).map(function (k) {
                return k + ": " + feature.properties[k];
            }).join("<br />"), {
                maxHeight: 200
            });
        }
    },
    style: function (feature) {
        switch (feature.properties.Label) {
            case "Acker":
                return {
                    color: "#d18b2c"
                };
            case "Acker_bepflanzt":
                return {
                    color: "#70843a"
                };
            case "Bahnschiene":
                return {
                    color: "#613232"
                };
            case "Baumgruppe":
                return {
                    color: "#18471e"
                };
            case "Binnengewaesser":
                return {
                    color: "#0a1cb1"
                };
            case "Industrie":
                return {
                    color: "#696969"
                };
            case "Innenstadt":
                return {
                    color: "#F5F5F5"
                };
            case "Kunstrasen":
                return {
                    color: "#92e597"
                };
            case "Laubwald":
                return {
                    color: "#03ad1d"
                };
            case "Mischwald":
                return {
                    color: "#11671e"
                };
            case "Parklandschaft":
                return {
                    color: "#92e597"
                };
            case "Siedlung":
                return {
                    color: "#B22222"
                };
            case "Strand":
                return {
                    color: "#ffff00"
                };
            case "Versiegelt":
                return {
                    color: "#141414"
                };
            case "Wiese":
                return {
                    color: "#00FF00"
                };
            default:
                return {
                    color: "#000000"
                };
        }
    },
}).addTo(map);


/**
Adds the uploaded sentinel .tif file via georaster plugin and displays it on the map.
The plugin is imported from the following sources:
@author - https://github.com/GeoTIFF/georaster 
@author - https://github.com/GeoTIFF/georaster-layer-for-leaflet
*/
fetch("http://localhost:3000/usersentineldata.tif")
    .then((response) => response.arrayBuffer())
    .then((arrayBuffer) => {
        parseGeoraster(arrayBuffer).then((georaster) => {
            console.log("georaster:", georaster);

            // https://github.com/GeoTIFF/georaster-layer-for-leaflet-example/blob/master/examples/separated.html#L45
            const pixelValuesToColorFn = ([red, green, blue]) => {
                let mins = georaster.mins;
                red = Math.round(
                    (255 / (4000 - mins[0])) * (red - mins[0])
                );
                green = Math.round(
                    (255 / (4000 - mins[1])) * (green - mins[1])
                );
                blue = Math.round(
                    (255 / (4000 - mins[2])) * (blue - mins[2])
                );

                // make sure no values exceed 255
                red = Math.min(red, 255);
                green = Math.min(green, 255);
                blue = Math.min(blue, 255);

                // treat all black as no data
                if (red === 0 && green === 0 && blue === 0) return null;

                return `rgb(${blue}, ${green}, ${red})`;
            };

            var geotiffdata = new GeoRasterLayer({
                georaster: georaster,
                pixelValuesToColorFn,
                resolution: 512,
            });
            // direktes hinzufügen zur Karte
            geotiffdata.addTo(map);

            map.fitBounds(geotiffdata.getBounds());

            // Asynchrones hinzufügen des Layer zur Layerkontrollfunktion von Leaflet
            layerControl.addOverlay(geotiffdata, 'Satelliten Bild');
        });
    });

/**
 * Loads the prediction .tif file via georaster plugin. The file is fetched from the localhost and 
 * parsed using the parseGeoraster method. The parsed data is then used to create a new GeoRasterLayer 
 * object, which is added to the map and to the layer control function of Leaflet. The map is then 
 * fitted to the bounds of the prediction data. The legend of the prediction data is fetched and 
 * added to the HTML using the jQuery library.
 * 
 * @author (Source) GeoTIFF and GeoTIFF/georaster-layer-for-leaflet (https://github.com/GeoTIFF/georaster and 
 * https://github.com/GeoTIFF/georaster-layer-for-leaflet)
 */
function loadprediction() {
    fetch("http://localhost:3000/prediction.tif")
        .then((response) => response.arrayBuffer())
        .then((arrayBuffer) => {
            parseGeoraster(arrayBuffer).then((georaster) => {
                console.log("georaster:", georaster);

                var predictiongeotiffdata = new GeoRasterLayer({
                    georaster: georaster,
                    //pixelValuesToColorFn,
                    resolution: 512
                });
                // direktes hinzufügen zur Karte
                predictiongeotiffdata.addTo(map);

                map.fitBounds(predictiongeotiffdata.getBounds());

                // Asynchrones hinzufügen des Layer zur Layerkontrollfunktion von Leaflet
                layerControl.addOverlay(predictiongeotiffdata, 'Prediction');
            });
        });
    
    // creating a legend object
    var legend = L.control({
        position: 'topright'
    });

    // adding the legend to the map with the wanted styles
    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'prediction legend');
        div.innerHTML = '<img src="http://localhost:3000/predictionlegende.png"/>';

        div.childNodes[0].style.width = "200px";
        div.childNodes[0].style.height = "400px";
        div.childNodes[0].style.objectFit = "none";
        div.childNodes[0].style.objectPosition = "center center";
        div.childNodes[0].style.opacity = 0.75;
        return div;
    };
    legend.addTo(map);
}

/**
 * Loads the aoa .tif file via georaster plugin. The file is fetched from the localhost and 
 * parsed using the parseGeoraster method. The parsed data is then used to create a new GeoRasterLayer 
 * object, which is added to the map and to the layer control function of Leaflet. The map is then 
 * fitted to the bounds of the apa data.
 * 
 * @author (Source) GeoTIFF and GeoTIFF/georaster-layer-for-leaflet (https://github.com/GeoTIFF/georaster and 
 * https://github.com/GeoTIFF/georaster-layer-for-leaflet)
 */
function loadaoa() {
    fetch("http://localhost:3000/aoa.tif")
        .then((response) => response.arrayBuffer())
        .then((arrayBuffer) => {
            parseGeoraster(arrayBuffer).then((georaster) => {
                console.log("georaster:", georaster);

                var aoageotiffdata = new GeoRasterLayer({
                    georaster: georaster,
                    //pixelValuesToColorFn,
                    resolution: 512
                });
                // direktes hinzufügen zur Karte
                aoageotiffdata.addTo(map);

                map.fitBounds(aoageotiffdata.getBounds());

                // Asynchrones hinzufügen des Layer zur Layerkontrollfunktion von Leaflet
                layerControl.addOverlay(aoageotiffdata, 'AOA');
            });
        });
}

/**
Loads the sampling locations to the map from a shapefile.
The shapefile is specified by its URL: "http://localhost:3000/samples".
*/
var samplingshp = new L.Shapefile("http://localhost:3000/samples", {
    onEachFeature: function (feature, layer) {
        layer.bindPopup("Hier im Optimalfall neue trainingspolygone zeichnen!");
    },
    style: function (feature) {
        switch (feature.properties.DI) {
            case "1":
                return {
                    color: "#714F84"
                };
            default:
                return {
                    color: "#000000"
                };
        }
    },
});

/**
Object literal to store the base maps available for the map.
Contains two key-value pairs, where the key is the name of the base map and the value is the corresponding map layer. 
@constant
@type {Object}
@property {L.TileLayer} "OpenStreetMap" - The OpenStreetMap base layer.
@property {L.TileLayer} "Google Satellite" - The Google Satellite base layer.
*/
var baseMaps = {
    "OpenStreetMap": osm,
    "Google Satellite": googlesat
};

/**
Object literal to store the overlay maps for the map.
Contains two key-value pairs, where the key is the name of the base map and the value is the corresponding map layer.
@constant
@type {Object}
@property {L.TileLayer} "OpenStreetMap" - The OpenStreetMap base layer.
@property {L.TileLayer} "Google Satellite" - The Google Satellite base layer.
*/
var overlayMaps = {
    "Sampling Locations": samplingshp,
    "Geopackage": gpkgtogeojsondata,
    "Shapefile": usershapefile,
    "GeoJSON": geojsondata,
    "Eigene Polygone": drawnItems,
    "zusammengefügt": mergedgeojson
};

/**
 * Handles the layer control for the map
 *
 * @type {L.Control.Layers} layerControl
 * @property {Object} baseMaps - Object that contains the base map layers.
 * @property {L.TileLayer} baseMaps.OpenStreetMap - The OpenStreetMap layer.
 * @property {L.TileLayer} baseMaps.Google Satellite - The Google Satellite layer.
 * @property {Object} overlayMaps - Object that contains the overlay map layers.
 * @property {L.GeoJSON} overlayMaps.Geopackage - The GeoJSON representation of the geopackage data.
 * @property {L.GeoJSON} overlayMaps.Shapefile - The GeoJSON representation of the shapefile data.
 * @property {L.GeoJSON} overlayMaps.GeoJSON - The GeoJSON data.
 * @property {L.GeoJSON} overlayMaps.Merged - The merged GeoJSON data.
 */
var layerControl = L.control.layers(baseMaps, overlayMaps).addTo(map);