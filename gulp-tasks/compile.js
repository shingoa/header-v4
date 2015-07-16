'use strict';

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var fs = require('fs');

var fileinclude = plugins.fileInclude;
var mustache = plugins.mustache;
var rename = plugins.rename;
var requireDir = plugins.requireDir;

gulp.task('compile', function() {

	fs.readFile('./data/locales.json', function (err, data)
	{
		if (!err)
		{
			var locales = JSON.parse(data);

			locales.forEach(function(locale)
			{
				fs.readFile('./data/config.' + locale.localeCode + '.json', function (err, data)
				{
					if (!err)
					{
						try
						{
							var templateData = JSON.parse(data);

							gulp.src(['./templates/parts/*.html'])
								.pipe(fileinclude({
									prefix: '@@',
									basepath: '@file'
								}))
								.pipe(mustache(templateData))
								.pipe(rename({
									'suffix' : '-' + locale.localeCode
								}))
								.pipe(gulp.dest('./compiled'));
						}
						catch (err)
						{
							console.log(err);
						}
					}
				});
			});
		}
	});
});
