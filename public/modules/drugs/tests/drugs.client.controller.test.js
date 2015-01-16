'use strict';

(function() {
	// Drugs Controller Spec
	describe('Drugs Controller Tests', function() {
		// Initialize global variables
		var DrugsController,
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

			// Initialize the Drugs controller.
			DrugsController = $controller('DrugsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Drug object fetched from XHR', inject(function(Drugs) {
			// Create sample Drug using the Drugs service
			var sampleDrug = new Drugs({
				name: 'New Drug'
			});

			// Create a sample Drugs array that includes the new Drug
			var sampleDrugs = [sampleDrug];

			// Set GET response
			$httpBackend.expectGET('drugs').respond(sampleDrugs);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.drugs).toEqualData(sampleDrugs);
		}));

		it('$scope.findOne() should create an array with one Drug object fetched from XHR using a drugId URL parameter', inject(function(Drugs) {
			// Define a sample Drug object
			var sampleDrug = new Drugs({
				name: 'New Drug'
			});

			// Set the URL parameter
			$stateParams.drugId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/drugs\/([0-9a-fA-F]{24})$/).respond(sampleDrug);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.drug).toEqualData(sampleDrug);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Drugs) {
			// Create a sample Drug object
			var sampleDrugPostData = new Drugs({
				name: 'New Drug'
			});

			// Create a sample Drug response
			var sampleDrugResponse = new Drugs({
				_id: '525cf20451979dea2c000001',
				name: 'New Drug'
			});

			// Fixture mock form input values
			scope.name = 'New Drug';

			// Set POST response
			$httpBackend.expectPOST('drugs', sampleDrugPostData).respond(sampleDrugResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Drug was created
			expect($location.path()).toBe('/drugs/' + sampleDrugResponse._id);
		}));

		it('$scope.update() should update a valid Drug', inject(function(Drugs) {
			// Define a sample Drug put data
			var sampleDrugPutData = new Drugs({
				_id: '525cf20451979dea2c000001',
				name: 'New Drug'
			});

			// Mock Drug in scope
			scope.drug = sampleDrugPutData;

			// Set PUT response
			$httpBackend.expectPUT(/drugs\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/drugs/' + sampleDrugPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid drugId and remove the Drug from the scope', inject(function(Drugs) {
			// Create new Drug object
			var sampleDrug = new Drugs({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Drugs array and include the Drug
			scope.drugs = [sampleDrug];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/drugs\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleDrug);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.drugs.length).toBe(0);
		}));
	});
}());