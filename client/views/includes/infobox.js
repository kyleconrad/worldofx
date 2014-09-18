Template.infobox.events = {

};

Template.infobox.helpers({

});

Template.infobox.rendered = function() {
	// Meteor.widowControl();

	locations = Locations.find().fetch();
    console.log(locations);
};

