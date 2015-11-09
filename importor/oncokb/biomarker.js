/*
 * Copyright (c) 2015 Memorial Sloan-Kettering Cancer Center.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY, WITHOUT EVEN THE IMPLIED WARRANTY OF MERCHANTABILITY OR FITNESS
 * FOR A PARTICULAR PURPOSE. The software and documentation provided hereunder
 * is on an "as is" basis, and Memorial Sloan-Kettering Cancer Center has no
 * obligations to provide maintenance, support, updates, enhancements or
 * modifications. In no event shall Memorial Sloan-Kettering Cancer Center be
 * liable to any party for direct, indirect, special, incidental or
 * consequential damages, including lost profits, arising out of the use of this
 * software and its documentation, even if Memorial Sloan-Kettering Cancer
 * Center has been advised of the possibility of such damage.
 */

/*
 * This file is part of CT-MOLE.
 *
 * CT-MOLE is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

'use strict';


var mongoose = require('mongoose');
var _ = require('underscore');

var	ClinicalTrialMetadata = require('../../app/models/clinical-trial-metadata.server.model.js');
var	Gene = require('../../app/models/gene.server.model.js');
var	Alteration = require('../../app/models/alteration.server.model.js');
var	Mapping = require('../../app/models/mapping.server.model.js');
var	Trial = require('../../app/models/trial.server.model.js');


var predictedMutations = [];


function connectDB(callback123){

	mongoose.connect('mongodb://localhost/firstDB');
	mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
	mongoose.connection.once('open', function callback () {
		callback123();
	});
}

function insertDocuments(collection, documents, callback) {
	// Drop collection before inserting
	collection.drop();

	// Insert some documents
	collection.insert(documents, function(err, result) {
		console.log('Inserted.');
		callback(result);
	});
}
function saveToMapping() {
	console.log('\n****************************************************************\n');
	console.log('saving to mapping collection ...');
	/*
	 predictedMutations = [{nctId: 'NCT01708954', gene: 'ATK', alteration: 'unspecified'},
	 {nctId: 'NCT00681798', gene: 'BRAF', alteration: 'unspecified'},
	 {nctId: 'NCT01226316', gene: 'MEK', alteration: 'unspecified'},
	 {nctId: 'NCT00002763', alterationID: '56390a58443bc8c2b0ae77f4'},
	 {nctId: 'NCT01682772', alterationID: '56390a58443bc8c2b0ae77f5'},
	 {nctId: 'NCT01708954', alterationID: '56390a58443bc8c2b0ae7123'}

	 ];
	 */
	var flag3 = 0;
	//predictedMutations = predictedMutations.slice(2000,3000);
	_.each(predictedMutations, function(item){

		if(item.alteration === 'unspecified'){
			Mapping.find({nctId: item.nctId}, function(err, mapping){

				if(mapping.length > 0)
				{
					mapping = mapping[0];
					var preGenes = mapping.predictedGenes;
					if(preGenes === undefined)
					{
						preGenes = [];
					}
					preGenes.push(item.gene);
					Mapping.update({nctId: item.nctId},{$set: {predictedGenes: preGenes}}, function(err, map){
						flag3++;
						console.log('update mapping table ', (flag3/predictedMutations.length*100).toFixed(2), '% finished');
					});
				}
				else
				{

					var newMappingRecord = new Mapping({nctId: item.nctId, predictedGenes: [item.gene], completeStatus: '1'});

					newMappingRecord.save(function(err, map){
						flag3++;
						console.log('save to mapping table ', (flag3/predictedMutations.length*100).toFixed(2), '% finished');
					});
				}
			})

		}
		else
		{
			Mapping.find({nctId: item.nctId}, function(err, mapping){
				if(mapping.length > 0)
				{
					mapping = mapping[0];
					var alteration = mapping.alteration;
					if(alteration === undefined)
					{
						alteration = [];
					}
					alteration.push({alteration_Id: item.alterationID, status: 'predicted'});
					Mapping.update({nctId: item.nctId},{$set: {alteration: alteration}}, function(err, map){
						flag3++;
						console.log('update mapping table ', (flag3/predictedMutations.length*100).toFixed(2), '% finished');
					});
				}
				else
				{

					var newMappingRecord = new Mapping({nctId: item.nctId, alteration: [{alteration_Id: item.alterationID, status: 'predicted'}], completeStatus: '1'});

					newMappingRecord.save(function(err, map){
						flag3++;
						console.log('save to mapping table', (flag3/predictedMutations.length*100).toFixed(2), '% finished');
					});
				}
			})
		}
	});

}

function searchTrial(result){
	console.log('\n****************************************************************\n');
	console.log('There are ', result.length, ' mutation records.');
	console.log('Start to search for those mutation records in all clinical trials...');
	var flag2 = 0;
	_.each(result, function(mutationItem){

		Trial.find({$text: {$search: '\"' + mutationItem.gene + '\"' + ' \"' + mutationItem.alteration + '\"' }}, function(err, trials){
			flag2++;
			console.log('Searching for ', mutationItem.gene, '   ' ,mutationItem.alteration, ' and ', trials.length, ' trials found ', '\n', (flag2/result.length*100).toFixed(2), '% finished');
			_.each(trials, function(trial){
				predictedMutations.push({nctId: trial.nctId, alterationID: mutationItem._id.toString()});
			});
			if(flag2 === result.length)
			{
				saveToMapping();
			}

		})
	});
}
function workers() {

	var hugoGenes = [], genes = [], genesNoMutations = [];

	Gene.find({}, function(err1, geneResult){

		_.each(geneResult, function(item){
			hugoGenes.push(item.hugo_symbol);
		});

		Alteration.find({}, function(err2, result){

			_.each(result, function(resultItem){
				genes.push(resultItem.gene);

			});

			genesNoMutations = _.difference(hugoGenes, genes);
			console.log('\n****************************************************************\n');
			console.log('There are ', genesNoMutations.length, 'genes not having mutation records.');
			console.log('Start to search for those genes in all clinical trials...');
			var flag1 = 0;
			_.each(genesNoMutations, function(gene){

				Trial.find({ $text: { $search: '\"' + gene + '\"' } }, function(err, trials){
					flag1++;
					console.log('Searching for ', gene, ' and ', trials.length, ' trials found ', '\n', (flag1/genesNoMutations.length*100).toFixed(2), '% finished');
					_.each(trials, function(trial){
						predictedMutations.push({nctId: trial.nctId, gene: gene, alteration: 'unspecified'});
					});
					if(flag1 === genesNoMutations.length)
					{
						searchTrial(result);
					}
				});

			});


		});

	});

}

function main() {

	connectDB(workers);
}

main();
