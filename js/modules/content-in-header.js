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
		var $targetNavElm;

		self.init = function()
		{
			self.findElements();
			self.setupScrollHander();
		};

		self.findElements = function()
		{
			$targetTitleElm = $("#xrx_bnr_v4_floating_title");
			$targetNavElm = $("#xrx_bnr_v4_floating_nav");

			$titles = $(".xrx_bnr_v4_floating_title");
			$navs = $(".xrx_bnr_v4_floating_nav");
		};

		self.setupScrollHander = function()
		{
			$(document).scroll(function(evt) {
				self.setFloatingTitle();
				self.setFloatingNav();
			});
		};

		self.setFloatingTitle = function()
		{
			var pos = helpers.scrollY();

			if (pos > 0)
			{
				var $activeTitle;

				$titles.each(function() {
					var $title = $(this);

					if (!$activeTitle || ($title.offset().top < $activeTitle.offset().top && $title.offset().top > pos))
					{
						$activeTitle = $title;
					}
				});

				if ($activeTitle && $activeTitle.length > 0)
				{
					$targetTitleElm.text($activeTitle.first().text());
				}
			}
			else
			{
				$targetTitleElm.text("");
			}

			$("#xrx_bnrv4_header").toggleClass("xrx_bnr_v4_floating_title_active", $targetTitleElm.text().length > 0);
		};

		self.setFloatingNav = function()
		{
			var pos = helpers.scrollY();

			if (pos > 0)
			{
				var $activeNav;

				$navs.each(function() {
					var $nav = $(this);

					if (pos > $nav.offset().top || ($activeNav && $nav.offset().top < $activeNav.offset().top))
					{
						$activeNav = $nav;
					}
				});

				if ($activeNav && $activeNav.length > 0)
				{
					$targetNavElm.empty()
					$targetNavElm.append($activeNav.children().clone(true, true));

					var $activeLi;
					var $activeLinkTarget;

					$targetNavElm.children().each(function(){
						var $li = $(this);
						var $a = $li.children("a[href^='#']");

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
					$targetNavElm.empty();
				}
			}
			else
			{
				$targetNavElm.empty();
			}

			$("#xrx_bnrv4_header").toggleClass("xrx_bnr_v4_floating_nav_active", $targetNavElm.children().length > 0);
		};

		self.init();
	}

})(window, document, window.xrx.helpers, window.jQuery);
