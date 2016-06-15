
var request = require('request');
var mongoose = require('mongoose');
var _ = require('underscore');

var MMTrial = require('../../app/models/mmtrial.server.model.js');
var pageIndex = 0, totalPages = 0, trials, mmTrial, lastPageTrialsCount;

function main() {
    mongoose.connect('mongodb://localhost/firstDB');
    mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
    mongoose.connection.once('open', function callback() {
        console.log('Done connecting and begin to fetch trials info...');
        fetchTrials();
    });
}

function fetchTrials() {
    request({
        url: 'https://api.molecularmatch.com:443/v1/search/trials', //URL to hit
        method: 'POST',
        //Lets post the following key/values as form
        json: {
            apiKey: '3b8c3083-0d69-4069-ba69-15d1c9fa70c6',
            filters: '[{"facet":"COUNTRY","term":"United States"},{"facet":"CONDITION","term":"cancer"}]',
            start: pageIndex * 200

        }
    }, function (error, response, body) {
        if (error) {
            console.log(error);
        } else {
            if (pageIndex === 0) {
                totalPages = body.total / 200;
                lastPageTrialsCount = body.total - 200 * (totalPages - 1);
            }
            trials = body.trials;
            if (trials !== undefined) {
                console.log('Fetching page ', body.page, '...');
                saveTrial(0);
            } else {
                console.log('Page ', pageIndex + 1, ' is undefined and we wait here for 10 seconds to fetch same page again');
                setTimeout(function () {
                    fetchTrials();
                }, 5000);
            }

        }
    });
}

function saveTrial(trialIndex) {
    mmTrial = new MMTrial(trials[trialIndex]);
    mmTrial.save(function (err) {
        if (err) {
            console.error("Error while saving data to MongoDB: " + err);
        }
        if (pageIndex === totalPages - 2) {
            if (trialIndex < lastPageTrialsCount - 1) {
                trialIndex++;
                saveTrial(trialIndex);
            } else {
                console.log('Done saving all trials!');
            }
        } else {
            if (trialIndex < 199) {
                trialIndex++;
                saveTrial(trialIndex);
            } else {
                pageIndex++;
                console.log('Saved to database ', (pageIndex / totalPages * 100).toFixed(2), '% finished');

                setTimeout(function () {
                    fetchTrials();
                }, (pageIndex % 10 === 0 ? 1000 : 200));
            }
        }



    });
}

main();