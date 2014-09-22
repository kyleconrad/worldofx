Meteor.startup(function () {
	if(Locations.find().count() === 0){
        var locations = Meteor.locations();
        
        _.each(locations, function(element, index){
        	return Locations.insert(element);
        });
    }

    if(Comics.find().count() === 0){
    	var comicsArray = [];
    	var locations = Meteor.locations();

    	_.each(locations, function(location) {
      		var seriesSplit = location.series.split(',');

      		for (var i=0; i < seriesSplit.length; i++){
      			if (comicsArray.indexOf(seriesSplit[i]) == -1) {
      				comicsArray.push(seriesSplit[i]);
      			}
      		}
    	});

    	// console.log(comicsArray);
    }
});