'use strict';

var gulp = require('gulp');
var requireDir = require('require-dir');
var xrxhelpers = require('./gulp-tasks/_helpers.js');
var gutil = require('gulp-util');

requireDir('./gulp-tasks');

var tier = xrxhelpers.getPassedArg("tier");

gutil.log("Running tier: ", tier);
gutil.log("Building version: ", xrxhelpers.getPackageVersion());
