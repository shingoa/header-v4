if (typeof(jQuery) === "undefined" || !jQuery)
{
    if (typeof(console) !== "undefined")
        console.log("jQuery is not defined. Connect module will not run");
}
else if (typeof($) === "undefined" || !$ || typeof($.templates) === "undefined" || !$.templates)
{
    if (typeof(console) !== "undefined")
        console.log("JSRender not defined. Connect module will not run");
}
else if (typeof(moment) === "undefined" || !moment)
{
    if (typeof(console) !== "undefined")
        console.log("Moment.js is not defined. Connect module will not run");
}
else
{
    (function($) {
        // Pull in the feed data here and dump into .social-feed .content
        // hashtag parser
        String.prototype.parseHashtag = function() {
    		return this.replace(/[#]+[A-Za-z0-9-_]+/g, function(t) {
    			var tag = t.replace("#", "%23");
    			return t
    				.link("http://twitter.com/search?q=" + tag)
    				.replace(/^<a/, '$& target="_blank"');
    		});
        };

        function noSocialError() {
    		var $errorTitle = $('.social-feed-red').attr('data-error-title'),
    		$errorText = $('.social-feed-red').attr('data-error-text');
    		$('.feed').html('<div class="feed-error row no-gutter"><div class="col-md-1 col-sm-1 col-xs-1"><div class="icon"></div></div><div class="col-md-11 col-sm-11 col-xs-11"><div class="error-title">' + $errorTitle + '</div><p>' + $errorText + '</p></div></div>');
        }

        var $feeds = $('.xrx_social_feed').attr('data-handles'),
    		$feedArray = $feeds.split(','),
    		sourceArr = [];

        for (var i = 0; i < $feedArray.length; i++) {
    		var sourceURL = 'source=' + $feedArray[i] + '&';
    		sourceArr.push(sourceURL);
        }
        sourceArr = sourceArr.join("&");

        var $feedsURL = 'http://www.xerox.com/perl-bin/social_aggregator_service.pl?' + sourceArr + 'aggregation_strategy=alternate_by_medium&show_count=2';

        // Begin AJAX call to get the social feed
        $.ajax({
    		type: "GET",
    		url: $feedsURL,
    		dataType: "JSONP",
    		async: true,
    		statusCode: {
    			0: function() {
    				noSocialError();
    			},
    			404: function() {
    				noSocialError();
    			},
    			500: function() {
    				noSocialError();
    			}
    		},
    		error: function() {
    			noSocialError();
    		},
    		success: function(data) {
    	        if (data.length < 1) {
    				noSocialError();
    	        } else {
    				// sort function (backwards)
    				function sortByKey(array, key) {
    					return array.sort(function(b, a) {
    						var x = a[key];
    						var y = b[key];
    						return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    					});
    				}

    				//sort by date
    				data = sortByKey(data, 'updated');
    				var isLiFound = false;

    				//begin the loop
    				for (i = 0; i < data.length; i++)
    				{
                        var obj = {};

    					obj = data[i];
    					obj.title = obj.title || '';
    					obj.excerpt = obj.excerpt || '';
    					obj.link = obj.link || '';
    					obj.id = obj.id || '';
    					obj.native_id = obj.native_id || '';
    					obj.account = obj.account || '';
    					obj.account_name = obj.account_name || '';
    					obj.account_link = obj.account_link || '';
    					obj.source_id = obj.source_id || '';
    					obj.medium = obj.medium || '';
    					obj.image_link = obj.image_link || '';
    					obj.author = obj.author || '';

    					function twitterFormat()
    					{
    						moment.locale('en', {
    							// Format the date for Twitter
    							relativeTime: {
    								future: "in %s",
    								past: "%s ago",
    								s: "s",
    								m: "1m",
    								mm: "%dm",
    								h: "1h",
    								hh: "%dh",
    								d: "1d",
    								dd: "%d d",
    								M: "a month",
    								MM: "%d months",
    								y: "a year",
    								yy: "%d years"
    							}
    						});

    						var currentTime = moment().utc(),
    							postTime = moment(obj.updated).utc();
    						var timeDiff = currentTime.diff(postTime)

    						if (timeDiff > 86400000) {
    							return moment(postTime).format('D MMM')
    						} else {
    							return moment($feed.updatedUTC).fromNow(true);
    						}
    					}

    					function linkedInFormat()
    					{
    						// format the date for linkedIn
    						moment.locale('en', {
    							relativeTime: {
    								future: "in %s",
    								past: "%s ago",
    								s: "seconds",
    								m: "a minute",
    								mm: "%d minutes",
    								h: "1 hour",
    								hh: "%d hours",
    								d: "a day",
    								dd: "%d days",
    								M: "a month",
    								MM: "%d months",
    								y: "a year",
    								yy: "%d years"
    							}
    						});

    						return moment($feed.updatedUTC).fromNow();
                		}

    		            var $newTab;
    		            var $feed = {};

    		            $feed.title = obj.title;
    		            $feed.title_twitter = $feed.title.parseHashtag();
    		            $feed.link = obj.link;
    		            $feed.index = i.toString();
    		            $feed.image = obj.image_link;
    		            $feed.author = obj.author;
    		            $feed.account = obj.account;
    		            $feed.account_name = obj.account_name;
    		            $feed.account_link = obj.account_link;
    		            $feed.excerpt = obj.excerpt;
    		            $feed.media_id = obj.media_id;
    		            $feed.URLexcerpt = encodeURIComponent($feed.excerpt);
    		            $feed.URLtitle = encodeURIComponent($feed.title);
    		            $feed.medium = obj.medium.toLowerCase();
    		            $feed.updatedUTC = moment(obj.updated).utc();
    		            $feed.TWtimeago = twitterFormat();
    		            $feed.LItimeago = linkedInFormat();
    		            $feed.twitter = false;
    		            $feed.facebook = false;
    		            $feed.linkedin = false;

    		            // begin medium-specific items
    					if ($feed.medium === 'twitter')
    					{
    						$feed.twitter = true;

    						$feed.reply = '<a class="reply" target="_blank" href="https://twitter.com/intent/tweet?in_reply_to=' + obj.native_id + '">Reply</a>',
    						$feed.retweet = '<a class="retweet" target="_blank" href="https://twitter.com/intent/retweet?tweet_id=' + obj.native_id + '">Retweet</a>',
    						$feed.favorite = '<a class="favorite" target="_blank" href="https://twitter.com/intent/favorite?tweet_id=' + obj.native_id + '">Favorite</a>',
    						$feed.tweetLink = '<a target="_blank" href="https://twitter.com/XeroxHealthcare/status/' + obj.native_id + '"><span>&middot;</span> ' + $feed.TWtimeago + '</a>';

    					}
    					else if ($feed.medium === 'linkedin')
    					{
    						$feed.linkedin = true;
    						$feed.LIshare = 'https://www.linkedin.com/shareArticle?mini=true&url=' + $feed.link + '&title=' + $feed.URLtitle + '&summary=' + $feed.URLexcerpt + '&source=';

    						if ($feed.excerpt.length > 75) {
    							$feed.excerpt = $feed.excerpt.substr(0, 75) + '...';
    						}
    						if ($feed.title.length > 75) {
    							$feed.title = $feed.title.substr(0, 75) + '...';
    						}
    					}
    					else if ($feed.medium === 'facebook')
    					{
    						$feed.facebook = true;
    						var postID = $feed.media_id.substr(12);
    						if ($feed.title.length > 75) {
    							$feed.title = $feed.title.substr(0, 75) + '...';
    						}
    						$feed.postLink = $feed.account_link + '/posts/' + postID;
    					}
    					else
    					{
    						continue;
    					}

    		            var template = $.templates("#feed-tmpl-js");
    		            var htmlOutput = template.render($feed);

    		            $(".xrx_social_feed").append(htmlOutput);

    					$('.tweet-text a[href^="http://"]').attr('target', '_blank');
    				} // end loop
    			} // end else greater than 0
    		} // end success
    	}); // end ajax
    })(jQuery);
}
