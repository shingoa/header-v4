//=require modules/_helpers.js

(function(window, document, helpers, $)
{
	if (typeof($) === "undefined" || !$)
    {
        if (typeof(console) !== "undefined")
            console.log("jQuery is not defined. Content in header module will not run");
    }
	else
	{
		var jQuery = $;

		var self = {};

		var $titles;
		var $navs;

		var $targetTitleElm;
		var $targetContentElm;

		var $activeTitleElm;
		var $activeContentElm;

		self.init = function()
		{
			self.findElements();
			self.setupScrollHander();
		};

		self.findElements = function()
		{
			$targetTitleElm = $("#xrx_bnr_v4_floating_title");
			$targetContentElm = $("#xrx_bnr_v4_floating_content");

			$titles = $(".xrx_bnr_v4_floating_title");
			$contents = $(".xrx_bnr_v4_floating_content");
		};

		self.setupScrollHander = function()
		{
			$(document).scroll(function(evt) {
				self.setFloatingTitle();
				self.setFloatingContent();
			});
		};

		self.setFloatingTitle = function()
		{
			var pos = helpers.scrollY();

			if (pos > 0)
			{
				pos += 50;

				var $activeTitle;

				$titles.each(function() {
					var $title = $(this);

					if (!$activeTitle ||
						($title.offset().top > $activeTitle.offset().top && $title.offset().top < pos))
					{
						$activeTitle = $title;
					}
				});

				if ($activeTitle && $activeTitle.length > 0 && (!$activeTitleElm || $activeTitleElm.get(0) !== $activeTitle.get(0)))
				{
					$targetTitleElm.text($activeTitle.first().text());

					$activeTitleElm = $activeTitle;
				}
			}
			else
			{
				$activeTitleElm = null;
				$targetTitleElm.text("");
			}

			$("#xrx_bnrv4_header").toggleClass("xrx_bnr_v4_floating_title_active", $targetTitleElm.text().length > 0);
		};

		self.setFloatingContent = function()
		{
			var pos = helpers.scrollY();

			if (pos > 0)
			{
				pos += 50;

				var $activeContent;

				$contents.each(function() {
					var $content = $(this);

					if (pos > $content.offset().top || ($activeContent && $content.offset().top < $activeContent.offset().top))
					{
						$activeContent = $content;
					}
				});

				$contents.change(function(evt) {
					var $elm = $(evt.target);
					$elm.attr('value', $elm.val());
				});

				if ($activeContent && $activeContent.length > 0)
				{
					if (!$activeContentElm || $activeContentElm.get(0) !== $activeContent.get(0))
					{
						$targetContentElm.empty()
						$targetContentElm.append($activeContent.children().clone(true, true));
						$targetContentElm.find("*").removeClass();

						$targetContentElm.find("[value]").each(function() {
							$(this).val($(this).attr("value"));
						});

						$activeContentElm = $activeContent;

						$targetContentElm.change(function(evt) {
							var $elm = $(evt.target);

							var nodeName = $elm.prop("nodeName");
							var name = $elm.attr("name");

							var search = "";
							if (nodeName) {
								search += nodeName.toLowerCase();
							}
							if (name) {
								search += "[name='" + name + "']";
							}

							var $matchElm = $activeContentElm.find(search);

							$matchElm.val($elm.val());
							$matchElm.attr("value", $elm.val());
						});
					}

					var $activeLi;
					var $activeLinkTarget;

					$targetContentElm.find("li").each(function(){
						var $li = $(this);
						var $a = $li.children("a[href^='#']");

						$li.removeClass("xrx_bnr_v4_floating_nav_active_current");

						if ($a && $a.length > 0) {
							var $target = $($a.attr("href"));

							if ($target && $target.length > 0)
							{
								if (pos > $target.offset().top || ($activeLinkTarget && $target.offset().top < $activeLinkTarget.offset().top))
								{
									$activeLi = $li;
									$activeLinkTarget = $target;
								}
							}
						}
					});

					if ($activeLi) {
						$activeLi.addClass("xrx_bnr_v4_floating_nav_active_current");
					}
				}
				else
				{
					$activeContentElm = null;
					$targetContentElm.empty();
				}
			}
			else
			{
				$targetContentElm.empty();
			}

			$("#xrx_bnrv4_header").toggleClass("xrx_bnr_v4_floating_content_active", $targetContentElm.children().length > 0);
		};

		self.init();
	}

})(window, document, window.xrx.helpers, window.jQuery);
