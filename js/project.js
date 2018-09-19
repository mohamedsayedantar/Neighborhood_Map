var map;
var infoWindow;
var address;
var markers = [];
var address1 = '';
var address2 = '';
var address3 = '';
var markerData = [];


// the ViewModel
function ViewModel() {
  var self = this;

  this.searchOption = ko.observable("");

  // here is the google maps init function,
  // and the placeService API from google to get list of places.
  this.initMap = function() {
    var self2 = this;
    var us = {lat: 40.705421, lng: -74.004630};


    map = new google.maps.Map(document.getElementById('map'), {
      center: us,
      zoom: 10
    });


    infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch({
      location: us,
      radius: 50000,
      type: ['hospital']
    }, self.callback);
  };

  // this function takes the results from google placeService and generate the 'a' elements in the sidebar
  self.callback = function(results, status){
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        self.createMarker(results[i], i);
        var element = document.createElement("a");
        element.setAttribute("id", i);
        element.setAttribute("class", "items");
        element.setAttribute("data-bind", "if: ShowItem");
        element.appendChild(document.createTextNode(results[i].name));
        document.getElementById('mySidenav').appendChild(element);
      }
      details(results[0].geometry.location, 0, results[0].name);
    }
  };

  // this event listener to know which element exactly the user clicked on
  // to bounce its marker and populate its infowindow.
  window.addEventListener('load', function(){
    var tags = document.getElementsByClassName("items");
    for (i=0; i<tags.length; i++){
      tags[i].addEventListener('mousedown', function(e){ tagClick.call(this, e) }, false);
    }
  }, false);
  function tagClick(e){
    info(this.id);
    bounce(this.id);
  };

  // this function takes the place location and the id from the loop in callback function
  // and create a marker with this id
  // and by adding listener functions to each marker
  self.createMarker = function(place, i){
    var self2 = this;
    var placeLoc = place.geometry.location;
    var defaultIcon = makeMarkerIcon('0091ff');
    var highlightedIcon = makeMarkerIcon('FFFF24');

    var marker = new google.maps.Marker({
      map: map,
      title: place.name,
      position: place.geometry.location,
      draggable: true,
      animation: google.maps.Animation.DROP,
      icon: defaultIcon,
      id: i,
    });

    markers.push(marker);

    var defaultIcon = makeMarkerIcon('0091ff');
    var highlightedIcon = makeMarkerIcon('FFFF24');

    marker.addListener('click', function() {
      var id = marker.id;
      info(id);
      bounce(id)
    });

    marker.addListener('mouseover', function() {
      this.setIcon(highlightedIcon);
    });

    marker.addListener('mouseout', function() {
      this.setIcon(defaultIcon);
    });
  };

  // to initiate the map by calling init map
  this.initMap();

  // the info function used to get the address from foursquare API using LatLng
  // and populate the infowindow with this information
  function info(id){
    var lat = markers[id].position.lat;
    var lng = markers[id].position.lng;
    var name = document.getElementById((id).toString()).textContent;

    address1 = '';
    address2 = '';
    address3 = '';
    infowindow.setContent('');

    var url = 'https://api.foursquare.com/v2/venues/search?ll='+lat()+','+lng()+
    '&client_id=5HX2M5BOQQH4XM35QZYAPWO00ES5IRSX5N2AD3WD2HMMVBT0'+
    '&client_secret=VUX4CAHRRKYHDCLDHHJM0LZSQR25PYWEYUF5B3SXSJQFPKBU'+
    '&v=20160118';

    $.getJSON(url).done(function(data) {
      var results = data.response.venues[0];
      address1 = results.location.formattedAddress[0] ? results.location.formattedAddress[0]: 'N/A';
      address2 = results.location.formattedAddress[1] ? results.location.formattedAddress[1]: 'N/A';
      address3 = results.location.formattedAddress[2] ? results.location.formattedAddress[2]: 'N/A';
      infowindow.setContent('<h5>'+name+'</h5>'+'<h6>'+address1+'</h6>'+'<h6>'+address2+'</h6>'+'<h6>'+address3+'</h6>')
    }).fail(function() {
        alert('there is something wrong with foursquare or the application exceeded the rate limit of requests'+
               'please reload your webpage.....');
    });


    infowindow.open(map, markers[id]);
    google.maps.event.addListener(map, 'click', function() {
          infowindow.close();
      });


  }

  // this function used to make the marker Bounce when clicked on
  function bounce(id){
    markers[id].addListener('click', toggleBounce(id));
    function toggleBounce(id) {
      if (markers[id].getAnimation() !== null) {
        markers[id].setAnimation(null);
      } else {
        markers[id].setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
        markers[id].setAnimation(null);
      }, 1000);
      }
    }
  }

  // using this function to generate a new marker with the givin color to change the color when mouseover and mouseout
  function makeMarkerIcon(markerColor) {
      var markerImage = new google.maps.MarkerImage(
        'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
        '|40|_|%E2%80%A2',
        new google.maps.Size(21, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34),
        new google.maps.Size(21,34));
      return markerImage;
  }


  // the detail function is called once in the callback function,
  // it repeats itself to generate information for all the existed markers from foursquare,
  // it used for the input search to enable it to find the place with the address too.
  function details(position, id, name){
    var lat = position.lat;
    var lng = position.lng;
    id = id+1;

    var url = 'https://api.foursquare.com/v2/venues/search?ll='+lat()+','+lng()+
    '&client_id=5HX2M5BOQQH4XM35QZYAPWO00ES5IRSX5N2AD3WD2HMMVBT0'+
    '&client_secret=VUX4CAHRRKYHDCLDHHJM0LZSQR25PYWEYUF5B3SXSJQFPKBU'+
    '&v=20160118';

    $.getJSON(url).done(function(data) {
      var results = data.response.venues[0];
      var add1 = results.location.formattedAddress[0] ? results.location.formattedAddress[0]: 'N/A';
      var add2 = results.location.formattedAddress[1] ? results.location.formattedAddress[1]: 'N/A';
      var detail = name+" "+(add1).toString()+" "+(add2).toString();
      markerData.push(detail);
      if (id < (markers.length)){
        details(markers[id].position, id, markers[id].title);
      }else{
        return;
      }
    }).fail(function() {
    alert('there is something wrong with foursquare or the application exceeded the rate limit of requests'+
           'please reload your webpage.....');
    });

  }

  // to call the check function each time the search input changes.
  this.searchOption.subscribe(function (value) {
    check(value);
 });

  // to check the word in search input existed in the address or the name of the marker or not,
  // and to show this marker if yes or to hide it if no.
 function check(word){
   for (var i = 0; i < markerData.length; i++) {
     if (markerData[i].toLowerCase().includes(self.searchOption().toLowerCase())) {
       markers[i].setVisible(true);
       document.getElementById((i).toString()).style.display = "block";
     }else{
       markers[i].setVisible(false);
       document.getElementById((i).toString()).style.display = "none";
     }
     }
 }

}

// handle the google maps error
function googleMapsError() {
    alert('there is an error occurred with Google Maps!....Please reload your webpage');
}

// to open the sidebar
function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
}

// to close the sidebar
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}


function myApp() {
    ko.applyBindings(new ViewModel());
}
