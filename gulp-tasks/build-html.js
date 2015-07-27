'use strict';

var gulp = require('gulp');
var fs = require('fs');
var xrxhelpers = require('./_helpers.js');

var mustache = require('gulp-mustache');
var rename = require('gulp-rename');
var requireDir = require('require-dir');

gulp.task('build-html', function() {

	var locales = ["en_GB", "chris"];

	locales.forEach(function(locale)
	{
		fs.readFile('./data/config.' + locale + '.json', function (err, data)
		{
			if (!err)
			{
				try
				{
					var templateData = JSON.parse(data);
					templateData = xrxhelpers.processTemplateData(templateData);

					var files = fs.readdirSync("./templates/mock_pages/");
					files = xrxhelpers.processMockPageFileList(files, '-' + locale);
					templateData.files = files;

					gulp.src(['./templates/mock_pages/*.mustache'])
						.pipe(mustache(templateData))
						.pipe(rename({
							'suffix' : '-' + locale,
							'extname' : '.html'
						}))
						.pipe(gulp.dest('./built'));
				}
				catch (err)
				{
					console.log(err);
				}
			}
			else {
				console.log(err);
			}
		});
	});
});
