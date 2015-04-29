/*
 * Copyright (c) 2015 Memorial Sloan-Kettering Cancer Center.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY, WITHOUT EVEN THE IMPLIED WARRANTY OF MERCHANTABILITY OR FITNESS
 * FOR A PARTICULAR PURPOSE. The software and documentation provided hereunder
 * is on an "as is" basis, and Memorial Sloan-Kettering Cancer Center has no
 * obligations to provide maintenance, support, updates, enhancements or
 * modifications. In no event shall Memorial Sloan-Kettering Cancer Center be
 * liable to any party for direct, indirect, special, incidental or
 * consequential damages, including lost profits, arising out of the use of this
 * software and its documentation, even if Memorial Sloan-Kettering Cancer
 * Center has been advised of the possibility of such damage.
 */

/*
 * This file is part of CT-MOLE.
 *
 * CT-MOLE is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

var request = require('request');
var parseString = require('xml2js').parseString;
var jsdom = require('jsdom');
var colors = require('colors');
var mongoose = require('mongoose');
var	ClinicalTrialMetadata = require('../../app/models/clinical-trial-meta-data.server.model');
var nctIds = [];
var nctIdLocks = 0;
var urlIndex = 0;
var clinicalTrials = [];
var savingToDB = false;
var fs = require('fs');


main();

function main() {
	// getUrlsConditions(getListOfCancerTrialsFromClinicalTrialsGov);
	readNctIdsFile();
	// removeDuplicateNctIdFromFiles();
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
				var uniqueNctIds = nctIds.filter(function(item, pos) {
				    return nctIds.indexOf(item) == pos;
				});
				console.log(uniqueNctIds.length, ' unique trials have been found.\n');
				// importTrials(uniqueNctIds);
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
	    }
	}); 
}

function readNctIdsFile() {
	fs.readFile('./nctIds.txt', 'utf8', function (err,data) {
	  	if (err) {
		    return console.log(err);
	  	}
	  	var nctIds = JSON.parse(data);
	  	console.log(nctIds.length);
	  	importTrials(nctIds.slice(32000));
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

function removeDuplicateNctIdFromFiles() {
	var nctIds = [];
	fs.readFile('./nctIds.txt', 'utf8', function (err,data) {
	  	if (err) {
		    return console.log(err);
	  	}
	  	nctIds = JSON.parse(data);
	  	console.log('Total', nctIds.length , 'nct ids.');
	  	var uniqueNctIds = nctIds.filter(function(item, pos) {
		    return nctIds.indexOf(item) == pos;
		});
	  	console.log('Total unique', uniqueNctIds.length , 'nct ids.');

	  	fs.writeFile("./nctIdsUnique.txt", JSON.stringify(uniqueNctIds), function(err) {
		    if(err) {
		        console.log(err);
		    } else {
		        console.log("The file was saved!");
		    }
		}); 
	});
}

function importTrials(nctIds) {
	mongoose.connect('mongodb://localhost/clinicaltrials-dev');
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

function saveClinicalTrialMetadata(clinicalTrials, callback) {
	if(clinicalTrials.length > 0) {
		var clinicalTrial = clinicalTrials.pop();
		var thing = new ClinicalTrialMetadata(clinicalTrial);
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
	}else {
		savingToDB = false;
	}
}

function parseClinicalTrialsGov(nctIds, nctIdIndex, callback) {
	// ClinicalTrialMetadata.findOne({'id_info.nct_id': nctIds[nctIdIndex]}, 'id_info',function(err, result){
	// 	if(result === null) {
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
	// 	}else {
	// 		console.log('\t\t', nctIds[nctIdIndex], ' exists in database, skip...');
	// 		callback(nctIds, ++nctIdIndex);
	// 	}
	// });
}