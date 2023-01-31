var modal;
// various event handler
window.onclick = function(event) {
    if (event.target == modal) {
    modal.style.display = "none";
    }
    }

window.onload= function() {
    console.log('ist geladen');
    var anzeig = document.getElementById("puff5");
    anzeig.style.display = "none";
    var anzeig2 = document.getElementById("buttonAnzeig");
    anzeig2.style.display ="block";
}

// creating a leaflet map with OSM as baselayer and view set to Telgte
var map = L.map("demomap").setView([52, 7.8], 12);

var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);


var googlesat = L.tileLayer('https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}');

// drawcontrol variables
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

// adding drawControl
map.addLayer(drawnItems)
map.addControl(drawControl)


// adding the drawn rectangle to map via event
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

// adding the demo shapefile to the map with styling and popup for it's properties
var usershapefile = new L.Shapefile("http://localhost:3000/demoshape.zip", {
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

// adding the merged file to the map with styling and pop up for it's properties
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
}).addTo(map);

// add converted GeoPackage as GeoJSON to map with styling and popup for it's properties
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

// adding the merged file to the map with styling and pop up for it's properties
var geojsondata = new L.GeoJSON.AJAX("http://localhost:3000/demopolygonegjson.geojson", {
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

// adding the .tif via georaster plugin: 
// source: https://github.com/GeoTIFF/georaster and https://github.com/GeoTIFF/georaster-layer-for-leaflet
fetch("http://localhost:3000/demosentineldata.tif")
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

// adding the demo aoi to the map (no need for the data here technically since it is the demo)
const areaofinterestTextdemo = document.getElementById("aoibbdemo");
areaofinterestTextdemo.value = "";

var aoidemo;
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

map.on(L.Draw.Event.DRAWSTART, function (e) {
  if (aoidemo != null) {
    map.removeLayer(aoidemo);
    areaofinterestTextdemo.value = "";
  }
});

map.on("draw:deleted", function (e) {
  aoidemo = null;
  areaofinterestTextdemo.value = "";
});

// Layer Control
var baseMaps = {
    "OpenStreetMap": osm,
    "Google Satellite": googlesat
};

var overlayMaps = {
    "Geopackage": gpkgtogeojsondata,
    "Shapefile": usershapefile,
    "GeoJSON": geojsondata,
    "Merged": mergedgeojson,
};

var layerControl = L.control.layers(baseMaps, overlayMaps).addTo(map);