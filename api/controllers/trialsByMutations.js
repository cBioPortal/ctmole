'use strict';
/*
 'use strict' is not required but helpful for turning syntactical errors into true errors in the program flow
 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
*/

/*
 Modules make it possible to import JavaScript files into your application.  Modules are imported
 using 'require' statements that give you a reference to the module.

  It is a good idea to list the modules that your application depends on in the package.json in the project root
 */
var util = require('util');

var mongoose = require('mongoose'),
    _ = require('lodash');
var Trial = require('../../app/models/trial.server.model'),
    Mapping = require('../../app/models/mapping.server.model');

module.exports = {
    trialsByMutationsGET: trialsByMutationsGET,
    trialsByMutationsPOST: trialsByMutationsPOST
};


function trialsByMutationsGET(req, res) {

    mongoose.connect('mongodb://localhost/firstDB');
    mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
    mongoose.connection.once('open', function callback () {

        // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
        var gene = req.swagger.params.gene.value.toUpperCase();
        var alterations = req.swagger.params.alterations.value;
        alterations = alterations.split(",");
        var results = [], nctIds = [];
        alterations.forEach(function(alteration, index){
            alteration = alteration.trim();
            if(alteration !== 'unspecified'){
                alteration = alteration.toUpperCase();
            }
            Mapping.find({}).stream()
            .on('data',function(item){
                    item.alterations.forEach(function(altItem, i){
                        if(altItem.gene === gene && altItem.alteration === alteration){
                            nctIds.push(item.nctId);
                        }
                    });
            })
            .on('error', function(err){
                console.log('Oppos, error happened ', err);
            })
            .on('end', function(){
                results.push({gene: gene, alteration: alteration, nctIds: nctIds });
                nctIds = [];
                if(index === alterations.length -1){
                    res.json(results);
                    mongoose.connection.close();
                }
            })

        });


    });

}

function trialsByMutationsPOST(req, res) {

    mongoose.connect('mongodb://localhost/firstDB');
    mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
    mongoose.connection.once('open', function callback () {

        // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
        var gene = req.swagger.params.body.value.gene.toUpperCase();
        var alterations = req.swagger.params.body.value.alterations;
        alterations = alterations.split(",");
        var results = [], nctIds = [];
        alterations.forEach(function(alteration, index){
            alteration = alteration.trim();
            if(alteration !== 'unspecified'){
                alteration = alteration.toUpperCase();
            }
            Mapping.find({}).stream()
                .on('data',function(item){
                    item.alterations.forEach(function(altItem, i){
                        if(altItem.gene === gene && altItem.alteration === alteration){
                            nctIds.push(item.nctId);
                        }
                    });
                })
                .on('error', function(err){
                    console.log('Oppos, error happened ', err);
                })
                .on('end', function(){
                    results.push({gene: gene, alteration: alteration, nctIds: nctIds });
                    nctIds = [];
                    if(index === alterations.length -1){
                        res.json(results);
                        mongoose.connection.close();
                    }
                })

        });


    });
}

