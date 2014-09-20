repeatOnXAxis = true;

Template.mainLayout.helpers({
	locations: function(){
		return Locations.find();
	}
});

Template.mainLayout.rendered = function() {
	// BASIC MAP SETUP
	var minViewZoom = 4,
		maxViewZoom = 7;
	var centerLat = 68,
		centerLng = -93;
	var markers = [],
		latLngs = [],
		markerData = [];
	var disableListener = false;

	if (isPhone) {
	}
	if (biggerThanPhone && !biggerThanPortrait) {
		centerLng = -110;
	}
	if (biggerThanPortrait && !biggerThanLandscape) {
		centerLng = -105;
	}
	if (biggestScreen) {
		centerLat = 69;
		minViewZoom = 5;
	}

	var customMapType = new google.maps.ImageMapType({
		getTileUrl: function(coord, zoom) {
			var normalizedCoord = getNormalizedCoord(coord, zoom);
			if(normalizedCoord && (normalizedCoord.x < Math.pow(2, zoom)) && (normalizedCoord.x > -1) && (normalizedCoord.y < Math.pow(2, zoom)) && (normalizedCoord.y > -1)) {
				return 'http://cdn.world-of-x.com/tiles/' + zoom + '/' + normalizedCoord.x + '/' + normalizedCoord.y + '.jpg';
			} else {
				return 'img/empty.jpg';
			}
		},
		tileSize: new google.maps.Size(128, 128),
		maxZoom: maxViewZoom,
		name: 'cerebro'
	});

	var myOptions = {
		center: new google.maps.LatLng(centerLat, centerLng),
		zoom: minViewZoom,
		minZoom: minViewZoom,
		maxZoom: maxViewZoom,
		mapTypeControlOptions: {
			mapTypeIds: ['cerebro']
		},
		backgroundColor: '#400605',
		disableDefaultUI: true,
		disableDoubleClickZoom: true
	};

	map = new google.maps.Map(document.getElementById('map'), myOptions);
	map.mapTypes.set('cerebro', customMapType);
	map.setMapTypeId('cerebro');




	// ZOOM BUTTONS
	var zoomIn = document.getElementById('map-zoomin'),
		zoomOut = document.getElementById('map-zoomout');

	google.maps.event.addDomListener(zoomIn, 'click', function() {
		var currentZoomLevel = map.getZoom();

   		if (currentZoomLevel != maxViewZoom) {
    		map.setZoom(currentZoomLevel + 1);
    	}
	});
	google.maps.event.addDomListener(zoomOut, 'click', function() {
		var currentZoomLevel = map.getZoom();

   		if (currentZoomLevel != minViewZoom) {
    		map.setZoom(currentZoomLevel - 1);
    	}
	});
	google.maps.event.addListener(map, 'zoom_changed', function() {
	    // CHECK ZOOM LEVEL FOR BUTTONS
	    var currentZoomLevel = map.getZoom();

	    if (currentZoomLevel >= maxViewZoom) {
    		zoomIn.classList.add('disabled');
    	}
    	if (currentZoomLevel <= minViewZoom) {
    		zoomOut.classList.add('disabled');
    	}
    	if (currentZoomLevel < maxViewZoom && currentZoomLevel > minViewZoom) {
			zoomIn.classList.remove('disabled');
    		zoomOut.classList.remove('disabled');
    	}
	});




	// MAP MARKERS
	var icon = {
        path: "M465.955385,1085.33771 C465.955385,974.693835 376.421538,885 265.978462,885 C155.533846,885 66,974.693835 66,1085.33771 C66,1171.88588 120.786154,1245.61249 197.509231,1273.6214 L216.703077,1332.01425 L265.978462,1482.26945 L315.252308,1332.01425 L334.452308,1273.61831 C411.172308,1245.60941 465.955385,1171.88434 465.955385,1085.33771 L465.955385,1085.33771 Z M265.978462,949.194067 C290.630769,949.194067 314.278462,955.731995 334.958462,967.980206 L265.315385,1037.74893 L196.161538,968.47032 C217.038462,955.903072 240.993846,949.194067 265.978462,949.194067 L265.978462,949.194067 Z M217.812308,1085.33771 L148.832308,1154.44215 C136.606154,1133.72485 130.08,1110.03449 130.08,1085.33771 C130.08,1060.63938 136.606154,1036.94903 148.832308,1016.23172 L217.812308,1085.33771 L217.812308,1085.33771 Z M265.315385,1132.92648 L334.958462,1202.69521 C314.278462,1214.94188 290.630769,1221.48135 265.978462,1221.48135 C240.993846,1221.48135 217.038462,1214.7708 196.161538,1202.20355 L265.315385,1132.92648 L265.315385,1132.92648 Z M312.818462,1085.33771 L382.635385,1015.39637 C395.178462,1036.30941 401.876923,1060.30802 401.876923,1085.33771 C401.876923,1110.3674 395.178462,1134.36446 382.633846,1155.27905 L312.818462,1085.33771 L312.818462,1085.33771 Z",
        fillColor: '#FFFFFF',
        fillOpacity: 1,
        strokeColor: 'black',
        strokeWeight: 1,
        origin: new google.maps.Point(276, 1450),
        anchor: new google.maps.Point(276, 1450),
        scale: .075
    }
    var iconhover = {
        path: "M465.955385,1085.33771 C465.955385,974.693835 376.421538,885 265.978462,885 C155.533846,885 66,974.693835 66,1085.33771 C66,1171.88588 120.786154,1245.61249 197.509231,1273.6214 L216.703077,1332.01425 L265.978462,1482.26945 L315.252308,1332.01425 L334.452308,1273.61831 C411.172308,1245.60941 465.955385,1171.88434 465.955385,1085.33771 L465.955385,1085.33771 Z M265.978462,949.194067 C290.630769,949.194067 314.278462,955.731995 334.958462,967.980206 L265.315385,1037.74893 L196.161538,968.47032 C217.038462,955.903072 240.993846,949.194067 265.978462,949.194067 L265.978462,949.194067 Z M217.812308,1085.33771 L148.832308,1154.44215 C136.606154,1133.72485 130.08,1110.03449 130.08,1085.33771 C130.08,1060.63938 136.606154,1036.94903 148.832308,1016.23172 L217.812308,1085.33771 L217.812308,1085.33771 Z M265.315385,1132.92648 L334.958462,1202.69521 C314.278462,1214.94188 290.630769,1221.48135 265.978462,1221.48135 C240.993846,1221.48135 217.038462,1214.7708 196.161538,1202.20355 L265.315385,1132.92648 L265.315385,1132.92648 Z M312.818462,1085.33771 L382.635385,1015.39637 C395.178462,1036.30941 401.876923,1060.30802 401.876923,1085.33771 C401.876923,1110.3674 395.178462,1134.36446 382.633846,1155.27905 L312.818462,1085.33771 L312.818462,1085.33771 Z",
        fillColor: '#FFFFFF',
        fillOpacity: 1,
        strokeColor: 'black',
        strokeWeight: 1,
        origin: new google.maps.Point(276, 1450),
        anchor: new google.maps.Point(276, 1450),
        scale: .085
    }

 	// var marker = new google.maps.Marker({
	//     position: new google.maps.LatLng(centerLat, centerLng),
	//     map: map,
	//     draggable: false,
	//     icon: icon
	// });
	Deps.autorun(function() {
		var locations = Locations.find().fetch();

		_.each(locations, function(location) {
			if (typeof location.latitude !== 'undefined' && typeof location.longitude !== 'undefined') {
				var objMarker = {
                    id: location.slug,
                    label: location.title,
                    lat: location.latitude,
                    lng: location.longitude
                };

                if (!markerExists('id', objMarker.id)) {
                	addMarker(objMarker);
                }
			}
		});
	});

	function addMarker(marker) {
		var gLatLng = new google.maps.LatLng(marker.lat, marker.lng);
        // var gMarker = new google.maps.Marker({
        var gMarker = new MarkerWithLabel({
        		id: marker.id,
	            position: gLatLng,
	            map: map,
	            draggable: false,
	            icon: icon,
	            labelContent: marker.label,
				labelAnchor: new google.maps.Point(-24, 43),
				labelClass: "map-label"
	        });

        latLngs.push(gLatLng);
        markers.push(gMarker);
        markerData.push(marker);

		google.maps.event.addListener(gMarker, 'click', function() {
			// DO STUFF ON CLICK HERE
			var currentZoomLevel = map.getZoom();

			disableListener = true;
			console.log(disableListener);
			map.panTo(gMarker.position);

			var interval,
				i = currentZoomLevel + 1;

			function mapZoomIn() {
				map.setZoom(i);

				if (i < maxViewZoom) i+=1;
				else {
					clearInterval(interval);

					setTimeout(function(){
						Router.go('/' + gMarker.id);

						setTimeout(function(){
							map.setZoom(minViewZoom);
							zoomIn.classList.remove('disabled');
							disableListener = false;
						}, 3500);
					}, 1250);
				}
			}
			interval = setInterval(mapZoomIn, 750);
		});
		google.maps.event.addListener(gMarker, 'mouseover', function() {
			// DO STUFF ON HOVER
			if (!isMobile) {
				gMarker.set('labelClass', 'map-label hover');
				gMarker.setIcon(iconhover);
			}
		});
		google.maps.event.addListener(gMarker, 'mouseout', function() {
			// DO STUFF ON HOVER AWAY
			if (!isMobile) {
				gMarker.set('labelClass', 'map-label');
				gMarker.setIcon(icon);
			}
		});
        return gMarker;
	}
	function markerExists(key, val) {
        _.each(this.markers, function(storedMarker) {
            if (storedMarker[key] == val)
                return true;
        });
        return false;
    }



	// BOUNDARY CHECKING
	var allowedBounds = new google.maps.LatLngBounds(
		new google.maps.LatLng(35, -178), // SW
		new google.maps.LatLng(80, 10) // NE
	);
	var boundLimits = {
		maxLat: allowedBounds.getNorthEast().lat(),
		maxLng: allowedBounds.getNorthEast().lng(),
		minLat: allowedBounds.getSouthWest().lat(),
		minLng: allowedBounds.getSouthWest().lng()
	};
	var lastValidCenter = map.getCenter();
	var newLat,
		newLng;

	zoomCheck = google.maps.event.addListener(map, 'zoom_changed', function() {
		if (!disableListener) {
			checkBounds();
		}
	});
	boundsCheck = google.maps.event.addListener(map, 'bounds_changed', function() {
	    if (!disableListener) {
			checkBounds();
		}
	});
	centerCheck = google.maps.event.addListener(map, 'center_changed', function() {
		if (!disableListener) {
			limitBounds(allowedBounds);
		}
	});

	function checkBounds() {
	    var currentBounds = map.getBounds();
	    if (currentBounds == null) return;

		var allowed_ne_lng = allowedBounds.getNorthEast().lng(),
			allowed_ne_lat = allowedBounds.getNorthEast().lat(),
			allowed_sw_lng = allowedBounds.getSouthWest().lng(),
			allowed_sw_lat = allowedBounds.getSouthWest().lat();

	    var wrap;
	    var cc = map.getCenter();
	    var centerH = false;
	    var centerV = false;

	    if ( currentBounds.toSpan().lng() > allowedBounds.toSpan().lng() ) {
	        centerH = true;
	    }
	    else {
	        wrap = currentBounds.getNorthEast().lng() < cc.lng();
	        var current_ne_lng = !wrap ?   currentBounds.getNorthEast().lng()  : allowed_ne_lng +(currentBounds.getNorthEast().lng() + 180 )  + (180 - allowed_ne_lng);
	        wrap = currentBounds.getSouthWest().lng() > cc.lng();
	        var current_sw_lng = !wrap ?  currentBounds.getSouthWest().lng() : allowed_sw_lng - (180-currentBounds.getSouthWest().lng()) - (allowed_sw_lng+180);
	    }

	    if ( currentBounds.toSpan().lat() > allowedBounds.toSpan().lat() ) {
	        centerV = true;
	    }
	    else {
			wrap = currentBounds.getNorthEast().lat()   < cc.lat();    if (wrap) { alert("WRAp detected top") }
			var current_ne_lat =  !wrap ? currentBounds.getNorthEast().lat()  : allowed_ne_lat + (currentBounds.getNorthEast().lat() +90) + (90 - allowed_ne_lat);
			wrap = currentBounds.getSouthWest().lat() > cc.lat();  if (wrap) { alert("WRAp detected btm") }
			var current_sw_lat = !wrap ?  currentBounds.getSouthWest().lat() : allowed_sw_lat - (90-currentBounds.getSouthWest().lat()) - (allowed_sw_lat+90);
	    }

	    var centerX = cc.lng(),
	    	centerY = cc.lat();
		if (!centerH) {
			if (current_ne_lng > allowed_ne_lng) centerX -= current_ne_lng-allowed_ne_lng;
			if (current_sw_lng < allowed_sw_lng) centerX += allowed_sw_lng-current_sw_lng;
		}
		else {
			centerX = allowedBounds.getCenter().lng();
		}

		if (!centerV) {
			if (current_ne_lat > allowed_ne_lat) {
		   		centerY -= (current_ne_lat - allowed_ne_lat) * 3;
			}
			if (current_sw_lat < allowed_sw_lat) {
		   		centerY += (allowed_sw_lat - current_sw_lat) * 2.8;
			}
		}
		else {
			centerY = allowedBounds.getCenter().lat();
		}

		map.setCenter(lastValidCenter = new google.maps.LatLng(centerY,centerX));
	}

	function limitBounds(bound) {
		var mapBounds = map.getBounds();

		if (mapBounds.getNorthEast().lng() >= mapBounds.getSouthWest().lng() && mapBounds.getNorthEast().lat()  >= mapBounds.getSouthWest().lat()
			&& bound.getNorthEast().lat() > mapBounds.getNorthEast().lat()
			&& bound.getNorthEast().lng() > mapBounds.getNorthEast().lng()
			&& bound.getSouthWest().lat() < mapBounds.getSouthWest().lat()
			&& bound.getSouthWest().lng() < mapBounds.getSouthWest().lng()) {
		    lastValidCenter = map.getCenter();
		    return;
		}

		map.panTo(lastValidCenter);
	}
};




function getNormalizedCoord(coord, zoom) {
	if (!repeatOnXAxis) return coord;

	var y = coord.y;
	var x = coord.x;

	var tileRange = 1 << zoom;

	if (y < 0 || y >= tileRange) {
		return null;
	}

	if (x < 0 || x >= tileRange) {
		x = (x % tileRange + tileRange) % tileRange;
	}

	return {
		x: x,
		y: y
	};
}