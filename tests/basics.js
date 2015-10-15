casper.test.begin('Basic stuff', 5, function suite(test)
{
	casper.start("http://localhost:8000/built/index.enus.html");

	casper.viewport(1500, 1000);

	casper.then(function() {
        test.assertExists('#xrx_bnrv4_header_floater .xrx_bnrv4_logo', "Logo is found");

		test.assertExists('#xrx_bnrv4_header_nav #xrx_bnrv4_header_nav_primary', "Primary nav exists");
		test.assertExists('#xrx_bnrv4_header_nav #xrx_bnrv4_header_nav_primary > li', "Primary nav should have at least 1 nav element");

		test.assertExists('#xrx_bnrv4_header_nav #xrx_bnrv4_header_nav_secondary', "Secondary nav exists");

		test.assertExists('#xrx_bnrv4_header_floater #xrx_bnrv4_header_nav_tertiary', "Tertiary nav exists");
    });

	casper.run(function() {
        test.done();
    });
});
