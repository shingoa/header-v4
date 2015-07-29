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
	var locales = ["ptbr", "engb", "frfr", "heil"];

	var merged = mergeStream();

	locales.forEach(function(locale)
	{
		fs.readFile('./data/config.' + locale + '.json', { "encoding" : "utf8" }, function (err, data)
		{
			if (!err)
			{
				try
				{
					var templateData = JSON.parse(data);
					templateData = xrxhelpers.processTemplateData(templateData);

					//console.log(templateData.header.primaryNav.services);
					//throw "stop: " + templateData.header.primaryNav.services.label;

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
