var myApp = angular.module('myApp', []);

schools = [
            {"id": "1", "name": "Macquarie University", "latitude": "-33.777007", "longitude": "151.117603" },
            {"id": "2", "name": "University of Sydney","latitude": "-33.889014","longitude": "151.190731"},
            {"id": "5", "name": "Charles Sturt University","latitude": "-33.878273","longitude": "151.214561"},
            {"id": "6", "name": "The University of Notre Dame Australia, Sydney campus","latitude": "-33.884657","longitude": "151.198102"},
            {"id": "7", "name": "University of New South Wales","latitude": "-33.917571","longitude": "151.230201"},
            {"id": "8", "name": "University of Newcastle, Newcastle campus","latitude": "-33.357735","longitude": "151.37769"},
            {"id": "9", "name": "University of Newcastle, Sydney campus","latitude": "-33.87376","longitude": "151.204396"},
            {"id": "10", "name": "University of Technology","latitude": "-33.883358","longitude": "151.201749"},
            {"id": "11", "name": "University of Western Sydney (Penrith campus)","latitude": "-33.765467","longitude": "150.734607"},
            {"id": "12", "name": "University of Western Sydney (Hawkesbury campus)","latitude": "-33.606256","longitude": "150.755421"},
            {"id": "13", "name": "University of Western Sydney (Bankstown campus)","latitude": "-33.940049","longitude": "150.992099"},
            {"id": "14", "name": "University of Western Sydney (Parramatta campus)","latitude": "-33.808579","longitude": "151.02109"},
            {"id": "15", "name": "University of Western Sydney (Campbelltown campus)","latitude": "-34.070134","longitude": "150.792393"},
            {"id": "16", "name": "University of Western Sydney (Blacktown campus)","latitude": "-33.726098","longitude": "150.879448"},
            {"id": "17", "name": "University of Wollongong (Wollongong campus)","latitude": "-34.406724","longitude": "150.878064"},
            {"id": "18", "name": "University of Wollongong, Sydney campus","latitude": "-33.862028","longitude": "151.209436"},
            {"id": "20", "name": "University of Wollongong, Southern Sydney campus","latitude": "-34.044668","longitude": "151.051485"},
            {"id": "21", "name": "Australian Catholic University, Strathfield campus","latitude": "-33.876362","longitude": "151.076709"},
            {"id": "22", "name": "Australian Catholic University, North Sydney campus","latitude": "-33.837217", "longitude": "151.203895"},
            {"id": "23", "name": "Kaplan international college Sydney","latitude": "-33.878415","longitude": "151.209978"},
            {"id": "24", "name": "Navitas English","latitude": "-33.865329","longitude": "151.205627"},
            {"id": "25", "name": "ThinkGroup","latitude": "-33.837792","longitude": "151.20633"},
            {"id": "26", "name": "Sydney Institute (TAFE) Petersham","latitude": "-33.889744","longitude": "151.158494"},
            {"id": "27", "name": "Sydney Institute (TAFE) Enmore","latitude": "-33.902889","longitude": "151.172301"},
            {"id": "28", "name": "Sydney Institute (TAFE) HayMarket","latitude": "-33.881025","longitude": "151.199876"}
        ];
        
function SchoolCtrl($scope) {
    $scope.schools = schools;
}

function TestCntrl ($scope,$location) {
        $scope.changeView = function(view){
            alert(($location.search()).gid);
        }
    }


    
function MyCtrl($scope, $location) {

    $scope.schools = schools;
    var map = new L.map('map');
    var tileslayer = new L.TileLayer();
    var utfGrid = new L.UtfGrid();
    var marker = new L.marker();
    
    var mapboxTiles = L.tileLayer('https://{s}.tiles.mapbox.com/v3/examples.map-0l53fhk2/{z}/{x}/{y}.png', {
        attribution: '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>'
    });
    
    var info = L.control();
    //info.options.position = 'bottomright';
    info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'score'); // create a div with a class "info"
        this.update();
        return this._div;
    };

    // method that we will use to update the control based on feature properties passed
    info.update = function (props) {
        this._div.innerHTML = "<h4>Information</h4>"  +
        
        "Name: " + (props ?
        "<b>" + props.data.tz_name11 + "</b><br />" +
        "Local Government Area (Suburb): <b>" + props.data.lga + "</b><br />" +
        "Public Transport Commute (min): <b>" + props.data.duration + "</b><br />" +
        "Cycling Commute (min): <b>" + props.data.duration_active + "</b><br />" +
        "Crime Score: <b>" + props.data.crime + "</b><br />" +
        "Travel Score: <b>" + props.data.travel + "</b><br />" +
        "Average Rent (weekly): <b>" + props.data.rent_avg + "</b><br />" +
        "Rent Score: <b>" + props.data.rent + "</b><br />" +
        "Services Score: <b>" + props.data.service + "</b><br />"
        : 'Hover over a location');
    };



    function getColor(d) {
            return 
                   d > 55 ? '#275D19' :
                   d > 45 ? '#1A7E00' :
                   d > 25 ? '#D77C87' :
                   d > 15 ? '#D74556' :
                            '#5B000B';
        }       
        
        
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 15, 25, 45, 55],
            labels = [];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

        return div;
    };

    var schoolIcon = L.icon({
        iconUrl: 'http://govhack2013.kelvinism.com/static/university.png',
        iconSize:     [32, 37], // size of the icon
        iconAnchor:   [18, 36], // point of the icon which will correspond to marker's location
    });
    
    
    map.setView(new L.LatLng(-33.7664, 151.1067), 11)
    .addLayer(mapboxTiles)
    .addControl(info)
    .addControl(legend);
       
    
    $scope.changeView = function(school){

        map.removeLayer(tileslayer);
        map.removeLayer(utfGrid);
        map.removeLayer(marker);
        
        $scope.location = $location;     

        var utfGridUrl = 'http://d2i0kygte2vy0v.cloudfront.net/school'+school.id+'.mbtiles/{z}/{x}/{y}.json';
        var tilesUrl = 'http://d2i0kygte2vy0v.cloudfront.net/school'+school.id+'.mbtiles/{z}/{x}/{y}.png';
        
        marker = new L.marker([school.latitude, school.longitude], {icon: schoolIcon});
        
        utfGrid = new L.UtfGrid(utfGridUrl, {
            useJsonP: false,
            resolution: 4
            });       
            
        utfGrid.on('click', function (e) {
            //click events are fired with e.data==null if an area with no hit is clicked
            if (e.data) {
                //alert('click: ' + e.data.duration);
            }
        });
        utfGrid.on('mouseover', function (e) {
            info.update(e);
        });
        
        tileslayer = new L.TileLayer(tilesUrl);
        
        map.setView(new L.LatLng(school.latitude, school.longitude), 11)
            .addLayer(utfGrid)
            .addLayer(tileslayer)
            .addLayer(marker);
            

                
        
    }

}