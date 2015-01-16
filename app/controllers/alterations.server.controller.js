'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Alteration = mongoose.model('Alteration'),
	_ = require('lodash');

/**
 * Create a Alteration
 */
exports.create = function(req, res) {
	var alteration = new Alteration(req.body);
	alteration.user = req.user;

	alteration.save(function(err) {
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
exports.read = function(req, res) {
	res.jsonp(req.alteration);
};

/**
 * Update a Alteration
 */
exports.update = function(req, res) {
	var alteration = req.alteration ;

	alteration = _.extend(alteration , req.body);

	alteration.save(function(err) {
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
exports.delete = function(req, res) {
	var alteration = req.alteration ;

	alteration.remove(function(err) {
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
exports.list = function(req, res) { Alteration.find().sort('-created').populate('user', 'displayName').exec(function(err, alterations) {
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
exports.alterationByID = function(req, res, next, id) { Alteration.findOne({'symbol': id}).populate('user', 'displayName').exec(function(err, alteration) {
		if (err) return next(err);
		if (! alteration) return next(new Error('Failed to load Alteration ' + id));
		req.alteration = alteration ;
		next();
	});
};

/**
 * Alteration authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.alteration.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};