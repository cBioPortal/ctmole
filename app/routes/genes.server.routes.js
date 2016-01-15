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
	var genes = require('../../app/controllers/genes');

	// Genes Routes
	app.route('/genes')
		.get(genes.list)
		.post(users.requiresLogin, genes.create);

	app.route('/geneAlias')
		.get(genes.getAlias);

	app.route('/getskipItems')
		.get(genes.getskipItems);

	app.route('/genes/:symbol')
		.get(genes.read)
		.put(users.requiresLogin, genes.update)
		.delete(users.requiresLogin, genes.delete);

	app.route('/genes/trials/:nctIds')
		.get(genes.readGenes)
		.put(genes.create);

	app.route('/assignRule/:type/:operation/:values')
		.get(genes.assignRule);


	// Finish by binding the Gene middleware
	app.param('symbol', genes.geneByID);
	app.param('nctIds', genes.geneByNctIds);
	//app.param('nctId', genes.geneByNctId);
};
