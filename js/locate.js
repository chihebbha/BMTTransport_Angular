
	 function localiser() {
		 
		
		 	if (navigator.geolocation)
{
  navigator.geolocation.getCurrentPosition(function(position)
  {
	      
	          var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            var geocoder = geocoder = new google.maps.Geocoder();
            geocoder.geocode({ 'latLng': latlng }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    if (results[1]) {
						
             alert(results[1])  ;  
			console.log(results[1])	;		
	//return	"results[1].formatted_address";
						
						
                    }
					
                }
            });
	 
  });
	//$scope.myAdress=myAdress;
}	
else
  alert("Votre navigateur ne prend pas en compte la géolocalisation HTML5");
	 }


