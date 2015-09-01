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
			var deferred = q.defer();
			promises.push(deferred.promise);

			var url = "http://" + server + "/assets/js/banners/V" + version + ".html";

			var tryCount = 0;
			var interval = setInterval(function()
			{
				if (tryCount < 120)
				{
					request
						.get(url)
						.on('response', function(response) {
							if (response.statusCode < 300)
							{
								gutil.log("Ready on: " + server);
								deferred.resolve("Ready on: " + server);
								clearInterval(interval);
							}
							else {
								gutil.log("Not ready on: " + server);
							}
						})
						.on('error', function(err){
							gutil.log("Not ready on: " + server);
							gutil.log(err);
						});
				}
				else {
					deferred.reject(new Error("Failed to replicate onto: " + server));
					clearInterval(interval);
					gutil.log("Failed to replicate onto: " + server);

					throw "Failed to replicate onto: " + server;
				}
			}, 30000);

		});

		// http://lampa.origin.xerox.com/assets/js/banners/V4.3.63.html
		// http://wvlnxas01.opbu.xerox.com/assets/js/banners/V4.3.63.html
		// http://wvlnxas02.opbu.xerox.com/assets/js/banners/V4.3.63.html
		// http://wvlnxas03.opbu.xerox.com/assets/js/banners/V4.3.63.html

		// http://usa0300lx261.na.xerox.net/assets/js/banners/V4.3.63.html
		// http://lampb.origin.xerox.com/assets/js/banners/V4.3.63.html
	}


	var server = xrxhelpers.getXeroxHttpServer(argv.t);
	server += "assets/";

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

		var deferred = q.defer();
		promises.push(deferred.promise);

		var tryCount = 0;
		var interval = setInterval(function() {
			if (tryCount < 120)
			{
				request
					.get(server + fullPath)
					.on('response', function(response)
					{
						if (response.statusCode < 300)
						{
							gutil.log("Ready: " + server + fullPath);
							deferred.resolve("Ready: " + fullPath);
							clearInterval(interval);
						}
						else {
							gutil.log("Not ready: " + server + fullPath);
						}
					})
					.on('error', function(err){
						gutil.log("Not ready: " + server + fullPath);
						gutil.log(err);
					});
			}
			else {
				deferred.reject(new Error("Failed: " + server + fullPath));
				clearInterval(interval);
				gutil.log("Failed: " + fullPath);

				throw "Failed: " + fullPath;
			}
			tryCount++;

		}, 30000);

		next();
	});

	walker.on("errors", function (root, nodeStatsArray, next) {
		next();
	});

	walker.on("end", function () {
		q.allSettled(promises)
			.then(function()
			{
				gutil.log("All ready");
				cb();
			});
	});
});
