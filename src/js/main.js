const markers = [];
const locations = [
    {title: 'Park Ave Penthouse', position: {lat: 40.7713024, lng: -73.9632393}},
    {title: 'Chelsea Loft', position: {lat: 40.7444883, lng: -73.9949465}},
    {title: 'Union Square Open Floor Plan', position: {lat: 40.7347062, lng: -73.9895759}},
    {title: 'East Village Hip Studio', position: {lat: 40.7281777, lng: -73.984377}},
    {title: 'TriBeCa Artsy Bachelor Pad', position: {lat: 40.7195264, lng: -74.0089934}},
    {title: 'Chinatown Homey Space', position: {lat: 40.7180628, lng: -73.9961237}}
];
const styles = [
    {
        featureType: 'water',
        stylers: [
            { color: '#19a0d8' }
        ]
    },
    {
        featureType: 'administrative',
        elementType: 'labels.text.stroke',
        stylers: [
            { color: '#ffffff' },
            { weight: 6 }
        ]
    },
    {
        featureType: 'transit.station',
        elementType: 'labels.icon',
        stylers: [
            { visibility: 'off'}
        ]
    }
]

function initMap() {
    
    // MAP OPTIONS
    const options = {
        zoom: 12,
        center: {lat: 40.7713124, lng: -73.9632393},
        styles: styles
    }

    // MAP'S CONTAINER
    const mapContainer = document.getElementById('map');
    const map = new google.maps.Map(mapContainer, options)

    /* ========== CREATE A MARKER FUNCTION ========== */
    function createMarker(props) {
        let marker = new google.maps.Marker({
            position: props.position,
            map: map,
            animation: google.maps.Animation.DROP
        });

        //check if title was passed
        if ( props.title ) {
            marker.setTitle(props.title);
        }

        // check if iconImage was passed
        if ( props.iconImage ) {
            marker.setIcon(props.iconImage);
        }
        return marker;
    }
    
    /* ========== MAKE A MARKER OUT OF EACH LOCATION ========== */
    let largeInfoWindow = new google.maps.InfoWindow();

    for ( let i = 0; i < locations.length; i++ ) {
        let location = locations[i];
        let marker = createMarker(location);

        // push the marker to the markers array
        markers.push(marker);

        // ADD event on click
        marker.addListener('click', function() {
            populateInfoWindow(this, largeInfoWindow);
        });
    }

    /* ========== MAKE A MARKER OUT OF EACH LOCATION ========== */
    function populateInfoWindow(marker, infoWindow) {
        // CHECK IF THE INFOWINDOW IS NOT ALREADY OPENED ON THIS MARKER
        if ( infoWindow.marker != marker ) {
            infoWindow.marker = marker;
            infoWindow.setContent(`<div><h3>${marker.title}</h3> ${marker.position}</div>`);
            infoWindow.open(map, marker);

            // MAKE SURE THE MARKER PROPERTY IS CLEARED IF THE INFOWINDOW IS CLOSED
            infoWindow.addListener('closeclick', function() {
                infoWindow.marker = null;
            })
        }
    }
}