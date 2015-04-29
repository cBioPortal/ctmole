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
	_ = require('lodash');

/**
 * Create a Trial
 */
exports.create = function(req, res) {
	var trial = new Trial(req.body);
	trial.user = req.user;

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

/**
 * Show the current Trial
 */
exports.read = function(req, res) {
	res.jsonp(req.trial);
};

/**
 * Update a Trial
 */
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

/**
 * Delete an Trial
 */
exports.delete = function(req, res) {
	var trial = req.trial ;

	trial.remove(function(err) {
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
exports.list = function(req, res) { Trial.find({}, 'nctId title phase drugs recruitingStatus drugs countries').limit(10).exec(function(err, trials) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(trials);
		}
	});
};

exports.search = function(req, res) {
	res.jsonp(req.trials);
};
/**
 * Trial middleware
 */
exports.trialByID = function(req, res, next, id) { Trial.findOne({'nctId': id}).exec(function(err, trial) {
		if (err) return next(err);
		if (! trial) return next(new Error('Failed to load Trial ' + id));
		req.trial = trial;
		next();
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
exports.searchList = function(req, res) {
	Trial.find({'nctId': {$in: req.body}}).exec(function(err, trials) {
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
exports.searchByKeyword = function(req, res, next, keyword) {
	Trial.find({'tumorTypes.clinicalTrialKeywords': keyword}, 'nctId').limit(10).exec(function(err, trials) {
		if (err) return next(err);
		if (! trials) return next(new Error('Failed to load Trial ' + keyword));
		req.trials = trials;
		next();
	});
};

/**
 * Trial authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.trial.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};