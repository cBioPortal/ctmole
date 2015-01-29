'use strict';

// Configuring the Articles module
angular.module('genes').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		// Menus.addMenuItem('topbar', 'Genes', 'genes', 'dropdown', '/genes(/create)?');
		// Menus.addSubMenuItem('topbar', 'genes', 'List Genes', 'genes');
		// Menus.addSubMenuItem('topbar', 'genes', 'New Gene', 'genes/create');
	}
]);