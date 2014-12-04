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
exports.list = function(req, res) { Trial.find().limit(10).exec(function(err, trials) {
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
 * Trial authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.trial.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};