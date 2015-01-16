'use strict';

(function() {
	// Alterations Controller Spec
	describe('Alterations Controller Tests', function() {
		// Initialize global variables
		var AlterationsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Alterations controller.
			AlterationsController = $controller('AlterationsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Alteration object fetched from XHR', inject(function(Alterations) {
			// Create sample Alteration using the Alterations service
			var sampleAlteration = new Alterations({
				name: 'New Alteration'
			});

			// Create a sample Alterations array that includes the new Alteration
			var sampleAlterations = [sampleAlteration];

			// Set GET response
			$httpBackend.expectGET('alterations').respond(sampleAlterations);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.alterations).toEqualData(sampleAlterations);
		}));

		it('$scope.findOne() should create an array with one Alteration object fetched from XHR using a alterationId URL parameter', inject(function(Alterations) {
			// Define a sample Alteration object
			var sampleAlteration = new Alterations({
				name: 'New Alteration'
			});

			// Set the URL parameter
			$stateParams.alterationId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/alterations\/([0-9a-fA-F]{24})$/).respond(sampleAlteration);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.alteration).toEqualData(sampleAlteration);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Alterations) {
			// Create a sample Alteration object
			var sampleAlterationPostData = new Alterations({
				name: 'New Alteration'
			});

			// Create a sample Alteration response
			var sampleAlterationResponse = new Alterations({
				_id: '525cf20451979dea2c000001',
				name: 'New Alteration'
			});

			// Fixture mock form input values
			scope.name = 'New Alteration';

			// Set POST response
			$httpBackend.expectPOST('alterations', sampleAlterationPostData).respond(sampleAlterationResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Alteration was created
			expect($location.path()).toBe('/alterations/' + sampleAlterationResponse._id);
		}));

		it('$scope.update() should update a valid Alteration', inject(function(Alterations) {
			// Define a sample Alteration put data
			var sampleAlterationPutData = new Alterations({
				_id: '525cf20451979dea2c000001',
				name: 'New Alteration'
			});

			// Mock Alteration in scope
			scope.alteration = sampleAlterationPutData;

			// Set PUT response
			$httpBackend.expectPUT(/alterations\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/alterations/' + sampleAlterationPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid alterationId and remove the Alteration from the scope', inject(function(Alterations) {
			// Create new Alteration object
			var sampleAlteration = new Alterations({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Alterations array and include the Alteration
			scope.alterations = [sampleAlteration];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/alterations\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleAlteration);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.alterations.length).toBe(0);
		}));
	});
}());