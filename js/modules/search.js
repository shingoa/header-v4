(function(window, document, $)
{
	"use strict";

	var form = document.getElementById("xrx_bnr_hdr_utilitynav_search_form");

	if (form)
	{
		var field = document.createElement("input");
		field.setAttribute("type", "hidden");
		field.setAttribute("name", "js_avail");
		field.setAttribute("value", "1");

		form.appendChild(field);

		if (typeof($) !== "undefined" && $)
		{
			var $hdr = $('#xrx_bnrv4_header');

			$(document).on("focus blur", "#xrx_bnr_hdr_utilitynav_search_form input", function(evt)
			{
				$hdr.toggleClass("xrx_bnr_hdr_search_active", evt.type == "focusin");
			});
		}
		else
		{
			if (typeof(console) !== "undefined")
	            console.log("jQuery is not defined. Search box menu opening will not run");
		}
	}

})(window, document, window.jQuery);
