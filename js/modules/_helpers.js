"use strict";

(function(window)
{
	if (typeof(window.xrx) == "undefined") {
		window.xrx = {};
	}
	if (typeof(window.xrx.helpers) == "undefined")
	{
		var self = {};
		window.xrx.helpers = self;

		self.jsonp = function(config)
		{
			var method;

			if (config.url)
			{
				var match = config.url.match("callback=([^&]*)");
				if (match && match[1] && match[1] !== "?")
				{
					method = match[1];
				}
			}

			while (!method || typeof(window[method]) !== "undefined")
			{
				method = "xrxjsonp_" + (Math.random() + 1).toString(36).substring(7);
			}

			window[method] = function(data)
			{
				if(typeof(config.success) == "function")
				{
					config.success.call(this, data);
				}
			}

			if(config.url)
			{
				if (config.url.indexOf("?") > -1) {
					config.url += "&callback=" + method;
				} else {
					config.url += "?callback=" + method;
				}

				var script = document.createElement('script');
				script.src = config.url;
				document.getElementsByTagName('head')[0].appendChild(script);
			}
		};
	}

})(window);
