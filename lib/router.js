Router.configure({
  	layoutTemplate: 'mainLayout',
  	loadingTemplate: 'loading',
	waitOn: function(){
		return Meteor.subscribe('locations');
	}
});

Router.onBeforeAction('loading');

Router.map(function() {
  	this.route('home', {
  		path: '/',
  		action: function() {
    		$('body').removeClass('about-panel-open');
    	},
    	data: function() {
    		return Locations.find();
    	},
    	fastRender: true
  	});
  	this.route('infobox', {
    	path: '/:slug',
    	data: function() {
    		return Locations.findOne({slug: this.params.slug});
    	},
    	onAfterAction: function() {
    		setTimeout(function(){
	    		$('body').addClass('infobox-open');

	    		setTimeout(function(){
	    			var center = new google.maps.LatLng(centerLat, centerLng);

	    			map.setZoom(minViewZoom);
	    			map.panTo(center);
	    		}, 2500);
    		}, 250);
    	}
  	});
});