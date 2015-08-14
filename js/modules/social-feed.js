//=require modules/_helpers.js

(function(xrx)
{
    var feedUrl = 'http://www.xerox.com/perl-bin/social_aggregator_service.pl?aggregation_strategy=alternate_by_medium&show_count=2';

    if (typeof(window.xrx) == "undefined") {
		window.xrx = {};
	}
	if (typeof(window.xrx.socialFeed) == "undefined")
	{
        var self = {};
		window.xrx.socialFeed = self;

        self.loadFeed = function()
        {

        }
    }

})(window.xrx);
