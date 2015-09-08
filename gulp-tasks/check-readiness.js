'use strict';

var gulp = require('gulp');
var request = require('request');
var xrxhelpers = require('./_helpers.js');
var argv = require('yargs').argv;
var q = require('q');
var fs = require('fs');
var walk = require('walk')
var gutil = require('gulp-util');

gulp.task('check-readiness', function (cb)
{
	if (argv.t == "local") {
		throw "Cannot check readiness of " + argv.t + " tier";
	}

	var promises = [];

	var version = xrxhelpers.getPackageVersion();

	if (argv.t == "prod")
	{
		var servers = [
			'lampa.origin.xerox.com',
			'wvlnxas01.opbu.xerox.com',
			'wvlnxas02.opbu.xerox.com',
			'wvlnxas03.opbu.xerox.com',
			'wvlnxas04.opbu.xerox.com',
			'wvlnxas05.opbu.xerox.com',
			'wvlnxas10.opbu.xerox.com',
			'wvlnxas11.opbu.xerox.com',
			'wvlnxas12.opbu.xerox.com',
			'wvlnxas13.opbu.xerox.com',
			'wvlnxas14.opbu.xerox.com',
			'wvlnxas15.opbu.xerox.com',

			'lampb.origin.xerox.com',
			'nylnxas01.opbu.xerox.com',
			'nylnxas02.opbu.xerox.com',
			'nylnxas03.opbu.xerox.com',
			'nylnxas04.opbu.xerox.com',
			'nylnxas05.opbu.xerox.com',
			'nylnxas06.opbu.xerox.com',
			'nylnxas07.opbu.xerox.com',
			'nylnxas08.opbu.xerox.com',
			'nylnxas09.opbu.xerox.com'
		];

		servers.forEach(function(server)
		{
			var d = xrxhelpers.downloadDeferred({
				uri: "http://" + server + "/assets/js/banners/V" + version + ".html",
				retry: 200,
				name: server,
				retryDelay: 30000,
				retryOn404: true,
				silentComplete: true,
				silentDownloading: false
			});
			d.promise.then(function(data) {
				if (data.success) {
					gutil.log("Ready: " + data.name);
				} else {
					gutil.log("Not Ready: " + data.name);
				}
			});

			promises.push(d.promise);
		});
	}


	var server = xrxhelpers.getXeroxHttpServer(argv.t);
	server += "assets/";

	var walkerDeferred = q.defer();
	promises.push(walkerDeferred.promise);

	var walkerPromises = [];

	var walker = walk.walk("./compiled/" + argv.t, {
		filters: ["parts"]
	});
	walker.on("file", function (root, fileStats, next)
	{
		var fullPath = root + "/" + fileStats.name;
		fullPath = fullPath.replace(/\\/g, "/");

		var tierPathPart = "/" + argv.t + "/";
		if (fullPath.indexOf(tierPathPart) >= 0)
		{
			fullPath = fullPath.substr(fullPath.indexOf(tierPathPart) + tierPathPart.length);
		}

		fullPath = fullPath.replace(/(css|js)\//, "$1/banners/");

		var d = xrxhelpers.downloadDeferred({
			uri: server + fullPath,
			retry: 200,
			name: fullPath,
			retryDelay: 30000,
			retryOn404: true,
			silentComplete: true,
			silentDownloading: false
		});
		d.promise.then(function(data) {
			if (data.success) {
				gutil.log("Ready: " + data.name);
			} else {
				gutil.log("Not Ready: " + data.name);
			}
		});

		walkerPromises.push(d.promise);

		next();
	});

	walker.on("errors", function (root, nodeStatsArray, next) {
		next();
	});

	walker.on("end", function () {
		q.all(walkerPromises)
			.then(function(){
				walkerDeferred.resolve("Walk complete");
			});
	});

	return q.all(promises);
});
