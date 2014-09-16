Meteor.startup(function () {
	// USER AGENTS
	var b = document.documentElement;
	b.setAttribute('data-useragent',  navigator.userAgent);
	b.setAttribute('data-platform', navigator.platform );
	b.className += ((!!('ontouchstart' in window) || !!('onmsgesturechange' in window))?' touch':'');


	// WIDOW CONTROL
	Meteor.widowControl();
});