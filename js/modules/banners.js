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
		var scrollingFixedHeaderClassSet;

		var floater = document.getElementById("xrx_bnrv4_header_floater");
		var htmlElm = document.documentElement;

		var scrollingHandler = function()
		{
			try {
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

				if (helpers.scrollY() >= 80 && !scrollingFixedHeaderClassSet)
				{
					scrollingFixedHeaderClassSet = true;

					helpers.addClass(document.getElementById("xrx_bnrv4_header_nav"), "xrx_bnrv4_fixed_header");
					helpers.removeClass(document.getElementById("xrx_bnrv4_header_nav"), "xrx_bnrv4_static_header");
				}
				else if (helpers.scrollY() < 80 && scrollingFixedHeaderClassSet) {
					scrollingFixedHeaderClassSet = false;

					helpers.removeClass(document.getElementById("xrx_bnrv4_header_nav"), "xrx_bnrv4_fixed_header");
					helpers.addClass(document.getElementById("xrx_bnrv4_header_nav"), "xrx_bnrv4_static_header");
				}
			}
			catch (err) {
				helpers.logError(err);
			}
		};

		helpers.attachListener(document, "scroll", scrollingHandler);
		helpers.attachListener(window, "scroll", scrollingHandler);
		scrollingHandler();
	};

	self.setupAnchorHandler = function()
	{
		helpers.attachListener(document, "click", function(evt)
		{
			try {
				var element = evt.srcElement || evt.target;

				if (element.nodeName !== "A" && element.nodeName !== "LABEL") {
					while (element && (element.nodeName !== "A" && element.nodeName !== "LABEL")) {
						element = element.parentNode;
					}
				}

				if (element)
				{
					var target = element.nodeName === "A" ? element.getAttribute("href") : element.getAttribute("for");

					if (target)
					{
						target = target.replace("#", "");

						var clsFound = false;
						var clsNode = element;

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
							var targetElm = document.getElementById(target);

							if (target === "searchString" && window.elc_options && document.getElementById("elc-searchInput-0")) {
								targetElm = document.getElementById("elc-searchInput-0");
							}

							if (targetElm)
							{
								var scrollComplete = function()
								{
									if (targetElm && targetElm.focus) {
										targetElm.focus();
									}
								}

								if(helpers.scrollTo(targetElm, scrollComplete))
								{
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
