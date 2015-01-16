'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var cancertypes = require('../../app/controllers/cancertypes');

	// Cancertypes Routes
	app.route('/cancertypes')
		.get(cancertypes.list)
		.post(users.requiresLogin, cancertypes.create);

	app.route('/cancertypes/:cancertypeId')
		.get(cancertypes.read)
		.put(users.requiresLogin, cancertypes.hasAuthorization, cancertypes.update)
		.delete(users.requiresLogin, cancertypes.hasAuthorization, cancertypes.delete);

	// Finish by binding the Cancertype middleware
	app.param('cancertypeId', cancertypes.cancertypeByID);
};