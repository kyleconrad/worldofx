Meteor.startup(function () {
	if(Locations.find().count() === 0){
        var locations = Meteor.locations();
        
        _.each(locations, function(element, index){
        	return Locations.insert(element);
        });
    }
});