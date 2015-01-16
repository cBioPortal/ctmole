'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var drugs = require('../../app/controllers/drugs');

	// Drugs Routes
	app.route('/drugs')
		.get(drugs.list)
		.post(users.requiresLogin, drugs.create);

	app.route('/drugs/full')
		.get(drugs.listFull)
		.post(users.requiresLogin, drugs.create);

	app.route('/drugs/:drugId')
		.get(drugs.read)
		.put(users.requiresLogin, drugs.hasAuthorization, drugs.update)
		.delete(users.requiresLogin, drugs.hasAuthorization, drugs.delete);

	// Finish by binding the Drug middleware
	app.param('drugId', drugs.drugByID);
};