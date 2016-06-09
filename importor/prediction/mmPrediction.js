//pull trials based on gene alteration pairs
var request = require('request');
var mongoose = require('mongoose');
var _ = require('underscore');
var fs = require('fs'), readline = require('readline');
var Mapping = require('../../app/models/mapping.server.model.js');
var MMTrial = require('../../app/models/mmtrial.server.model.js');
var pageIndex = 0, mappings = [], nctIds = [], alterations = [], alterationIndex = 0, filterString, missingResults = [], mappings, uniqueNctIds = [], mappingIndex = 0, facets = [];


function getAlterations() {
    var rd = readline.createInterface({
        input: fs.createReadStream('./alterations.txt'),
        output: process.stdout,
        terminal: false
    });
    rd.on('line', function (line) {
        alterations.push(line.trim());
    });

    rd.on('close', function () {
        fetchTrials();
    });
}

function fetchTrials() {
    filterString = '[{"facet":"COUNTRY","term":"United States"},{"facet":"CONDITION","term":"cancer"},{"facet": "MUTATION", "term": "' + alterations[alterationIndex] + '"}]';
    request({
        url: 'https://api.molecularmatch.com:443/v1/search/trials', //URL to hit
        method: 'POST',
        //Lets post the following key/values as form
        json: {
            apiKey: '3b8c3083-0d69-4069-ba69-15d1c9fa70c6',
            filters: filterString,
            start: pageIndex * 200

        }
    }, function (error, response, body) {
        if (error) {
            console.log(error);
        } else {
            if (alterationIndex < alterations.length - 1) {
                if (body.total === undefined) {
                    console.log('The result is undefined for ', alterations[alterationIndex]);
                    fs.appendFile('./failedMMTrials.txt', alterations[alterationIndex] + '\n', function (err) {
                        if (err) {
                            console.log(err);
                        } else {
                            setTimeout(function () {
                                fetchTrials();
                            }, 100);
                        }
                    });


                    alterationIndex++;
                    pageIndex = 0;
                    nctIds = [];
                } else {
                    facets = _.map(body.rationalized, function(item){return item.facet;}); 
                    _.each(body.trials, function (item) {
                        nctIds.push(item.id);
                    });
                    if (pageIndex < Math.ceil(body.total / 200) - 1) {
                        pageIndex++;
                        console.log("fetching page ", pageIndex);
                        setTimeout(function () {
                            fetchTrials();
                        }, 100);
                    } else {

                        console.log('Done fetching trials info for ', alterations[alterationIndex]);
                        console.log('Fetched trials length are ', nctIds.length);

                        fs.appendFile('./mmTrials.txt', (facets.indexOf("PHRASE") === -1 ? alterations[alterationIndex] : alterations[alterationIndex].split(" ")[0] + " unspecified" ) + '\n', function (err) {
                            if (err) {
                                console.log(err);
                            } else {
                                fs.appendFile('./mmTrials.txt', nctIds.join() + '\n', function (err1) {
                                    if (err1) {
                                        console.log(err);
                                    } else {
                                        alterationIndex++;
                                        console.log((alterationIndex / alterations.length * 100).toFixed(2), '% finished');
                                        pageIndex = 0;
                                        nctIds = [];
                                        setTimeout(function () {
                                            fetchTrials();
                                        }, 100);
                                    }

                                });
                            }

                        });


                    }
                }

            } else {
                console.log('All Done');
                saveMappings();
            }




        }
    });
}

function saveMappings() {
    fs.readFile('./mmTrials.txt', 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }
        var lines = data.split("\n");
        for (var i = 0; i < lines.length - 1; i = i + 2) {
            var nctIds = lines[i + 1].split(",");
            uniqueNctIds = _.map(mappings, function (item) {
                return item.nctId;
            });
            _.each(nctIds, function (item) {
                var tempIndex = uniqueNctIds.indexOf(item);
                var firstSpace = lines[i].indexOf(" ");
                var gene = lines[i].substring(0, firstSpace);
                var alteration = lines[i].substring(firstSpace + 1);
                if (tempIndex === -1) {
                    mappings.push({nctId: item, alterations: [{gene: gene, alteration: alteration, "curationMethod": "predicted", "type": "inclusion", "status": "unconfirmed"}]});
                } else {
                    mappings[tempIndex].alterations.push({gene: gene, alteration: alteration, "curationMethod": "predicted", "type": "inclusion", "status": "unconfirmed"});
                }

            });
        }
         
        mongoose.connect('mongodb://localhost/firstDB');
        mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
        mongoose.connection.once('open', function () { console.log(mappings.length);
            saveToDB();
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
        if(mappingIndex < mappings.length -1){
            mappingIndex++;
            saveToDB();
        }else{
            console.log('Done saving ');
        }
        
    });

}

getAlterations();