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

	var server = xrxhelpers.getXeroxHttpServer(argv.t);
	server += "assets/";

	var walkerPromise = q.defer();
	promises.push(walkerPromise);

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
		promises.push(deferred);

		var tryCount = 0;
		var interval = setInterval(function() {
			if (tryCount < 60)
			{
				request
					.get(server + fullPath)
					.on('response', function(response) {
						if (response.statusCode < 300)
						{
							gutil.log("Ready: " + server + fullPath);
							deferred.resolve("Ready: " + fullPath);
							clearInterval(interval);
						}
						else {
							gutil.log("Not ready: " + server + fullPath);
							gutil.log(err);
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
			}
			tryCount++;

		}, 15000);

		deferred.resolve();

		next();
	});

	walker.on("errors", function (root, nodeStatsArray, next) {
		next();
	});

	walker.on("end", function () {
		walkerPromise.resolve();
	});

	q.allSettled(promises)
		.then(function()
		{
			cb();
		});
});
