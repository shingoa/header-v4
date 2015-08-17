//***************************************************************
// log in/out
//***************************************************************
(function(window, document)
{
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
				if (document.getElementById("hdr-bar-log-in"))
					document.getElementById("hdr-bar-log-in").style.display = "none"
				if (document.getElementById("hdr-bar-log-out"))
					document.getElementById("hdr-bar-log-out").style.display = "inline-block"
			}
		}
	}
})(window, document);
