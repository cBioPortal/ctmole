'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Cancertype Schema
 */
var CancertypeSchema = new Schema({
	symbol: String,
	nctIds: Array
});

mongoose.model('Cancertype', CancertypeSchema);