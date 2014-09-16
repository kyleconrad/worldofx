Router.configure({
  	layoutTemplate: 'mainLayout'
});

Router.map(function() {
  	this.route('home', {
  		path: '/',
  		action: function() {
    		$('body').removeClass('about-panel-open');
    	}
  	});

  	// this.route('aboutPage', {
   //  	path: '/about',
   //  	action: function() {
   //  		$('body').addClass('about-panel-open');
   //  	},
   //  	onAfterAction: function(){
   //  		console.log(Router.current().path);
  	// 	}
  	// });
});