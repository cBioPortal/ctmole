'use strict';

module.exports = function(app) {
	var trials = require('../../app/controllers/trials');

	// Trials Routes
	app.route('/trials')
		.get(trials.list)
		.post(trials.create);

	app.route('/trials/:nctId')
		.get(trials.read)
		.put(trials.update)
		.delete(trials.delete);

	app.route('/trials/search/:keyword')
		.get(trials.search);

	app.route('/trials/list')
		.post(trials.searchList);

	// Finish by binding the Trial middleware
	app.param('nctId', trials.trialByID);
	app.param('keyword', trials.searchByKeyword);
};