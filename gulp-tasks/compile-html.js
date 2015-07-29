'use strict';

var gulp = require('gulp');
var fs = require('fs');

var mustache = require('gulp-mustache');
var rename = require('gulp-rename');
var requireDir = require('require-dir');
var mergeStream = require("merge-stream");

gulp.task('compile-html', ['download-configs'], function()
{
	var merged = mergeStream();

	fs.readFile('./data/locales.json', { "encoding" : "utf8" }, function (err, data)
	{
		if (!err)
		{
			var data = JSON.parse(data);

			data.locales.forEach(function(locale)
			{
				if (locale.type != "redirect")
				{
					var localeCodeShort = locale['locale-short'];

					fs.readFile('./data/config.' + localeCodeShort + '.json', { "encoding" : "utf8" }, function (err, data)
					{
						if (!err)
						{
							try
							{
								var templateData = JSON.parse(data);

								merged.add(gulp.src(['./templates/parts/header.mustache', './templates/parts/footer.mustache'])
									.pipe(mustache(templateData))
									.pipe(rename({
										'suffix' : '.' + localeCodeShort,
										'extname' : '.html'
									}))
									.pipe(gulp.dest('./compiled/parts')));
							}
							catch (err)
							{
								console.log(err);
							}
						}
					});
				}
			});

			merged.add(gulp.src(['./templates/parts/head_section.*.mustache'])
				.pipe(mustache({}))
				.pipe(rename({
					'extname' : '.html'
				}))
				.pipe(gulp.dest('./compiled/parts')));
		}
		else
		{
			console.log(err);
		}
	});
});
