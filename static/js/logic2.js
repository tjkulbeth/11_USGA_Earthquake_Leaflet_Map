// Define arrays to hold created city and state markers
const geoMarkers = [];

// Loop through locations and create city and state markers
geoInfo.forEach(data => {
    const location = data.geometry
    coord = [location.coordinates[1], location.coordinates[0]]
    timeStamp = Date(data.properties.time)
    // console.log(timestamp);
    // geoMarkers.push (
        L.circleMarker(coord, {
            fillOpacity: 0.75,
            // Setting our circle's radius equal to the output of our markerSize function
            // This will make our marker's size proportionate to its population
            color: "black",
            fillColor: getColor(data.properties.mag),
            weight: 1,
            // radius: 500
            radius: markerSize(data.properties.mag)
        })
        .bindPopup(`<h1>${data.properties.mag} Magnitude Earthquake</h1><hr><h3>Timestamp: ${timeStamp}</h3><hr><h3>Location: ${data.properties.place}</h3><hr><h3><a href="${data.properties.url}">Click for more information</a></h3>`)
        .addTo(myMap); 
});

    // Setting the marker radius for the city by passing population into the markerSize function
    cityMarkers.push(
        L.circle(location.coordinates, {
        stroke: false,
        fillOpacity: 0.75,
        color: "purple",
        fillColor: "purple",
        radius: markerSize(location.city.population)
        })
    );
})

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
        id: "mapbox.outdoor",
        accessToken: API_KEY
    });

const quakeLayer = L.layerGroup(quakeMarkers);
const plateLayer = L.layerGroup(geoPlates);

// Create a baseMaps object
const baseMaps = {
    "Satellite Map": satellitemap,
    "Grayscale Map": lightmap,
    "Outdoor Map": outdoormap
};

// Create an overlay object
const overlayMaps = {
    "Earthquakes": quakeLayer,
    "Techtonic Plates": plateLayer
};

// Create Map base layer
// Draw center of map
const myMap = L.map("map", {
    center: [37.47, -18.16],
    zoom: 3
    layers: [satellitemap, quakeLayer, plateLayer]
});

L.control.layers(baseMaps, overlayMaps).addTo(myMap);


// Define a markerSize function that will give each city a different radius based on its population
function markerSize(magnitude) {
    // console.log(magnitude*8);
    return magnitude * 3;
  };

function getColor(d) {
    return d > 6? "#ff3300" :
    d > 5? "#ff5c00" :
    d > 4? "#ff8500" :
    d > 3? "#ffa300" :
    d > 2? "#ffc200" :
    d > 1? "#ffe000" :
    d > 0? "#ffff00" :
    ""
    };

// Pass our map layers into our layer control
// Add the layer control to the map
L.control.layers(baseMaps, overlayMaps).addTo(myMap);

// Perform an API call to the USGS geojson file and get geojson data
(
    async function(){
        let geoInfo = await d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_month.geojson");
        geoInfo = geoInfo.features
        let plateData = await d3.json("https://github.com/fraxen/tectonicplates/blob/master/GeoJSON/PB2002_plates.json")
        console.log(plateData)
        // console.log(geoInfo);
        // geoMarkers = []
        
        // geoInfo.forEach(data => {
        //     const location = data.geometry
        //     coord = [location.coordinates[1], location.coordinates[0]]
        //     timeStamp = Date(data.properties.time)
        //     // console.log(timestamp);
        //     // geoMarkers.push (
        //         L.circleMarker(coord, {
        //             fillOpacity: 0.75,
        //             // Setting our circle's radius equal to the output of our markerSize function
        //             // This will make our marker's size proportionate to its population
        //             color: "black",
        //             fillColor: getColor(data.properties.mag),
        //             weight: 1,
        //             // radius: 500
        //             radius: markerSize(data.properties.mag)
        //         })
        //         .bindPopup(`<h1>${data.properties.mag} Magnitude Earthquake</h1><hr><h3>Timestamp: ${timeStamp}</h3><hr><h3>Location: ${data.properties.place}</h3><hr><h3><a href="${data.properties.url}">Click for more information</a></h3>`)
        //         .addTo(myMap); 
        // });

        const legend = L.control({position: 'bottomright'});
        legend.onAdd = function() {
            const div = L.DomUtil.create('div', 'legend');
            const grades = ['0', '1', '2', '3', '4', '5', '6']
            // const colors = ['blue', 'green', '#fc4e2a', '#e31a1c', '#bd0026', '#7a0177']

        for (let i = 0; i < grades.length; i++){
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i]) + '"></i>' + grades[i] + (grades[i+1]?'&ndash;'+ grades[i+1]+'<br>': '+');
        }
        return div;
        }    
         legend.addTo(myMap);
        }
    
)()

       
         