'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Mapping Schema
 */
var MappingSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Mapping name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Mapping', MappingSchema);