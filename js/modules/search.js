//=require modules/_data.js

(function(window, document, $, data)
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

		var xogLang = data.getData("XOGLang");
		if (xogLang)
		{
			var inputs = form.getElementsByTagName("input");

			if (inputs)
			{
				for(var i = 0; i < inputs.length; i++)
				{
					var input = inputs[i];

					if (typeof(input) !== "undefined" && typeof(input.getAttribute) === "function")
					{
						if (input.getAttribute("name") === "XOGlang")
						{
							input.setAttribute("value", xogLang);

							break;
						}
					}
				}
			}
		}

		if (typeof($) !== "undefined" && $)
		{
			var $hdr = $('#xrx_bnrv4_header');
			var tracked = false;

			$(document).on("focus", "#xrx_bnr_hdr_utilitynav_search_form input", function(evt)
			{
				if ($('#xrx_bnrv4_menu_search_btn:visible, #xrx_bnrv4_menu_search_default_btn:visible').length === 0)
				{
					var $chk = $("#xrx_bnrv4_header_menuchk");

					// AB Testing of menu
					if (typeof(window.mboxUpdate) === 'function')
					{
						if (!tracked)
						{
						    mboxUpdate('target-global-mbox', 'searchbox=clicked');
							tracked = true;
						}
					}

					if ($chk.length > 0)
						$chk[0].checked = true;
				}
			});
		}
		else
		{
			if (typeof(console) !== "undefined")
	            console.log("jQuery is not defined. Search box menu opening will not run");
		}
	}

})(window, document, window.jQuery, window.xrx.data);
