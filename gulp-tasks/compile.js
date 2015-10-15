'use strict';

var gulp = require('gulp');
var runSequence = require('run-sequence');

gulp.task('compile', function(cb) {
	runSequence(['init-repo', 'clean'],
        		['compile-html', 'compile-sass', 'compile-images', 'compile-js'],
				cb);
});
