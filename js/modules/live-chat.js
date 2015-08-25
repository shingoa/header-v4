//=require modules/_helpers.js
//=require modules/_data.js

(function(window, document, helpers, data)
{
	"use strict";

	var agentOnlineUrl = "https://rs.instantservice.com/resources/smartbutton/5590/$dept/available.gif";

	if (typeof(window.xrx) == "undefined") {
		window.xrx = {};
	}
	if (typeof(window.xrx.liveChat) == "undefined")
	{
		var self = {};

		self.init = function()
		{
			var lnk = self.getLink();
			if (lnk)
			{
				var dept = self.getDept(lnk);

				if (dept)
				{
					var imgUrl = agentOnlineUrl.replace("$dept", dept);

					var imgTag = document.createElement("img");
					imgTag.setAttribute('src', imgUrl);
					imgTag.style.width = '1px';
					imgTag.style.width = '1px';
					document.body.appendChild(imgTag);

					helpers.attachListener(imgTag, "load", function() {
						self.handleAgentsOnline();
					});
					helpers.attachListener(imgTag, "error", function() {
						self.handleNoAgentsOnline();
					});

					imgTag.style.display = "none";
				}
			}
		}

		self.getDept = function(chatUrl)
		{
			if (chatUrl)
			{
				var matcher = /dept=(\d+)/i;
				var results = matcher.exec(chatUrl)
				if (results)
				{
					return results[1];
				}
			}

			return null;
		}

		self.getLink = function()
		{
			var liveChatLink = xrx.data.getData("liveChatLink");
			if (liveChatLink)
			{
				return liveChatLink;
			}

			var liveChatData = xrx.data.getData("livechat");
			if (liveChatData)
			{
				var lob = xrx.data.getLob();

				if (lob === "psg" && liveChatData.psgLiveChatLink) {
					return liveChatData.psgLiveChatLink;
				}
				else if (lob === "xog" && liveChatData.xogLiveChatLink) {
					return liveChatData.xogLiveChatLink
				}
			}

			return null;
		}

		self.handleAgentsOnline = function()
		{
			var lnk = self.getLink();

			var liveChatData = xrx.data.getData("livechat");
			if (liveChatData && lnk)
			{
				var text = liveChatData.chatLabel;

				self.setLinks(lnk, text);
			}
		}

		self.handleNoAgentsOnline = function()
		{
			var lnk = self.getLink();
			var liveChatData = xrx.data.getData("livechat");

			if (liveChatData && lnk)
			{
				lnk += "&notavail=1";
				var text = liveChatData.emailLabel;

				self.setLinks(lnk, text);
			}
		}

		self.setLinks = function(url, text)
		{
			if (url && text)
			{
				self.setListLink(url, text, document.getElementById("xrx_bnrv4_header_contact"));
				self.setListLink(url, text, document.getElementById("xrx_bnrv4_lobfooter_sales"));
			}
		}

		self.setListLink = function(url, text, elm)
		{
			if(url && text && elm)
			{
				var findList = elm.getElementsByTagName("ul");

				if (findList && findList.length > 0)
				{
					var list = findList[0];

					var liTag = document.createElement("li");
					list.appendChild(liTag);

					var aTag = document.createElement("a");
					aTag.setAttribute('href', url);
					aTag.setAttribute('target', "_blank");
					aTag.innerHTML = text;
					liTag.appendChild(aTag);

					helpers.attachListener(aTag, "click", function(evt) {
						window.open( url, 'chat_client', 'width=600,height=400,scrollbars=0' );

						if (evt.preventDefault)
							evt.preventDefault();

						return false;
					});
				}
			}
		}
		if (document.getElementById('xrx_bnrv4_lobfooter'))
			self.init();
	}

})(window, document, window.xrx.helpers, window.xrx.data);
