'use strict';

var gulp = require('gulp');

var argv = require('yargs').argv;
var gutil = require('gulp-util');

gulp.task('testing-argdump', function()
{
	gutil.log(argv);
});
