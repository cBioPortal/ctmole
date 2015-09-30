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

/**
 * Create a Mapping
 */
exports.create = function(req, res) {
	//var mapping = new Mapping(req.body);
	var mapping = new Mapping({type: 'mapping', name: 'mapping'});
	console.log('starting here...');
	console.log(mapping);
	mapping.user = req.user;

	mapping.save(function(err) {
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
exports.read = function(req, res) {
	res.jsonp(req.mapping);
};

/**
 * Update a Mapping
 */
exports.update = function(req, res) {
	var mapping = req.mapping ;

	mapping = _.extend(mapping , req.body);

	mapping.save(function(err) {
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
 * Delete an Mapping
 */
exports.delete = function(req, res) {
	var mapping = req.mapping ;

	mapping.remove(function(err) {
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
exports.list = function(req, res) { Mapping.find().sort('-created').populate('user', 'displayName').exec(function(err, mappings) {
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
exports.mappingByID = function(req, res, next, id) { Mapping.findById(id).populate('user', 'displayName').exec(function(err, mapping) {
		if (err) return next(err);
		if (! mapping) return next(new Error('Failed to load Mapping ' + id));
		req.mapping = mapping ;
		next();
	});
};

/**
 * Mapping authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.mapping.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
