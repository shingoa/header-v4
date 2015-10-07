// /W3Dev/nomigrate/GitHub/Banner
'use strict';

var gulp = require('gulp');
var fs = require('fs');
var request = require('request');

var mergeStream = require("merge-stream");
var xrxhelpers = require('./_helpers.js');
var argv = require('yargs').argv;
var gutil = require('gulp-util');

gulp.task('compile-and-push-to-lamp', ['compile-zip'], function()
{
	var merged = mergeStream();

	var tier = xrxhelpers.getPassedArg("tier");

	var targets = [];

	if (tier == "dev") {
		targets.push("http://wvlnxas08.opbu.xerox.com/perl-bin/receive_versioned_banner.pl");
	}
	else if (tier == "test") {
		targets.push("http://wvlnxas06.opbu.xerox.com/perl-bin/receive_versioned_banner.pl");
		targets.push("http://wvlnxas07.opbu.xerox.com/perl-bin/receive_versioned_banner.pl");
	}
	else if (tier == "prod") {
		targets.push("http://w3adminp.opbu.xerox.com/perl-bin/receive_versioned_banner.pl");
	}
	else {
		gutil.log("Cannot push to " + tier + " tier");
	}

	var releaseFile = fs.readFileSync('./dist/' + tier + '.zip');

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
							filename: tier + '.zip',
							contentType: "application/zip"
						}
					}
				}
			};

			merged.add(request.post(options, function(err, resp, body) {

				if (err)
				{
					gutil.log("ERROR: ", err);
					throw err;
				}
				else
				{
					if (resp.statusCode == 201)
					{
						gutil.log("Uploaded complete. Ready to test on ", tier);
					}
					else if (resp.statusCode == 202)
					{
						gutil.log("Uploaded complete. Awaiting processing and replication on ", tier);
					}
					else if (resp.statusCode == 400)
					{
						gutil.log("Uploaded error on ", tier);
						gutil.log(body);
						throw body;
					}
					else
					{
						gutil.log("Uploaded complete. Unknown status on ", tier);
					}
				}
			}));
		});
	}

	return merged;
});
