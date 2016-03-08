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
    Mapping = mongoose.model('Mapping'),
    Trial = mongoose.model('clinicaltrial'),
    _ = require('lodash');


var Alteration = mongoose.model('Alteration');
var User = mongoose.model('User');

var ObjectId = mongoose.Types.ObjectId;

/**
 * Create a Mapping
 */
exports.create = function (req, res) {
    var rightNow = new Date();
    rightNow = rightNow.toString();

    var mapping = new Mapping({
        nctId: req.params.nctId,
        alteration: [{alteration_Id: req.params.alteration, status: 'manually'}],
        completeStatus: '1',
        log: [{date: rightNow, user: req.user._id, operationType:'add', alteration_Id: req.params.alteration}]
    });
    mapping.user = req.user;
    mapping.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(mapping);
        }
    });
};


/**
 * Show the current Mapping
 */
exports.read = function (req, res) {
    res.jsonp(req.mapping);
};

/**
 * Update a Mapping
 */
exports.update = function (req, res) {
    var alterationArray = req.body.alteration;
    alterationArray.push({alteration_Id: req.params.Idvalue, status: 'manually'});

    var rightNow = new Date();
    rightNow = rightNow.toString();

    req.body.log.push({date: rightNow, user: req.user._id, operationType:'add', alteration_Id: req.params.Idvalue});

    Mapping.update({nctId: req.body.nctId}, {$set: {alteration: alterationArray, log: req.body.log}}).populate('user', 'displayName').exec(function (err, mappings) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(mappings);
        }
    });

};

/**
 * Delete an Mapping
 */
exports.delete = function (req, res) {
    var mapping = req.mapping;

    mapping.remove(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(mapping);
        }
    });
};

/**
 * List of Mappings
 */
exports.list = function (req, res) {
    Mapping.find().sort('-created').populate('user', 'displayName').exec(function (err, mappings) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(mappings);
        }
    });
};

/**
 * Mapping middleware
 */
exports.mappingByID = function (req, res, next, id) {
    Mapping.findById(id).populate('user', 'displayName').exec(function (err, mapping) {
        if (err) return next(err);
        if (!mapping) return next(new Error('Failed to load Mapping ' + id));
        req.mapping = mapping;
        next();
    });
};

/**
 * Mapping authorization middleware
 */
exports.hasAuthorization = function (req, res, next) {
    if (req.mapping.user.id !== req.user.id) {
        return res.status(403).send('User is not authorized');
    }
    next();
};

//find mapping record by nctId

exports.mappingBynctId = function (req, res) {
    Mapping.findOne({nctId: req.params.Idvalue}).populate('user', 'displayName').exec(function (err, mapping) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        if (!mapping) {
            console.log('No Mapping Record Exist');
            res.jsonp();
        }
        else
        {
            res.jsonp(mapping);
        }

    });
};

function compare(a, b) {
    if (a.date < b.date)
        return -1;
    if (a.date > b.date)
        return 1;
    return 0;
};

exports.convertLog = function (req, res) {
    Mapping.findOne({nctId: req.params.trialID}).populate('user', 'displayName').exec(function (err, mapping) {
        if (err) console.log('error happened when searching ',err);
        if (!mapping) {
            console.log('No Mapping Record Exist');
            res.jsonp();
        }
        else
        {

            var records = [];
            var count = 0;

            _.each(mapping.log, function(item){

                User.findOne({_id: new ObjectId(item.user)}).populate('user', 'displayName').exec(function (err, user) {
                    if (err) console.log('error happened when searching ',err);
                    if (!user) {
                        console.log('No User Record Exist');
                    }
                    else
                    {
                        records.push({user: user.displayName, changetoStatus: item.changetoStatus, date: item.date, operationType: item.operationType, alteration: item.alteration, gene: item.gene});

                        count++;
                        if(count === mapping.log.length){
                            records.sort(compare);
                            res.jsonp(records);
                        }
                    }

                });

            });


        }

    });
};


exports.mappingBynctIdAlt = function (req, res) {

    Mapping.findOne({
        nctId: req.params.nctId,
        alteration: {$elemMatch: {alteration_Id: req.params.alteration, status: 'manually'}}
    }).populate('user', 'displayName').exec(function (err, mapping) {

        //if (err) return next(err);
        if (!mapping) {
            res.jsonp();
        } else {
            res.jsonp(mapping);
        }
        //next();
    });
};


exports.completeTrial = function (req, res) {
    var rightNow = new Date();
    rightNow = rightNow.toString();

    req.body.log.push({date: rightNow, user: req.user._id, operationType:'changeStatus', changetoStatus: req.params.Idvalue});

    Mapping.update({nctId: req.body.nctId}, {$set: {completeStatus: req.params.Idvalue, log: req.body.log}}).exec(function (err, mapping) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            return res.jsonp(mapping);
        }
    });

};


exports.fetchByStatus = function (req, res) {

    Mapping.find({completeStatus: req.params.status}).exec(function (err, mappings) {

        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(mappings);
        }
    });
};


exports.saveMapping = function (req, res) {
    var mapping = new Mapping({
        nctId: req.params.nctId,
        alteration: [],
        completeStatus: true
    });
    mapping.user = req.user;
    mapping.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(mapping);
        }
    });
};



exports.saveComments = function (req, res) {
    Mapping.findOne({nctId: req.params.trialID}).populate('user', 'displayName').exec(function (err, mapping) {
        if (err) console.log('error happened when searching ',err);
        if (!mapping) {
            console.log('No Mapping Record Exist');

            var mapping = new Mapping({
                nctId: req.params.trialID,
                alteration: [],
                completeStatus: '1',
                comments: [req.params.comment]
            });
            mapping.user = req.user;
            mapping.save(function (err) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    res.jsonp(mapping);
                }
            });


        }
        else
        {
            req.mapping = mapping;
            mapping.comments.push(req.params.comment);
            if(mapping.completeStatus === '1')
            {
                mapping.completeStatus = '2';
            }
            Mapping.update({nctId: req.params.trialID}, {$set: {comments: mapping.comments, completeStatus: mapping.completeStatus}}).exec(function (err, mapping) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    return res.jsonp(mapping);
                }
            });


        }

    });
};

exports.confirmAlteration = function (req, res) {
    Mapping.findOne({nctId: req.params.trialID}).populate('user', 'displayName').exec(function (err, mapping) {
        if (err) console.log('error happened when searching ',err);
        req.mapping = mapping;

        _.each(mapping.alterations, function(item){
            if(item.alteration === req.params.alteration && item.gene === req.params.gene && item.type === req.params.type){
                item.status = 'confirmed';
            }
        });
        var rightNow = new Date();
        rightNow = rightNow.toString();

        mapping.log.push({date: rightNow, user: req.user._id, operationType:'confirm', alteration_Id: req.params.alteration_Id});

        if(mapping.completeStatus === '1')
        {
            mapping.completeStatus = '2';
        }

        Mapping.update({nctId: req.params.trialID}, {$set: {alterations: mapping.alterations, log: mapping.log, completeStatus: mapping.completeStatus}}).exec(function (err, mapping) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                return res.jsonp(mapping);
            }
        });

    });
};


exports.deleteAlteration = function (req, res) {

    Mapping.findOne({nctId: req.params.trialID}).populate('user', 'displayName').exec(function (err, mapping) {
        if (err) console.log('error happened when searching ',err);
        req.mapping = mapping;

        for (var i = 0; i < mapping.alterations.length; i++) {
            if ((req.params.alteration === 'unspecified' || mapping.alterations[i].alteration === req.params.alteration) && mapping.alterations[i].type === req.params.type && mapping.alterations[i].gene === req.params.gene)
            {
                mapping.alterations.splice(i, 1);
                break;
            }
        }
        var rightNow = new Date();
        rightNow = rightNow.toString();

        mapping.log.push({date: rightNow, user: req.user._id, operationType:'delete', alteration: req.params.alteration, gene: req.params.gene});

        if(mapping.completeStatus === '1')
        {
            mapping.completeStatus = '2';
        }

        Mapping.update({nctId: req.params.trialID}, {$set: {alterations: mapping.alterations, log: mapping.log, completeStatus: mapping.completeStatus }}).exec(function (err, mapping) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                return res.jsonp(mapping);
            }
        });

    });


};

function compare(a, b) {
    return a.predicted + a.curated - b.predicted + b.curated;
}

exports.geneTrialCounts = function(req, res){
    var geneTrialCountArr = [];
    var validStatusTrials = [];
    Trial.find({$and:[{countries: {$in: ["United States"]}},  {$or:[{recruitingStatus: 'Recruiting'},{recruitingStatus: 'Active, not recruiting'}]} ]}).stream()
        .on('data', function(trial){
            validStatusTrials.push(trial.nctId);
        })
        .on('error', function(){
            console.log('error happened when searching valid status trials ');
        })
        .on('end', function(){
            Mapping.find({nctId: {$in: validStatusTrials}}).stream()
                .on('data', function(mapping){


                    if(mapping.alterations !== undefined && mapping.alterations.length !== 0)
                    {
                        var countedGenes = [];
                        _.each(mapping.alterations, function(item){
                            //use geneIndex to make sure each gene only count once for each trial
                            var currentGene = item.gene;

                            var index = -1, geneIndex = countedGenes.indexOf(currentGene);
                            for(var i = 0;i < geneTrialCountArr.length;i++)
                            {
                                if(geneTrialCountArr[i].gene === currentGene)
                                {
                                    index = i;
                                    break;
                                }
                            }
                            if(index === -1 && item.curationMethod === 'predicted' && item.status === 'unconfirmed')
                            {
                                geneTrialCountArr.push({gene: currentGene, predicted: 1, curated: 0});
                            }
                            else if(index === -1 && (item.curationMethod === 'manually' || item.status === 'confirmed') )
                            {
                                geneTrialCountArr.push({gene: currentGene, predicted: 0, curated: 1});
                            }
                            else if(geneIndex === -1 && index !== -1 && item.curationMethod === 'predicted' && item.status === 'unconfirmed')
                            {
                                geneTrialCountArr[index].predicted++;
                            }
                            else if(geneIndex === -1 && index !== -1 && (item.curationMethod === 'manually' || item.status === 'confirmed'))
                            {
                                geneTrialCountArr[index].curated++;
                            }

                            countedGenes.push(currentGene);

                        });
                    }
                })
                .on('error', function(err){
                    // handle error
                    console.log('error happened');
                })
                .on('end', function(){
                    // final callback
                    geneTrialCountArr.sort(compare);
                    return res.jsonp(geneTrialCountArr);
                });
        })



}


exports.curationStatusCounts = function(req, res){
    var curationStatusCountArr = [0, 0, 0];

        Mapping.find({}).stream()
            .on('data', function(mapping){
                //var countFlag = true;
                if(mapping.completeStatus !== undefined)
                {
                    if(mapping.completeStatus === '2')
                    {
                        curationStatusCountArr[1]++;
                    }
                    else if(mapping.completeStatus === '3')
                    {
                        curationStatusCountArr[2]++;
                    }
                }
            })
            .on('error', function(err){
                // handle error
                console.log('error happened');
            })
            .on('end', function(){
                // final callback
                Trial.find({countries: {$in: ['United States']}}).count().exec(function(err, countResult){
                    curationStatusCountArr[0] = countResult - curationStatusCountArr[1] - curationStatusCountArr[2];
                    return res.jsonp(curationStatusCountArr);
                });

            });

}

exports.overlappingTrials = function(req, res){
    var filteredNctIds = [], tempArr = [], firstFlag = true, count = 0;
    var gene = req.params.gene;
    var alterations = req.params.alterations;
    _.each(alterations, function(item){
        tempArr = [];
        Mapping.find({alterations: {$in: [{gene: gene, alteration: item, curationMethod: 'manually', type: 'inclusion'},
            {gene: gene, alteration: item, curationMethod: 'manually', type: 'exclusion'},
            {gene: gene, alteration: item, curationMethod: 'predicted', type: 'inclusion', status: 'unconfirmed'},
            {gene: gene, alteration: item, curationMethod: 'predicted', type: 'inclusion', status: 'confirmed'},
            {gene: gene, alteration: item, curationMethod: 'predicted', type: 'exclusion', status: 'unconfirmed'},
            {gene: gene, alteration: item, curationMethod: 'predicted', type: 'exclusion', status: 'confirmed'} ]}}).stream()
            .on('data', function(mapping){
                tempArr.push(mapping.nctId);
            })
            .on('error', function(err){
                console.log('error happened when searching ', err);
            })
            .on('end', function(){
                count++;
                if(firstFlag){
                    filteredNctIds = tempArr;
                    firstFlag = false;
                }
                else{
                    filteredNctIds = _.intersection(tempArr, filteredNctIds);
                }

                if(count === alterations.length){
                    console.log('here is the mapping info ', filteredNctIds);
                  return res.jsonp(filteredNctIds);
                }
            });
    });
}



