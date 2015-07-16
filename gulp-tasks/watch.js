'use strict';

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

gulp.task('watch', function () {
	gulp.watch(['./templates/**/*.html', './templates/**/*.mustache', "./data/*.json"], ['build']);
	gulp.watch('./sass/**/*.scss', ['sass']);
});
