'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	ClinicalTrialMetadata = mongoose.model('ClinicalTrialMetadata');

/**
 * Globals
 */
var user, clinicalTrialMetadata;

/**
 * Unit tests
 */
describe('Clinical trial meta data Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() { 
			ClinicalTrialMetadata = new ClinicalTrialMetadata({
				// Add model fields
				// ...
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return ClinicalTrialMetadata.save(function(err) {
				should.not.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		ClinicalTrialMetadata.remove().exec();
		User.remove().exec();

		done();
	});
});