//=require modules/_helpers.js

(function(window, document, helpers)
{
	"use strict";

	var self = {};

	self.init = function()
	{
		self.setupScrollHandler();
		self.setupFeatureDetection();
		self.setupAnchorHandler();
	};

	// This is designed to be a super light version of modernizr just for the little features we need.
	self.setupFeatureDetection = function()
	{
		var htmlElm = document.documentElement;

		if (htmlElm.className.indexOf("svg") == -1)
		{
			var svg = "no-svg";
			if (!!document.createElementNS && !!document.createElementNS('http://www.w3.org/2000/svg', "svg").createSVGRect)
			{
				svg = "svg";
			}

			htmlElm.className = htmlElm.className + " " + svg;
		}

		if (htmlElm.className.indexOf("boxShadow") == -1)
		{
			var boxShadow = "no-boxshadow";
			if (!!(0 + document.createElement('div').style['boxShadow']))
			{
				boxShadow = "boxshadow";
			}

			htmlElm.className = htmlElm.className + " " + boxShadow;
		}

		if (htmlElm.className.indexOf("transform") == -1)
		{
			var transform = "no-csstransforms";
			if (!!(0 + document.createElement('div').style['transform']) ||
				!!(0 + document.createElement('div').style['msTransform']))
			{
				transform = "csstransforms";
			}

			htmlElm.className = htmlElm.className + " " + transform;
		}

		if (navigator.userAgent && navigator.userAgent.match(/trident/i))
		{
			if (typeof(window.atob) !== "undefined") {
			    htmlElm.className = htmlElm.className + " " + "ie-10";
			}
			else if (typeof(document.addEventListener) !== "undefined") {
			    htmlElm.className = htmlElm.className + " " + "ie-9";
			}
			else if (typeof(document.querySelector) !== "undefined") {
			    htmlElm.className = htmlElm.className + " " + "ie-8";
			}
			else {
			    htmlElm.className = htmlElm.className + " " + "ie-unsupported";
			}
		}
	};

	self.setupScrollHandler = function()
	{
		var scrollingClassSetTo;
		helpers.attachListener(document, "scroll", function(evt)
		{
			try {
				var floater = document.getElementById("xrx_bnrv4_header_floater");

				if (helpers.scrollY() > 0 && !scrollingClassSetTo)
				{
					scrollingClassSetTo = true;

					if (floater.className.indexOf("xrx_bnrv4_scrolling") == -1)
						floater.className = floater.className + " xrx_bnrv4_scrolling";
				}
				else if (helpers.scrollY() == 0 && scrollingClassSetTo) {
					scrollingClassSetTo = false;

					floater.className = floater.className.replace("xrx_bnrv4_scrolling", "");
				}
			}
			catch (err) {
				helpers.logError(err);
			}
		});
	};

	self.setupAnchorHandler = function()
	{
		helpers.attachListener(document, "click", function(evt)
		{
			try {
				var a = evt.srcElement || evt.target;

				if (a.nodeName !== "A") {
					while (a && a.nodeName !== "A") {
						a = a.parentNode;
					}
				}

				if (a)
				{
					var href = a.getAttribute("href");

					if (href)
					{
						if (href.indexOf("#") === 0)
						{
							href = href.substr(1);

							var clsFound = false;
							var clsNode = a;

							while (clsNode && !clsFound)
							{
								if (typeof(clsNode.getAttribute) === "function")
								{
									var cls = clsNode.getAttribute("class");

									if (cls && cls.indexOf("xrx_bnr_handle_jump_link") > -1) {
										clsFound = true;
										break;
									} else {
										clsNode = clsNode.parentNode;
									}
								}
								else if (typeof(clsNode.parentNode) !== "undefined") {
									clsNode = clsNode.parentNode;
								}
								else {
									break;
								}
							}

							if (clsFound)
							{
								var target = document.getElementById(href);

								if (target)
								{
									var rect = target.getBoundingClientRect();

									var body = document.body;
		    						var docElem = document.documentElement;

									var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
									var clientTop = docElem.clientTop || body.clientTop || 0;

									var scrollTo = rect.top +  scrollTop - clientTop;

									window.scrollTo(0, scrollTo - 95);

									if (evt.preventDefault)
										evt.preventDefault();

									return false;
								}
							}
						}
					}
				}
			}
			catch (err) {
				helpers.logError(err);
			}
		});
	};

	self.init();

})(window, document, window.xrx.helpers);
