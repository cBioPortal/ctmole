'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var genes = require('../../app/controllers/genes');

	// Genes Routes
	app.route('/genes')
		.get(genes.list)
		.post(users.requiresLogin, genes.create);

	app.route('/genes/:geneId')
		.get(genes.read)
		.put(users.requiresLogin, genes.hasAuthorization, genes.update)
		.delete(users.requiresLogin, genes.hasAuthorization, genes.delete);

	// Finish by binding the Gene middleware
	app.param('geneId', genes.geneByID);
};