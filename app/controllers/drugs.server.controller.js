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