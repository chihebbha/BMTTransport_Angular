var directionsDisplay;
var directionsService = new google.maps.DirectionsService();

function initialize() {
	

	
	//-----------------------
  directionsDisplay = new google.maps.DirectionsRenderer();
  var mapOptions = {
    zoom: 9,
	scrollwheel: false,
    center: new google.maps.LatLng(36.81881,10.16596)
  };
  var map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);
  directionsDisplay.setMap(map);
  directionsDisplay.setPanel(document.getElementById('directions-panel'));
  var control = document.getElementById('control');
  
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(control);
	
	
			 	if (navigator.geolocation)
{
  navigator.geolocation.getCurrentPosition(function(position)
  {
	map.setCenter({lat:position.coords.latitude, lng:position.coords.longitude});
  map.setZoom(17);})}
	  

}

function calcRoute() {

	
  var start =document.getElementById('start').value;
  var end=document.getElementById('end').value;

	
	
	
	
  var request = {
    origin: start,
    destination: end,
	
    travelMode: google.maps.TravelMode.DRIVING
  };

  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
    }
	 
  });
}




 // Setup the click event listeners: simply set the map to
 
google.maps.event.addDomListener(window, 'load', initialize);