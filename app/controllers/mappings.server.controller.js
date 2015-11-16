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
    _ = require('lodash');


var Alteration = mongoose.model('Alteration');
var User = mongoose.model('User');

var ObjectId = mongoose.Types.ObjectId;

/**
 * Create a Mapping
 */
exports.create = function (req, res) {
    var mapping = new Mapping({
        nctId: req.params.nctId,
        alteration: [{alteration_Id: req.params.alteration, status: 'manually'}],
        completeStatus: '1',
        log: [{date: new Date(), user: req.user._id, operationType:'add', alteration_Id: req.params.alteration}]
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

    req.body.log.push({date: new Date(), user: req.user._id, operationType:'add', alteration_Id: req.params.Idvalue});

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
                        if(item.operationType === 'changeStatus')
                        {
                            records.push({user: user.displayName, changetoStatus: item.changetoStatus, date: item.date, operationType: item.operationType});

                            count++;
                            if(count === mapping.log.length){
                                res.jsonp(records);
                            }
                        }
                        else if(item.alteration_Id !== undefined)
                        {
                            Alteration.findOne({_id: new ObjectId(item.alteration_Id)}).populate('user', 'displayName').exec(function (err1, alteration) {

                                if (err1) console.log('error happened when searching ',err1);
                                if (!alteration) {
                                    console.log('No alteration Record Exist');
                                }
                                else
                                {
                                    records.push({user: user.displayName, alteration: alteration, date: item.date, operationType: item.operationType});

                                }
                                count++;
                                if(count === mapping.log.length){
                                    res.jsonp(records);

                                }

                            });
                        }
                        else if(item.gene !== undefined)
                        {
                            records.push({user: user.displayName, gene: item.gene, date: item.date, operationType: item.operationType});

                            count++;
                            if(count === mapping.log.length){
                                res.jsonp(records);
                            }
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

    req.body.log.push({date: new Date(), user: req.user._id, operationType:'changeStatus', changetoStatus: req.params.Idvalue});

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


exports.fetchByAltId = function (req, res) {
    Mapping.find({completeStatus: true}).exec(function (err, mappings) {

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

            Mapping.update({nctId: req.params.trialID}, {$set: {comments: mapping.comments}}).exec(function (err, mapping) {
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


exports.confirmGene = function (req, res) {
    Mapping.findOne({nctId: req.params.trialID}).populate('user', 'displayName').exec(function (err, mapping) {
        if (err) console.log('error happened when searching ',err);
        req.mapping = mapping;

        _.each(mapping.predictedGenes, function(item){
            if(item.gene === req.params.gene){
                item.confirmStatus = 'confirmed';
            }
        });
        mapping.log.push({date: new Date(), user: req.user._id, operationType:'confirmGene', gene: req.params.gene});
        Mapping.update({nctId: req.params.trialID}, {$set: {predictedGenes: mapping.predictedGenes, log: mapping.log}}).exec(function (err, mapping) {
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


exports.confirmAlteration = function (req, res) {
    Mapping.findOne({nctId: req.params.trialID}).populate('user', 'displayName').exec(function (err, mapping) {
        if (err) console.log('error happened when searching ',err);
        req.mapping = mapping;

        _.each(mapping.alteration, function(item){
            if(item.alteration_Id === req.params.alteration_Id){
                item.confirmStatus = 'confirmed';
            }
        });
        mapping.log.push({date: new Date(), user: req.user._id, operationType:'confirmAlteration', alteration_Id: req.params.alteration_Id});

        Mapping.update({nctId: req.params.trialID}, {$set: {alteration: mapping.alteration, log: mapping.log}}).exec(function (err, mapping) {
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

        for (var i = 0; i < mapping.alteration.length; i++) {
            if (mapping.alteration[i].alteration_Id === req.params.alteration_Id) {console.log('deleting...');
                mapping.alteration.splice(i, 1);
                break;
            }
        }

        mapping.log.push({date: new Date(), user: req.user._id, operationType:'delete', alteration_Id: req.params.alteration_Id});

        Mapping.update({nctId: req.params.trialID}, {$set: {alteration: mapping.alteration, log: mapping.log }}).exec(function (err, mapping) {
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


exports.deleteGene = function (req, res) {

    Mapping.findOne({nctId: req.params.trialID}).populate('user', 'displayName').exec(function (err, mapping) {
        if (err) console.log('error happened when searching ',err);
        req.mapping = mapping;

        for (var i = 0; i < mapping.predictedGenes.length; i++) {
            if (mapping.predictedGenes[i].gene === req.params.gene) {
                mapping.predictedGenes.splice(i, 1);
                break;
            }
        }

        mapping.log.push({date: new Date(), user: req.user._id, operationType:'delete', gene: req.params.gene});

        Mapping.update({nctId: req.params.trialID}, {$set: {predictedGenes: mapping.predictedGenes, log: mapping.log }}).exec(function (err, mapping) {
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
