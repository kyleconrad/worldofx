Meteor.widowControl = function() {
	if (windowWidth > 640) {
		$('h1, h2, h3, li, p, figcaption').each(function() {
		    $(this).html($(this).html().replace(/\s((?=(([^\s<>]|<[^>]*>)+))\2)\s*$/,'&nbsp;$1'));
		});
	}
}