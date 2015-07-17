'use strict';

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var fs = require('fs');

var fileinclude = plugins.fileInclude;
var mustache = plugins.mustache;
var rename = plugins.rename;
var requireDir = plugins.requireDir;

gulp.task('build', function() {

	var locales = ["en-GB"];

	locales.forEach(function(locale)
	{
		fs.readFile('./data/config.' + locale + '.json', function (err, data)
		{
			if (!err)
			{
				try
				{
					var templateData = JSON.parse(data);

					gulp.src(['./templates/mock_pages/*.html'])
						.pipe(fileinclude({
							prefix: '@@',
							basepath: '@file'
						}))
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
