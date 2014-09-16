Template.nav.events = {
	// ABOUT PANEL
	'click #about-link': function (e) {
		$('body').toggleClass('about-panel-open');
		e.preventDefault;
	}
};

Template.nav.rendered = function() {
	Meteor.widowControl();
};