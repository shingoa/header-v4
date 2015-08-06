'use strict';

var gulp = require('gulp');
var fs = require('fs');
var request = require('request');
var xrxhelpers = require('./_helpers.js');
var mergeStream = require("merge-stream");
var git = require("gulp-git");
var bump = require('gulp-bump');
var gulpmatch = require('gulp-match');

var gituser = "phawxby";
var gitpat = "7a6b80e8631552487ea4e6475a15d60715fc418c";
var repo = "https://" + gituser + ":" + gitpat + "@github.com/xeroxinteractive/header-v4.git";
var pathsToMatch = ['./data/**/*', './dist/**/*', './package.json'];


gulp.task('compile-and-release', ['compile-html', 'compile-images', 'compile-sass', 'compile-zip'], function()
{
	var merged = mergeStream();

	git.status({args: '--porcelain', quiet: true}, function (err, stdout)
	{
		if (err) {
			throw err;
		}
		else
		{
			var filesRegex = /\s\w\s([^\s]+)$/gm;
			var files = [];
			var fileMatch;

			while (fileMatch = filesRegex.exec(stdout))
			{
				if (fileMatch && fileMatch[1])
				{
					var match = gulpmatch({ path: './' + fileMatch[1] }, pathsToMatch);

					if (match) {
						files.push('./' + fileMatch[1]);
					}
				}
			}

			if (files.length > 0)
			{
				try {
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

					merged.add(request(options, function(err, resp, body)
					{
						if (resp.statusCode == 200)
						{
							var releases = JSON.parse(body);

							if (releases && releases.length > 0)
							{
								merged.add(gulp.src('./package.json')
									.pipe(bump({type: 'patch'}))
									.pipe(gulp.dest('./'))
									.on('end', function() {
										var pjson = JSON.parse(fs.readFileSync('./package.json'));
										var version = pjson.version;

										merged.add(gulp.src(pathsToMatch)
											.pipe(git.commit('Automated release: ' + version)));

										git.push(repo, 'master');

										options = {
											url: "https://api.github.com/repos/xeroxinteractive/header-v4/releases",
											auth: {
												user: gituser,
												pass: gitpat
											},
											json: true,
											body: {
												"tag_name": version,
												"name": version
											},
											headers : {
												"User-Agent" : "Gulp"
											}
										};

										err = null;
										resp = null;
										body = null;
										merged.add(request.post(options, function(err, resp, body)
										{
											if (resp.statusCode == 201)
											{
												var newRelease = body;

												var releaseFile = fs.readFileSync('./dist/release.zip');

												if (releaseFile)
												{
													var uploadUrl = newRelease.upload_url;
													uploadUrl = uploadUrl.replace("{?name}", "?name=release.zip");

													options = {
														url: uploadUrl,
														auth: {
															user: gituser,
															pass: gitpat
														},
														body: releaseFile,
														headers : {
															"User-Agent" : "Gulp",
															"Content-Type" : "application/zip"
														}
													};

													merged.add(request.post(options, function(err, resp, body)
													{
														if (resp.statusCode == 200)
														{
															console.log("Release.zip uploaded");
														}
													}));
												}
												else {
													console.log("No release.zip to upload")
												}
											}
										}));
									}));
							}
						}
					}));
				}
				catch (err)
				{
					throw err;
				}
			}
			else
			{
				console.log("No update to release");
			}
		}
	});

	return merged;
});
