var request = require('request');
var parseString = require('xml2js').parseString;
var jsdom = require('jsdom');
var colors = require('colors');
var mongoose = require('mongoose');
var	clinicalTrialMetaData = require('../../app/models/clinical-trial-meta-data.server.model');
var nctIds = [];
var nctIdLocks = 0;
var urlIndex = 0;
var clinicalTrials = [];
var savingToDB = false;

main();

function main() {
	// getUrlsConditions(getListOfCancerTrialsFromClinicalTrialsGov);
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
				console.log('URL: ', urls[urlIndex]);
				console.log('URL index: ', urlIndex, ' Fnished: ', urlIndex/urls.length * 100, '%');
				getNctIds(urls[urlIndex], 1, function(){
					--nctIdLocks;
					++urlIndex;
				});
			}else {
				var uniqueNctIds = nctIds.filter(function(item, pos) {
				    return nctIds.indexOf(item) == pos;
				});
				console.log('\n\nFINISHIED. Total number of nctIds is', nctIds.length, '.', nctIds.length, ' unique trials have been found.\n');
				// importTrials(uniqueNctIds);
				writeNctIdsIntoFile(uniqueNctIds);
			}
		}
	},500);
}

function writeNctIdsIntoFile(nctIds) {
	var fs = require('fs');
	fs.writeFile("./nctIds.txt", JSON.stringify(nctIds), function(err) {
	    if(err) {
	        console.log(err);
	    } else {
	        console.log("The file was saved!");
	    }
	}); 
}

function readNctIdsFile() {
	var fs = require('fs');
	fs.readFile('./nctIds.txt', 'utf8', function (err,data) {
	  	if (err) {
		    return console.log(err);
	  	}
	  	var nctIds = JSON.parse(data);
	  	console.log(nctIds.length);
	  	importTrials(nctIds.slice(0,10000));
	});
}
function getNctIds(url, page, callback) {
	var _url = 'http://clinicaltrials.gov'+url+'&displayxml=true&pg='+page;
	++nctIdLocks;
	request(_url, function(error, response, body){
		parseString(body, {trim: true}, function (err, result) {
			var searchResults = result.search_results || {};
		    if(searchResults.hasOwnProperty('clinical_study') && searchResults.clinical_study instanceof Array && searchResults.clinical_study.length > 0) {
		    	searchResults.clinical_study.forEach(function(e, i) {
		    		nctIds.push(e.nct_id);
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
				    urlConditions.push(_attr);
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
	mongoose.connect('mongodb://localhost/clinicaltrials-dev');
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function callback () {
		if(nctIds instanceof Array) {
			checkNctIndex(nctIds, 0);
		}
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

function saveClinicalTrialMetadata(clinicalTrials, callback) {
	var thing = new clinicalTrialMetaData(clinicalTrials.pop());
	thing.save(function(err, news){
	 	if(err) return console.error("Error while saving data to MongoDB: " + err); // <- this gets executed when there's an error
    	// console.error(news); // <- this never gets logged, even if there's no error.
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
}

function parseClinicalTrialsGov(nctIds, nctIdIndex, callback) {
	var url = 'http://clinicaltrials.gov/show/' + nctIds[nctIdIndex] + '?displayxml=true';
	request(url, function(error, response, body){
		parseString(body, {trim: true, attrkey: '__attrkey', charkey: '__charkey'}, function (err, result) {
			clinicalTrials.push(result.clinical_study);
			if((nctIdIndex+1) % 100 === 0) {
				console.log('\t\t', nctIdIndex+1, ' trials have been parsed.');
			}
			callback(nctIds, ++nctIdIndex);
		});
	});
}