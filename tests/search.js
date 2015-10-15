casper.test.begin('Search without elicit', 5, function suite(test)
{
	casper.start("http://localhost:8000/built/index.enus.html");

	casper.viewport(1500, 1000);

	casper.then(function() {
        test.assertExists('form#xrx_bnr_hdr_utilitynav_search_form input[name="searchString"]', "Search box is found");

		this.fillSelectors('form#xrx_bnr_hdr_utilitynav_search_form', {
			'input[name="searchString"]' :    'phaser'
        }, true);
    });

	casper.waitForUrl(/.*\/search-results\/.*/, function() {
        test.assertUrlMatch(/q=phaser/, "Search term has been submitted");
		test.assertUrlMatch(/locale=en_US/, "Locale has been submitted");
		test.assertUrlMatch(/js_avail=1/, "JS available has been submitted");

		test.assertExists('#xrx_search_results', "Found search results");
    }, null, 10000);

	casper.run(function() {
        test.done();
    });
});
