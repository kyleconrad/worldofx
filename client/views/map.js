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

	if (isPhone) {
	}
	if (biggerThanPhone && !biggerThanPortrait) {
		centerLng = -110;
	}
	if (biggerThanPortrait && !biggerThanLandscape) {
		centerLng = -105;
	}
	if (biggestScreen) {
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

	var map = new google.maps.Map(document.getElementById('map'), myOptions);
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




	// MAP MARKERS
	var icon = {
        path: "M465.955385,1085.33771 C465.955385,974.693835 376.421538,885 265.978462,885 C155.533846,885 66,974.693835 66,1085.33771 C66,1171.88588 120.786154,1245.61249 197.509231,1273.6214 L216.703077,1332.01425 L265.978462,1482.26945 L315.252308,1332.01425 L334.452308,1273.61831 C411.172308,1245.60941 465.955385,1171.88434 465.955385,1085.33771 L465.955385,1085.33771 Z M265.978462,949.194067 C290.630769,949.194067 314.278462,955.731995 334.958462,967.980206 L265.315385,1037.74893 L196.161538,968.47032 C217.038462,955.903072 240.993846,949.194067 265.978462,949.194067 L265.978462,949.194067 Z M217.812308,1085.33771 L148.832308,1154.44215 C136.606154,1133.72485 130.08,1110.03449 130.08,1085.33771 C130.08,1060.63938 136.606154,1036.94903 148.832308,1016.23172 L217.812308,1085.33771 L217.812308,1085.33771 Z M265.315385,1132.92648 L334.958462,1202.69521 C314.278462,1214.94188 290.630769,1221.48135 265.978462,1221.48135 C240.993846,1221.48135 217.038462,1214.7708 196.161538,1202.20355 L265.315385,1132.92648 L265.315385,1132.92648 Z M312.818462,1085.33771 L382.635385,1015.39637 C395.178462,1036.30941 401.876923,1060.30802 401.876923,1085.33771 C401.876923,1110.3674 395.178462,1134.36446 382.633846,1155.27905 L312.818462,1085.33771 L312.818462,1085.33771 Z",
        fillColor: '#FFFFFF',
        fillOpacity: 1,
        strokeWeight: 0,
        anchor: new google.maps.Point(276, 1450),
        scale: .075
    }

 //    var marker = new google.maps.Marker({
	//     position: new google.maps.LatLng(centerLat, centerLng),
	//     map: map,
	//     draggable: false,
	//     icon: icon
	// });




	// BOUNDARY CHECKING
	var allowedBounds = new google.maps.LatLngBounds(
		new google.maps.LatLng(35, -178),
		new google.maps.LatLng(80, 10)
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

	google.maps.event.addListener(map, 'zoom_changed', function() {
	    checkBounds();

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
	google.maps.event.addListener(map, 'bounds_changed', function() {
	    checkBounds();
	});
	google.maps.event.addListener(map, 'center_changed', function() {
		limitBounds(allowedBounds);
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