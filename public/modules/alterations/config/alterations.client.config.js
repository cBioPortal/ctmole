'use strict';

// Configuring the Articles module
angular.module('alterations').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Alterations', 'alterations', 'dropdown', '/alterations(/create)?');
		Menus.addSubMenuItem('topbar', 'alterations', 'List Alterations', 'alterations');
		// Menus.addSubMenuItem('topbar', 'alterations', 'New Alteration', 'alterations/create');
	}
]);