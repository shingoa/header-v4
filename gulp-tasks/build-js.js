'use strict';

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var include = require("gulp-include");
var mergeStream = require("merge-stream");
var xrxhelpers = require('./_helpers.js');

gulp.task('build-js', ['init-repo'], function ()
{
	var tier = xrxhelpers.getPassedArg("tier");

	if (tier != "local")
		throw "Builds can only be performed locally"

	var merged = mergeStream();

	merged.add(gulp.src('./js/xrx_bnrv4.js')
		.pipe(include())
		.pipe(jshint())
		.pipe(gulp.dest('./built/js')));

	merged.add(gulp.src('./js/xrx_bnrv4.ie8.js')
		.pipe(include())
		.pipe(jshint())
		.pipe(gulp.dest('./built/js')));

	merged.add(gulp.src('./js/libs.js')
		.pipe(include())
		.pipe(jshint())
		.pipe(gulp.dest('./built/js')));

	merged.add(gulp.src('./js/vendor/**/*.js')
		.pipe(jshint())
		.pipe(gulp.dest('./built/js/vendor')));

	return merged;
});
