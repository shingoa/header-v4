'use strict';

var gulp = require('gulp');
var fs = require('fs');

var fileinclude = require('gulp-file-include');
var mustache = require('gulp-mustache');
var rename = require('gulp-rename');
var requireDir = require('require-dir');

gulp.task('compile', ['download-locales'], function() {

	fs.readFile('./data/locales.json', function (err, data)
	{
		if (!err)
		{
			var data = JSON.parse(data);

			data.locales.forEach(function(locale)
			{
				if (locale.type != "redirect")
				{
					var localeCode = locale.locale;

					fs.readFile('./data/config.' + localeCode + '.json', function (err, data)
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
				}
			});
		}
		else
		{
			console.log(err);
		}
	});
});
