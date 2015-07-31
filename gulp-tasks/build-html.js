'use strict';

var gulp = require('gulp');
var fs = require('fs');
var xrxhelpers = require('./_helpers.js');

var mustache = require('gulp-mustache');
var rename = require('gulp-rename');
var requireDir = require('require-dir');
var mergeStream = require("merge-stream");

gulp.task('build-html', function()
{
	var locales = ["ptbr", "engb", "frfr", "heil", "enus", "sample"];

	var merged = mergeStream();

	locales.forEach(function(locale)
	{
		try
		{
			var templateData = xrxhelpers.openJson('./data/config.' + locale + '.json');
			if (typeof(templateData) !== "undefined" && templateData)
			{
				templateData = xrxhelpers.processTemplateData(templateData);

				var files = fs.readdirSync("./templates/mock_pages/");
				files = xrxhelpers.processMockPageFileList(files, '.' + locale);
				templateData.files = files;

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
			console.log(err);
		}
	});

	return merged;
});
