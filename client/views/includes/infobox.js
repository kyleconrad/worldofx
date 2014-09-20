Template.infobox.events = {
	'click #backlink': function (e) {
		$('body').removeClass('infobox-open');
		setTimeout(function(){
			Router.go('/');
		}, 1500);
		e.preventDefault;
	}
};

Template.infobox.helpers({
	comics: function() {
    	return Comics.find();
  	}
});

Template.infobox.rendered = function() {
	$(function(){
		Meteor.widowControl();

		if (!isMobile) {
			$('.location-info').nanoScroller({
				contentClass: 'scroll-container',
				sliderMinHeight: 40,
				sliderMaxHeight: 200,
				preventPageScrolling: true,
				disableResize: true
			});
		}
	});
};