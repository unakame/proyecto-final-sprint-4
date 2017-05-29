function initMap() {
        var map = new google.maps.Map(document.getElementById('map'), {
          mapTypeControl: false,
          center: {lat: -33.8688, lng: 151.2195},
          zoom: 13
        });

        new AutocompleteDirectionsHandler(map);
      }

       function AutocompleteDirectionsHandler(map) {
               this.map = map;
               this.originPlaceId = null;
               this.destinationPlaceId = null;
               this.travelMode = 'WALKING';
               var originInput = document.getElementById('origin-input');
               var destinationInput = document.getElementById('destination-input');

               this.directionsService = new google.maps.DirectionsService;
               this.directionsDisplay = new google.maps.DirectionsRenderer;
               this.directionsDisplay.setMap(map);

        var originAutocomplete = new google.maps.places.Autocomplete(
            originInput, {placeIdOnly: true});
        var destinationAutocomplete = new google.maps.places.Autocomplete(
            destinationInput, {placeIdOnly: true});
            this.setupPlaceChangedListener(originAutocomplete, 'ORIG');
        this.setupPlaceChangedListener(destinationAutocomplete, 'DEST');


      }

      AutocompleteDirectionsHandler.prototype.setupClickListener = function(id, mode) {
       var radioButton = document.getElementById(id);
       var me = this;
       radioButton.addEventListener('click', function() {
         me.travelMode = mode;
         me.route();
       });
     };

     AutocompleteDirectionsHandler.prototype.setupPlaceChangedListener = function(autocomplete, mode) {
       var me = this;
       autocomplete.bindTo('bounds', this.map);
       autocomplete.addListener('place_changed', function() {
         var place = autocomplete.getPlace();
         if (!place.place_id) {
           window.alert("Please select an option from the dropdown list.");
           return;
         }
         if (mode === 'ORIG') {
           me.originPlaceId = place.place_id;
         } else {
           me.destinationPlaceId = place.place_id;
         }
         me.route();
       });

     };

     AutocompleteDirectionsHandler.prototype.route = function() {
       if (!this.originPlaceId || !this.destinationPlaceId) {
         return;
       }
       var me = this;

       this.directionsService.route({
         origin: {'placeId': this.originPlaceId},
         destination: {'placeId': this.destinationPlaceId},
         travelMode: this.travelMode
       }, function(response, status) {
         if (status === 'OK') {
           me.directionsDisplay.setDirections(response);
         } else {
           window.alert('Directions request failed due to ' + status);
         }
       });
     };


     var latitud, longitud, miUbicacion;
    /* var funcionEncontrado=function(posicion){
       latitud=posicion.coords.latitude;
       longitud=posicion.coords.longitude;

       miUbicacion= new google.maps.Marker({
         position: {lat:latitud, lng:longitud},
         map:map
       });

       map.setZoom(18);
       map.setCenter({lat:latitud, lng:longitud});
     }*/
    /* funcionEncontrado=function(posicion){
        latitud=posicion.coords.latitude;
        longitud=posicion.coords.longitude;

        miUbicacion= new google.maps.Marker({
          position: {lat:latitud, lng:longitud},
          map:map
        });

        map.setZoom(18);
        map.setCenter({lat:latitud, lng:longitud});
      }


     window.onload= function buscar(){
       if(navigator.geolocation){
         navigator.geolocation.getCurrentPosition(funcionEncontrado);

       }
     }*/

     if (navigator.geolocation) {
         navigator.geolocation.getCurrentPosition(function(position) {
           var pos = {
             lat: position.coords.latitude,
             lng: position.coords.longitude
           };

           infoWindow.setPosition(pos);
           infoWindow.setContent('Location found.');
           map.setCenter(pos);
         }, function() {
           handleLocationError(true, infoWindow, map.getCenter());
         });
       }
