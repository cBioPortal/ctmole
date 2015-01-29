'use strict';

// Configuring the Articles module
angular.module('mappings',['localytics.directives', 'angular-underscore', 'datatables', 'datatables.bootstrap'])
.constant('Venn', window.venn)
.constant('D3', window.d3)
.constant('S', window.S)
.constant('_', window._)
.run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Mappings', 'mappings', 'dropdown', false, true, ['*'], -1);
		Menus.addSubMenuItem('topbar', 'mappings', 'Find common trials', 'mappings');
        Menus.addSubMenuItem('topbar', 'mappings', 'Assign trial', 'trials/assign');
		// Menus.addSubMenuItem('topbar', 'mappings', 'New Mapping', 'mappings/create');
	}
]);