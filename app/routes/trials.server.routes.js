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
	var trials = require('../../app/controllers/trials');
	var users = require('../../app/controllers/users');

	// Trials Routes
	app.route('/trials')
		.get(trials.list)
		.post(trials.create);

	app.route('/trials/:nctId')
		.get(trials.read)
		//.put(trials.update)
		.delete(trials.delete);

	app.route('/trials/:requestednctId')
		.get(trials.read)
		.put(trials.updateTrial);

	app.route('/searchTrials/:gene/:alteration/:tumorType/:otherContent')
		.get(trials.searchTrials);

	app.route('/trials/search/:keyword')
		.get(trials.search);

	app.route('/trials/list')
		.post(trials.searchList);

	app.route('/trialsMultiSearch/:nctIds')
		.get(trials.multiTrials);

	app.route('/tumorTypes')
		.get(trials.tumorTypes);

	app.route('/recruitingStatusCount')
		.get(trials.statusCounts);

	// Finish by binding the Trial middleware
	app.param('nctId', trials.trialByID);
	app.param('requestednctId', trials.trialByID);
	app.param('keyword', trials.searchByKeyword);
};
