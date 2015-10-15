'use strict';

var gulp = require('gulp');

gulp.task('watch', ['build'], function () {

	gulp.watch(['./templates/**/*.handlebars', "./data/**/*.json"], ['build-html']);
	gulp.watch('./sass/**/*.scss', ['build-sass']);
	gulp.watch('./images/**/*', ['build-images']);
	gulp.watch('./js/**/*', ['build-js']);
});
