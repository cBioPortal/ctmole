'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * CancerType Schema
 */
var CancerTypeSchema = new Schema({
	symbol: String
});

mongoose.model('CancerType', CancerTypeSchema);