(function(window, document)
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
	}

})(window, document);
