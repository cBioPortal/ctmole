/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var request = require('request');
var mongoose = require('mongoose');
var _ = require('underscore');
var MMTrial = require('../../app/models/mmtrial.server.model.js');
var Mapping = require('../../app/models/mapping.server.model.js');
var mappings = [], gene, alteration, uniqueNctIds = [], mappingIndex = 0;

function main() {
    mongoose.connect('mongodb://localhost/firstDB');
    mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
    mongoose.connection.once('open', function () {
        console.log('Done connecting and begin to fetch trials info...');

        MMTrial.find({}, {id: 1, tags: 1}).exec(function (err, trials) {
            if (err) {
                console.log('error message ', err);
            } else {
                _.each(trials, function (item) {

                    _.each(item.tags, function (tag) {

                        if (tag.facet === "GENE" || tag.facet === "MUTATION") {

                            if (tag.facet === "GENE") {
                                gene = tag.term;
                                alteration = "unspecified";
                            } else if (tag.facet === "MUTATION") {
                                var firstSpace = tag.term.indexOf(" ");
                                var gene = tag.term.substring(0, firstSpace);
                                var alteration = tag.term.substring(firstSpace + 1);
                            }
                            if (uniqueNctIds.indexOf(item.id) === -1) {
                                uniqueNctIds.push(item.id);
                                mappings.push({nctId: item.id, alterations: [{gene: gene, alteration: alteration, "curationMethod": "predicted", "type": "inclusion", "status": "unconfirmed"}]});
                            } else {
                                mappings[uniqueNctIds.indexOf(item.id)].alterations.push({gene: gene, alteration: alteration, "curationMethod": "predicted", "type": "inclusion", "status": "unconfirmed"});
                            }

                        }

                    });

                });
                console.log('Done getting mapping table, begin to save...');
                console.log('Total length is ', mappings.length);
                saveToDB();
            }
        });
    });
}
function saveToDB() {
    var mapping = new Mapping({"nctId": mappings[mappingIndex].nctId, "alterations": mappings[mappingIndex].alterations, completeStatus: "1", log: [], comments: [], oncoTreeTumors: []});

    mapping.save(function (err) {
        if (err) {
            console.log('error occured ', err);
        }
        console.log('index ', mappingIndex);
        if (mappingIndex < mappings.length - 1) {
            mappingIndex++;
            saveToDB();
        } else {
            console.log('Done saving ');
        }

    });

}
main();