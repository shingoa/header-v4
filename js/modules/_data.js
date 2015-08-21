(function(window, document)
{
	if (typeof(window.xrx) == "undefined") {
		window.xrx = {};
	}
	if (typeof(window.xrx.data) == "undefined")
	{
		var self = {};

		self.xrx_vars = {};
		self.xrx_bnrv4_vars = {};
		self.xrx_bnr_vars = {};
		self.xerox_data = {};

		self.init = function()
		{
			if (typeof(xrx_vars) !== "undefined") {
				self.xrx_vars = xrx_vars;
			}
			if (typeof(xrx_bnrv4_vars) !== "undefined") {
				self.xrx_bnrv4_vars = xrx_bnrv4_vars;
			}
			if (typeof(xrx_bnr_vars) !== "undefined") {
				self.xrx_bnr_vars = xrx_bnr_vars;
			}

			var xerox_data_elm = document.getElementById("xerox-data");
			if (xerox_data_elm)
			{
				for(var i = 0; i < xerox_data_elm.attributes.length; i++)
				{
					var attr = xerox_data_elm.attributes[i];

					if (attr.indexOf("data-") == 0)
					{
						self.xerox_data[attr.replace("data-", "")] = xerox_data_elm.getAttribute(attr);
					}
				}
			}
		}

		self.getLob = function()
		{
			if (self.xrx_bnr_vars && self.xrx_bnr_vars.LOB) {
				return self.xrx_bnr_vars.LOB;
			}

			if ()

			return null;
		}

		self.init();

		window.xrx.data = self;
	}
})(window, document);
