(function($, moment)
{
    'use strict';

    var BASE_FEED_URL = 'https://www.xerox.com/perl-bin/social_aggregator_service.pl?aggregation_strategy=alternate_by_medium';

    if (typeof($) === "undefined" || !$)
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
        var jQuery = $;

        var self = {};

        self.init = function()
        {
            var $feeds = $('.xrx_social_feed');

            $feeds.each(function()
            {
                var $feed = $(this);

                var handles = self.getHandles($feed);

                if (handles)
                {
                    var handlesArr = handles.split(",");
                    var handlesQs = "&source=" + handlesArr.join("&source=");

                    var count = $feed.attr("data-count") || '2';

                    var url = BASE_FEED_URL + "&show_count=" + count + handlesQs;

                    $.ajax({
                		type: "GET",
                		url: url,
                		dataType: "JSONP",
                		async: true,
                		error: function() {
                			self.setNoFeedError($feed);
                		},
                		success: function(data) {
                            self.handleData(data, $feed);
                        }
                    });
                }
                else
                {
                    self.setNoFeedError($feed);
                }
            });
        }

        self.getHandles = function($feed)
        {
            if ($feed)
            {
                var handles = $feed.closest("[data-handles]").attr("data-handles");
                if (handles) return handles;

                handles = $("meta[name='xerox:socialfeed:handles']").attr("content");
                if (handles) return handles;

                handles = $feed.closest("[data-handles-default]").attr("data-handles-default");
                if (handles) return handles;

                var handles = $("[data-handles]").attr("data-handles");
                if (handles) return handles;

                handles = $("[data-handles-default]").attr("data-handles-default");
                if (handles) return handles;
            }

            return null;
        }

        self.setNoFeedError = function($feed)
        {
            $feed.text("Unable to load social feed. Please try later.");
        }

        self.handleData = function(data, $feed)
        {
            $feed.empty();

            if (!data || data.length < 1)
            {
                self.setNoFeedError($feed);
            }
            else
            {
                var template = $.templates("#feed-tmpl-js");

                // sort function (backwards)
                var sortByKey = function(array, key) {
                    return array.sort(function(b, a) {
                        var x = a[key];
                        var y = b[key];
                        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
                    });
                }

                //sort by date
                data = sortByKey(data, 'updated');

                //begin the loop
                for (var i = 0; i < data.length; i++)
                {
                    var obj = data[i];
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
                    obj.medium = obj.medium.toLowerCase();
                    obj.index = i.toString();
                    obj.URLexcerpt = encodeURIComponent(obj.excerpt);
                    obj.URLtitle = encodeURIComponent(obj.title);
                    obj.updatedUTC = moment(obj.updated).utc();
                    obj[obj.medium] = true;

                    if (obj.medium === 'twitter')
                    {
                        obj.title = self.parseHashTag(obj.title);
                        obj.time_ago = self.twitterFormatDate(obj);
                    }
                    else if (obj.medium === 'linkedin')
                    {
                        obj.time_ago = self.linkedInFormatDate(obj);

                        if (obj.excerpt.length > 75) {
                            obj.excerpt = obj.excerpt.substr(0, 75) + '...';
                        }
                        if (obj.title.length > 75) {
                            obj.title = obj.title.substr(0, 75) + '...';
                        }
                    }
                    else if (obj.medium === 'facebook')
                    {
                        obj.time_ago = self.linkedInFormatDate(obj);

                        var postID = obj.media_id.substr(12);
                        if (obj.title.length > 75) {
                            obj.title = obj.title.substr(0, 75) + '...';
                        }
                        obj.postLink = obj.account_link + '/posts/' + postID;
                    }
                    else
                    {
                        continue;
                    }

                    var htmlOutput = template.render(obj);

                    $feed.append(htmlOutput);
                } // end loop
            } // end else greater than 0

            $feed.find('.tweet-text a[href^="http://"]').attr('target', '_blank');
        }

        self.parseHashTag = function(txt) {
            return txt.replace(/[#]+[A-Za-z0-9-_]+/g, function(t) {
    			var tag = t.replace("#", "%23");
    			return t
    				.link("http://twitter.com/search?q=" + tag)
    				.replace(/^<a/, '$& target="_blank"');
    		});
        };

        self.twitterFormatDate = function(obj)
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
                return moment(obj.updatedUTC).fromNow(true);
            }
        }

        self.linkedInFormatDate = function(obj)
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

            return moment(obj.updatedUTC).fromNow();
        }

        self.init();
    }
})(window.jQuery, window.moment);
