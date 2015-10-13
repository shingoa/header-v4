'use strict';

var spawn = require('child_process').spawn;
var gulp = require('gulp');
var gutil = require('gulp-util');
var xrxhelpers = require('./_helpers.js');
var webserver = require('gulp-webserver');

gulp.task('build-tests', ['build'], function (cb)
{
	var server = gulp.src('./')
				.pipe(webserver({
					fallback: 'index.enus.html',
					directoryListing : true
				}));


	process.env.PHANTOMJS_EXECUTABLE = './node_modules/casperjs/node_modules/phantomjs/lib/phantom/phantomjs';

	var args = [];

	args.push('test');
	args.push('--tier="' + xrxhelpers.getPassedArg("tier") + '"');
	if (process.env.http_proxy) {
		args.push('--proxy="' + process.env.http_proxy + '"');
	}
	args.push('./tests/');

    var casperChild = spawn('./node_modules/casperjs/bin/casperjs', args);

    casperChild.stdout.on('data', function (data) {
        gutil.log('CasperJS:', data.toString().slice(0, -1));
    });

    casperChild.on('close', function (code) {
        var success = code === 0; // Will be 1 in the event of failure

		gutil.log('CasperJS:', "Close");

        cb();
		process.exit(0);
    });

	casperChild.on('error', function (err) {
        gutil.log('CasperJS:', err);
    });
});
