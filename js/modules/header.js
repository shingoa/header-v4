//=require modules/_helpers.js

(function(window, document, helpers)
{
	var self = {};

	self.init = function()
	{
		self.setupScrollHandler();
		self.setupFeatureDetection();
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
			if (!!(0 + document.createElement('div').style['transform']))
			{
				transform = "csstransforms";
			}

			htmlElm.className = htmlElm.className + " " + transform;
		}
	};

	self.setupScrollHandler = function()
	{
		var scrollingClassSetTo;
		helpers.attachListener(document, "scroll", function(evt)
		{
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
		});
	};

	self.init();

})(window, document, window.xrx.helpers);
