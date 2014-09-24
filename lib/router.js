Router.configure({
  	layoutTemplate: 'mainLayout',
  	loadingTemplate: 'loading',
	waitOn: function() {
		return [
			Meteor.subscribe('locations'),
			Meteor.subscribe('comics')
		];
	}
});

Router.onBeforeAction('loading');

Router.map(function() {
  	this.route('home', {
  		path: '/',
  		action: function() {
    		$('body').removeClass('about-panel-open');
    		if (isMobile) {
    			$('body').addClass('mobile');
				$('#blam, #map-fullscreen, .map-label').remove();
			}
    	},
    	data: function() {
    		return Locations.find();
    	},
    	onAfterAction: function() {
    		document.title = "World Of X - An Interactive Exploration of the World of Marvel's X-Men";

    		setTimeout(function(){
    			$('#mainloader').addClass('completed');
    		}, 2400);
    		setTimeout(function(){
    			$('#mainloader').addClass('hidden');
    		}, 2825);
    	},
    	fastRender: true
  	});
  	this.route('infobox', {
    	path: '/:slug',
    	data: function() {
    		return Locations.findOne({slug: this.params.slug});
    	},
    	onAfterAction: function() {
    		$('body').removeClass('about-panel-open');
    		if (isMobile) {
    			$('body').addClass('mobile');
				$('#blam, #map-fullscreen, .map-label').remove();
			}

    		document.title = "World Of X - " + this.data().title + " - An Interactive Exploration of the World of Marvel's X-Men";
    		setTimeout(function(){
	    		$('body').addClass('infobox-open');
    		}, 250);

    		setTimeout(function(){
    			$('#mainloader').addClass('completed');
    		}, 2550);
    		setTimeout(function(){
    			$('#mainloader').addClass('hidden');
    		}, 2975);
    	}
  	});
});