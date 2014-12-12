'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * ClinicalTrialMetaData Schema
 */
var ClinicalTrialMetaDataSchema = new Schema({
	'required_header': Array,
	'id_info': Array,
	'brief_title': Array,
	'official_title': Array,
	'sponsors': Array,
	'source': Array,
	'oversight_info': Array,
	'brief_summary': Array,
	'overall_status': Array,
	'start_date': Array,
	'completion_date': Array,
	'primary_completion_date': Array,
	'phase': Array,
	'study_type': Array,
	'study_design': Array,
	'primary_outcome': Array,
	'secondary_outcome': Array,
	'number_of_arms': Array,
	'enrollment': Array,
	'condition': Array,
	'arm_group': Array,
	'intervention': Array,
	'eligibility': Array,
	'overall_official': Array,
	'location': Array,
	'location_countries': Array,
	'verification_date': Array,
	'lastchanged_date': Array,
	'firstreceived_date': Array,
	'responsible_party': Array,
	'keyword': Array,
	'is_fda_regulated': Array,
	'is_section_801': Array,
	'has_expanded_access': Array,
	'condition_browse': Array
}, { strict: false });

module.exports = mongoose.model('ClinicalTrialMetaData', ClinicalTrialMetaDataSchema);