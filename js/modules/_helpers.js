(function(window, document)
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

		self.attachListener = function(elm, event, callback)
		{
			if (elm)
			{
				if (elm.addEventListener)
				{
					elm.addEventListener(event, callback, false);
				}
				else if (elm.attachEvent)
				{
					elm.attachEvent("on" + event, callback);
				}
			}
		};

		self.scrollY = function()
		{
			return (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
		};

		self.addClass = function(elm, cls)
		{
			if (elm && cls)
			{
				var re = new RegExp("\s?" + cls + "\s?");

				if (!elm.className || !re.exec(elm.className))
				{
					elm.className = elm.className + " " + cls;
				}
			}
		};
		self.removeClass = function(elm, cls)
		{
			if (elm && cls && elm.className)
			{
				elm.className = elm.className.replace(cls, "");
			}
		};

		self.toggleClass = function(elm, cls)
		{
			if (elm && cls)
			{
				var re = new RegExp("\s?" + cls + "\s?");

				if (re.exec(elm.className))
					self.removeClass(elm, cls);
				else
					self.addClass(elm, cls);
			}
		}
	}

})(window, document);
