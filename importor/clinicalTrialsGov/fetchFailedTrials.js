/**
 * Created by jiaojiao on 11/5/15.
 */
var request = require('request');
var parseString = require('xml2js').parseString;
var jsdom = require('jsdom');
var colors = require('colors');
var mongoose = require('mongoose');
var fs = require('fs');
var _ = require('underscore');

var	ClinicalTrialMetadata = require('../../app/models/clinical-trial-metadata.server.model');
var nctIds = [];
var clinicalTrials = [];
var savingToDB = false;
var checkCount = 1;
var failedNctIDs = [];

main();

function main() {

    fs.readFile('./failedNctId.txt', 'utf8', function (err,data) {
        if (err) {
            return console.log(err);
        }

        var nctIds = data.trim().split("\n");

        if(nctIds.length == 0)
        {
            console.log('There is no failed trials in failedNctId.txt');
        }
        else
        {
            mongoose.connect('mongodb://localhost/firstDB');
            mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
            mongoose.connection.once('open', function callback () {
                failedNctIDs = nctIds;
                checkNctIndex(failedNctIDs, 0);
            });
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
        console.log('\n\n*****************************************');
        console.log(checkCount + " try to fetch failed trials");
        console.log('There are '+ failedNctIDs.length +' failed trials left');
        checkCount++;
        if(checkCount < 5 && failedNctIDs.length > 0)
        {
            checkNctIndex(failedNctIDs, 0);
        }
        else
        {
            console.log('Done fetching and there are ', failedNctIDs.length, ' failed trials left');
            var leftNctIds = '';
            _.each(failedNctIDs, function(nctId){
                leftNctIds += nctId + '\n';
            });


            fs.writeFile("./failedNctId.txt", leftNctIds, function(err) {
                if(err) {
                    console.log(err);
                } else {
                    console.log("failedNctId.txt was changed!");
                }
            });


            console.log('Final saving data to MongoDB....');
            savingToDB = true;
            saveClinicalTrialMetadata(clinicalTrials,function(){
                mongoose.connection.close();
            });
        }

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
    var url = 'http://clinicaltrials.gov/show/' + nctIds[nctIdIndex] + '?displayxml=true';
    request(url, function(error, response, body){
        parseString(body, {trim: true, attrkey: '__attrkey', charkey: '__charkey'}, function (err, result) {
            if(result.hasOwnProperty('clinical_study')) {
                clinicalTrials.push(result.clinical_study);
                if((nctIdIndex+1) % 100 === 0) {
                    console.log('\t', nctIdIndex+1, ' trials have been parsed.');
                }

                failedNctIDs = _.without(failedNctIDs, nctIds[nctIdIndex]);

            }else {
                console.log('\t\t',nctIds[nctIdIndex], 'does not have clinical study attribute.');
            }
            callback(nctIds, ++nctIdIndex);

        });
    });
}
