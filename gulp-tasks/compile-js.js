'use strict';

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var xrxhelpers = require('./_helpers.js');
var include = require("gulp-include");
var mergeStream = require("merge-stream");

gulp.task('compile-js', ['init-repo'], function ()
{
	var version = xrxhelpers.getPackageVersion();
	var tier = xrxhelpers.getPassedArg("tier");

	var merged = mergeStream();

	if (tier == "prod" || tier == "test")
	{
		merged.add(gulp.src('./js/xrx_bnrv4.js')
			.pipe(include())
			.pipe(jshint())
			.pipe(uglify())
			.pipe(gulp.dest('./compiled/' + tier + '/js/' + version)));

		merged.add(gulp.src('./js/xrx_bnrv4.ie8.js')
			.pipe(include())
			.pipe(jshint())
			.pipe(uglify())
			.pipe(gulp.dest('./compiled/' + tier + '/js/' + version)));

		merged.add(gulp.src('./js/libs.js')
			.pipe(include())
			.pipe(jshint())
			.pipe(uglify())
			.pipe(gulp.dest('./compiled/' + tier + '/js/' + version)));
	}
	else
	{
		merged.add(gulp.src('./js/xrx_bnrv4.js')
			.pipe(include())
			.pipe(jshint())
			.pipe(gulp.dest('./compiled/' + tier + '/js/' + version)));

		merged.add(gulp.src('./js/xrx_bnrv4.ie8.js')
			.pipe(include())
			.pipe(jshint())
			.pipe(gulp.dest('./compiled/' + tier + '/js/' + version)));

		merged.add(gulp.src('./js/libs.js')
			.pipe(include())
			.pipe(jshint())
			.pipe(gulp.dest('./compiled/' + tier + '/js/' + version)));
	}

	return merged;
});
