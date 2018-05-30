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
];

function initMap() {
    
    // MAP OPTIONS
    const options = {
        zoom: 12,
        center: {lat: 40.7713124, lng: -73.9632393},
        styles: styles
    };

    // MAP'S CONTAINER
    const mapContainer = document.getElementById('map');
    const map = new google.maps.Map(mapContainer, options);

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
            infoWindow.setContent('');

            // MAKE SURE THE MARKER PROPERTY IS CLEARED IF THE INFOWINDOW IS CLOSED
            infoWindow.addListener('closeclick', function() {
                infoWindow.marker = null;
            });

            // get street view
            let streetViewService = new google.maps.StreetViewService();
            let radius = 50;

            /* INCASE THE STATUS WAS OK, MEANING THE PANO WAS FOUND,
            COMPUTE THE POSITION OF THE STREETVIEW IMAGE, THEN CALCULATE THE HEADING
            THEN GET A PANORAMA FROM THAT AND SET THE OPTIONS */
            function getStreetView(data, status) {
                if ( status == google.maps.StreetViewStatus.OK ) {
                    let nearStreetViewLocation = data.location.latLng;
                    let heading = google.maps.geometry.spherical.computeHeading(
                        nearStreetViewLocation, marker.position
                    );
                    infoWindow.setContent(`<div>${marker.title}</div><div id='pano'></div>`);
                    infoWindow.setMap(map)
                    let panoramaOptions = {
                        position: nearStreetViewLocation,
                        pov: {
                            heading: heading,
                            pitch: 30
                        }
                    };

                    let panorama = new google.maps.StreetViewPanorama(
                        document.getElementById('pano'), panoramaOptions
                    );

                } else {
                    infoWindow.setContent(`<div>${marker.title}</div> <div>NO STREET VIEW FOUND!</div>`);
                }
            }

            /* USE STREETVIEW SERVICE TO GET THE CLOSEST STREETVIEW IMAGE 
            WITHIN 50 METERS OF THE MARKER'S POSITION */
            streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);

            // OPEN THE INFOWINDOW ON THE CORRECT MARKER
            infoWindow.open(map, marker);
        }
    }
}
