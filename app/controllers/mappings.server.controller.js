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
	var mapping = new Mapping(req.body);
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