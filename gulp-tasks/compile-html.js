'use strict';

var gulp = require('gulp');
var fs = require('fs');

var mustache = require('gulp-mustache');
var rename = require('gulp-rename');
var requireDir = require('require-dir');
var mergeStream = require("merge-stream");
var xrxhelpers = require('./_helpers.js');

gulp.task('compile-html', ['download-configs'], function()
{
	var merged = mergeStream();

	try
	{
		var version = xrxhelpers.getPackageVersion();

		var locales = xrxhelpers.openJson('./data/locales.json', true);

		locales.locales.push({
			'locale-short' : 'sample'
		});

		locales.locales.forEach(function(locale)
		{
			if (locale.type != "redirect")
			{
				var localeCodeShort = locale['locale-short'];

				try
				{
					var templateData = xrxhelpers.openJson('./data/config.' + localeCodeShort + '.json');

					if (typeof(templateData) !== "undefined" && templateData)
					{
						templateData = xrxhelpers.processTemplateData(templateData);

						merged.add(gulp.src(['./templates/parts/header.mustache', './templates/parts/footer.mustache'])
							.pipe(mustache(templateData))
							.pipe(rename({
								'suffix' : '.' + localeCodeShort,
								'extname' : '.html'
							}))
							.pipe(gulp.dest('./compiled/' + version + '/parts')));
					}
				}
				catch (err)
				{
					console.log(err);
				}
			}
		});

		merged.add(gulp.src(['./templates/parts/head_section.*.mustache'])
			.pipe(mustache({}))
			.pipe(rename({
				'extname' : '.html'
			}))
			.pipe(gulp.dest('./compiled/' + version + '/parts')));
	}
	catch (err)
	{
		console.log(err);
	}

	return merged;
});
