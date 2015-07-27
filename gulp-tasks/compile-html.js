'use strict';

var gulp = require('gulp');
var fs = require('fs');

var mustache = require('gulp-mustache');
var rename = require('gulp-rename');
var requireDir = require('require-dir');

gulp.task('compile-html', ['download-locales'], function()
{
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

								gulp.src(['./templates/parts/header.mustache', './templates/parts/footer.mustache'])
									.pipe(mustache(templateData))
									.pipe(rename({
										'suffix' : '-' + localeCode,
										'extname' : '.html'
									}))
									.pipe(gulp.dest('./compiled/parts'));
							}
							catch (err)
							{
								console.log(err);
							}
						}
					});
				}
			});

			gulp.src(['./templates/parts/head_section.*.mustache'])
				.pipe(mustache({}))
				.pipe(rename({
					'extname' : '.html'
				}))
				.pipe(gulp.dest('./compiled/parts'));
		}
		else
		{
			console.log(err);
		}
	});
});
