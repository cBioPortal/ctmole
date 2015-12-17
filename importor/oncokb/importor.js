//jiaojiao Nocv/5/2015
//This file is used to update Trial model from ClinicalTrialMetadata



'use strict';


var mongoose = require('mongoose');
var _ = require('underscore');

var	ClinicalTrialMetadata = require('../../app/models/clinical-trial-metadata.server.model.js');
var	Trial = require('../../app/models/trial.server.model.js');


function connectDB(){

	mongoose.connect('mongodb://localhost/firstDB');
	mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
	mongoose.connection.once('open', function callback () {
		workers();
	});
}


function workers() {
	var count = 0;
	var total = 0;
	ClinicalTrialMetadata.find({}).count().exec(function(err, result){
		total = result;

	ClinicalTrialMetadata.find({}).stream()
		.on('data', function(metadata){
			// handle doc

			if(metadata.id_info !== undefined){
				var trialID = metadata.id_info[0].nct_id[0];
				Trial.findOne({nctId: trialID}).exec(function(err, trial){

					if(_.isNull(trial) )
					{
						var drugsNeeded = [];
						if(metadata.intervention !== undefined)
						{
							_.each(metadata.intervention, function(item){
								drugsNeeded = drugsNeeded.concat(item.intervention_name);
							});
						}

						var trialRecord = new Trial({nctId: trialID,
							title: (metadata.brief_title !== undefined && metadata.brief_title.length !== 0) ? metadata.brief_title[0] : "",
							purpose: (metadata.brief_summary !== undefined && metadata.brief_summary.length !== 0 && metadata.brief_summary[0].textblock !== undefined) ? metadata.brief_summary[0].textblock[0] : "",
							recruitingStatus: (metadata.overall_status !== undefined && metadata.overall_status.length !== 0) ? metadata.overall_status[0] : "",
							eligibilityCriteria: (metadata.eligibility !== undefined &&  metadata.eligibility.length !== 0 && metadata.eligibility[0].criteria !== undefined) ? metadata.eligibility[0].criteria[0].textblock[0] : "",
							phase: (metadata.phase !== undefined && metadata.phase.length !== 0) ? metadata.phase[0] : "",
							tumorTypes: (metadata.condition_browse !== undefined && metadata.condition_browse.length !== 0 && metadata.condition_browse[0].mesh_term !== undefined) ? metadata.condition_browse[0].mesh_term : "",
							lastChangedDate: (metadata.lastchanged_date !== undefined && metadata.lastchanged_date.length !== 0) ? metadata.lastchanged_date[0] : "",
							countries: (metadata.location_countries !== undefined && metadata.location_countries.length !== 0 && metadata.location_countries[0].country !== undefined) ? metadata.location_countries[0].country : "",
							drugs: drugsNeeded,
							arm_group: (metadata.arm_group !== undefined) ? metadata.arm_group : ""});


						trialRecord.save(function(err, trail){
							count++;

							if(err)console.log('Error happened when saving to db', err);
							else if(count % 1000 === 0)
							{
								console.log("**********************************************");
								console.log(' Fnished: ', (count/total * 100).toFixed(2), '%');
							}




						});

					}
					else
					{
						if(metadata.overall_status !== undefined)
						{
							if(metadata.overall_status[0] === trial.recruitingStatus)
							{
								count++;
								console.log('Trial ', trialID, 'is already updated to the most recent version');
								if(count % 1000 === 0)
								{
									console.log("**********************************************");
									console.log(' Fnished: ', (count/total * 100).toFixed(2), '%');
								}
							}
							else
							{
								Trial.update({nctId: trialID},{$set: {phase: metadata.overall_status[0]}}).exec(function (err, trial) {
									count++;
									if (err) {
										console.log('Error happened when trying to update trial ', trialID);

									}
									else if(count % 1000 === 0)
									{

										console.log("**********************************************");
										console.log(' Fnished: ', (count/total * 100).toFixed(2), '%');
									}




								});
							}
						}


					}
				});
			}





		})
		.on('error', function(err){
			// handle error
			console.log('error happened');
		})
		.on('end', function(){
			// final callback
			console.log('this is the end');
		});

	});
}

function main() {

	connectDB();
}

main();
