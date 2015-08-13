'use strict';

var gulp = require('gulp');

gulp.task('build', ['init-repo', 'clean'], function() {
	gulp.start('build-html', 'build-sass', 'build-images', 'build-js');
});
