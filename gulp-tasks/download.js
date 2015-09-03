'use strict';

var gulp = require('gulp');
var fs = require('fs');
var request = require('request');
var source = require('vinyl-source-stream');
var mergeStream = require("merge-stream");
var xrxhelpers = require('./_helpers.js');
var argv = require('yargs').argv;
var iconv  = require('iconv-lite');
var gutil = require('gulp-util');
var q = require('q');

iconv.extendNodeEncodings();

gulp.task('download-locales', ['init-repo', 'clean'], function(cb)
{
	var locales = xrxhelpers.getPassedArg("locales");
	if (locales && locales.length && locales.length > 0)
	{
		cb();
	}
	else
	{
		var server = xrxhelpers.getXeroxHttpServer(argv.t);
		var cacheBuster = Math.floor((Math.random() * 100) + 1);

		var d = xrxhelpers.downloadAndSaveDeferred(
			server + "perl-bin/json_locale_service.pl?cacheBuster=" + cacheBuster,
			'./data/' + argv.t,
			'locales.json'
		);

		return d.promise;
	}
});

gulp.task('download-configs', ['init-repo', 'clean', 'download-locales'], function()
{
	var promises = [];

	var locales = xrxhelpers.getPassedArg("locales");
	if (!locales || !locales.length || locales.length === 0)
	{
		locales = [];

		var data = xrxhelpers.openJson('./data/' + argv.t + '/locales.json', true);
		data.locales.forEach(function(locale)
		{
			if (locale.type != "redirect" && (typeof(locale.redirect) === "undefined" || !locale.redirect))
			{
				locales.push(data.locales['locale-short']);
			}
		});
	}


	if (locales && locales.length && locales.length > 0)
	{
		locales.forEach(function(locale)
		{
			var savePath = './data/' + argv.t + '/config.' + locale + '.json';

			var uri = xrxhelpers.getConfigPath(argv.t, locale);

			var d = xrxhelpers.downloadAndSaveDeferred(
				uri,
				'./data/' + argv.t,
				'config.' + locale + '.json'
			);
			d.promise.then(function(){
				complete++;
			});

			promises.push(d.promise);
		});
	}
	else
	{
		throw "No locales supplied";
	}

	var all = q.all(promises);
	all.then(function(data)
		{
			gutil.log("All configs downloaded");
		})
		.fail(function(err)
		{
			gutil.log("Config download failure");
		});

	return all;
});

gulp.task('download-test-configs', ['init-repo'], function(cb)
{
	var promises = [];

	if (argv.t != "local")
		throw "Test configs can only be downloaded on local builds"

	var locales = xrxhelpers.getPassedArg("locales");

	if (!locales || !locales.length || locales.length == 0) {
		locales = xrxhelpers.testLocales;
	}

	locales.forEach(function(locale)
	{
		if(locale.length != 4)
			return;

		var savePath = './data/' + argv.t + '/config.' + locale + '.json';
		var differenceMinutes = xrxhelpers.getFileAgeMinutes(savePath);

		var cacheBuster = Math.floor((Math.random() * 100) + 1);

		if (typeof(differenceMinutes) === "undefined" ||
			!differenceMinutes ||
			differenceMinutes > 240)
		{
			var uri = xrxhelpers.getConfigPath(argv.t, locale);

			var d = xrxhelpers.downloadAndSaveDeferred(
				uri,
				'./data/' + argv.t,
				'config.' + locale + '.json'
			);
			promises.push(d.promise);
		}
	});

	return q.all(promises);
});
