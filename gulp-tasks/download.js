'use strict';

var gulp = require('gulp');
var fs = require('fs');
var request = require('request');
var source = require('vinyl-source-stream');

gulp.task('download-locales', function()
{
	request("http://www.xerox.com/perl-bin/json_locale_service.pl")
		.pipe(source('locales.json'))
		.pipe(gulp.dest('./data'));
});

gulp.task('download-configs', ['download-locales'], function()
{
	fs.readFile('./data/locales.json', function (err, data)
	{
		if (!err)
		{
			var data = JSON.parse(data);

			data.locales.forEach(function(locale)
			{
				if (locale.type != "redirect")
				{
					var localeCodeShort = locale['locale-short'];

					request("http://psgdev.opbu.xerox.com/assets/json/xrx_bnr_json/v4_header_raw." + localeCodeShort + ".json")
						.pipe(source('config.' + localeCodeShort + '.json'))
						.pipe(gulp.dest('./data'));
				}
			});
		}
	});


});
