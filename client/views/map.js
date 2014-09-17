repeatOnXAxis = true;

Template.mainLayout.rendered = function() {
	var minViewZoom = 4,
		maxViewZoom = 7;
	var centerLat = 68,
		centerLng = -93;

	// screen size dependent variables
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