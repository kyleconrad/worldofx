Router.configure({
  	layoutTemplate: 'mainLayout',
	waitOn: function(){
		return Meteor.subscribe('locations');
	}
});

Router.map(function() {
  	this.route('home', {
  		path: '/',
  		action: function() {
    		$('body').removeClass('about-panel-open');
    	},
    	data: function() {
    		return Locations.find();
    	}
  	});
});