'use strict';

var gulp = require('gulp');
var source = require('vinyl-source-stream');
var fs = require('fs');
var gutil = require('gulp-util');
var ent = require('ent');
var q = require('q');
var request = require('request');
var argv = require('yargs').argv;

var helpers = {};

helpers.testLocales = ["ptbr", "engb", "frfr", "heil", "enus", "sample", "huhu"];

helpers.getXOGLang = function(locale)
{
	if (typeof(locale) !== "undefined" && locale)
	{
		if (typeof(locale) == "object" && typeof(locale.locale) != "undefined" && locale.locale)
		{
			locale = locale.locale;
		}

		var matches = locale.match(/^(\w{2}).*(\w{2})$/);

		if (matches)
		{
			return matches[1].toLowerCase() + "_" + matches[2].toUpperCase();
		}
	}

	return null;
}

helpers.processTemplateData = function(data, locale)
{
	if(typeof(data) !== "undefined" && data)
	{
		data.XOGLang = helpers.getXOGLang(locale);

		helpers.recurse(data, function(obj, p, path)
		{
			if (typeof(obj) === "object" && obj)
			{
				if (typeof(obj.label) !== "undefined" && obj.label)
				{
					var id = obj.id || obj.label;

					obj.id = id
						.toLowerCase()
						.replace(/\s/g, "-")
						.replace('&lid=', '')
						.replace(/[^a-zA-Z0-9-_]/g, '');

					if (!obj.lid) {
						obj.lid = "&lid=" + obj.id;
					}
				}

				if (obj.id && obj.id === "hdr-bar-country-select") {
					obj.id = "xrx_bnrv4_header_country_selector";
				}
				if (obj.id && obj.id.indexOf("xrx_") === -1)
				{
					var base = "xrx_bnrv4_";

					if (path.indexOf("lobFooter") >= 0) {
						base += "lobfooter_"
					}
					else if (path.indexOf("footer") >= 0) {
						base += "footer_"
					}
					else if (path.indexOf("header") >= 0) {
						base += "header_"
					}

					obj.id = base + obj.id;
				}

				if (obj.label) {
					obj.label = ent.decode(obj.label);
				}
			}
		});

		if (typeof(data.data) !== "undefined")
		{
			data.dataStr = JSON.stringify(data.data);
		}
	}

	return data;
};

helpers.recurse = function(obj, callback, path)
{
    for (var property in obj)
	{
        if (obj.hasOwnProperty(property))
		{
			var newPath;

			if (!path)
				newPath = property;
			else
				newPath = path + "." + property;

			if (typeof(callback) === "function") {
				callback(obj[property], property, newPath);
			}

            if (typeof obj[property] == "object") {
                helpers.recurse(obj[property], callback, newPath);
            }
        }
    }
};

helpers.processMockPageFileList = function(files, suffix)
{
	var returnFiles = [];

	if (files)
	{
		files.forEach(function(file)
		{
			if (file.indexOf(".mustache") > -1)
			{
				file = file.replace(".mustache", suffix + ".html");

				if (returnFiles.indexOf(file) === -1) {
					returnFiles.push(file);
				}
			}
			if (file.indexOf(".handlebars") > -1)
			{
				file = file.replace(".handlebars", suffix + ".html");

				if (returnFiles.indexOf(file) === -1) {
					returnFiles.push(file);
				}
			}
		});
	}

	return returnFiles;
};

helpers.getFileAgeMinutes = function(path)
{
	try
	{
		var stats = fs.statSync(path);
		var differenceMinutes = 0;

		if (stats)
		{
			var now = new Date();
			var modified = new Date(stats.mtime);
			return ((now.getTime() - modified.getTime()) / 1000) / 60;
		}
	}
	catch (err)
	{}

	return null;
};

helpers.openJson = function(path, shouldThrow)
{
	try
	{
		var data = fs.readFileSync(path);

		return JSON.parse(data);
	}
	catch (err)
	{
		gutil.log("Unable to open path:", path);
	}
}

helpers.getPackageVersion = function()
{
	var pjson = JSON.parse(fs.readFileSync('./package.json'));
	return pjson.version;
}

helpers.getXeroxHttpServer = function(tier)
{
	if (tier == "prod") {
		return "http://www.xerox.com/";
	}
	else if (tier == "test") {
		return "http://xeroxtest.xerox.com/";
	}
	else {
		return "http://psgdev.opbu.xerox.com/";
	}
}

helpers.getConfigPath = function(tier, locale)
{
	var cacheBuster = Math.floor((Math.random() * 10000) + 1);

	if (tier == "prod") {
		return "http://w3adminp.opbu.xerox.com/perl-bin/get_banner_json_raw.pl?file=v4_header_raw." + locale + ".json&cacheBuster=" + cacheBuster;
	}
	else if (tier == "test") {
		return "http://xeroxtest.xerox.com/assets/json/xrx_bnr_json/v4_header_raw." + locale + ".json?cacheBuster=" + cacheBuster;
	}
	else {
		return "http://psgdev.opbu.xerox.com/assets/json/xrx_bnr_json/v4_header_raw." + locale + ".json?cacheBuster=" + cacheBuster;
	}
}

helpers.downloadDeferred = function(data)
{
	if (typeof(data) === "undefined" || !data) {
		throw "No data supplied";
	}
	if (typeof(data.uri) === "undefined" || !data.uri) {
		throw "No uri supplied";
	}

	data.deferred = data.deferred || q.defer();
	data.retry = data.retry || 3;
	data.count = data.count || 0;
	data.name = data.name || data.uri;
	data.retryDelay = data.retryDelay || 5000;
	data.retryOn404 = data.retryOn404 || false;
	data.silentRetry = data.silentRetry || false;
	data.silentComplete = data.silentComplete || false;
	data.silentDownloading = data.silentDownloading || false;

	if (!data.silentDownloading)
		gutil.log("Downloading (attempt " + (data.count + 1) + " / " + data.retry + "): " + data.name);

	var requestOptions  = {
		encoding: null,
		method: "GET",
		uri: data.uri,
		headers: {
			"Cache control" : "no-cache"
		}
	};

	var req = request(requestOptions)
		.on("response", function(resp)
		{
			data.count++;

			if (resp.statusCode < 300)
			{
				if (!data.silentComplete)
					gutil.log("Downloaded: " + data.name);

				data.deferred.resolve({
					success: true,
					req: req,
					resp: resp,
					name: data.name
				});
			}
			else if (resp.statusCode == 404)
			{
				if (data.retryOn404 && data.count < data.retry)
				{
					if (!data.silentRetry)
						gutil.log("404 - Retrying: " + data.name);

					setTimeout(function() {
						helpers.downloadDeferred(data);
					}, data.retryDelay);
				}
				else
				{
					if (!data.silentRetry)
						gutil.log("404: " + data.name);

					data.deferred.resolve({
						success: false,
						req: req,
						resp: resp,
						name: data.name
					});
				}
			}
			else
			{
				if (data.count < data.retry)
				{
					if (!data.silentRetry)
						gutil.log("Failed - Retrying: " + data.name + " | Status Code: " + resp.statusCode);

					setTimeout(function() {
						helpers.downloadDeferred(data);
					}, data.retryDelay);
				}
				else
				{
					if (!data.silentRetry)
						gutil.log("Failed - Fatal: " + data.name + " | " + requestOptions.uri);

					data.deferred.reject(new Error("Failed to download: " + data.uri + " - Status code: " + resp.statusCode));
				}
			}
		})
		.on("error", function(err)
		{
			data.count++;

			if (count < retry)
			{
				if (!data.silentRetry)
					gutil.log("Failed - Retrying: " + data.name);

				setTimeout(function() {
					helpers.downloadDeferred(data);
				}, data.retryDelay);
			}
			else
			{
				if (!data.silentRetry)
					gutil.log("Failed - Fatal: " + data.name + " | " + requestOptions.uri);

				data.deferred.reject(new Error("Failed to download: " + data.uri + " - " + err));
			}
		});

	return data.deferred;
}

helpers.downloadAndSaveDeferred = function(uri, dir, filename, retry)
{
	var deferred = q.defer();

	helpers.downloadDeferred({
		uri: uri,
		name: filename
	}).promise
		.then(function(data)
		{
			if (data.success)
			{
				data.req
					.pipe(source(filename))
					.pipe(gulp.dest(dir))
					.on("end", function() {
						gutil.log("Saved: " + filename);
						deferred.resolve("Saved: " + filename);
					});
			}
			else
			{
				deferred.resolve("Not found: " + filename);
			}
		})
		.fail(function(err)
		{
			deferred.reject(err);
		});

	return deferred;
}

helpers.getPassedArg = function(key)
{
	if (key)
	{
		if (key === "l" || key === "locales")
		{
			var locales = argv.l || argv.locales;

			if (locales) {
				return locales.split(",");
			}
		}
		else if (key === "t" || key === "tier")
		{
			return argv.t || argv.tier;
		}

		if (argv[key]) {
			return argv[key];
		}
	}

	return null;
}

helpers.getLocales = function()
{
	var locales = helpers.getPassedArg("locales");
	if (!locales || !locales.length || locales.length === 0)
	{
		locales = [];

		var tier = helpers.getPassedArg("tier");

		var data = helpers.openJson('./data/' + tier + '/locales.json', true);
		if (data)
		{
			data.locales.forEach(function(locale)
			{
				if (locale.type != "redirect" && (typeof(locale.redirect) === "undefined" || !locale.redirect))
				{
					locales.push(locale['locale-short']);
				}
			});
		}
	}

	if (!locales || locales.length == 0)
		throw "No locales supplied";

	return locales;
}

module.exports = helpers;
