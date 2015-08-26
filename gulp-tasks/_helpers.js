'use strict';

var fs = require('fs');
var gutil = require('gulp-util');
var ent = require('ent');
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
		gutil.log("Unable to open path: ", err.path);
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

module.exports = helpers;
