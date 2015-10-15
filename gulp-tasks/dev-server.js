'use strict';

var gulp = require('gulp');
var webserver = require('gulp-webserver');

gulp.task('dev-server', ['watch'], function()
{
	gulp.src('./')
		.pipe(webserver({
			fallback: 'index.enus.html',
			open : '/built/index.enus.html',
			directoryListing : true
		}));
});
