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
	singleSeries: function(series) {
		var seriesSplit = series.split(',');
		return seriesSplit;
	},
	comicURL: function() {
    	var singleID = parseInt(this.valueOf());
    	return Comics.findOne({id: singleID}).urls[0].url;
  	},
  	comicCover: function() {
  		var singleID = parseInt(this.valueOf());
  		return Comics.findOne({id: singleID}).thumbnail.path + '.' + Comics.findOne({id: singleID}).thumbnail.extension;
  	},
  	comicTitle: function() {
  		var singleID = parseInt(this.valueOf());
  		return Comics.findOne({id: singleID}).title;
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