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

	data.locales.forEach(function(locale)
	{
		if (locale.type != "redirect")
		{
			var localeCodeShort = locale['locale-short'];
			var savePath = './data/config.' + localeCodeShort + '.json';
			var differenceMinutes = xrxhelpers.getFileAgeMinutes(savePath);

			if (differenceMinutes > 120)
			{
				merged.add(request("http://psgdev.opbu.xerox.com/assets/json/xrx_bnr_json/v4_header_raw." + localeCodeShort + ".json")
					.pipe(source('config.' + localeCodeShort + '.json'))
					.pipe(gulp.dest('./data')));
			}
		}
	});

	return merged;
});
