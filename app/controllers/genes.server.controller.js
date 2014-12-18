'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Gene = mongoose.model('clinicaltrial'),
    _ = require('lodash');

/**
 * Create a Gene
 */
exports.create = function(req, res) {

};

/**
 * Show the current Gene
 */
exports.read = function(req, res) {

};

/**
 * Update a Gene
 */
exports.update = function(req, res) {

};

/**
 * Delete an Gene
 */
exports.delete = function(req, res) {

};

/**
 * List of Genes
 */
exports.list = function(req, res) {
	Trial.find({}, 'nctId title phase drugs recruitingStatus drugs countries').limit(10).exec(function(err, trials) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(trials);
		}
	}
};