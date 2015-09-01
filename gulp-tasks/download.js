'use strict';

var gulp = require('gulp');
var fs = require('fs');
var request = require('request');
var source = require('vinyl-source-stream');
var mergeStream = require("merge-stream");
var xrxhelpers = require('./_helpers.js');
var argv = require('yargs').argv;
var iconv  = require('iconv-lite');
var gutil = require('gulp-util');

iconv.extendNodeEncodings();

gulp.task('download-locales', ['init-repo', 'clean'], function()
{
	var server = xrxhelpers.getXeroxHttpServer(argv.t);

	var cacheBuster = Math.floor((Math.random() * 100) + 1);

	return request(server + "perl-bin/json_locale_service.pl?cacheBuster=" + cacheBuster)
		.on("response", function(resp)
		{
			gutil.log("Downloaded locale config");
		})
		.pipe(source('locales.json'))
		.pipe(gulp.dest('./data/' + argv.t));
});

gulp.task('download-configs', ['init-repo', 'clean', 'download-locales'], function()
{
	var merged = mergeStream();

	var data = xrxhelpers.openJson('./data/' + argv.t + '/locales.json', true);
	var downloaded = 0;

	data.locales.forEach(function(locale)
	{
		if (locale.type != "redirect" && (typeof(locale.redirect) === "undefined" || !locale.redirect))
		{
			var localeCodeShort = locale['locale-short'];
			var savePath = './data/' + argv.t + '/config.' + localeCodeShort + '.json';

			var uri = xrxhelpers.getConfigPath(argv.t, localeCodeShort);

			var requestOptions  = {
				encoding: null,
				method: "GET",
				uri: uri,
				headers: {
					"Cache control" : "no-cache"
				}
			};

			var req = request(requestOptions)
				.on("response", function(resp)
				{
					gutil.log("Downloaded config for " + locale['locale-short']);

					if (resp.statusCode < 300)
					{
						req
							.pipe(source('config.' + localeCodeShort + '.json'))
							.pipe(gulp.dest('./data/' + argv.t));
					}
				});

			merged.add(req);

			downloaded++;
		}
	});

	if (downloaded == 0)
	{
		// This may seem weird but without it the download task stalls in the case that it doesn't need
		// to download any updated files.
		// I'd rather that didn't happen
		merged.add(
			gulp.src('./data/config.*.json')
		);
	}

	return merged;
});

gulp.task('download-test-configs', ['init-repo'], function()
{
	var merged = mergeStream();

	if (argv.t != "local")
		throw "Test configs can only be downloaded on local builds"

	var locales = xrxhelpers.testLocales;
	var downloaded = 0;

	locales.forEach(function(locale)
	{
		if(locale.length != 4)
			return;

		var savePath = './data/' + argv.t + '/config.' + locale + '.json';
		var differenceMinutes = xrxhelpers.getFileAgeMinutes(savePath);

		var cacheBuster = Math.floor((Math.random() * 100) + 1);

		if (typeof(differenceMinutes) === "undefined" ||
			!differenceMinutes ||
			differenceMinutes > 240)
		{
			var uri = xrxhelpers.getConfigPath(argv.t, locale);

			var requestOptions  = {
				encoding: null,
				method: "GET",
				uri: uri,
				headers: {
					"Cache-Control" : "no-cache"
				}
			};

			var req = request(requestOptions)
				.on("response", function(resp)
				{
					gutil.log("Downloaded config for " + locale);

					if (resp.statusCode < 300)
					{
						req
							.pipe(source('config.' + locale + '.json'))
							.pipe(gulp.dest('./data/' + argv.t));
					}
				});
			merged.add(req);

			downloaded++;
		}
	});

	if (downloaded == 0)
	{
		// This may seem weird but without it the download task stalls in the case that it doesn't need
		// to download any updated files.
		// I'd rather that didn't happen
		merged.add(
			gulp.src('./data/config.*.json')
		);
	}

	return merged;
});
