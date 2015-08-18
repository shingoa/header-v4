// /W3Dev/nomigrate/GitHub/Banner
'use strict';

var gulp = require('gulp');
var fs = require('fs');
var request = require('request');

var mergeStream = require("merge-stream");
var xrxhelpers = require('./_helpers.js');
var argv = require('yargs').argv;
var gutil = require('gulp-util');

gulp.task('compile-and-push-to-lamp', ['clean', 'compile-zip'], function()
{
	var merged = mergeStream();

	var targets = [];

	if (argv.t == "dev") {
		targets.push("http://wvlnxas08.opbu.xerox.com/perl-bin/receive_versioned_banner.pl");
	}
	else if (argv.t == "test") {
		targets.push("http://wvlnxas06.opbu.xerox.com/perl-bin/receive_versioned_banner.pl");
		targets.push("http://wvlnxas07.opbu.xerox.com/perl-bin/receive_versioned_banner.pl");
	}
	else if (argv.t == "prod") {
		targets.push("http://w3adminp.opbu.xerox.com/perl-bin/receive_versioned_banner.pl");
	}
	else {
		gutil.log("Cannot push to " + argv.t + " tier");
	}

	var releaseFile = fs.readFileSync('./dist/' + argv.t + '.zip');

	if (releaseFile)
	{
		targets.forEach(function(target)
		{
			var options = {
				url: target,
				headers : {
					"User-Agent" : "Gulp",
					"Content-Type" : "multipart/form-data"
				},
				formData : {
					dist : {
						value : releaseFile,

						options : {
							filename: argv.t + '.zip',
							contentType: "application/zip"
						}
					}
				}
			};

			merged.add(request.post(options, function(err, resp, body) {
				gutil.log("Uploaded");
			}));
		});
	}

	return merged;
});
