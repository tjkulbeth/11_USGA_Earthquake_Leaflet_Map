// Create Map base layer
// Draw center of map
const myMap = L.map("map", {
    center: [37.47, -18.16],
    zoom: 3
    // layers: [geoMap, geoLayer]
});

// Build base map layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.light",
        accessToken: API_KEY
    }).addTo(myMap);

// Define a markerSize function that will give each city a different radius based on its population
function markerSize(magnitude) {
    // console.log(magnitude*8);
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
        // console.log(geoInfo);
        // geoMarkers = []
        
        geoInfo.forEach(data => {
            const location = data.geometry
            coord = [location.coordinates[1], location.coordinates[0]]
            const quakeDate = new Date(data.properties.time)
            // geoMarkers.push (
                L.circleMarker(coord, {
                    fillOpacity: 0.75,
                    color: "black",
                    fillColor: getColor(data.properties.mag),
                    weight: 1,
                    // radius: 500
                    radius: markerSize(data.properties.mag)
                })
                .bindPopup(`<h1>${data.properties.mag} Magnitude Earthquake</h1><hr><h3>Timestamp: ${quakeDate}</h3><hr><h3>Location: ${data.properties.place}</h3><hr><h3><a href="${data.properties.url}">Click for more information</a></h3>`)
                .addTo(myMap); 
        });

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

       
         