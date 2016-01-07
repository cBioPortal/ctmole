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
var	Trial = require('../../app/models/trial.server.model.js');

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
        if(checkCount < 8 && failedNctIDs.length > 0)
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
            // console.error(news); // <- this never gets logged, even if there's no error.

           // saveClinicalTrial(clinicalTrial, callback);

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
