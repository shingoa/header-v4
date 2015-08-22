//=require modules/_metrics.js
//=require modules/_helpers.js

(function(window, document, metrics, helpers)
{
	"use strict";

	var V4_ELEMENT_IDS = ["xrx_bnrv4_header", "xrx_bnrv4_footer"];

	var searchForm = document.getElementById("xrx_bnr_hdr_utilitynav_search_form");
	if (searchForm)
	{
		helpers.attachListener(searchForm, "submit", function() {
			metrics.trackLink("hdr-search-submit");
		});
	}

	for (var i = 0; i < V4_ELEMENT_IDS.length; i++)
	{
		var elm = document.getElementById(V4_ELEMENT_IDS[i]);

		if (elm)
		{
			var labels = elm.getElementsByTagName("label");

			for (var j = 0; j < labels.length; j++)
			{
				helpers.attachListener(labels[j], "click", function(evt) {
					var clickTarget = evt.currentTarget;
					var lid = metrics.determineLid(clickTarget);

					metrics.trackLink(lid);
				});
			}
		}
	}

})(window, document, window.xrx.metrics, window.xrx.helpers);
