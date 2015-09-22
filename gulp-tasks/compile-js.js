'use strict';

var gulp = require('gulp');
var argv = require('yargs').argv;
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var xrxhelpers = require('./_helpers.js');
var include = require("gulp-include");
var mergeStream = require("merge-stream");
var argv = require('yargs').argv;

gulp.task('compile-js', ['init-repo'], function ()
{
	var version = xrxhelpers.getPackageVersion();

	var merged = mergeStream();

	if (argv.t == "prod" || argv.t == "test")
	{
		merged.add(gulp.src('./js/xrx_bnrv4.js')
			.pipe(include())
			.pipe(jshint())
			.pipe(uglify())
			.pipe(gulp.dest('./compiled/' + argv.t + '/js/' + version)));

		merged.add(gulp.src('./js/xrx_bnrv4.ie8.js')
			.pipe(include())
			.pipe(jshint())
			.pipe(uglify())
			.pipe(gulp.dest('./compiled/' + argv.t + '/js/' + version)));

		merged.add(gulp.src('./js/libs.js')
			.pipe(include())
			.pipe(jshint())
			.pipe(uglify())
			.pipe(gulp.dest('./compiled/' + argv.t + '/js/' + version)));
	}
	else
	{
		merged.add(gulp.src('./js/xrx_bnrv4.js')
			.pipe(include())
			.pipe(jshint())
			.pipe(gulp.dest('./compiled/' + argv.t + '/js/' + version)));

		merged.add(gulp.src('./js/xrx_bnrv4.ie8.js')
			.pipe(include())
			.pipe(jshint())
			.pipe(gulp.dest('./compiled/' + argv.t + '/js/' + version)));

		merged.add(gulp.src('./js/libs.js')
			.pipe(include())
			.pipe(jshint())
			.pipe(gulp.dest('./compiled/' + argv.t + '/js/' + version)));
	}

	return merged;
});
