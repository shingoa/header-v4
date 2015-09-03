'use strict';

var gulp = require('gulp');
var fs = require('fs');
var xrxhelpers = require('./_helpers.js');

var mustache = require('gulp-mustache');
var rename = require('gulp-rename');
var requireDir = require('require-dir');
var mergeStream = require("merge-stream");
var argv = require('yargs').argv;
var gutil = require('gulp-util');

gulp.task('build-html', ['init-repo', 'download-test-configs'], function()
{
	if (argv.t != "local")
		throw "Builds can only be performed locally"

	var locales = xrxhelpers.getPassedArg("locales");

	if (!locales || !locales.length || locales.length == 0) {
		locales = xrxhelpers.testLocales;
	}

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

				merged.add(gulp.src(['./templates/mock_pages/*.mustache'])
					.pipe(mustache(templateData))
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
