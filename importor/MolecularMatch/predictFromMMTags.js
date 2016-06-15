/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var request = require('request');
var mongoose = require('mongoose');
var _ = require('underscore');
var MMTrial = require('../../app/models/mmtrial.server.model.js');
var Mapping = require('../../app/models/mapping.server.model.js');
var Trial = require('../../app/models/trial.server.model.js');
var mappings = [], gene, alteration, uniqueNctIds = [], mappingIndex = 0, firstSpace = -1, firstDash = -1, failedTrials = [];
var parseString = require('xml2js').parseString;
function main() {
    mongoose.connect('mongodb://localhost/firstDB');
    mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
    mongoose.connection.once('open', function () {
        console.log('Done connecting and begin to fetch trials info...');

        MMTrial.find({status: {$in: ["Active, not recruiting", "Approved", "Approved for marketing", "Recruiting", "Not yet recruiting", "Available", "Enrolling by invitation", "Open", "Enrolling"]}}, {id: 1, tags: 1}).exec(function (err, trials) {
            if (err) {
                console.log('error message ', err);
            } else {
                _.each(trials, function (item, index) {
                    if (index % 1000 === 0)
                        console.log('parsing trial ', index + 1);
                    _.each(item.tags, function (tag) {

                        if (tag.facet === "GENE" || tag.facet === "MUTATION") {

                            if (tag.facet === "GENE") {
                                gene = tag.term;
                                alteration = "unspecified";
                            } else if (tag.facet === "MUTATION") {
                                firstDash = tag.term.indexOf("-");
                                if (firstDash !== -1) {
                                    gene = tag.term.substring(0, firstDash);
                                    alteration = tag.term;
                                } else {
                                    firstSpace = tag.term.indexOf(" ");
                                    gene = tag.term.substring(0, firstSpace);
                                    alteration = tag.term.substring(firstSpace + 1);
                                }

                            }
                            if (uniqueNctIds.indexOf(item.id) === -1) {
                                uniqueNctIds.push(item.id);
                                mappings.push({nctId: item.id, alterations: [{gene: gene, alteration: alteration, "curationMethod": "predicted", "type": "inclusion", "status": "unconfirmed"}]});
                            } else {
                                mappings[uniqueNctIds.indexOf(item.id)].alterations.push({gene: gene, alteration: alteration, "curationMethod": "predicted", "type": "inclusion", "status": "unconfirmed"});
                            }

                        }

                    });

                });
                console.log('Done getting mapping table, begin to save...');
                saveToDB();
            }
        });
    });
}
function saveToDB() {
    var mapping = new Mapping({"nctId": mappings[mappingIndex].nctId, "alterations": mappings[mappingIndex].alterations, completeStatus: "1", log: [], comments: [], oncoTreeTumors: []});

    mapping.save(function (err) {
        if (err) {
            console.log('error occured ', err);
        }
        if (mappingIndex % 1000 === 0)
            console.log('saving index ', mappingIndex);

        if (mappingIndex < mappings.length - 1) {
            mappingIndex++;
            saveToDB();
        } else {
            console.log('Done saving to mapping table, need to check if exist in trials table');
            findUniqueNctIdsInMapping();
        }

    });

}

function findUniqueNctIdsInMapping() {
    var uniqueMappingNctIds = [];
    Mapping.find({}).exec(function (error, data) {
        uniqueMappingNctIds = _.map(data, function (item) {
            return item.nctId;
        });
        var difference = [], tempArr = [];
        Trial.find({nctId: {$in: uniqueMappingNctIds}}).exec(function (error, trials) {
            tempArr = _.map(trials, function (item) {
                return item.nctId;
            });
            difference = _.difference(uniqueMappingNctIds, tempArr);
            console.log('There are ', difference.length, ' new trials need to be saved');
            saveTrials(difference, 0);
        });

    });
}

function saveTrials(nctIds, index) {
    var url = 'http://clinicaltrials.gov/ct2/show/' + nctIds[index] + '?displayxml=true';
    request(url, function (error, response, body) {
        parseString(body, {trim: true, attrkey: '__attrkey', charkey: '__charkey'}, function (err, metadata) {
            if (metadata !== undefined && metadata.hasOwnProperty('clinical_study')) {
                metadata = metadata.clinical_study;
                var drugsNeeded = [];
                if (metadata.intervention !== undefined)
                {
                    _.each(metadata.intervention, function (item) {
                        drugsNeeded.push(item.intervention_name);
                    });
                }


                var trialRecord = new Trial({nctId: nctIds[index],
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


                trialRecord.save(function (err) {
                    if (err)
                        console.log('Error happened when saving to db', err);
                    else {
                        console.log('Insert', nctIds[index], ' into trial collection successfully');

                        if (index < nctIds.length - 1) {
                            index++;
                            setTimeout(function () {
                                saveTrials(nctIds, index);
                            }, 500);
                        } else {
                            console.log('Done saving new trials');
                        }

                    }
                });

            } else {
                failedTrials.push(nctIds[index]);
                console.log(nctIds[index], 'does not have clinical study attribute.');
                if (index < nctIds.length - 1) {
                    index++;
                    setTimeout(function () {
                        saveTrials(nctIds, index);
                    }, 1000);
                } else {
                    console.log('Done saving new trials');
                    console.log('failed trials ', failedTrials);
                }
            }


        });
    });
}

main();


function test() {
    var url = 'http://clinicaltrials.gov/ct2/show/NCT00290758?displayxml=true';
    request(url, function (error, response, body) {
        parseString(body, {trim: true, attrkey: '__attrkey', charkey: '__charkey'}, function (err, metadata) {
            if (metadata !== undefined && metadata.hasOwnProperty('clinical_study')) {
                metadata = metadata.clinical_study;
                var drugsNeeded = [];
                if (metadata.intervention !== undefined)
                {
                    _.each(metadata.intervention, function (item) {
                        drugsNeeded.push(item.intervention_name);
                    });
                }


                var trialRecord = new Trial({nctId: "NCT00290758",
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

                mongoose.connect('mongodb://localhost/firstDB');
                mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
                mongoose.connection.once('open', function () {
                    console.log('Done connecting and begin to fetch trials info...');
                    trialRecord.save(function (err) {
                        if (err)
                            console.log('Error happened when saving to db', err);
                        else {
                            console.log('Insert into trial collection successfully');

                        }
                    });
                });


            } else {
                console.log('does not have clinical study attribute.');

            }


        });
    });
}

//test();