casper.test.begin('Share', 7, function suite(test)
{
	casper.start("http://localhost:8000/built/index.enus.html");

	casper.viewport(1500, 1000);

	casper.then(function()
	{
		test.assertExists('#xrx_bnrv4_header_share', "Share list item should exist");

		test.assertNotVisible('#xrx_bnrv4_header_share', "Share list item should not be visible");
	});

	// We need to wait for share to load
	casper.waitForSelector('.addthis', function()
	{
		test.assertExists('#xrx_bnrv4_header_share label[for="xrx_bnrv4_header_sharechk"]', "Share link in tertiary nav exists");

		test.assertNotVisible('#xrx_bnrv4_header_share .xrx_bnrv4_header_flyout', "Share flyout should be hidden");
		this.click('#xrx_bnrv4_header_share label[for="xrx_bnrv4_header_sharechk"]');
		test.assertVisible('#xrx_bnrv4_header_share .xrx_bnrv4_header_flyout', "Share flyout should be visible");

		test.assertExists('#xrx_bnrv4_header_share .xrx_bnrv4_share_module', "Share link is in the flyout");

		test.assertExists('#xrx_bnrv4_header_share .xrx_bnrv4_share_module .addthis_button_facebook', "Facebook button exists");
    }, null, 20000);

	casper.run(function() {
        test.done();
    });
});
