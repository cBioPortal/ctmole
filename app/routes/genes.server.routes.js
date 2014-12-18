'use strict';

module.exports = function(app) {
	var genes = require('../../app/controllers/genes');

	// Trials Routes
	app.route('/trials')
		.get(trials.list)
		.post(trials.create);

	app.route('/trials/:symbol')
		.get(trials.read)
		.put(trials.update)
		.delete(trials.delete);

	// Finish by binding the Trial middleware
	app.param('nctId', genes.symbol);
	app.param('keyword', trials.searchByKeyword);
};