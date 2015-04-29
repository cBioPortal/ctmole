/*
 * Copyright (c) 2015 Memorial Sloan-Kettering Cancer Center.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY, WITHOUT EVEN THE IMPLIED WARRANTY OF MERCHANTABILITY OR FITNESS
 * FOR A PARTICULAR PURPOSE. The software and documentation provided hereunder
 * is on an "as is" basis, and Memorial Sloan-Kettering Cancer Center has no
 * obligations to provide maintenance, support, updates, enhancements or
 * modifications. In no event shall Memorial Sloan-Kettering Cancer Center be
 * liable to any party for direct, indirect, special, incidental or
 * consequential damages, including lost profits, arising out of the use of this
 * software and its documentation, even if Memorial Sloan-Kettering Cancer
 * Center has been advised of the possibility of such damage.
 */

/*
 * This file is part of CT-MOLE.
 *
 * CT-MOLE is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * ClinicalTrialMetadata Schema
 */
var ClinicalTrialMetadataSchema = new Schema({
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

module.exports = mongoose.model('ClinicalTrialMetadata', ClinicalTrialMetadataSchema);