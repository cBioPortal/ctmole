'use strict';

// Configuring the Articles module
angular.module('trials').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Trials', 'trials', 'dropdown', '/trials(/create)?');
		Menus.addSubMenuItem('topbar', 'trials', 'List Trials', 'trials');
		Menus.addSubMenuItem('topbar', 'trials', 'New Trial', 'trials/create');
	}
]);