'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Gene = mongoose.model('Gene'),
	_ = require('lodash');

/**
 * Create a Gene
 */
exports.create = function(req, res) {
	var gene = new Gene(req.body);
	gene.user = req.user;

	gene.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(gene);
		}
	});
};

/**
 * Show the current Gene
 */
exports.read = function(req, res) {
	res.jsonp(req.gene);
};

/**
 * Update a Gene
 */
exports.update = function(req, res) {
	var gene = req.gene ;

	gene = _.extend(gene , req.body);

	gene.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(gene);
		}
	});
};

/**
 * Delete an Gene
 */
exports.delete = function(req, res) {
	var gene = req.gene ;

	gene.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(gene);
		}
	});
};

/**
 * List of Genes
 */
exports.list = function(req, res) { Gene.find().exec(function(err, genes) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(genes);
		}
	});
};

/**
 * Gene middleware
 */
exports.geneByID = function(req, res, next, id) { Gene.findOne({'symbol': id}).populate('user', 'displayName').exec(function(err, gene) {
		if (err) return next(err);
		if (! gene) return next(new Error('Failed to load Gene ' + id));
		req.gene = gene ;
		next();
	});
};

/**
 * Gene authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.gene.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};