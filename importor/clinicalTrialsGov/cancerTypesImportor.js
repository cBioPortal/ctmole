
var request = require('request');
var parseString = require('xml2js').parseString;
var jsdom = require('jsdom');
var colors = require('colors');
var mongoose = require('mongoose');
var fs = require('fs');
var _ = require('underscore');
readline = require('readline');

var	Cancertype = require('../../app/models/cancertype.server.model');

var cancerTypesArr = [];
var nctIdLocks = 0;
var urlIndex = 0;
var clinicalTrials = [];
var savingToDB = false;


main();

function main() {
    //getUrlsConditions(getListOfCancerTrialsFromClinicalTrialsGov);
    readNctIdsFile();
}

function getListOfCancerTrialsFromClinicalTrialsGov(urls) {
    checkNctLocks(urls);
}

function checkNctLocks(urls) {
    setTimeout(function(){
        if(nctIdLocks !== 0) {
            checkNctLocks(urls);
        }else {
            if(urlIndex < urls.length) {
                checkNctLocks(urls);
                console.log('\n-----------------------------------------------');
                console.log('URL: ', urls[urlIndex].url);
                console.log('Number of conditions: ', urls[urlIndex].count);
                console.log('URL index: ', urlIndex, ' Fnished: ', (urlIndex/urls.length * 100).toFixed(2), '%');
                getNctIds(urls[urlIndex], 1, function(){
                    --nctIdLocks;
                    ++urlIndex;
                });
            }else {
                console.log('\n\nFINISHIED. ');
                //var uniqueNctIds = _.uniq(nctIds);
                //console.log(uniqueNctIds.length, ' unique trials have been found.\n');
                //writeNctIdsIntoFile(nctIds);
            }
        }
    },500);
}


function readNctIdsFile() {
    var rd = readline.createInterface({
        input: fs.createReadStream('./cancertype_nctIds.txt'),
        output: process.stdout,
        terminal: false
    });

    var index = -1,  currentCancer = '', currentNctId = '';
    rd.on('line', function(line) {
        var cancerIndex = -1,
        index = line.indexOf('results?cond=%22');
        currentCancer = line.substr(index + 16, line.length - index - 19);
        currentNctId = line.substr(0, index - 6);
        currentCancer = currentCancer.replace(/(\%2C)/g, '');
        currentCancer = currentCancer.replace(/(\+)/g, ' ');

        for(var i = 0;i < cancerTypesArr.length;i++) {
            if (cancerTypesArr[i].cancer === currentCancer)
            {
                cancerIndex = i;
                break;
            }
        }
        if(cancerIndex === -1)
        {
            cancerTypesArr.push({cancer: currentCancer, nctIds: [currentNctId]});
        }
        else
        {
            cancerTypesArr[cancerIndex].nctIds.push(currentNctId);
        }
    });

    rd.on('close', function(){
        mongoose.connect('mongodb://localhost/firstDB');
        mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
        mongoose.connection.once('open', function callback () {

        saveNextCancer(0);

        });


    });
}

function saveNextCancer(index){
    if(index < cancerTypesArr.length)
    {
        var cancerType = new Cancertype(cancerTypesArr[index]);
        cancerType.save(function(err, cancerTypeItem){
            index = index + 1;
            saveNextCancer(index);
        });
    }
    else
    {
        console.log('Done saving to database ');
        mongoose.connection.close();
    }

}

function getNctIds(url, page, callback) {
    var _url = 'http://clinicaltrials.gov'+url.url+'&displayxml=true&pg='+page;
    ++nctIdLocks;
    request(_url, function(error, response, body){
        parseString(body, {trim: true}, function (err, result) {
            var searchResults = result.search_results || {};
            if(searchResults.hasOwnProperty('clinical_study') && searchResults.clinical_study instanceof Array && searchResults.clinical_study.length > 0) {
                searchResults.clinical_study.forEach(function(e, i) {

                    fs.appendFile('./cancertype_nctIds.txt', e.nct_id[0] + ',' + url.url + '\n' , function (err) {
                        return 'error message is ' + err;
                    });

                    //nctIds.push({nctId: e.nct_id[0], category: url.url});
                });

                getNctIds(url, ++page, function(){--nctIdLocks;});
            }
            callback();
        });
    });
}

function getUrlsConditions(callback) {
    var urlConditions = [];
    jsdom.env(
        'http://clinicaltrials.gov/ct2/search/browse?brwse=cond_cat_BC04&brwse-force=true',
        ["http://code.jquery.com/jquery.js"],
        function (errors, window) {
            window.$("#conditions").find('li').each(function(e, i){
                var _attr = window.$(this).find('a').attr('href');

                if (typeof _attr !== 'undefined' && _attr !== false) {
                    var _datum = {
                        url: _attr,
                        count: window.$(this).text().trim().match(/\d* study|\d* studies/)[0].replace(/studies|study/, '').trim()
                    }
                    urlConditions.push(_datum);
                }else {
                    console.log('There is not any href link in:'.color, window.$(this).html());
                }
            })
            console.log("Total in ", urlConditions.length, " conditions");
            callback(urlConditions);
        }
    );
}

function importTrials(nctIds) {

}


function checkNctIndex(nctIds, nctIdIndex) {

    if(nctIdIndex < nctIds.length) {
        if(savingToDB) {
            setTimeout(function(){
                checkNctIndex(nctIds, nctIdIndex);
            },500);
        }else {
            parseClinicalTrialsGov(nctIds, nctIdIndex, checkNctIndex);
        }
        if ((nctIdIndex+1) % 1000 === 0) {
            console.log('Saving data to MongoDB....');
            savingToDB = true;
            saveClinicalTrialMetadata(clinicalTrials);
        }
    }else {
        console.log('Final saving data to MongoDB....');
        savingToDB = true;
        saveClinicalTrialMetadata(clinicalTrials,function(){
            mongoose.connection.close();
        });
    }
}



