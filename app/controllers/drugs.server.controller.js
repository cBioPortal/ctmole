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
	Drug = mongoose.model('Drug'),
	_ = require('lodash');

/**
 * Create a Drug
 */
exports.create = function(req, res) {
	var drug = new Drug(req.body);
	drug.user = req.user;

	drug.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(drug);
		}
	});
};

/**
 * Show the current Drug
 */
exports.read = function(req, res) {
	res.jsonp(req.drug);
};

/**
 * Update a Drug
 */
exports.update = function(req, res) {
	var drug = req.drug ;

	drug = _.extend(drug , req.body);

	drug.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(drug);
		}
	});
};

/**
 * Delete an Drug
 */
exports.delete = function(req, res) {
	var drug = req.drug ;

	drug.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(drug);
		}
	});
};

/**
 * List of Drugs
 */
exports.list = function(req, res) { Drug.find().limit(10).sort('-created').populate('user', 'displayName').exec(function(err, drugs) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(drugs);
		}
	});
};

/**
 * List of 10 Drugs
 */
exports.listFull = function(req, res) { Drug.find().sort('-created').populate('user', 'displayName').exec(function(err, drugs) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(drugs);
		}
	});
};

/**
 * Drug middleware
 */
exports.drugByID = function(req, res, next, id) { Drug.findOne({'symbol': id}).populate('user', 'displayName').exec(function(err, drug) {
		if (err) return next(err);
		if (! drug) return next(new Error('Failed to load Drug ' + id));
		req.drug = drug ;
		next();
	});
};

/**
 * Drug authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.drug.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};