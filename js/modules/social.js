(function(window, document, $)
{
    "use strict";

    if (typeof($) === "undefined" || !$)
    {
        if (typeof(window.console) !== "undefined")
            window.console.log("jQuery is not defined. Social module will not run");
    }
    else
    {
        var self = {};

        self.updateSocialLinks = function()
        {
            $("meta[name^='xerox:social:'][content]").each(function()
            {
                var $metaTag = $(this);
                var url = $metaTag.attr("content");
                var name = $metaTag.attr("name");

                if (name)
                {
                    var network = name.replace("xerox:social:", "");

                    var $networkIcon = $("#xrx_links_social_" + network);

                    if ($networkIcon && $networkIcon.length)
                    {
                        if (url) {
                            $networkIcon.attr("href", url);
                        } else {
                            $networkIcon.remove();
                        }
                    }
                }
            });
        }
        self.updateSocialLinks();

    }
})(window, document, window.jQuery);
