var places = [{
  name: "Bara Imambara",
  lat: 26.869014,
  lng: 80.913062
}, {
  name: "Chota Imambara",
  lat: 26.873281,
  lng: 80.904057
}, {
  name: "Dilkusha Kothi",
  lat: 26.829212,
  lng: 80.965582
}, {
  name: "Ambedkar Memorial Park",
  lat: 26.847906,
  lng: 80.975800
}, {
  name: "Tunday Kebabi",
  lat: 26.881684,
  lng: 80.946794
}];

var markers = null;
var initLat = 26.881684;
var initLng = 80.946794;
var initZoom = 10;



function initMap(){
  $(ko.applyBindings(new MapViewModel()));
}

var MapViewModel = function() {
  menu.addEventListener('click', function(e) {
    drawer.classList.toggle('open');
    e.stopPropagation();
  });

  var self = this;

  self.center = new google.maps.LatLng(initLat, initLng);

  self.init = function() {
    var myOptions = {
      zoom: initZoom,
      center: new google.maps.LatLng(initLat, initLng),
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    // Create a new google maps object and attaching it to the DOM with id='map-canvas'
    self.map = new google.maps.Map(document.getElementById('map-canvas'), myOptions);

    self.markers = ko.observableArray([]);
    // Creates a marker and pushes into self.markers array
    $.each(places, function(key, data) {
      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(data.lat, data.lng),
        map: self.map,
        listVisible: ko.observable(true),
        animation: google.maps.Animation.DROP,
        name: data.name,
      });


      var contentString = '<div><h1>' + data.name + '</h1>';
      self.infowindow = new google.maps.InfoWindow();
      google.maps.event.addListener(marker, 'click', function() {
        self.map.panTo(marker.getPosition());
        // Make marker icon bounce only once
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
          marker.setAnimation(null);
        }, 750);
        self.infowindow.setContent(contentString);
        self.infowindow.open(self.map, this);
      });

      self.markers.push(marker);
    });
    google.maps.event.addListener(self.infowindow, 'closeclick', function() {
      self.resetCenter();
    });
  };

  self.setCurrent= function(marker) {
    google.maps.event.trigger(marker, 'click');
  };

  self.resetCenter = function() {
    self.map.panTo(self.center);
  };

  self.locationListIsOpen = ko.observable(true);

  self.toggleLocationListIsOpen = function() {
    self.locationListIsOpen(!self.locationListIsOpen());
  };

  self.toggleLocationListIsOpenButtonText = ko.computed(function() {
    return self.locationListIsOpen() ? "hide" : "show";
  });

  self.toggleLocationListIsOpenStatus = ko.computed(function() {
    return self.locationListIsOpen() ? true : false;
  });

  self.filterWord = ko.observable("");
  self.filterWordSearch = ko.computed(function() {

    return self.filterWord()
      .toLowerCase()
      .split(' ');
  });
  self.filterSubmit = function() {
    self.filterWordSearch()
      .forEach(function(word) {
        self.markers()
          .forEach(function(marker) {
            var name = marker.name.toLowerCase();
            ((name.indexOf(word) === -1)) ? marker.setMap(null): marker.setMap(self.map);
            ((name.indexOf(word) === -1)) ? marker.listVisible(false): marker.listVisible(true);
          });
      });
    self.filterWord("");
  };

  self.init();
};




