'use strict';

var gulp = require('gulp');
var fs = require('fs');
var request = require('request');
var source = require('vinyl-source-stream');
var mergeStream = require("merge-stream");
var xrxhelpers = require('./_helpers.js');
var argv = require('yargs').argv;

gulp.task('download-locales', ['init-repo', 'clean'], function()
{
	var server = xrxhelpers.getXeroxHttpServer(argv.t);

	return request(server + "perl-bin/json_locale_service.pl")
		.pipe(source('locales.json'))
		.pipe(gulp.dest('./data/' + argv.t));
});

gulp.task('download-configs', ['init-repo', 'clean', 'download-locales'], function()
{
	var merged = mergeStream();

	var server = xrxhelpers.getXeroxHttpServer(argv.t);
	var data = xrxhelpers.openJson('./data/' + argv.t + '/locales.json', true);
	var downloaded = 0;

	data.locales.forEach(function(locale)
	{
		if (locale.type != "redirect")
		{
			var localeCodeShort = locale['locale-short'];
			var savePath = './data/' + argv.t + '/config.' + localeCodeShort + '.json';

			merged.add(request(server + "assets/json/xrx_bnr_json/v4_header_raw." + localeCodeShort + ".json")
				.pipe(source('config.' + localeCodeShort + '.json'))
				.pipe(gulp.dest('./data/' + argv.t)));

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

gulp.task('download-test-configs', ['init-repo', 'clean'], function()
{
	var merged = mergeStream();

	if (argv.t != "local")
		throw "Test configs can only be downloaded on local builds"

	var server = xrxhelpers.getXeroxHttpServer(argv.t);
	var locales = xrxhelpers.testLocales;
	var downloaded = 0;

	locales.forEach(function(locale)
	{
		if(locale.length != 4)
			return;

		var savePath = './data/' + argv.t + '/config.' + locale + '.json';
		var differenceMinutes = xrxhelpers.getFileAgeMinutes(savePath);

		if (typeof(differenceMinutes) === "undefined" ||
			!differenceMinutes ||
			differenceMinutes > 240)
		{
			merged.add(request(server + "assets/json/xrx_bnr_json/v4_header_raw." + locale + ".json")
				.pipe(source('config.' + locale + '.json'))
				.pipe(gulp.dest('./data/' + argv.t)));

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
