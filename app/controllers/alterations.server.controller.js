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
    Alteration = mongoose.model('Alteration'),
    Mapping = mongoose.model('Mapping'),
    _ = require('lodash');

var ObjectId = mongoose.Types.ObjectId;

/**
 * Create a Alteration
 */
exports.create = function (req, res) {
    //var alteration = new Alteration(req.body);
    var alteration = new Alteration({
        'alteration': req.body.alteration.toUpperCase(),
        'gene': req.body.gene.toUpperCase()
    });
    alteration.user = req.user;

    alteration.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(alteration);
        }
    });
};

/**
 * Show the current Alteration
 */
exports.read = function (req, res) {
    res.jsonp(req.alteration);
};


exports.readAlterations = function (req, res) {
    res.jsonp(req.alterations);
};

/**
 * Update a Alteration
 */
exports.update = function (req, res) {
    var alteration = req.alteration;

    alteration = _.extend(alteration, req.body);

    alteration.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(alteration);
        }
    });
};

/**
 * Delete an Alteration
 */
exports.delete = function (req, res) {
    var alteration = req.alteration;

    alteration.remove(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(alteration);
        }
    });
};

/**
 * List of Alterations
 */
exports.list = function (req, res) {
    Alteration.find().sort('-created').populate('user', 'displayName').exec(function (err, alterations) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(alterations);
        }
    });
};

/**
 * Alteration middleware
 */

exports.alterationByID = function (req, res) {
    var altArr = req.params.Ids.split(',');
    var newArr = [];
    for (var i = 0; i < altArr.length; i++) {
        newArr.push(new ObjectId(altArr[i]));
    }

    console.log(newArr);

    Alteration.find({'_id': {$in: newArr}}).populate('user', 'displayName').exec(function (err, alterations) {

        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(alterations);
        }
    });

};


exports.alterationByTwoIDs = function (req, res) {
    Alteration.findOne({
        'alteration': req.params.alteration,
        'gene': req.params.gene
    }).populate('user', 'displayName').exec(function (err, alteration) {
        //if (err) return next(err);
        if (alteration) {
            req.alteration = alteration;
            res.jsonp(req.alteration);
        } else {
            res.jsonp();
        }
        //next();
    });
};

/**
 * Alteration authorization middleware
 */
exports.hasAuthorization = function (req, res, next) {
    if (req.alteration.user.id !== req.user.id) {
        return res.status(403).send('User is not authorized');
    }
    next();
};

exports.generalSearch = function (req, res) {
    var keywords = req.params.searchEngineKeyword;
    var keywordsArr = keywords.split(',');
    var finalStr = '';
    var tempStr = '';
    for (var i = 0; i < keywordsArr.length; i++) {
        tempStr = '\"' + keywordsArr[i].trim() + '\"';
        finalStr += tempStr;
    }

    Alteration.find({$text: {$search: finalStr}}).exec(function (err, alterations) {

        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(alterations);
        }
    });
};

exports.addNewAlteration = function (req, res) {

    var result = '';
    Alteration.findOne({
        'alteration': req.params.alteration,
        'gene': req.params.gene
    }).populate('user', 'displayName').exec(function (err, alteration) {

        if (alteration) {
            console.log('found record');
            Mapping.findOne({nctId: req.params.nctId}).populate('user', 'displayName').exec(function (err, mapping) {
                if (err) res.jsonp('e');
                if (!mapping) {
                    console.log('Mapping record not exist yet');
                    var mapping = new Mapping({
                        nctId: req.params.nctId,
                        alteration: [{alteration_Id: alteration._id.toString(), status: 'manually'}],
                        completeStatus: 1,
                        log: [{
                            date: new Date(),
                            user: req.user._id.toString(),
                            operationType: 'add',
                            alteration_Id: alteration._id.toString()
                        }]
                    });
                    mapping.user = req.user;
                    mapping.save(function (err) {
                        if (err) {
                            //e stands for error
                            res.jsonp('e');
                        } else {
                            res.jsonp('a');
                        }
                    });
                }
                else {
                    mapping.alteration.push({alteration_Id: alteration._id.toString(), status: 'manually'});
                    mapping.log.push({
                        date: new Date(),
                        user: req.user._id.toString(),
                        operationType: 'add',
                        alteration_Id: alteration._id.toString()
                    });

                    Mapping.update({nctId: req.params.nctId}, {
                        $set: {
                            alteration: mapping.alteration,
                            log: mapping.log
                        }
                    }).exec(function (err, mapping) {
                        if (err) {
                            res.jsonp('e');
                        } else {
                            res.jsonp('b');
                        }
                    });
                }

            });
        } else {
            console.log('not found record');
            var newAltRecord = new Alteration({
                'alteration': req.params.alteration,
                'gene': req.params.gene
            });

            newAltRecord.save(function (err, alt) {
                if (err) {
                    res.jsonp('e');
                }
                else {
                    console.log('saved to alteration collection');
                    Mapping.findOne({nctId: req.params.nctId}).populate('user', 'displayName').exec(function (err, mapping) {
                        if (err) res.jsonp('e');
                        if (!mapping) {
                            console.log('Mapping record not exist yet');
                            var mapping = new Mapping({
                                nctId: req.params.nctId,
                                alteration: [{alteration_Id: alt._id.toString(), status: 'manually'}],
                                completeStatus: 1,
                                log: [{
                                    date: new Date(),
                                    user: req.user._id.toString(),
                                    operationType: 'add',
                                    alteration_Id: alt._id.toString()
                                }]
                            });
                            mapping.user = req.user;
                            mapping.save(function (err) {
                                if (err) {
                                    res.jsonp('e');
                                } else {
                                    res.jsonp('c');
                                }
                            });
                        }
                        else {
                            mapping.alteration.push({alteration_Id: alt._id.toString(), status: 'manually'});
                            mapping.log.push({
                                date: new Date(),
                                user: req.user._id.toString(),
                                operationType: 'add',
                                alteration_Id: alt._id.toString()
                            });

                            Mapping.update({nctId: req.params.nctId}, {
                                $set: {
                                    alteration: mapping.alteration,
                                    log: mapping.log
                                }
                            }).exec(function (err, mapping) {
                                if (err) {
                                    res.jsonp('e');
                                } else {
                                    res.jsonp('d');
                                }
                            });


                        }

                    });
                }
            });

        }

    });
};

exports.editAlteration = function (req, res) {
    if (req.params.id !== undefined) {
        var tempAltRecord = new Alteration();
        tempAltRecord.update({_id: new ObjectId(req.params.id)}, {
            $set: {
                gene: req.params.gene,
                alteration: req.params.alteration
            }
        }).populate('user', 'displayName').exec(function (err) {
            if (err) {
                console.log('error');
                res.jsonp('e');
            } else {
                res.jsonp('s');
            }
        });
    }
    else {
        var newAltRecord = new Alteration({
            gene: req.params.gene,
            alteration: req.params.alteration
        });

        newAltRecord.save(function (err, alt) {
            if (err) {
                res.jsonp('e');
            }
            else {
                res.jsonp('e');
            }
        });
    }
};
