'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Gene Schema
 */
var GeneSchema = new Schema({
	symbol: String
});

mongoose.model('Gene', GeneSchema);