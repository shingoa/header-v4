//=require modules/_data.js

(function(window, xrx_hbx_proxy, data)
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

			if (xrx.data.getData("tier") == "dev" && typeof(window.console) !== "undefined" && window.console)
			{
				window.console.log("Manual link track: " + id);
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

})(window, window.xrx_hbx_proxy, window.xrx.data);
