'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var trials = require('../../app/controllers/trials');

	// Trials Routes
	app.route('/trials')
		.get(trials.list)
		.post(users.requiresLogin, trials.create);

	app.route('/trials/:trialId')
		.get(trials.read)
		.put(users.requiresLogin, trials.hasAuthorization, trials.update)
		.delete(users.requiresLogin, trials.hasAuthorization, trials.delete);

	// Finish by binding the Trial middleware
	app.param('trialId', trials.trialByID);
};