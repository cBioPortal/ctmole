
var request = require('request');
var parseString = require('xml2js').parseString;
var jsdom = require('jsdom');
var colors = require('colors');
var mongoose = require('mongoose');
var fs = require('fs');
var _ = require('underscore');

var	ClinicalTrialMetadata = require('../../app/models/clinical-trial-metadata.server.model');
var	Trial = require('../../app/models/trial.server.model.js');

var nctIds = [];
var nctIdLocks = 0;
var urlIndex = 0;
var clinicalTrials = [];
var savingToDB = false;


main();

function main() {
	//getUrlsConditions(getListOfCancerTrialsFromClinicalTrialsGov);
	readNctIdsFile();
}

function getListOfCancerTrialsFromClinicalTrialsGov(urls) {
	checkNctLocks(urls);
}

function checkNctLocks(urls) {
	setTimeout(function(){
		if(nctIdLocks !== 0) {
			checkNctLocks(urls);
		}else {
			if(urlIndex < urls.length) {
				checkNctLocks(urls);
				console.log('\n-----------------------------------------------');
				console.log('URL: ', urls[urlIndex].url);
				console.log('Number of conditions: ', urls[urlIndex].count);
				console.log('URL index: ', urlIndex, ' Fnished: ', (urlIndex/urls.length * 100).toFixed(2), '%');
				getNctIds(urls[urlIndex], 1, function(){
					--nctIdLocks;
					++urlIndex;
				});
			}else {
				console.log('\n\nFINISHIED. Total number of nctIds is', nctIds.length);
				var uniqueNctIds = _.uniq(nctIds);
				console.log(uniqueNctIds.length, ' unique trials have been found.\n');
				writeNctIdsIntoFile(uniqueNctIds);
			}
		}
	},500);
}

function writeNctIdsIntoFile(nctIds) {
	fs.writeFile("./nctIds.txt", JSON.stringify(nctIds), function(err) {
		if(err) {
			console.log(err);
		} else {
			console.log("The file was saved!");
			readNctIdsFile();
		}
	});
}

function readNctIdsFile() {
	fs.readFile('./nctIds.txt', 'utf8', function (err,data) {
		if (err) {
			return console.log(err);
		}
		var nctIds = JSON.parse(data);
		importTrials(nctIds);
	});
}



function getNctIds(url, page, callback) {
	var _url = 'http://clinicaltrials.gov'+url.url+'&displayxml=true&pg='+page;
	++nctIdLocks;
	request(_url, function(error, response, body){
		parseString(body, {trim: true}, function (err, result) {
			var searchResults = result.search_results || {};
			if(searchResults.hasOwnProperty('clinical_study') && searchResults.clinical_study instanceof Array && searchResults.clinical_study.length > 0) {
				searchResults.clinical_study.forEach(function(e, i) {
					nctIds.push(e.nct_id[0]);
				});

				getNctIds(url, ++page, function(){--nctIdLocks;});
			}
			callback();
		});
	});
}

function getUrlsConditions(callback) {
	var urlConditions = [];
	jsdom.env(
		'http://clinicaltrials.gov/ct2/search/browse?brwse=cond_cat_BC04&brwse-force=true',
		["http://code.jquery.com/jquery.js"],
		function (errors, window) {
			window.$("#conditions").find('li').each(function(e, i){
				var _attr = window.$(this).find('a').attr('href');

				if (typeof _attr !== 'undefined' && _attr !== false) {
					var _datum = {
						url: _attr,
						count: window.$(this).text().trim().match(/\d* study|\d* studies/)[0].replace(/studies|study/, '').trim()
					}
					urlConditions.push(_datum);
				}else {
					console.log('There is not any href link in:'.color, window.$(this).html());
				}
			})
			console.log("Total in ", urlConditions.length, " conditions");
			callback(urlConditions);
		}
	);
}

function importTrials(nctIds) {
	mongoose.connect('mongodb://localhost/firstDB');
	mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
	mongoose.connection.once('open', function callback () {
		if(nctIds instanceof Array) {
			checkNctIndex(nctIds, 0);
		}

	});
}

function failToFindTrialXML(nctId) {
	fs.appendFile('./failedNctId.txt', nctId + '\n' , function (err) {
		return console.log(err);
	});
}

function checkNctIndex(nctIds, nctIdIndex) {

	if(nctIdIndex < nctIds.length) {
		if(savingToDB) {
			setTimeout(function(){
				checkNctIndex(nctIds, nctIdIndex);
			},500);
		}else {
			parseClinicalTrialsGov(nctIds, nctIdIndex, checkNctIndex);
		}
		if ((nctIdIndex+1) % 1000 === 0) {
			console.log('Saving data to MongoDB....');
			savingToDB = true;
			saveClinicalTrialMetadata(clinicalTrials);
		}
	}else {
		console.log('Final saving data to MongoDB....');
		savingToDB = true;
		saveClinicalTrialMetadata(clinicalTrials,function(){
			mongoose.connection.close();
		});
	}
}

function saveNextTrial(callback){
	if(clinicalTrials.length !== 0) {
		saveClinicalTrialMetadata(clinicalTrials, callback);
	}else {
		console.log('Done.');
		savingToDB = false;
		if(typeof callback === 'function') {
			callback();
		}
	}
}

function saveClinicalTrial(metadata, callback){
	if(metadata.id_info !== undefined)
	{
	var trialID = metadata.id_info[0].nct_id[0];
	Trial.findOne({nctId: trialID}).exec(function(err1, trial){
		if(err1)
		{
			console.log('error happened when searching Trial', err1);
			saveNextTrial(callback);
		}
		else if(_.isNull(trial) )
		{
			console.log('Inserting new trial record ',trialID);
			var drugsNeeded = [];
			if(metadata.intervention !== undefined)
			{
				_.each(metadata.intervention, function(item){
					drugsNeeded.push(item.intervention_name);
				});
			}


			var trialRecord = new Trial({nctId: trialID,
				title: (metadata.brief_title !== undefined) ? metadata.brief_title[0] : "",
				purpose: (metadata.brief_summary !== undefined) ? metadata.brief_summary[0].textblock[0] : "",
				recruitingStatus: (metadata.overall_status !== undefined) ? metadata.overall_status[0] : "",
				eligibilityCriteria: (metadata.eligibility !== undefined && metadata.eligibility[0].criteria !== undefined) ? metadata.eligibility[0].criteria[0].textblock[0] : "",
				phase: (metadata.phase !== undefined) ? metadata.phase[0] : "",
				diseaseCondition: (metadata.condition_browse !== undefined) ? metadata.condition_browse[0].mesh_term : "",
				lastChangedDate: (metadata.lastchanged_date !== undefined) ? metadata.lastchanged_date[0] : "",
				countries: (metadata.location_countries !== undefined) ? metadata.location_countries[0].country : "",
				drugs: drugsNeeded,
				arm_group: (metadata.arm_group !== undefined) ? metadata.arm_group : ""});


			trialRecord.save(function(err, trail){
				if(err)console.log('Error happened when saving to db', err);
				else console.log('Insert', trialID, ' into trial collection successfully');


				console.log("**********************************************");

				saveNextTrial(callback);
			});

		}
		else
		{
			if(metadata.overall_status !== undefined)
			{
				if(metadata.overall_status[0] === trial.recruitingStatus)
				{
					console.log('Trial ', trialID, 'is already updated to the most recent version');
					saveNextTrial(callback);

				}
				else
				{
					Trial.update({nctId: trialID},{$set: {phase: metadata.overall_status[0]}}).exec(function (err, trial) {
						if (err) {
							console.log('Error happened when trying to update trial ', trialID);
						} else {
							console.log('Successfully updated trial', trialID);
						}

						console.log("**********************************************");

						saveNextTrial(callback);
					});
				}
			}


		}
	});
	}
}

function saveClinicalTrialMetadata(clinicalTrials, callback) {
	if(clinicalTrials.length > 0) {
		var clinicalTrial = clinicalTrials.pop();
		var thing = new ClinicalTrialMetadata(clinicalTrial);
		thing.save(function(err, news){
			if(err) return console.error("Error while saving data to MongoDB: " + err); // <- this gets executed when there's an error
			//save to trial collection at the same time here


			//saveClinicalTrial(clinicalTrial, callback);

			if(clinicalTrials.length !== 0) {
				saveClinicalTrialMetadata(clinicalTrials);
			}else {
				console.log('Done.');
				savingToDB = false;
				if(typeof callback === 'function') {
					callback();
				}
			}
		});
	}else {
		savingToDB = false;
	}
}

function parseClinicalTrialsGov(nctIds, nctIdIndex, callback) {
	var url = 'http://clinicaltrials.gov/show/' + nctIds[nctIdIndex] + '?displayxml=true';
	request(url, function(error, response, body){
		parseString(body, {trim: true, attrkey: '__attrkey', charkey: '__charkey'}, function (err, result) {
			if(result.hasOwnProperty('clinical_study')) {
				clinicalTrials.push(result.clinical_study);
				if((nctIdIndex+1) % 100 === 0) {
					console.log('\t', nctIdIndex+1, ' trials have been parsed.');
				}

			}else {
				console.log('\t\t',nctIds[nctIdIndex], 'does not have clinical study attribute.');
				failToFindTrialXML(nctIds[nctIdIndex]);
			}
			callback(nctIds, ++nctIdIndex);

		});
	});
}
