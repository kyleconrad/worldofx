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
    	},
    	data: function() {
    		return Locations.find();
    	},
    	onAfterAction: function() {
    		document.title = "World Of X - An Interactive Exploration of the World of Marvel's X-Men";
    	},
    	fastRender: true
  	});
  	this.route('infobox', {
    	path: '/:slug',
    	data: function() {
    		return Locations.findOne({slug: this.params.slug});
    	},
    	onAfterAction: function() {
    		document.title = "World Of X - " + this.data().title + " - An Interactive Exploration of the World of Marvel's X-Men";
    		setTimeout(function(){
	    		$('body').addClass('infobox-open');
    		}, 250);
    	}
  	});
});