//=require modules/_helpers.js

// Fast <= IE8 check.
//if (!document.addEventListener)
{
	(function(window, document, helpers)
	{
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
								input.checked = true;
							}
							else
							{
								input.focus();
							}
						}
					}
				});
			}

			var inputs = header.getElementsByTagName("input");
			for (var i = 0; i < inputs.length; i++)
			{
				// This adds a checked classes when checked. IE8 doesn't support :checked
				helpers.attachListener(inputs[i], "change", function(evt)
				{
					self.checkCheckboxState();
				});

				// This makes the change event fire properly
				helpers.attachListener(inputs[i], "click", function(evt)
				{
					var input = (event.currentTarget) ? event.currentTarget : event.srcElement;

					if (input.getAttribute("type") === "radio" || input.getAttribute("type") === "checkbox")
					{
						input.blur();
						input.focus();
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
		};

		self.init();

	})(window, document, window.xrx.helpers);
}
