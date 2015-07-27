'use strict';

var gulp = require('gulp');

gulp.task('watch', ['build-html', 'build-sass', 'build-images'], function () {
	gulp.watch(['./templates/**/*.html', './templates/**/*.mustache', "./data/*.json"], ['build-html']);
	gulp.watch('./sass/**/*.scss', ['build-sass']);
	gulp.watch('./images/**/*', ['build-images']);
});
