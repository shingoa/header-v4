'use strict';

var fs = require('fs');

var helpers = {};

helpers.processTemplateData = function(data)
{
	if(typeof(data) !== "undefined" && data)
	{
		helpers.recurse(data, function(obj, p)
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
			}
		});
	}

	return data;
};

helpers.recurse = function(obj, callback)
{
    for (var property in obj)
	{
        if (obj.hasOwnProperty(property))
		{
			if (typeof(callback) === "function") {
				callback(obj[property], property);
			}

            if (typeof obj[property] == "object") {
                helpers.recurse(obj[property], callback);
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
		//if (shouldThrow) {
			console.log(shouldThrow);
		//}
	}
}

module.exports = helpers;
