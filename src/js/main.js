var map;
    function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 40.7413549, lng: -73.9980244},
        zoom: 13
        });

        var tribeca = {lat: 40.719526, lng: -74.0089934};
        var marker = new google.maps.Marker({
            position: tribeca,
            map:map,
            title: 'First Marker!'
        });

        var infoWindow = new google.maps.InfoWindow({
            content: 'Do you ever feel like an InfoWindow, floating through the wind,' + ' ready to start again?'
        });

        marker.addListener('click', () => {
            infoWindow.open(map, marker);
        })
    }