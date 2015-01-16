'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var alterations = require('../../app/controllers/alterations');

	// Alterations Routes
	app.route('/alterations')
		.get(alterations.list)
		.post(users.requiresLogin, alterations.create);

	app.route('/alterations/:alterationId')
		.get(alterations.read)
		.put(users.requiresLogin, alterations.hasAuthorization, alterations.update)
		.delete(users.requiresLogin, alterations.hasAuthorization, alterations.delete);

	// Finish by binding the Alteration middleware
	app.param('alterationId', alterations.alterationByID);
};