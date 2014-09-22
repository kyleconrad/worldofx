Meteor.publish('locations', function(){
	return Locations.find();
});

Meteor.publish('comics', function(){
	return Comics.find();
});