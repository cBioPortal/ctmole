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
	var cancertypes = require('../../app/controllers/cancertypes');

	// Cancertypes Routes
	app.route('/cancertypes')
		.get(cancertypes.list)
		.post(users.requiresLogin, cancertypes.create);

	app.route('/cancertypes/:cancertypeSymbol')
		.get(cancertypes.read)
		//.put(users.requiresLogin, cancertypes.hasAuthorization, cancertypes.update)
		//.delete(users.requiresLogin, cancertypes.hasAuthorization, cancertypes.delete);
		.put(users.requiresLogin, cancertypes.update)
		.delete(users.requiresLogin, cancertypes.delete);

	app.route('/cancertypes/:newCancertypeSymbol/:nctId')
		.post(users.requiresLogin, cancertypes.create);

	app.route('/cancertypes/trials/:nctIds')
		.get(cancertypes.readCancertypes);

	app.route('/tumorTypes')
		.get(cancertypes.cancertypeCount);

	app.route('/cancerTypeInfo/:nctId')
		.get(cancertypes.cancerTypeInfo);

	// Finish by binding the Cancertype middleware
	app.param('cancertypeSymbol', cancertypes.cancertypeByID);
	app.param('nctIds', cancertypes.cancertypeByNctIds);


};
