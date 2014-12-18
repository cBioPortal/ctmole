'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Alteration Schema
 */
var AlterationSchema = new Schema({
	symbol: String
});

mongoose.model('Alteration', AlterationSchema);