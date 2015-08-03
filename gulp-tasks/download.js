'use strict';

var gulp = require('gulp');
var fs = require('fs');
var request = require('request');
var source = require('vinyl-source-stream');
var mergeStream = require("merge-stream");
var xrxhelpers = require('./_helpers.js');

gulp.task('download-locales', function()
{
	return request("http://www.xerox.com/perl-bin/json_locale_service.pl")
		.pipe(source('locales.json'))
		.pipe(gulp.dest('./data'));
});

gulp.task('download-configs', ['download-locales'], function()
{
	var merged = mergeStream();

	var data = xrxhelpers.openJson('./data/locales.json', true);
	var downloaded = 0;

	data.locales.forEach(function(locale)
	{
		if (locale.type != "redirect")
		{
			var localeCodeShort = locale['locale-short'];
			var savePath = './data/config.' + localeCodeShort + '.json';
			var differenceMinutes = xrxhelpers.getFileAgeMinutes(savePath);

			if (typeof(differenceMinutes) === "undefined" ||
				!differenceMinutes ||
				differenceMinutes > 120)
			{
				merged.add(request("http://psgdev.opbu.xerox.com/assets/json/xrx_bnr_json/v4_header_raw." + localeCodeShort + ".json")
					.pipe(source('config.' + localeCodeShort + '.json'))
					.pipe(gulp.dest('./data')));

				downloaded++;
			}
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