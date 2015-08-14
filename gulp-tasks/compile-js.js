'use strict';

var gulp = require('gulp');
var argv = require('yargs').argv;
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var xrxhelpers = require('./_helpers.js');
var include = require("gulp-include");

gulp.task('compile-js', ['init-repo'], function ()
{
	var version = xrxhelpers.getPackageVersion();

	return gulp.src('./js/**/*.js')
		.pipe(include())
		.pipe(jshint())
		.pipe(uglify())
		.pipe(gulp.dest('./compiled/' + argv.t + '/js/' + version));
});
