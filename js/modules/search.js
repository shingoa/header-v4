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
				if ($('#xrx_bnrv4_menu_search_btn:visible, #xrx_bnrv4_menu_search_default_btn:visible').length === 0)
				{
					var $chk = $("#xrx_bnrv4_header_menuchk");

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

})(window, document, window.jQuery);
