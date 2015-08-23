//=require modules/_helpers.js

// Fast <= IE8 check.
if (!document.addEventListener)
{
	(function(window, document, helpers)
	{
		"use strict";

		var self = {};

		self.init = function()
		{
			self.setupCheckboxHandlers();
		};

		self.setupCheckboxHandlers = function()
		{
			var header = document.getElementById("xrx_bnrv4_header");
			var labels = header.getElementsByTagName("label");

			self.checkCheckboxState();

			for (var i = 0; i < labels.length; i++)
			{
				// This makes labels work properly
				helpers.attachListener(labels[i], "click", function(evt)
				{
					var label = (event.currentTarget) ? event.currentTarget : event.srcElement;
					var forAttr = label.getAttribute("for");

					if (forAttr)
					{
						var input = document.getElementById(forAttr);

						if (input)
						{
							if (input.getAttribute("type") === "radio" || input.getAttribute("type") === "checkbox")
							{
								try {
									input.focus();
								} catch (err) {};

								input.checked = true;

								try {
									input.blur();
								} catch (err) {};

								self.checkCheckboxState();
							}
							else
							{
								input.focus();
							}
						}
					}
				});
			}
		};

		// This sets up the inital checkbox state
		self.checkCheckboxState = function()
		{
			var header = document.getElementById("xrx_bnrv4_header");
			var inputs = header.getElementsByTagName("input");

			for (var i = 0; i < inputs.length; i++)
			{
				var input = inputs[i];

				if (typeof(input) !== "undefined" && input)
				{
					if (input.getAttribute("type") === "radio" || input.getAttribute("type") === "checkbox")
					{
						if (input.checked === true) {
							helpers.addClass(input, "checked");
						} else {
							helpers.removeClass(input, "checked");
						}
					}
				}
			}

			helpers.toggleClass(document.body, "xrx_poke_ie8");
		};

		self.init();

	})(window, document, window.xrx.helpers);
}
