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

		for (var i=0; i < comicsArray.length; i++){
	    	var comicID = comicsArray[i],
	    		url = "http://gateway.marvel.com/v1/public/series/" + comicID,
				date = new Date();
				hash = CryptoJS.MD5(date + marvelPrivatekey + marvelPublickey).toString();

			var result = HTTP.get(url, {params:{
				ts: date,
				apikey: marvelPublickey,
				hash: hash }
			});
			var singleComic = result.data.data.results;
			
			Comics.insert(singleComic);
		}
    }
});