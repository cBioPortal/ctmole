'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Cancertype = mongoose.model('Cancertype'),
	_ = require('lodash');

/**
 * Create a Cancertype
 */
exports.create = function(req, res) {
	var cancertype = new Cancertype(req.body);
	cancertype.user = req.user;

	cancertype.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(cancertype);
		}
	});
};

/**
 * Show the current Cancertype
 */
exports.read = function(req, res) {
	res.jsonp(req.cancertype);
};

/**
 * Update a Cancertype
 */
exports.update = function(req, res) {
	var cancertype = req.cancertype ;

	cancertype = _.extend(cancertype , req.body);

	cancertype.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(cancertype);
		}
	});
};

/**
 * Delete an Cancertype
 */
exports.delete = function(req, res) {
	var cancertype = req.cancertype ;

	cancertype.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(cancertype);
		}
	});
};

/**
 * List of Cancertypes
 */
exports.list = function(req, res) { Cancertype.find().sort('-created').populate('user', 'displayName').exec(function(err, cancertypes) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(cancertypes);
		}
	});
};

/**
 * Cancertype middleware
 */
exports.cancertypeByID = function(req, res, next, id) { Cancertype.findOne({'symbol': id}).populate('user', 'displayName').exec(function(err, cancertype) {
		if (err) return next(err);
		if (! cancertype) return next(new Error('Failed to load Cancertype ' + id));
		req.cancertype = cancertype ;
		next();
	});
};

/**
 * Cancertype authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.cancertype.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};