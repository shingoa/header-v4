'use strict';

var gulp = require('gulp');
var runSequence = require('run-sequence');

gulp.task('build', function(cb)
{
	runSequence(['init-repo', 'clean'],
        		['build-html', 'build-sass', 'build-images', 'build-js'],
				cb);
});
