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
				return 'assets/tiles/' + zoom + '/' + normalizedCoord.x + '/' + normalizedCoord.y + '.jpg';
			} else {
				return 'assets/tiles/empty.jpg';
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