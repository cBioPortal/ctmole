'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Drug Schema
 */
var DrugSchema = new Schema({
	symbol: String,
	nctIds: Array
});

mongoose.model('Drug', DrugSchema);