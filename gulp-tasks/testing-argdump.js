'use strict';

var gulp = require('gulp');

var argv = require('yargs').argv;
var gutil = require('gulp-util');
var xrxhelpers = require('./_helpers.js');

gulp.task('testing-argdump', function()
{
	var locales = xrxhelpers.getPassedArg("locales");
	gutil.log(locales);
});
