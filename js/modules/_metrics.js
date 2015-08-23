(function(window)
{
	"use strict";

	if (typeof(window.xrx) == "undefined") {
		window.xrx = {};
	}
	if (typeof(window.xrx.metrics) == "undefined")
	{
		var self = {};
		window.xrx.metrics = self;

		self.trackLink = function(id)
		{
			if  ( typeof(xrx_hbx_proxy) !== 'undefined' && xrx_hbx_proxy.xrxLink )
			{
				xrx_hbx_proxy.xrxLink(id);
			}
		}

		self.determineLid = function(elm)
		{
			if (elm)
			{
				var nameAttr = elm.getAttribute("name");

				if (nameAttr)
				{
					var lidMatch = /lid=([^&]+)/i;
					var lidMatches = lidMatch.exec(nameAttr);
					if (lidMatches)
					{
						return lidMatches[1];
					}
				}

				if (elm.textContent)
				{
					return elm.textContent;
				}
			}

			return null;
		}
	}

})(window);
