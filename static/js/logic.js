



//     // Setting the marker radius for the city by passing population into the markerSize function
//     cityMarkers.push(
//         L.circle(location.coordinates, {
//         stroke: false,
//         fillOpacity: 0.75,
//         color: "purple",
//         fillColor: "purple",
//         radius: markerSize(location.city.population)
//         })
//     );
// })

// Build base map layers
const satellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.satellite",
        accessToken: API_KEY
    });

const lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.light",
        accessToken: API_KEY
    });

const outdoormap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.outdoors",
        accessToken: API_KEY
    });

function buildMarkers(geoInfo){
    // quakeMarkers = []
    geoInfo.forEach(data => {
        const location = data.geometry
        coord = [location.coordinates[1], location.coordinates[0]]
        const quakeDate = new Date(data.properties.time)
        // quakeMarkers.push (
            L.circleMarker(coord, {
                fillOpacity: 0.75,
                color: "black",
                fillColor: getColor(data.properties.mag),
                weight: 1,
                // radius: 500
                radius: markerSize(data.properties.mag)
            })
            .bindPopup(`<h1>${data.properties.mag} Magnitude Earthquake</h1><hr><h3>Timestamp: ${quakeDate}</h3><hr><h3>Location: ${data.properties.place}</h3><hr><h3><a href="${data.properties.url}">Click for more information</a></h3>`)
            .addTo(layers.earthquakeLayer)
    });
};

function buildPlates(plateData){
    L.geoJson(plateData, {
        color: 'gray',
        weight: 2.5,
        opacity: .5

    }).addTo(layers.tectonicPlateLayer)
}

// Create a baseMaps object
const baseMaps = {
    "Satellite Map": satellitemap,
    "Grayscale Map": lightmap,
    "Outdoor Map": outdoormap
};

const layers = {
    earthquakeLayer: new L.layerGroup(),
    tectonicPlateLayer: new L.layerGroup()
};

// Create an overlay object
const overlayMaps = {
    'Earthquakes': layers.earthquakeLayer,
    'Tectonic Plates': layers.tectonicPlateLayer
};

// Create Map base layer
// Draw center of map
const myMap = L.map("map", {
    center: [37.47, -18.16],
    zoom: 3,
    layers: [
        satellitemap,
        layers.earthquakeLayer,
        layers.tectonicPlateLayer
    ]
});

// Pass our map layers into our layer control
// Add the layer control to the map
L.control.layers(baseMaps, overlayMaps).addTo(myMap);


// Define a markerSize function that will give each city a different radius based on its population
function markerSize(magnitude) {
    return magnitude * 3;
  };

  function getColor(d) {
    return d > 5? "#ff0000" :
    d > 4? "#ff3300" :
    d > 3? "#ff5900" :
    d > 2? "#ff8000" :
    d > 1? "#ffb200" :
    d > 0? "#ffe600" :
    "#ffff00"
    };

// Perform an API call to the USGS geojson file and get geojson data
(
    async function(){
        let geoInfo = await d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_month.geojson");
        geoInfo = geoInfo.features
        buildMarkers(geoInfo)
        let plateData = await d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json")
        buildPlates(plateData)
       
        
        // geoInfo.forEach(data => {
        //     const location = data.geometry
        //     coord = [location.coordinates[1], location.coordinates[0]]
        //     const quakeDate = new Date(data.properties.time)
        //     // geoMarkers.push (
        //         L.circleMarker(coord, {
        //             fillOpacity: 0.75,
        //             color: "black",
        //             fillColor: getColor(data.properties.mag),
        //             weight: 1,
        //             // radius: 500
        //             radius: markerSize(data.properties.mag)
        //         })
        //         .bindPopup(`<h1>${data.properties.mag} Magnitude Earthquake</h1><hr><h3>Timestamp: ${quakeDate}</h3><hr><h3>Location: ${data.properties.place}</h3><hr><h3><a href="${data.properties.url}">Click for more information</a></h3>`)
        //         .addTo(myMap); 
        // });

        const legend = L.control({position: 'bottomright'});
        legend.onAdd = function() {
            const div = L.DomUtil.create('div', 'legend');
            const grades = ['0', '1', '2', '3', '4', '5']

        for (let i = 0; i < grades.length; i++){
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i]) + '"></i>' + grades[i] + (grades[i+1]?'&ndash;'+ grades[i+1]+'<br>': '+');
        }
        return div;
        }    
        legend.addTo(myMap);
    }
    
)()

       
         