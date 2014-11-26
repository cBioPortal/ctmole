'use strict';

(function() {
	// Trials Controller Spec
	describe('Trials Controller Tests', function() {
		// Initialize global variables
		var TrialsController,
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

			// Initialize the Trials controller.
			TrialsController = $controller('TrialsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Trial object fetched from XHR', inject(function(Trials) {
			// Create sample Trial using the Trials service
			var sampleTrial = new Trials({
				name: 'New Trial'
			});

			// Create a sample Trials array that includes the new Trial
			var sampleTrials = [sampleTrial];

			// Set GET response
			$httpBackend.expectGET('trials').respond(sampleTrials);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.trials).toEqualData(sampleTrials);
		}));

		it('$scope.findOne() should create an array with one Trial object fetched from XHR using a trialId URL parameter', inject(function(Trials) {
			// Define a sample Trial object
			var sampleTrial = new Trials({
				name: 'New Trial'
			});

			// Set the URL parameter
			$stateParams.trialId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/trials\/([0-9a-fA-F]{24})$/).respond(sampleTrial);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.trial).toEqualData(sampleTrial);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Trials) {
			// Create a sample Trial object
			var sampleTrialPostData = new Trials({
				name: 'New Trial'
			});

			// Create a sample Trial response
			var sampleTrialResponse = new Trials({
				_id: '525cf20451979dea2c000001',
				name: 'New Trial'
			});

			// Fixture mock form input values
			scope.name = 'New Trial';

			// Set POST response
			$httpBackend.expectPOST('trials', sampleTrialPostData).respond(sampleTrialResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Trial was created
			expect($location.path()).toBe('/trials/' + sampleTrialResponse._id);
		}));

		it('$scope.update() should update a valid Trial', inject(function(Trials) {
			// Define a sample Trial put data
			var sampleTrialPutData = new Trials({
				_id: '525cf20451979dea2c000001',
				name: 'New Trial'
			});

			// Mock Trial in scope
			scope.trial = sampleTrialPutData;

			// Set PUT response
			$httpBackend.expectPUT(/trials\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/trials/' + sampleTrialPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid trialId and remove the Trial from the scope', inject(function(Trials) {
			// Create new Trial object
			var sampleTrial = new Trials({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Trials array and include the Trial
			scope.trials = [sampleTrial];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/trials\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleTrial);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.trials.length).toBe(0);
		}));
	});
}());