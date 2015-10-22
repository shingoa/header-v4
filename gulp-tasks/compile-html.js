'use strict';

var gulp = require('gulp');
var fs = require('fs');

var handlebars = require('gulp-compile-handlebars');
var rename = require('gulp-rename');
var requireDir = require('require-dir');
var mergeStream = require("merge-stream");
var xrxhelpers = require('./_helpers.js');
var gutil = require('gulp-util');
var minifyHTML = require('gulp-minify-html');

gulp.task('compile-html', ['init-repo', 'download-configs'], function()
{
	var merged = mergeStream();

	var version = xrxhelpers.getPackageVersion();
	var locales = xrxhelpers.getLocales("locales");
	var tier = xrxhelpers.getPassedArg("tier");

	var handlebarOptions = {
		ignorePartials : true,
		batch : [
			"./templates"
		]
	};

	locales.forEach(function(locale)
	{
		if (locale.type != "redirect" && (typeof(locale.redirect) === "undefined" || !locale.redirect))
		{
			try
			{
				var templateData = xrxhelpers.openJson('./data/' + tier + '/config.' + locale + '.json');

				if (typeof(templateData) !== "undefined" && templateData)
				{
					templateData = xrxhelpers.processTemplateData(templateData, locale);

					templateData.imagePath = "/assets/css/banners/" + version + "/images/";

					merged.add(gulp.src(['./templates/parts/header.handlebars', './templates/parts/footer.handlebars', './templates/parts/footer.*.handlebars'])
						.pipe(handlebars(templateData, handlebarOptions).on('error', gutil.log))
						.pipe(minifyHTML({
							'comments' : true,
							'quotes' : true
						}))
						.pipe(rename({
							'suffix' : '.' + locale,
							'extname' : '.html'
						}))
						.pipe(gulp.dest('./compiled/' + tier + '/parts/' + version)));
				}
			}
			catch (err)
			{
				gutil.log("Error: " + err);
			}
		}
	});

	merged.add(gulp.src(['./templates/parts/head_section.*.handlebars'])
		.pipe(handlebars({}, handlebarOptions).on('error', gutil.log))
		.pipe(rename({
			'extname' : '.html'
		}))
		.pipe(gulp.dest('./compiled/' + tier + '/parts/' + version)));

	return merged;
});
