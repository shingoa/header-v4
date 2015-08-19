'use strict';

var gulp = require('gulp');
var webserver = require('gulp-webserver');

gulp.task('dev-server', ['watch'], function()
{
	gulp.src('./built')
		.pipe(webserver({
			fallback: 'index.enus.html',
			open : '/built',
			directoryListing : true
		}));
});
