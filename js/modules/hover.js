//=require modules/_helpers.js

(function(window, document, helpers) {
	var htmlElm = document.documentElement;

	if (window.navigator && window.navigator.maxTouchPoints)
	{
		var touching = false;
		var touch = false;
		var timeout = null;

		var handler = function(e) {
			if (e.type == "touchstart") {
				touching = true;
			}
			else if (e.type == "touchend") {
				touch = true;
				touching = false;

				if (timeout) {
					clearTimeout(timeout);
				}

				timeout = setTimeout(function() {
					touch = false;
				}, 500);
			}

			helpers.toggleClass(htmlElm, "xrx-mouse", !touch && !touching);
			helpers.toggleClass(htmlElm, "xrx-touch", touch || touching);
		}

		helpers.attachListener(htmlElm, "touchend", handler);
		helpers.attachListener(htmlElm, "touchstart", handler);
		helpers.attachListener(htmlElm, "mousemove", handler);

		helpers.addClass(htmlElm, "xrx-touch");
	}
	else
	{
		helpers.addClass(htmlElm, "xrx-mouse");
	}

})(window, document, window.xrx.helpers);
