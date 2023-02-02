var modal; // Variable for storing the Modal currently open

/**
onClick function to hide the modal when clicking outside of the modal window.
@param {Event} event - The event object associated with the click event.
*/
window.onclick = function(event) {
    if (event.target == modal) {
    modal.style.display = "none";
    }
    }

/**
onLoad function to hide a display element and show another display element after the page has loaded.
Also logs a message to the console to indicate that the page has loaded.
*/

window.onload= function() {
    console.log('ist geladen');
    var anzeig = document.getElementById("puff5");
    anzeig.style.display = "none";
    var anzeig2 = document.getElementById("buttonAnzeig");
    anzeig2.style.display ="block";
}

/**
Function to create a leaflet map with OpenStreetMap as the base layer and set the default view to [52, 7.8] at zoom level 12.
@type {L.Map}
*/
var map = L.map("demomap").setView([52, 7.8], 12);

/**
Function to create an instance of OpenStreetMap tile layer.
@type {L.TileLayer}
*/
var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
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
var drawControl = new L.Control.Draw({
    draw: {
        marker: false,
        circle: false,
        polyline: false,
        circlemarker: false,
        polygon: false
    },
    edit: {
        featureGroup: drawnItems
    }
})

/**
Adding the drawnItems instance to the map and adding the drawControl to the map.
*/
map.addLayer(drawnItems)
map.addControl(drawControl)


/**
Event handler to add the drawn rectangle to the map and store its coordinates.
Also adds the ability to delete the drawn features from the map.
*/
map.on(L.Draw.Event.CREATED, (e) => {
    var type = e.layerType;
    var layer = e.layer;
    rectangle = layer.toGeoJSON().geometry.coordinates;
    console.log(rectangle)
    drawnItems.addLayer(layer);
    map.addLayer(layer);

    map.on("draw:deleted", function(e) {
        map.removeControl(drawControl);
        map.addControl(drawControl);
    });
})

/**
Adds the uploaded shapefile to the map with styling and a popup displaying its properties.
@param {L.Shapefile} usershapefile - the Shapefile layer to be added to the map
@param {String} http://localhost:3000/usertrainingsdatashp.zip - the URL for the shapefile
@param {Object} onEachFeature - a function that will be called on each feature in the layer,
displaying its properties in a popup
@param {Object} style - a function that styles the features based on the value of the "Label" property
*/
var usershapefile = new L.Shapefile("http://localhost:3000/demodaten/demoshape.zip", {
    onEachFeature: function(feature, layer) {
        if (feature.properties) {
            layer.bindPopup(Object.keys(feature.properties).map(function(k) {
                return k + ": " + feature.properties[k];
            }).join("<br />"), {
                maxHeight: 200
            });
        }
    },
    style: function(feature) {
        switch (feature.properties.Label) {
            case "Acker":
                return { color: "#d18b2c" };
            case "Acker_bepflanzt":
                return { color: "#70843a" };
            case "Bahnschiene":
                return { color: "#613232" };
            case "Baumgruppe":
                return { color: "#18471e" };
            case "Binnengewaesser":
                return { color: "#0a1cb1" };
            case "Industrie":
                return { color: "#696969" };
            case "Innenstadt":
                return { color: "#F5F5F5" };
            case "Kunstrasen":
                return { color: "#92e597" };
            case "Laubwald":
                return { color: "#03ad1d" };
            case "Mischwald":
                return { color: "#11671e" };
            case "Parklandschaft":
                return { color: "#92e597" };
            case "Siedlung":
                return { color: "#B22222" };
            case "Strand":
                return { color: "#ffff00" };
            case "Versiegelt":
                return { color: "#141414" };
            case "Wiese":
                return { color: "#00FF00" };
            default:
                return { color: "#000000" };
        }
    },
}).addTo(map);

/**
Adds the uploaded GeoJSON file to the map with styling and a popup displaying its properties.
@param {L.GeoJSON.AJAX} mergedgeojson - the GeoJSON layer to be added to the map
@param {String} http://localhost:3000/mergedgeojsonfile.geojson - the URL for the GeoJSON file
@param {Object} onEachFeature - a function that will be called on each feature in the layer,
displaying its properties in a popup
@param {Object} style - a function that styles the features based on the value of the "Label" property
*/
var mergedgeojson = new L.GeoJSON.AJAX("http://localhost:3000/mergedgeojsonfile.geojson", {
    onEachFeature: function(feature, layer) {
        if (feature.properties) {
            layer.bindPopup(Object.keys(feature.properties).map(function(k) {
                return k + ": " + feature.properties[k];
            }).join("<br />"), {
                maxHeight: 200
            });
        }
    },
    style: function(feature) {
        switch (feature.properties.Label) {
            case "Acker":
                return { color: "#d18b2c" };
            case "Acker_bepflanzt":
                return { color: "#70843a" };
            case "Bahnschiene":
                return { color: "#613232" };
            case "Baumgruppe":
                return { color: "#18471e" };
            case "Binnengewaesser":
                return { color: "#0a1cb1" };
            case "Industrie":
                return { color: "#696969" };
            case "Innenstadt":
                return { color: "#F5F5F5" };
            case "Kunstrasen":
                return { color: "#92e597" };
            case "Laubwald":
                return { color: "#03ad1d" };
            case "Mischwald":
                return { color: "#11671e" };
            case "Parklandschaft":
                return { color: "#92e597" };
            case "Siedlung":
                return { color: "#B22222" };
            case "Strand":
                return { color: "#ffff00" };
            case "Versiegelt":
                return { color: "#141414" };
            case "Wiese":
                return { color: "#00FF00" };
            default:
                return { color: "#000000" };
        }
    },
});

/* add converted GeoPackage as GeoJSON to map with styling and popup for it's properties
var gpkgtogeojsondata = new L.GeoJSON.AJAX("http://localhost:3000/demopolygonegpkg.geojson", {
    onEachFeature: function(feature, layer) {
        if (feature.properties) {
            layer.bindPopup(Object.keys(feature.properties).map(function(k) {
                return k + ": " + feature.properties[k];
            }).join("<br />"), {
                maxHeight: 200
            });
        }
    },
    style: function(feature) {
        switch (feature.properties.Label) {
            case "Acker":
                return { color: "#d18b2c" };
            case "Acker_bepflanzt":
                return { color: "#70843a" };
            case "Bahnschiene":
                return { color: "#613232" };
            case "Baumgruppe":
                return { color: "#18471e" };
            case "Binnengewaesser":
                return { color: "#0a1cb1" };
            case "Industrie":
                return { color: "#696969" };
            case "Innenstadt":
                return { color: "#F5F5F5" };
            case "Kunstrasen":
                return { color: "#92e597" };
            case "Laubwald":
                return { color: "#03ad1d" };
            case "Mischwald":
                return { color: "#11671e" };
            case "Parklandschaft":
                return { color: "#92e597" };
            case "Siedlung":
                return { color: "#B22222" };
            case "Strand":
                return { color: "#ffff00" };
            case "Versiegelt":
                return { color: "#141414" };
            case "Wiese":
                return { color: "#00FF00" };
            default:
                return { color: "#000000" };
        }
    },
}).addTo(map);
*/

/**
Adds the merged file to the map with styling and pop-up for its properties.
@constructor L.GeoJSON.AJAX
@param {string} url - The URL of the GeoJSON file.
@param {Object} options - The options for the GeoJSON layer.
@param {function} options.onEachFeature - A function that is called on each feature of the GeoJSON data.
@param {function} options.style - A function that returns the style for each feature based on its properties.
@property {string} url - The URL of the GeoJSON file.
@property {function} onEachFeature - A function that is called on each feature of the GeoJSON data.
@property {function} style - A function that returns the style for each feature based on its properties.
*/
var geojsondata = new L.GeoJSON.AJAX("http://localhost:3000/demodaten/demopolygonegjson.geojson", {
    onEachFeature: function(feature, layer) {
        if (feature.properties) {
            layer.bindPopup(Object.keys(feature.properties).map(function(k) {
                return k + ": " + feature.properties[k];
            }).join("<br />"), {
                maxHeight: 200
            });
        }
    },
    style: function(feature) {
        switch (feature.properties.Label) {
            case "Acker":
                return { color: "#d18b2c" };
            case "Acker_bepflanzt":
                return { color: "#70843a" };
            case "Bahnschiene":
                return { color: "#613232" };
            case "Baumgruppe":
                return { color: "#18471e" };
            case "Binnengewaesser":
                return { color: "#0a1cb1" };
            case "Industrie":
                return { color: "#696969" };
            case "Innenstadt":
                return { color: "#F5F5F5" };
            case "Kunstrasen":
                return { color: "#92e597" };
            case "Laubwald":
                return { color: "#03ad1d" };
            case "Mischwald":
                return { color: "#11671e" };
            case "Parklandschaft":
                return { color: "#92e597" };
            case "Siedlung":
                return { color: "#B22222" };
            case "Strand":
                return { color: "#ffff00" };
            case "Versiegelt":
                return { color: "#141414" };
            case "Wiese":
                return { color: "#00FF00" };
            default:
                return { color: "#000000" };
        }
    },
}).addTo(map);

/**
Adds the .tif file via georaster plugin and displays it on the map.
The plugin is imported from the following sources:
@author - https://github.com/GeoTIFF/georaster 
@author - https://github.com/GeoTIFF/georaster-layer-for-leaflet
*/
fetch("http://localhost:3000/demodaten/demosentineldata.tif")
    .then((response) => response.arrayBuffer())
    .then((arrayBuffer) => {
        parseGeoraster(arrayBuffer).then((georaster) => {
            console.log("georaster:", georaster);

            // source: https://github.com/GeoTIFF/georaster-layer-for-leaflet-example/blob/master/examples/separated.html#L45
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

            // adding the layer to layercontrol of the leaflet map asynchronous
            layerControl.addOverlay(geotiffdata, 'Satelliten Bild');
        });
    });

/**
@function
Adds the draw function and updates the coordinates to the DOM element with id "aoibbmdl".
The updated value is given to server side javascript modules via body parser.
*/
const areaofinterestTextdemo = document.getElementById("aoibbdemo");
areaofinterestTextdemo.value = "";

var aoidemo; // Variable for storing the drawn AOI

/**
Event listener for "draw:created" on the map object. This event is triggered when the user creates a new shape on the map. 
When this event is triggered, the coordinates of the new shape are retrieved and stored in the "aoishp" variable.
@event "draw:created"
@param {object} e - The event object passed to the listener.
*/
map.on("draw:created", function (e) {
  var areaofinterestdemo = e.layer;
  aoidemo = [
    areaofinterestdemo._bounds._southWest.lng,
    areaofinterestdemo._bounds._northEast.lng,
    areaofinterestdemo._bounds._southWest.lat,
    areaofinterestdemo._bounds._northEast.lat,
  ];
  console.log(aoidemo);
  areaofinterestTextdemo.value = aoidemo;
  console.log(areaofinterestTextdemo.value);
});

/**
Event listener for "L.Draw.Event.DRAWSTART" on the map object. This event is triggered when the user starts drawing a shape on the map.
If the "aoishp" variable is not null, the previously created shape is removed from the map and the value of the "areaofinterestTextshp" text field is set to an empty string.
@event "L.Draw.Event.DRAWSTART"
@param {object} e - The event object passed to the listener.
*/
map.on(L.Draw.Event.DRAWSTART, function (e) {
  if (aoidemo != null) {
    map.removeLayer(aoidemo);
    areaofinterestTextdemo.value = "";
  }
});

/**
Event listener for "draw:deleted" on the map object. This event is triggered when the user deletes a shape from the map.
When this event is triggered, the value of the "aoishp" variable is set to null and the value of the "areaofinterestTextshp" text field is set to an empty string.
@event "draw:deleted"
@param {object} e - The event object passed to the listener.
*/
map.on("draw:deleted", function (e) {
  aoidemo = null;
  areaofinterestTextdemo.value = "";
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
    "Shapefile": usershapefile,
    "GeoJSON": geojsondata,
    "Merged": mergedgeojson,
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