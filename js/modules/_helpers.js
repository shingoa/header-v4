(function(window, document)
{
	"use strict";

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
				script.setAttribute("src", config.url);
				script.setAttribute("type", "text/javascript");
				script.setAttribute("defer", "defer");
				document.getElementsByTagName('head')[0].appendChild(script);
			}
		};

		self.attachListener = function(elm, event, callback)
		{
			if (elm)
			{
				var normalise = function(evt)
				{
					if (!evt.currentTarget && evt.srcElement) {
						var currentTarget = evt.srcElement;

						while (currentTarget)
						{
							if (currentTarget === elm)
							{
								evt.currentTarget = currentTarget;
								break;
							}

							currentTarget = currentTarget.parentNode;
						}
					}

					if (callback)
						callback(evt);
				};

				if (elm.addEventListener)
				{
					elm.addEventListener(event, normalise, false);
				}
				else if (elm.attachEvent)
				{
					elm.attachEvent("on" + event, normalise);
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

				if (!elm.className)
				{
					elm.className = cls;
				}
				else if (!re.exec(elm.className))
				{
					elm.className = elm.className + " " + cls;
				}
			}
		};
		self.removeClass = function(elm, cls)
		{
			if (elm && cls && elm.className)
			{
				elm.className = elm.className
					.replace(cls, "")
					.replace("  ", " ")
					.replace("  ", " ")
					.replace("  ", " ");

					if (typeof(String.prototype.trim) == "function")
					{
						elm.className = elm.className.trim();
					}
			}
		};

		self.toggleClass = function(elm, cls, state)
		{
			if (elm && cls)
			{
				if (typeof(state) !== "undefined")
				{
					if (state)
						self.addClass(elm, cls);
					else
						self.removeClass(elm, cls);
				}
				else
				{
					var re = new RegExp("\s?" + cls + "\s?");

					if (re.exec(elm.className))
						self.removeClass(elm, cls);
					else
						self.addClass(elm, cls);
				}
			}
		}

		self.log = function()
		{
			if (typeof(window.console) === "object" && typeof(window.console.log) === "function")
			{
				if (arguments) {
					window.console.log.apply(window.console, arguments);
				}
			}
		}

		self.logError = function(err)
		{
			if (typeof(window.NREUM) !== "undefined" && typeof(window.NREUM.noticeError) !== "undefined") {
				NREUM.noticeError(err)
			}
		}

		self.scrollTo = function(target, scrollComplete)
		{
			try
			{
				if (target)
				{
					var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;

					if (typeof(target.getBoundingClientRect) === "function")
					{
						var rect = target.getBoundingClientRect();

						var body = document.body;
						var docElem = document.documentElement;

						var clientTop = docElem.clientTop || body.clientTop || 0;

						target = rect.top +  scrollTop - clientTop;
					}

					if (typeof(target) === "number")
					{
						target = target - 95;
						var dist = target - scrollTop;

						var smooth_step = function(start, end, point) {
					        if(point <= start) { return 0; }
					        if(point >= end) { return 1; }
					        var x = (point - start) / (end - start); // interpolation
					        return x*x*(3 - 2*x);
					    }

						var animTime = 500;
						var fr = 60;
						var segments = Math.round((1000 / animTime) * 60);
						var segmentTime = animTime / segments;

						// This needs to be changed to request animation frame at some point.
						// Probably when we drop IE8 support
						var segment = 0;
						var interval = setInterval(function()
						{
							var point = smooth_step(0, segments, segment);
							var to = scrollTop + (dist * point)

							window.scrollTo(0, to);

							segment++;
							if (segment >= segments) {
								clearInterval(interval);

								if (scrollComplete) {
									scrollComplete();
								}
							}
						}, segmentTime)

						return true;
					}
				}
			}
			catch (err)
			{
				self.logError(err);
			}

			return false;
		}
	}

})(window, document);
