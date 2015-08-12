'use strict';

var gulp = require('gulp');
var xrxhelpers = require('./_helpers.js');
var argv = require('yargs').argv;
var clean = require('gulp-clean');

gulp.task('clean', ['init-repo'], function()
{
	return gulp.src([
			'./dist',
			'./built',
			'./compiled',
			'./data/dev',
			'./data/test',
			'./data/prod',
			'./data/local/*',
			'!./data/local/config.sample.json'
		], {read: false})
        .pipe(clean());
});
