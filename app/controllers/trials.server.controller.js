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

'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
        errorHandler = require('./errors'),
        Trial = mongoose.model('clinicaltrial'),
        Mapping = mongoose.model('Mapping'),
        Cancertype = mongoose.model('Cancertype'),
        _ = require('lodash');

var ObjectId = mongoose.Types.ObjectId;

var request = require('request');
var parseString = require('xml2js').parseString;


/**
 * Create a Trial
 */
exports.create = function (req, res) {
    var trial = new Trial(req.body);
    /*console.log('testing here 123...');
     
     var trial = new Trial({ 'nctId': 'NCT02270606',
     'title': 'test',
     'purpose': 'test',
     'recruitingStatus': 'test',
     'eligibilityCriteria': 'test',
     'phase': 'test',
     'diseaseCondition': 'test',
     'lastChangeDate': 'test'});
     */
    trial.user = req.user;
    trial.save(function (err) {
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(trial);
        }
    });
};

/**
 * Show the current Trial
 */
exports.read = function (req, res) {
    res.jsonp(req.trial);
};

/**
 * Update a Trial
 
 exports.update = function(req, res) {
 
 var trial = req.trial ;
 
 trial = _.extend(trial , req.body);
 
 trial.save(function(err) {
 if (err) {
 return res.status(400).send({
 message: errorHandler.getErrorMessage(err)
 });
 } else {
 res.jsonp(trial);
 }
 });
 
 };
 */
/**
 * Delete an Trial
 */
exports.delete = function (req, res) {
    var trial = req.trial;

    trial.remove(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(trial);
        }
    });
};

/**
 * List of Trials
 */
exports.list = function (req, res) {
    Trial.find({$and: [{countries: {$in: ['United States']}}, {$or: [{recruitingStatus: 'Recruiting'}, {recruitingStatus: 'Active, not recruiting'}]}]}).exec(function (err, trials) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(trials);
        }
    });
};

exports.searchTrials = function (req, res) {
    var nctIds = [];
    var geneInput = (req.params.gene === " " ? false : true);
    var alterationInput = (req.params.alteration === " " ? false : true);
    var tumorTypeInput = (req.params.tumorType === " " ? false : true);
    var otherContentInput = (req.params.otherContent === " " ? false : true);
    if (geneInput || alterationInput) {
        Mapping.find().stream()
                .on('data', function (mapping) {
                    if (mapping.alterations !== undefined && mapping.alterations.length !== 0)
                    {
                        for (var i = 0; i < mapping.alterations.length; i++) {
                            //if there is gene input, test if it matches. if there is not, return true to skip test
                            //same for alteration input 
                            if ((geneInput ? mapping.alterations[i].gene.toUpperCase() === req.params.gene.toUpperCase() : true) && (alterationInput ? mapping.alterations[i].alteration.toUpperCase() === req.params.alteration.toUpperCase() : true)) {
                                nctIds.push(mapping.nctId);
                                break;
                            }
                        }

                    }
                })
                .on('error', function (err) {
                    // handle error
                    console.log('error happened');
                })
                .on('end', function () {
                    if (tumorTypeInput) {
                        searchCancerTypes(req, res, nctIds, req.params.tumorType, req.params.otherContent, true);
                    } else if (otherContentInput)
                    { 
                        generalSearch(req, res, nctIds, req.params.otherContent, true);
                    } else {
                        finalSearch(res, nctIds);
                        
                    }

                });
    } else if (tumorTypeInput) { 
        searchCancerTypes(req, res, nctIds, req.params.tumorType, req.params.otherContent, false);
    } else if (otherContentInput)
    {    
        generalSearch(req, res, nctIds, req.params.otherContent, false);
    } else {
        console.log('there is no input items');
        res.jsonp();
    }



};
function searchCancerTypes(req, res, nctIds, tumorType, otherContent, BioMarkerFlag) {
    var nctIdsFromTumorType = [];
    var finalExp = new RegExp(tumorType, 'i');
    //keep searching cancertype table
    Cancertype.find({cancer: {$regex: finalExp}}).stream()
            .on('data', function (item) {
                nctIdsFromTumorType = nctIdsFromTumorType.concat(item.nctIds);
            })
            .on('error', function (error) {
                console.log('Error happened when searching for tumor type ', error);
            })
            .on('end', function () {
                if(BioMarkerFlag){
                    nctIdsFromTumorType = _.intersection(nctIds, nctIdsFromTumorType);
                } 
                if (otherContent !== ' ')
                {
                    generalSearch(req, res, nctIdsFromTumorType, otherContent, true);
                } else {
                    finalSearch(res, nctIdsFromTumorType);
                }

            });
}
function generalSearch(req, res, nctIds, otherContent, preciseFlag) { 
    var keywords = otherContent;
    var bits = keywords.split(/,|;/);
    var tempIndex = 0, tempStr = '';
    var finalPattern = '';

    for (var i = 0; i < bits.length - 1; i++)
    {
        tempStr = bits[i].trim();
        finalPattern += '(?=.*' + tempStr + ')';
        finalPattern = '(' + finalPattern + ')';
        if (i === 0)
        {
            tempIndex += bits[i].length;
        } else
        {
            tempIndex += bits[i].length + 1;
        }

        if (keywords[tempIndex] === ';') {
            finalPattern += '|';
        }

    }
    tempStr = bits[bits.length - 1].trim();
    finalPattern += '(?=.*' + tempStr + ')';

    var finalExp = new RegExp(finalPattern, 'i');

    Trial.find({$or: [{nctId: {$regex: finalExp}},
            {title: {$regex: finalExp}},
            {purpose: {$regex: finalExp}},
            {recruitingStatus: {$regex: finalExp}},
            {eligibilityCriteria: {$regex: finalExp}},
            {phase: {$regex: finalExp}},
            {diseaseCondition: {$regex: finalExp}},
            {lastChangedDate: {$regex: finalExp}},
            {countries: {$regex: finalExp}},
            {drugs: {$regex: finalExp}},
            {tumorTypes: {$regex: finalExp}},
            {arm_group: {$regex: finalExp}}]}).exec(function (err, trials) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            if (trials.length === 0) {
                console.log('no trials found');
                res.jsonp();
            } else {
                var trialIds = _.map(trials, function (item) {
                    return item.nctId;
                });
                if(preciseFlag){
                    trialIds = _.intersection(trialIds, nctIds);
                }
                finalSearch(res, trialIds);
            }
        }
    });
}

function finalSearch(res, trialIds) {
    Trial.find({nctId: {$in: trialIds}}).exec(function (err, trials) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
             
            var trialsNCTIDS = _.map(trials, function(item){return item.nctId;});
            
            var diffArr = _.difference(trialIds, trialsNCTIDS);
            if(diffArr.length > 0){
                console.log('There are ', diffArr.length, " new trials need to fetch and save");
                //there are some new trials not exist in trial table, need to fetch it first
                saveNewTrials(res, trials, diffArr, 0);
            }else{
                console.log("No new trials need to save");
                getMappingInfo(res, trials);
            }
            
        }
    });
}

function saveNewTrials(res, trials, nctIds, index){
    var url = 'http://clinicaltrials.gov/ct2/show/' + nctIds[index] + '?displayxml=true';
    request(url, function (error, response, body) {
        parseString(body, {trim: true, attrkey: '__attrkey', charkey: '__charkey'}, function (err, metadata) {
            if (metadata !== undefined && metadata.hasOwnProperty('clinical_study')) {
                metadata = metadata.clinical_study;
                var drugsNeeded = [];
                if(metadata.intervention !== undefined)
                {
                    _.each(metadata.intervention, function(item){
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


                trialRecord.save(function(err, newTrial){
                    if(err)console.log('Error happened when saving to db', err);
                    else{
                        console.log('Insert', nctIds[index], ' into trial collection successfully');
                        trials.push(newTrial);
                        if(index < nctIds.length - 1){
                            index++;
                            setTimeout(function(){
                                saveNewTrials(res, trials, nctIds, index);
                            }, 500);
                        }else{
                            getMappingInfo(res, trials);
                        }
                        
                    } 
                });

            } else {
                console.log(nctIds[index], 'does not have clinical study attribute.');
                if (index < nctIds.length - 1) {
                    index++;
                    setTimeout(function () {
                        saveNewTrials(res, trials, nctIds, index);
                    }, 500);
                } else {
                    getMappingInfo(res, trials);
                }
            }


        });
    });
}

function getMappingInfo(res, trials){
    var trialIds = _.map(trials, function(item){
        return item.nctId;
    });
    var altRecords = [], tempIndex = -1;
    Mapping.find({nctId: {$in: trialIds}}).stream()
            .on('data', function (mapping) {
                _.each(mapping.alterations, function (item) {
                    if(item.gene === ""){
                        console.log('here are the empty genes ', mapping.nctId);
                    }
                    tempIndex = -1;
                    for (var i = 0; i < altRecords.length; i++)
                    {
                        if (altRecords[i].gene === item.gene && altRecords[i].alteration === item.alteration) {
                            tempIndex = i;
                            break;
                        }
                    }

                    if (tempIndex === -1) {
                        altRecords.push({gene: item.gene, alteration: item.alteration, nctIds: [mapping.nctId]});
                    } else {
                        if (altRecords[tempIndex].nctIds.indexOf(mapping.nctId) === -1)
                        {
                            altRecords[tempIndex].nctIds.push(mapping.nctId);
                        }
                    }

                });

            })
            .on('error', function () {

            })
            .on('end', function () {
                trials.push(altRecords);
                res.jsonp(trials);

            });
}

exports.search = function (req, res) {
    res.jsonp(req.trials);
};
/**
 * Trial middleware
 */
exports.trialByID = function (req, res, next, id) {
    Trial.findOne({'nctId': id}).exec(function (err, trial) {
        if (err)
            return next(err);

        if (!trial) {

            var nctId = id;
            var url = 'http://clinicaltrials.gov/ct2/show/' + nctId + '?displayxml=true';

            var updateRequiredTrial;
            request(url, function (error, response, body) {
                parseString(body, {trim: true, attrkey: '__attrkey', charkey: '__charkey'}, function (err, result) {

                    if (typeof result !== 'undefined' && result.hasOwnProperty('clinical_study')) {
                        updateRequiredTrial = result.clinical_study;
                        trial = new Trial({nctId: nctId});
                        trial.recruitingStatus = updateRequiredTrial.overall_status;
                        trial.title = updateRequiredTrial.brief_title;
                        trial.purpose = updateRequiredTrial.brief_summary[0].textblock;
                        trial.phase = updateRequiredTrial.phase;
                        trial.eligibilityCriteria = updateRequiredTrial.eligibility[0].criteria[0].textblock[0];
                        trial.diseaseCondition = updateRequiredTrial.condition_browse[0].mesh_term.toString();
                        trial.arm_group = updateRequiredTrial.arm_group;
                        var d = new Date();
                        trial.lastUpdatedStatusDate = d.toDateString();

                        trial.save(function (err) {
                            if (err) {
                                //return res.status(400).send({
                                //	message: errorHandler.getErrorMessage(err)
                                //});
                                console.log('error happened when inserting new record: ');
                                console.log(err);
                            } else {
                                console.log('success insert record ');
                                //res.jsonp(trial);
                            }
                        });
                    } else {
                        trial = null;
                        console.log(nctId, 'does not have clinical study attribute.');
                    }


                });
            });

        } else {
            req.trial = trial;
            next();
        }


    });
};

/**
 * Search list trials
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @param  {[type]}   list [description]
 * @return {[type]}        [description]
 */
exports.searchList = function (req, res) {
    Trial.find({'nctId': {$in: req.body}}).exec(function (err, trials) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(trials);
        }
    });
};

/**
 * Search trial by keywords
 */
exports.searchByKeyword = function (req, res, next, keyword) {
    Trial.find({'tumorTypes.clinicalTrialKeywords': keyword}, 'nctId').limit(10).exec(function (err, trials) {
        if (err)
            return next(err);
        if (!trials)
            return next(new Error('Failed to load Trial ' + keyword));
        req.trials = trials;
        next();
    });
};

/**
 * Trial authorization middleware
 */
exports.hasAuthorization = function (req, res, next) {
    if (req.trial.user.id !== req.user.id) {
        return res.status(403).send('User is not authorized');
    }
    next();
};

exports.updateTrial = function (req, res) {

    var trial = req.trial;
    var nctId = req.body.nctId;
    var url = 'http://clinicaltrials.gov/ct2/show/' + nctId + '?displayxml=true';

    var updateRequiredTrial;
    request(url, function (error, response, body) {
        parseString(body, {trim: true, attrkey: '__attrkey', charkey: '__charkey'}, function (err, result) {
            if (result.hasOwnProperty('clinical_study')) {
                updateRequiredTrial = result.clinical_study;
                trial.recruitingStatus = updateRequiredTrial.overall_status;
                var d = new Date();
                trial.lastUpdatedStatusDate = d.toDateString();

                trial.save(function (err) {
                    if (err) {
                        return res.status(400).send({
                            message: errorHandler.getErrorMessage(err)
                        });
                    } else {
                        console.log('success inserting new record');
                        res.jsonp(trial);
                    }
                });
            } else {
                console.log(nctId, 'does not have clinical study attribute.');
            }


        });
    });

};


exports.multiTrials = function (req, res) {
    var nctIds = req.params.nctIds;
    nctIds = nctIds.split(',');

    Trial.find({'nctId': {$in: nctIds}}).exec(function (err, trials) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(trials);
        }
    });
};

exports.tumorTypes = function (req, res) {
    var tumorTypes = [];
    Trial.find({countries: {$in: ['United States']}}).stream()
            .on('data', function (trial) {
                if (trial.tumorTypes !== undefined)
                {
                    tumorTypes = tumorTypes.concat(trial.tumorTypes);
                }
            })
            .on('error', function (err) {
                // handle error
                console.log('error happened tumor');
            })
            .on('end', function () {
                // final callback
                tumorTypes.sort();
                var finalTumors = [{tumor: tumorTypes[0], count: 1}];

                for (var i = 1; i < tumorTypes.length; i++)
                {
                    for (var j = 0; j < finalTumors.length; j++)
                    {
                        if (tumorTypes[i] === finalTumors[j].tumor) {
                            finalTumors[j].count++;
                            break;
                        } else if (j === finalTumors.length - 1)
                        {
                            finalTumors.push({tumor: tumorTypes[i], count: 1});
                        }

                    }

                }
                return res.jsonp(finalTumors);
            });

};

exports.statusCounts = function (req, res) {
    var statusCounts = {'Not_yet_recruiting': 0, 'Recruiting': 0, 'Enrolling_by_invitation': 0,
        'Active_not_recruiting': 0, 'Completed': 0, 'Others': 0};

    Trial.find({countries: {$in: ['United States']}}).stream()
            .on('data', function (trial) {
                if (trial.recruitingStatus === 'Not yet recruiting')
                {
                    statusCounts.Not_yet_recruiting++;
                } else if (trial.recruitingStatus === 'Recruiting')
                {
                    statusCounts.Recruiting++;
                } else if (trial.recruitingStatus === 'Enrolling by invitation')
                {
                    statusCounts.Enrolling_by_invitation++;
                } else if (trial.recruitingStatus === 'Active, not recruiting')
                {
                    statusCounts.Active_not_recruiting++;
                } else if (trial.recruitingStatus === 'Completed')
                {
                    statusCounts.Completed++;
                } else
                {
                    statusCounts.Others++;
                }

            })
            .on('error', function (err) {
                // handle error
                console.log('error happened tumor');
            })
            .on('end', function () {
                // final callback
                return res.jsonp(statusCounts);
            });

};
