//=require modules/_helpers.js

(function(window, document, helpers)
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

})(window, document, window.xrx.helpers);
