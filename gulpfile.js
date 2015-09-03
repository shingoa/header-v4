'use strict';

var gulp = require('gulp');
var requireDir = require('require-dir');
var xrxhelpers = require('./gulp-tasks/_helpers.js');
var gutil = require('gulp-util');

var argv = require('yargs')
    .default({ t : 'local' })
	.alias('t', 'tier')
	.describe('t', 'Specify the tier to build for. local/dev/test/prod. Defaults to local')
    .alias('l', 'locales')
	.describe('l', 'Specify the locales to build for')
    .array('l')
    .argv
;

requireDir('./gulp-tasks');

gutil.log("Running tier: ", argv.tier);
gutil.log("Building version: ", xrxhelpers.getPackageVersion());
