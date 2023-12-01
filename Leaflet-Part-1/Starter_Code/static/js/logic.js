
// Gathering data for the US from 11/23/2023  to 11/30/2023
let queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2023-11-23&endtime=2023-11-30&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";

let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

let myMap = L.map("map", {
    center: [37.09, -98.71],
    zoom: 5,
    layers: [street]

});

d3.json(queryUrl).then(function (data) {
    console.log(data),
    pointsinMap(data.features)

});


function pointsinMap(features) {
    let maxDepth = 0;

    for (let i = 0; i < features.length; i++) {
        let location = features[i].geometry.coordinates;
        let depth = features[i].geometry.coordinates[2];
        let magnitude = features[i].properties.mag;
        // if (depth > maxDepth){
        //     maxDepth = depth;
        // }

        if(location) {
            let circleFormats = {
            // the 5 below is the min value, this ensures that the circle is visible
                radius: Math.max(magnitude * 7, 5),
                color: circleColors(depth),
                fillOpacity: 0.8
            };

            L.circleMarker([location[1], location[0]], circleFormats).bindPopup(`Magnitude: ${magnitude} <br /> Depth: ${depth}`).addTo(myMap);
        }
    }

    let legend = L.control({ position: "bottomright" });
    legend.onAdd = function () {
        let div = L.DomUtil.create("div", "info legend");
        let limits = [10, 20, 30, 40];
        let colors = ['#71F92D', "#CAF92D", "#FAD000", "#FC9E04", "#FC5A04"];
        let labels = [];
        // let ranges = [];

        for (let i = 0; i < limits.length; i++) {
            labels.push(
        
        
            //     '<div><span class="legend-color" style="background-color:' + colors[i] + '"></span>' +
            // '<span class="legend-range">' + limits[i] + (limits[i + 1] ? '&ndash;' + limits[i + 1] : '+') + '</span></div>'
        
                "<li style=\"background-color: " + colors[i] + '">' +
                limits[i] + (limits[i + 1] ? '&ndash;' + limits[i + 1] + '<br>' : '+') + "</li>"
            );
    }   
        div.innerHTML = labels.join('');
        div.style.backgroundColor = "#fff";
        return div;
    };

    legend.addTo(myMap);
}

    function circleColors (depth){
        if (depth < 10) {
            return '#71F92D';
        } else if (depth < 20) {
                return "#CAF92D";
            } else if (depth < 30) {
                return "#FAD000";
            } else if (depth < 40) {
                return "#FC9E04";
        } else {return "#FC5A04";
        };
        }