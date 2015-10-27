(function(window, document)
{
	"use strict";

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
				self.xrx_vars = self.pullAndStandardise(xrx_vars);
			}
			if (typeof(xrx_bnrv4_vars) !== "undefined") {
				self.xrx_bnrv4_vars = self.pullAndStandardise(xrx_bnrv4_vars);
			}
			if (typeof(xrx_bnr_vars) !== "undefined") {
				self.xrx_bnr_vars = self.pullAndStandardise(xrx_bnr_vars);
			}

			var xerox_data_elm = document.getElementById("xerox-data");
			if (xerox_data_elm)
			{
				for(var i = 0; i < xerox_data_elm.attributes.length; i++)
				{
					var attr = xerox_data_elm.attributes[i];

					if (attr.name.indexOf("data-") == 0)
					{
						self.xerox_data[attr.name.toLowerCase().replace("data-", "")] = attr.value.toLowerCase();
					}
				}
			}
		}

		self.pullAndStandardise = function(obj)
		{
			if (obj)
			{
				var returnObj = {};

				for (var property in obj) {
	    			if (obj.hasOwnProperty(property)) {
						if (typeof(obj[property]) === "string")
	        				returnObj[property.toLowerCase()] = obj[property].toLowerCase();
						else
							returnObj[property.toLowerCase()] = obj[property];
	    			}
				}

				return returnObj;
			}

			return null;
		}

		self.getData = function(key)
		{
			var val = null;

			if (typeof(key) === "string")
			{
				key = key.toLowerCase();

				if (!val && self.xrx_bnr_vars && self.xrx_bnr_vars[key]) {
					val = self.xrx_bnr_vars[key];
				}
				if (!val && self.xerox_data && self.xerox_data[key]) {
					val = self.xerox_data[key];
				}
				if (!val && self.xrx_vars && self.xrx_vars[key]) {
					val = self.xrx_vars[key];
				}
				if (!val && self.xrx_bnrv4_vars && self.xrx_bnrv4_vars[key]) {
					val = self.xrx_bnrv4_vars[key];
				}
				if (!val && key === "xoglang") {
					if (typeof(navigator.language) !== "undefined") {
						val = navigator.language;
					} else if (typeof(navigator.languages) !== "undefined") {
						val = navigator.languages[0];
					}
				}

				if (val)
				{
					if (key === "xoglang")
					{
						if (val.length == 5) {
							val = val.substr(0,2) + "_" + val.substr(3,2).toUpperCase();
						} else if (val.length == 4) {
							val = val.substr(0,2) + "_" + val.substr(2,2).toUpperCase();
						}
					}
				}
			}

			return val;
		}

		self.getLob = function()
		{
			return self.getData("lob");
		}

		self.init();

		window.xrx.data = self;
	}
})(window, document);
