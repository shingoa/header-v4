'use strict';

var gulp = require('gulp');

gulp.task('compile', ['init-repo', 'clean'], function() {
	return gulp.start('compile-html', 'compile-sass', 'compile-images', 'compile-js');
});
