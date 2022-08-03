Promise.all([d3.csv("https://raw.githubusercontent.com/qinlinc/CSC3007-project/main/P2.csv"), d3.csv("https://raw.githubusercontent.com/qinlinc/CSC3007-project/main/statelatlong.csv")]).then(data => {
    let prod = data[0]
    let coordinate = data[1]
    statesData.features.forEach( data =>{
        let state = data.properties.name
        coordinate.forEach(c =>{
            let cState = c.City
            if(cState === state){
                let lat = c.Latitude
                let long = c.Longitude
                prod.forEach(p =>{
                    let pState = p.State
                    if(pState === state){
                        let biofuels = p["Biofuels"]
                        let coal = p["Coal"]
                        let crude_oil = p["Crude Oil"]
                        let natural_gas = p["Natural Gas"]
                        let nuclear_electric_power = p["Nuclear Electric Power"]
                        let other = p["Other"]
                        let total = p["Total"]
                        let wood_and_waste = p["Wood and Waste"]

                        data.properties = {
                            "state" : state,
                            "biofuels" : biofuels,
                            "coal" : coal,
                            "crude_oil" : crude_oil,
                            "natural_gas" : natural_gas,
                            "nuclear_electric_power" : nuclear_electric_power,
                            "other" : other,
                            "total" : parseInt(total.replace(",","")),
                            "wood_and_waste" : wood_and_waste,
                            "lat" : lat,
                            "long" : long
                        }
                        return
                    }
                })
                return
            }
        })
    })

    let geoDomain = [0, 100, 300, 500, 750, 1000, 2000, 3000, 4000, 5000, 10000, 25000]
    const geoColorScale = d3.scaleLinear()
        .domain(geoDomain)
        .range(["#f7fbff","#e3eef9","#cfe1f2","#b5d4e9","#93c3df","#6daed5","#4b97c9","#2f7ebc","#1864aa","#0a4a90","#08306b","#040021"]);
    let width = 1000, height = 1000;

    let tiles = new L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    let map = new L.Map("map", {
        center: [37.8, -96], 
        zoom: 4
    }).addLayer(tiles);

    var stateClicked = ""
    function style(feature) {
        return {
            fillColor: geoColorScale(feature.properties.total),
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
        };
    }

    function highlightFeature(e) {

        var layer = e.target;  
        layer.setStyle({
            weight: 5,
            color: '#666',
            dashArray: '',
            fillOpacity: 0.7
        });

        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        }
    }

    function resetHighlight(e) {
        geojson.resetStyle(e.target);
    }

    function zoomToFeature(e) {
        let currState = e.target.feature.properties.state
        if(currState === stateClicked){
            stateClicked = ""
            map.setView([37.8, -96], 4)
        }else{
            stateClicked = currState
            map.fitBounds(e.target.getBounds());
        }
    }

    function onEachFeature(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: zoomToFeature
        });

        let state = feature.properties.state
        let biofuels = feature.properties.biofuels
        let coal = feature.properties.coal
        let crude_oil = feature.properties.crude_oil
        let natural_gas = feature.properties.natural_gas
        let nuclear_electric_power = feature.properties.nuclear_electric_power
        let other = feature.properties.other
        let total = feature.properties.total
        let wood_and_waste = feature.properties.wood_and_waste

        layer.bindTooltip("State: "+ state 
                    + "<br/>Total: " + total 
                    + "<br/>Biofuels: "+ biofuels 
                    + "<br/>Coal: " + coal 
                    + "<br/>Crude Oil: " + crude_oil
                    + "<br/>Natural Gas: " + natural_gas
                    + "<br/>Nuclear Electric Power: " + nuclear_electric_power 
                    + "<br/>Other: " + other 
                    + "<br/>Wood and Waste: " + wood_and_waste).openTooltip();
    }

    var geojson = L.geoJson(statesData, {
        style: style,
        onEachFeature: onEachFeature
    }).addTo(map);

    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            domain = geoDomain,
            labels = [];
        
        for (var i = 0; i < domain.length; i++) {
            div.innerHTML += '<i style="background:' + geoColorScale(domain[i] + 1) + '"></i> ' +
            domain[i] + (domain[i + 1] ? ' &ndash; ' + domain[i + 1] + '<br>' : '+');
        }   

        return div;
    };

    legend.addTo(map);
})
