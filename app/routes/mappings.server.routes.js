'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var mappings = require('../../app/controllers/mappings');

	// Mappings Routes
	app.route('/mappings')
		.get(mappings.list)
		.post(users.requiresLogin, mappings.create);

	app.route('/mappings/:mappingId')
		.get(mappings.read)
		.put(users.requiresLogin, mappings.hasAuthorization, mappings.update)
		.delete(users.requiresLogin, mappings.hasAuthorization, mappings.delete);

	// Finish by binding the Mapping middleware
	app.param('mappingId', mappings.mappingByID);
};