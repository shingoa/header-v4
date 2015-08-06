'use strict';

var gulp = require('gulp');
var requireDir = require('require-dir');

var argv = require('yargs')
    .default({ t : 'local' })
	.alias('t', 'tier')
	.describe('t', 'Specify the tier to build for. local/dev/test/prod. Defaults to test')
    .argv
;

requireDir('./gulp-tasks');

console.log("Running tier: " + argv.tier);
