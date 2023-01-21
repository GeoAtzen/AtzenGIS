var modal;

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
// erstellen einer leaflet Karte mit Europa als Startpunkt und mit OSM als Basiskarte
var map = L.map("anwendungsmap").setView([52, 7.8], 12);

var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);

var googlesat = L.tileLayer('https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}');

//drawcontrol variables
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


// Anzeigen der hochgeladenen Shapefile
var usershapefile = new L.Shapefile("http://localhost:3000/usertrainingsdatashp.zip", {
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

// Anzeigen des hochgeladenen geopackages
// Anmerkung: Layer MUSS layer1 heißen
var usergeopackage = new L.geoPackageFeatureLayer([], {
    geoPackageUrl: 'http://localhost:3000/usertrainingspolygonegpkg.gpkg',
    layerName: 'layer1',
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

// add GeoJSON to map
var geojsondata = new L.GeoJSON.AJAX("http://localhost:3000/usertrainingspolygonegjson.geojson", {
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

// hinzufügen des .tif via georaster plugin: https://github.com/GeoTIFF/georaster und https://github.com/GeoTIFF/georaster-layer-for-leaflet
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

// aoi modell
const areaofinterestTextmdl = document.getElementById("aoibbmdl");
areaofinterestTextmdl.value = "";

var aoimdl;
map.on("draw:created", function (e) {
  var areaofinterestmdl = e.layer;
  aoimdl = [
    areaofinterestmdl._bounds._southWest.lng,
    areaofinterestmdl._bounds._northEast.lng,
    areaofinterestmdl._bounds._southWest.lat,
    areaofinterestmdl._bounds._northEast.lat,
  ];
  console.log(aoimdl);
  areaofinterestTextmdl.value = aoimdl;
  console.log(areaofinterestTextmdl.value);
});

map.on(L.Draw.Event.DRAWSTART, function (e) {
  if (aoimdl != null) {
    map.removeLayer(aoimdl);
    areaofinterestTextmdl.value = "";
  }
});

map.on("draw:deleted", function (e) {
  aoimdl = null;
  areaofinterestTextmdl.value = "";
});

// aoi gpkg
const areaofinterestTextgpkg = document.getElementById("aoibbgpkg");
areaofinterestTextgpkg.value = "";

var aoigpkg;
map.on("draw:created", function (e) {
  var areaofinterestgpkg = e.layer;
  aoigpkg = [
    areaofinterestgpkg._bounds._southWest.lng,
    areaofinterestgpkg._bounds._northEast.lng,
    areaofinterestgpkg._bounds._southWest.lat,
    areaofinterestgpkg._bounds._northEast.lat,
  ];
  console.log(aoigpkg);
  areaofinterestTextgpkg.value = aoigpkg;
  console.log(areaofinterestTextgpkg.value);
});

map.on(L.Draw.Event.DRAWSTART, function (e) {
  if (aoigpkg != null) {
    map.removeLayer(aoigpkg);
    areaofinterestTextgpkg.value = "";
  }
});

map.on("draw:deleted", function (e) {
  aoigpkg = null;
  areaofinterestTextgpkg.value = "";
});

// aoi gjson
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

// aoi shp
const areaofinterestTextshp = document.getElementById("aoibbshp");
areaofinterestTextshp.value = "";

var aoishp;
map.on("draw:created", function (e) {
  var areaofinterestshp = e.layer;
  aoishp = [
    areaofinterestshp._bounds._southWest.lng,
    areaofinterestshp._bounds._northEast.lng,
    areaofinterestshp._bounds._southWest.lat,
    areaofinterestshp._bounds._northEast.lat,
  ];
  console.log(aoishp);
  areaofinterestTextshp.value = aoishp;
  console.log(areaofinterestTextshp.value);
});

map.on(L.Draw.Event.DRAWSTART, function (e) {
  if (aoishp != null) {
    map.removeLayer(aoishp);
    areaofinterestTextshp.value = "";
  }
});

map.on("draw:deleted", function (e) {
  aoishp = null;
  areaofinterestTextshp.value = "";
});

// Layer Control
var baseMaps = {
    "OpenStreetMap": osm,
    "Google Satellite": googlesat
};

var overlayMaps = {
    "Shapefile": usershapefile,
    "Geopackage": usergeopackage,
    "GeoJSON": geojsondata
};

var layerControl = L.control.layers(baseMaps, overlayMaps).addTo(map);

