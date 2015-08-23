(function(window, document)
{
	"use strict";

	var countrySelector = document.getElementById("xrx_bnrv4_header_country_selector");
	if(countrySelector && countrySelector.children)
	{
		for(var i = 0; i < countrySelector.children.length; i++)
		{
			var child = countrySelector.children[i];

			if (child && child.nodeName === "A")
			{
				var href = child.getAttribute("href");

				if (href && href.match(/.html$/i))
				{
					child.setAttribute("href", href + "?url=" + encodeURIComponent(window.location.href));
				}
			}
		}
	}

})(window, document);
