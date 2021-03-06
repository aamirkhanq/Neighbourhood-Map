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
  name: "Tunde Ke Kabab",
  lat: 26.881684,
  lng: 80.946794
}];

var markers = null;
var initLat = 26.881684;
var initLng = 80.946794;
var initZoom = 10;

function googleError(){
    alert("Cannot connect to maps. Check your internet connection.");
    //console.log("Cannot connect to maps. Check your internet connection.");
}

function initMap(){
  $(ko.applyBindings(new MapViewModel()));
}

var MapViewModel = function() {

  var self = this;

  self.center = new google.maps.LatLng(initLat, initLng);

  self.init = function() {
    var myOptions = {
      zoom: initZoom,
      center: new google.maps.LatLng(initLat, initLng),
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    // Create a new google maps object and attaching it to the DOM with id='map-canvas'
    self.map = new google.maps.Map(document.getElementById('map-canvas'),myOptions);

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

      var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search='+data.name+'&format=json&callback=wikiCallback';
      //var contentString = '<div><h1>' + data.name + '</h1>';
      /*$.ajax({
        url: wikiUrl,
        dataType: "jsonp",
        success: function(response){
          var articleList = response[1];
          for (var i=0; i<articleList.length; i++){
            articleString = articleString[i];
            var contentString = '<div><h1>' + articleString + '</h1>';
          }
        }
      });*/
      self.infowindow = new google.maps.InfoWindow();
      google.maps.event.addListener(marker, 'click', function() {
        self.map.panTo(marker.getPosition());
        // Make marker icon bounce only once
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
          marker.setAnimation(null);
        }, 750);
        $.ajax({
        url: wikiUrl,
        dataType: "jsonp",
        success: function(response){
          var articleList = response[1];
          console.log(articleList);
          for (var i=0; i<articleList.length; i++){
            var articleString = articleList[i];
            var url = 'http://en.wikipedia.org/wiki/'+articleString;
            var contentString = '<h3>Link to Wikipedia Article</h3><a href="' + url + '"><div><b>' + articleString + '</b></a>';
            self.infowindow.setContent(contentString);
          }
        }
        }).fail(function(){
          alert("Cannot update wikipedia! Check your internet connection.");
        });
        //self.infowindow.setContent(contentString);
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
    self.filterWord.subscribe(function(v){
      //console.log(v.toLowerCase().split(' '));
      var t = v.toLowerCase().split(' ');
      t.forEach(function(word) {
        self.markers()
          .forEach(function(marker) {
            var name = marker.name.toLowerCase();
            ((name.indexOf(word) === -1)) ? marker.setMap(null): marker.setMap(self.map);
            ((name.indexOf(word) === -1)) ? marker.listVisible(false): marker.listVisible(true);
          });
      });
    });
    /*console.log(k);
      .toLowerCase()
      .split(' ');*/
  });
  self.filterSubmit = function() {
    self.filterWordSearch();
    /*self.filterWordSearch()
      .forEach(function(word) {
        self.markers()
          .forEach(function(marker) {
            var name = marker.name.toLowerCase();
            ((name.indexOf(word) === -1)) ? marker.setMap(null): marker.setMap(self.map);
            ((name.indexOf(word) === -1)) ? marker.listVisible(false): marker.listVisible(true);
          });
      });*/
    self.filterWord("");
  };
  self.filterSubmit()
  self.init();
};




