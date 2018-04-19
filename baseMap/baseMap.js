"use strict";

//global variables:
var geojson;
var map;
// control that shows state info on hover
var info = L.control();

//Main
window.onload = function () {
    renderMainMap();
    showHide();
}

function renderMainMap() {

    map = L.map('map').setView([37.8, -96], 4);

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        maxZoom: 18,
        attribution:
            '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="http://mapbox.com">Mapbox</a>, ' +
            'Population data &copy; <a href="https://www.socialexplorer.com//">Social Explorer</a>',
        id: 'mapbox.light'
    }).addTo(map);

    geojson = L.geoJson(statesData, {
        style: style,
        onEachFeature: onEachFeature
    }).addTo(map);

    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 10, 15, 20, 25, 30, 35, 40, 45, 50],
            labels = [],
            from, to;

        for (var i = 0; i < grades.length; i++) {
            from = grades[i];
            to = grades[i + 1];

            labels.push(
                '<i style="background:' + getColor(from + 1) + '"></i> ' +
                from + (to ? '&ndash;' + to : '+'));
        }

        div.innerHTML = labels.join('<br>');
        return div;
    };

    legend.addTo(map);
}

//When adding the info
info.add = function (map) {
    //"this" returns to info. 
    this._div = L.DomUtil.create('div', 'info');
    //the following line calls info.update(properties) function. Again, this refers to 'info' here
    //this.update();
    return this._div;
};

//Update the info based on what state user has clicked on
info.update = function (properties) {
    var name = properties.id;
    var data = properties.TPR100k;
    this._div.innerHTML = '<h4>Education, Poverty, and Teen Pregnancy Rates</h4>' + (properties ?
        '<b>' + name + '</b><br />' + data + ' people / mi<sup>2</sup>'
        : 'Hover over a state');
};

// get color depending on population TPR value
function getColor(d) {
    return d > 50 ? '#800026' :
        d > 45 ? '#bd0026' :
            d > 40 ? '#e31a1c' :
                d > 35 ? '#fc4e2a' :
                    d > 30 ? '#fd8d3c' :
                        d > 25 ? '#feb24c' :
                            d > 20 ? '#fed976' :
                                d > 15 ? '#ffeda0' :
                                    d > 10 ? '#ffffcc' :
                                        '#ffffe5';
}

function style(feature) {
    return {
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.6,
        fillColor: getColor(feature.properties.TPR100k)
    };
}

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.6
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }

    info.add(layer.feature.properties);

    parcoords.highlight([layer.feature.properties]);
}

function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.add();
    parcoords.unhighlight();
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

function showHide() {
    var x = document.getElementById("grid");
    var y = document.getElementById("pager");
    if (x.style.display === "none" || y.style.display === "none") {
        x.style.display = "block";
        y.style.display = "block";
    } else {
        x.style.display = "none";
        y.style.display = "none";
    }
}