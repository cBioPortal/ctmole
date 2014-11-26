'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Trial Schema
 */
var TrialSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Trial name',
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

mongoose.model('Trial', TrialSchema);