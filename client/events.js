Template.nav.events = {
	'click #about-link': function (e) {
		$('body').toggleClass('about-panel-open');
		e.preventDefault;
	}
};