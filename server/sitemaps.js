sitemaps.add('/sitemap.xml', function() {
	var out = [],
		locations = Locations.find().fetch();

	out.push({
		page: '/',
	    changefreq: 'monthly'
	});

	_.each(locations, function(location) {
		out.push({
			page: '/' + location.slug,
			changefreq: 'monthly'
		});
	});

	return out;
});