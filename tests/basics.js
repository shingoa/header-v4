casper.test.begin('Basic stuff', 5, function suite(test)
{
	casper.start("built/index.enus.html", function() {
        test.assertExists('#xrx_bnrv4_header_floater .xrx_bnrv4_logo', "Logo is found");

		test.assertExists('#xrx_bnrv4_header_nav #xrx_bnrv4_header_nav_primary', "Primary nav exists");
		test.assertElementCount('#xrx_bnrv4_header_nav #xrx_bnrv4_header_nav_primary > li', 5, "Primary nav should have 5 elements");

		test.assertExists('#xrx_bnrv4_header_nav #xrx_bnrv4_header_nav_secondary', "Secondary nav exists");

		test.assertExists('#xrx_bnrv4_header_floater #xrx_bnrv4_header_nav_tertiary', "Tertiary nav exists");
    });

	casper.run(function() {
        test.done();
    });
});

casper.run();
