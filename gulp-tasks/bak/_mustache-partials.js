'use strict';

var gulp = require('gulp');
var fs = require('fs');

var _mustacheExtensions = {};

var partialsDir = "./templates/includes/mustachePartials/";
var files = fs.readdirSync(partialsDir);

var getMustachePartials = function()
{
	files.forEach(function(file)
	{
		if (file)
		{
			var filename = file
				.replace(/^.*[\\\/]/, '')
				.replace(".html", "")
				.replace("-", "_");

			_mustacheExtensions[filename + "_partial"] = fs.readFileSync(partialsDir + file, { "encoding" : "utf8" });
		}
	});
};
