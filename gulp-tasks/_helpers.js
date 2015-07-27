'use strict';

var helpers = {};

helpers.processTemplateData = function(data)
{
	if(typeof(data) !== "undefined" && data)
	{
		helpers.recurse(data, function(obj, p)
		{
			if (typeof(obj) === "object")
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

module.exports = helpers;
