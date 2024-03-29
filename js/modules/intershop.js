//***************************************************************
// log in/out
//***************************************************************
(function(window, document)
{
	"use strict";

	var cookies = document.cookie;

	// set state of login/logout link correctly
	if (cookies && cookies.length > 0)
	{
		var offset = cookies.indexOf("xrxCookies");

		if (offset != -1)
		{
			var xrxcookie = cookies.substring(offset);
			offset = xrxcookie.indexOf(";");

			if (offset != -1)
			{
				xrxcookie = xrxcookie.substring(0, offset);
			}

			var pattern = /UserID=[0-9]/i;
			if (pattern.exec(xrxcookie) != null && cookies.indexOf("iPlanetDirectoryPro") != -1)
			{
				if (document.getElementById("xrx_bnrv4_header_secondary_log-in"))
					document.getElementById("xrx_bnrv4_header_secondary_log-in").style.display = "none"
				if (document.getElementById("xrx_bnrv4_header_secondary_log-out"))
					document.getElementById("xrx_bnrv4_header_secondary_log-out").style.display = "inline-block"
				if (document.getElementById("xrx_bnrv4_header_secondary_log-out_mobile"))
					document.getElementById("xrx_bnrv4_header_secondary_log-out_mobile-out").style.display = "block"
			}
		}
	}
})(window, document);

//***************************************************************
// Portal header substitution
//***************************************************************

// I will optimise this code and strip out the jQuery once it is finished
// Until then I'm adding some safety

(function(window, document, $)
{
	if (typeof($) === "undefined" || !$)
	{
		if (typeof(console) !== "undefined")
			console.log("jQuery is not defined. Intershop replacement will not run");
	}
	else
	{
		var jQuery = $;

		function xrx_bnr_v4_intershop_header_substitution()
		{
			var xrx_ish_request_time = new Date();

			jQuery.ajax({
				url: "https://www.xerox.com/perl-bin/p_xrx_ish_proxy_v4.pl",
				data: xrx_extranet_credentials.cookie_values,
				cache: true,
				dataType: "jsonp",
				jsonpCallback: "ish",
			    tryCount : 0,
			    retryLimit : 3,
				async: true,
				success: function(data)
				{
		  			if (typeof data.portal_home_url !== 'undefined')
					{
						jQuery("#xrx_bnrv4_header_nav_tertiary").html('<li id="xrx_bnrv4_header_contact"><a href="'+data.portal_home_url+'">Back to Portal Home &amp; Main Navigation</a></li>').show();
						jQuery("a.xrx_bnrv4_logo").attr("href","#");
		  			}

		  			// log success
		  			var xrx_ish_trycount = this.tryCount;
					var xrx_ish_interval = new Date() - xrx_ish_request_time;
					// wait 5 seconds, then log
					setTimeout(function () {
		  				jQuery.ajax({
							url: "https://www.xerox.com/perl-bin/xrx_ish_proxy_log.pl",
							data: {"success": "true", "retry": xrx_ish_trycount, "url": document.location.toString(), "interval": xrx_ish_interval},
							dataType: "jsonp",
							async: true
						});
					},5000);
				},
				error: function()
				{
			        this.tryCount++;
			        if (this.tryCount <= this.retryLimit)
					{
			            //try again
			            $.ajax(this);
			        }
					else
					{
			          	// exceeded retry limit
						// log failure
						var xrx_ish_trycount = this.tryCount;
						var xrx_ish_interval = new Date() - xrx_ish_request_time;
						// wait 5 seconds, then log
						setTimeout(function () {
							jQuery.ajax({
								url: "https://www.xerox.com/perl-bin/xrx_ish_proxy_log.pl",
								data: {"success": "false", "retry": xrx_ish_trycount, "url": document.location.toString(), "interval": xrx_ish_interval},
								dataType: "jsonp",
								async: true
							});
						},5000);
					}
				},
				timeout: 10000
			});
		}

		// re-test object existence just to make sure we can't error
		// don't replace if we have custom banners
		if (typeof(xrx_use_extranet_banners) === "function")
		{
			if (xrx_use_extranet_banners() && jQuery(".xrx_bnr_partner").length == 0) {
				xrx_bnr_v4_intershop_header_substitution();
				jQuery("ul#xrx_bnr_v3_ftr_links").html("<li class=\"xrx_bnr_first\"><a href=\"http://www.xerox.com/about-xerox/privacy-policy/enus.html\">Privacy</a></li><li><a href=\"http://www.xerox.com/about-xerox/website-terms-of-use/enus.html\">Legal</a></li><li><a href=\"http://www.xerox.com/about-xerox/privacy-policy/enus.html#adchoices\">Privacy Choices</a></li>");
			} else {
				//alert('test failed');
			}
		}
		else
		{
			//alert('function not found');
		}
	}
})(window, document, window.jQuery);
