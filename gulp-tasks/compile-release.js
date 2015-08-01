'use strict';

var gulp = require('gulp');
var fs = require('fs');
var request = require('request');
var xrxhelpers = require('./_helpers.js');

gulp.task('compile-release', function()
{
	var gituser = "phawxby";
	var gitpat = "7a6b80e8631552487ea4e6475a15d60715fc418c";

	var options = {
		url: "https://api.github.com/repos/xeroxinteractive/header-v4/releases",
		auth: {
			user: gituser,
			pass: gitpat
		},
		headers : {
			"User-Agent" : "Gulp"
		}
	};

	var latestRelease = request(options, function(err, resp, body)
	{
		if (resp.statusCode == 200)
		{
			var releases = JSON.parse(body);

			if (releases && releases.length > 0)
			{
				var latestRelease = releases[0];
				var latestReleaseVersion = latestRelease.tag_name;
				var latestReleaseVersionSplit = latestReleaseVersion.split(".");
				var lastIndex = latestReleaseVersionSplit.length - 1;
				latestReleaseVersionSplit[lastIndex] = parseInt(latestReleaseVersionSplit[lastIndex]) + 1;
				latestReleaseVersion = latestReleaseVersionSplit.join(".");


				options = {
					url: "https://api.github.com/repos/xeroxinteractive/header-v4/releases",
					auth: {
						user: gituser,
						pass: gitpat
					},
					json: true,
					body: {
						"tag_name": latestReleaseVersion.toString(),
						"name": latestReleaseVersion.toString()
					},
					headers : {
						"User-Agent" : "Gulp"
					}
				};

				err = null;
				resp = null;
				body = null;
				var createRelease = request.post(options, function(err, resp, body)
				{
					if (resp.statusCode == 201)
					{
						console.log("Created release: " + latestReleaseVersion.toString());
						var newRelease = body;

						var uploadUrl = newRelease.upload_url;
						uploadUrl = uploadUrl.replace("{?name}", "?name=release.zip");

						options = {
							url: uploadUrl,
							auth: {
								user: gituser,
								pass: gitpat
							},
							body: fs.readFileSync('./dist/release.zip'),
							headers : {
								"User-Agent" : "Gulp",
								"Content-Type" : "application/zip"
							}
						};

						var uploadAssetToRelease = request.post(options, function(err, resp, body)
						{
							console.log("Err: " + err);
							console.log("Code: " + resp.statusCode);
							console.log("Body: " + body);

							if (resp.statusCode == 200)
							{

							}
						});
					}
				});
			}
		}
	});
});
