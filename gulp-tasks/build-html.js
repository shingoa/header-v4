'use strict';

var gulp = require('gulp');
var fs = require('fs');
var xrxhelpers = require('./_helpers.js');

var handlebars = require('gulp-compile-handlebars');
var rename = require('gulp-rename');
var requireDir = require('require-dir');
var mergeStream = require("merge-stream");
var gutil = require('gulp-util');
var minifyHTML = require('gulp-minify-html');

gulp.task('build-html', ['init-repo', 'download-test-configs'], function()
{
	var tier = xrxhelpers.getPassedArg("tier");

	if (tier != "local")
		throw "Builds can only be performed locally"

	var locales = xrxhelpers.getPassedArg("locales");

	if (!locales || !locales.length || locales.length == 0) {
		locales = xrxhelpers.testLocales;
	}

	var handlebarOptions = {
		ignorePartials : true,
		batch : [
			"./templates"
		]
	};

	var merged = mergeStream();

	locales.forEach(function(locale)
	{
		try
		{
			var templateData = xrxhelpers.openJson('./data/local/config.' + locale + '.json');
			if (typeof(templateData) !== "undefined" && templateData)
			{
				templateData = xrxhelpers.processTemplateData(templateData, locale);

				var files = fs.readdirSync("./templates/mock_pages/");
				files = xrxhelpers.processMockPageFileList(files, '.' + locale);
				templateData.files = files;

				templateData.imagePath = "../images/";

				merged.add(gulp.src(['./templates/mock_pages/*.handlebars'])
					.pipe(handlebars(templateData, handlebarOptions).on('error', gutil.log))
					//.pipe(minifyHTML({
					//	'comments' : 'true'
					//}))
					.pipe(rename({
						'suffix' : '.' + locale,
						'extname' : '.html'
					}))
					.pipe(gulp.dest('./built')));
			}
		}
		catch (err)
		{
			gutil.log(err);
		}
	});

	return merged;
});
