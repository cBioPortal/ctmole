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

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var mappings = require('../../app/controllers/mappings');

	// Mappings Routes
	app.route('/mappings')
		.get(mappings.list)
		.post(users.requiresLogin, mappings.create);

	app.route('/mappings/:Idvalue')
		.get(mappings.mappingBynctId)
		.put(users.requiresLogin, mappings.update)
		.post(users.requiresLogin, mappings.completeTrial);

	app.route('/mappings/:alteration/:nctId')
		.get(mappings.mappingBynctIdAlt)
		.post(users.requiresLogin, mappings.create);

	app.route('/mappingStatus/:status')
		.get(mappings.fetchByStatus);

	app.route('/mappingSave/:nctId')
		.post(users.requiresLogin, mappings.saveMapping);

	//need to change Idvalue from middleware or we have to duplicate mappingBynctId function
	app.route('/commentsSave/:trialID/:comment')
		.get(users.requiresLogin, mappings.saveComments);

	app.route('/confirmAlteration/:trialID/:gene/:alteration/:type')
		.get(users.requiresLogin, mappings.confirmAlteration);

	app.route('/deleteAlteration/:trialID/:gene/:alteration/:type')
		.get(users.requiresLogin, mappings.deleteAlteration);

	app.route('/convertLog/:trialID')
		.get(users.requiresLogin, mappings.convertLog);

	app.route('/geneTrialCounts')
		.get(users.requiresLogin, mappings.geneTrialCounts);

	app.route('/curationStatusCounts')
		.get(users.requiresLogin, mappings.curationStatusCounts);

	app.route('/API/genAlt/:gene/:alterations')
		.get(users.requiresLogin, mappings.overlappingTrials);



	// Finish by binding the Mapping middleware
	//app.param('Idvalue', mappings.mappingBynctId);



};
