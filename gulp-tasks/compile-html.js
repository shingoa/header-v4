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
		var locales = xrxhelpers.openJson('./data/locales.json');

		locales.locales.forEach(function(locale)
		{
			if (locale.type != "redirect")
			{
				var localeCodeShort = locale['locale-short'];

				try
				{
					var templateData = xrxhelpers.openJson('./data/config.' + localeCodeShort + '.json');
					templateData = xrxhelpers.processTemplateData(templateData);

					merged.add(gulp.src(['./templates/parts/header.mustache', './templates/parts/footer.mustache'])
						.pipe(mustache(templateData))
						.pipe(rename({
							'suffix' : '.' + localeCodeShort,
							'extname' : '.html'
						}))
						.pipe(gulp.dest('./compiled/parts')));
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
			.pipe(gulp.dest('./compiled/parts')));
	}
	catch (err)
	{
		console.log(err);
	}

	return merged;
});
