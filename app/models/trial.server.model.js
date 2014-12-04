'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
    autoIncrement = require('mongoose-auto-increment');

var connection = mongoose.createConnection('mongodb://localhost/clinicaltrials-dev');

autoIncrement.initialize(connection);

/**
 * Trial Schema
 */
var TrialSchema = new Schema({
	nctId: {
		type: String,
		required: 'Please fill NCT ID',
		trim: true
	},
	title: {
		type: String,
		trim: true
	},
	purpose: {
		type: String,
		trim: true
	},
	recruitingStatus: {
		type: String,
		trim: true
	},
	eligibilityCriteria: {
		type: String,
		trim: true
	},
	phase: {
		type: String,
		trim: true
	},
	diseaseCondition: {
		type: String,
		trim: true
	},
	lastChangeDate: {
		type: String,
		trim: true
	}
});


TrialSchema.plugin(autoIncrement.plugin, {model: 'clinicaltrial', field: 'trialId'});
mongoose.model('clinicaltrial', TrialSchema);