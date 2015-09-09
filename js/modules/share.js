//=require modules/_helpers.js

(function(window, document, helpers, metrics)
{
	var self = {};

	self.init = function()
	{
		self.loadAddThisIfRequired();
	};

	self.loadAddThisIfRequired = function()
	{
		if (typeof(window.addthis) == 'undefined')
		{
			setTimeout(function()
			{
				if (typeof(window.addthis) == 'undefined')
				{
					helpers.log("Share module is missing AddThis, loading...");

					var script = document.createElement("script");
					script.setAttribute("src", "http://s7.addthis.com/js/250/addthis_widget.js?pub=xeroxinteractive");
					script.setAttribute("type", "text/javascript");

					helpers.attachListener(script, "load", function(evt)
					{
						helpers.log("AddThis loaded");

						var interval = setInterval(function() {
							var complete = self.initShare();

							if (complete) {
								clearInterval(interval);
							}
						},
						250);
					});

					document.body.appendChild(script);
				}
				else
				{
					self.initShare();
					window.addthis.toolbox();
				}

			}, 2000);
		}
		else
		{
			self.initShare();
			window.addthis.toolbox();
		}
	};

	self.initComplete = false;
	self.initShare = function()
	{
		if (!self.initComplete)
		{
			if (typeof(window.addthis) !== 'undefined')
			{
				initComplete = true;

				window.addthis.addEventListener('addthis.ready', function()
				{
					self.addThisReady();
				});

				window.addthis.addEventListener('addthis.menu.share', function(evt)
				{
					if (evt.type == 'addthis.menu.share')
					{
						switch (evt.data.service)
						{
							case "email" :
								metrics.trackLink("hdr-pre-int-share-email");
								share_type = 'email';
								break;
							case "print" :
								metrics.trackLink("hdr-pre-int-share-print");
								break;
							default :
								metrics.trackLink("hdr-pre-int-share-social-network");
								break;
						}
					}
				});

				if (window.addthis.ost) {
					self.addThisReady();
				}

				setTimeout(function() {
					self.addThisReady();
				}, 1000);

				return true;
			}
		}

		return false;
	};

	self.addThisReady = function()
	{
		var htmlElm = document.documentElement;
		if (htmlElm.className.indexOf("addthis") === -1)
		{
			helpers.log("AddThis ready");

			htmlElm.className = htmlElm.className + " addthis";
		}
	};

	self.init();

})(window, document, window.xrx.helpers, window.xrx.metrics);
