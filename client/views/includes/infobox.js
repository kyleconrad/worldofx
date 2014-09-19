Template.infobox.events = {

};

Template.infobox.helpers({

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