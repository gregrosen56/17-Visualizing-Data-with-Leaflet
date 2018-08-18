// Magnitude 1.0+ earthquakes from the past day, and tectonic plate geoJSON string
var quakeUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

d3.json(quakeUrl, function(data) {
    createFeatures(data.features);
  });

function getColor(d) {
  return d > 5 ? "red":
         d > 4 ? "orange":
         d > 3 ? "yellow":
         d > 2 ? "green":
         d > 1 ? "blue":
         d > 0 ? "lightblue":
                 "lightblue";
};

function createFeatures(quakeUrl) {

  // variables for quicker customization of marker appearance
  var weight = 1;
  var color = "black";
  var fillOpacity = .6;
  var radiusMultiplier = 4.0;

  var earthquakes = L.geoJson(quakeUrl, {
		  pointToLayer: function (feature, latlng) {
        // Add popup to each marker
		    	var popupOptions = { maxWith: 200 };
            var popupContent = "<h4>Earthquake of magnitude " + feature.properties.mag 
            + " occurred<br>" + feature.properties.place 
            + " on<br>" + new Date(feature.properties.time) + "</h4>";
        // Customize circle markers based on earthquake magnitude
		    function getOptions(properties) {
		      if (properties.mag < 1.0) {
		        return {
		          radius: properties.mag*radiusMultiplier,
              color: color,
              weight: weight,
              fillColor: getColor(feature.properties.mag),
              fillOpacity: fillOpacity
            };
		      } else {
		        return {
		          radius: properties.mag*radiusMultiplier,
              color: color,
              weight: weight,
              fillColor: getColor(feature.properties.mag),
              fillOpacity: fillOpacity
		        };
		      }
		    }
		    return L.circleMarker(latlng, getOptions(feature.properties)).bindPopup(popupContent, popupOptions);
		  }
		});
    
  createMap(earthquakes);
}

// Create the map
function createMap(earthquakes) {

    // Define different map layers
    var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.streets",
      accessToken: API_KEY
    });
    var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.light",
      accessToken: API_KEY
    });
    var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.dark",
      accessToken: API_KEY
    });

    // Add Legend
    var legend = L.control({ position: "bottomleft" });

    legend.onAdd = function (map) {

      var div = L.DomUtil.create('div', 'info legend'),
          grades = [0, 1, 2, 3, 4, 5]
      ;

      for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
              '<strong><i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
              grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+') + '</strong>';
      }

      return div;
  };
    
    // Set base map templates to allow toggling between
    var baseMaps = {
      "Dark Map": darkmap,
      "Light Map": lightmap,
      "Street Map": streetmap
    };
  
    // Set earthquakes as overlay
    var overlayMaps = {
      "Earthquakes": earthquakes
    };
  
    // Set starting condition of map
    var myMap = L.map("map", {
      center: [37.09, -106.71],
      zoom: 4,
      layers: [darkmap, earthquakes]
    });

    // Add control options
    L.control.layers(baseMaps, overlayMaps, {
      position: "topright",
      collapsed: false
    }).addTo(myMap);
    legend.addTo(myMap);
  
};
    
;