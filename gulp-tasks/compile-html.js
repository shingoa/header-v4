'use strict';

var gulp = require('gulp');
var fs = require('fs');

var mustache = require('gulp-mustache');
var rename = require('gulp-rename');
var requireDir = require('require-dir');
var mergeStream = require("merge-stream");
var xrxhelpers = require('./_helpers.js');
var argv = require('yargs').argv;
var gutil = require('gulp-util');

gulp.task('compile-html', ['init-repo', 'clean', 'download-configs'], function()
{
	var merged = mergeStream();

	try
	{
		var version = xrxhelpers.getPackageVersion();

		var locales = xrxhelpers.getPassedArg("locales");
		if (!locales || !locales.length || locales.length === 0)
		{
			locales = [];

			var data = xrxhelpers.openJson('./data/' + argv.t + '/locales.json', true);
			data.locales.forEach(function(locale)
			{
				if (locale.type != "redirect" && (typeof(locale.redirect) === "undefined" || !locale.redirect))
				{
					locales.push(data.locales['locale-short']);
				}
			});
		}


		locales.forEach(function(locale)
		{
			if (locale.type != "redirect" && (typeof(locale.redirect) === "undefined" || !locale.redirect))
			{
				try
				{
					var templateData = xrxhelpers.openJson('./data/' + argv.t + '/config.' + locale + '.json');

					if (typeof(templateData) !== "undefined" && templateData)
					{
						templateData = xrxhelpers.processTemplateData(templateData, locale);

						templateData.imagePath = "/assets/css/banners/" + version + "/images/";

						merged.add(gulp.src(['./templates/parts/header.mustache', './templates/parts/footer.mustache', './templates/parts/footer.*.mustache'])
							.pipe(mustache(templateData))
							.pipe(rename({
								'suffix' : '.' + locale,
								'extname' : '.html'
							}))
							.pipe(gulp.dest('./compiled/' + argv.t + '/parts/' + version)));
					}
				}
				catch (err)
				{
					gutil.log("Error: " + err);
				}
			}
		});

		merged.add(gulp.src(['./templates/parts/head_section.*.mustache'])
			.pipe(mustache({}))
			.pipe(rename({
				'extname' : '.html'
			}))
			.pipe(gulp.dest('./compiled/' + argv.t + '/parts/' + version)));
	}
	catch (err)
	{
		gutil.log("Compile HTML Error: " + err);
	}

	return merged;
});
