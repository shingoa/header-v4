// /W3Dev/nomigrate/GitHub/Banner
'use strict';

var gulp = require('gulp');
var fs = require('fs');
var request = require('request');

var mergeStream = require("merge-stream");
var xrxhelpers = require('./_helpers.js');
var argv = require('yargs').argv;

gulp.task('compile-push-to-lamp', ['compile-zip'], function()
{
	var merged = mergeStream();

	var targets = [];

	if (argv.t == "dev") {
		targets.push("http://dev.office.xerox.com:4080/perl-bin/receive_versioned_banner.pl?2");
	}
	//else if (argv.t == "test") {
	//}
	//else if (argv.t == "prod") {

	//}
	else {
		console.log("Cannot push to " + argv.t + " tier");
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
				console.log("Uploaded");
			}));
		});
	}

	return merged;
});
