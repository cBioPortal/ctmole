
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

var urlIndex = 0;

var urlConditions = [];
var savedIndices = [];
var page = 1;

main();

function main() {
    getUrlsConditions();

}

function checkNctLocks() {
    if(urlIndex < urlConditions.length) {

        console.log('\n-----------------------------------------------');
        console.log('URL: ', urlConditions[urlIndex].url);
        console.log('Number of conditions: ', urlConditions[urlIndex].count);
        console.log('URL index: ', urlIndex, ' Fnished: ', (urlIndex/urlConditions.length * 100).toFixed(2), '%');

        page = 1;
        getNctIds();

    }else {
        console.log('\n\nFINISHIED. ');

        readNctIdsFile();
    }
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
        console.log('saving to database....', (index/cancerTypesArr.length * 100).toFixed(2), '%');
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

function getNctIds() {
    var branchFlag = true;
    var _url = 'http://clinicaltrials.gov'+urlConditions[urlIndex].url+'&displayxml=true&pg='+page;

    request(_url, function(error, response, body){
        parseString(body, {trim: true}, function (err, result) {

            var searchResults = result.search_results || {};

            if(!_.isEmpty(searchResults)){
                //the page already approached to the end
                branchFlag = false;
            }
            else{
                branchFlag = true;
            }

            if(searchResults.hasOwnProperty('clinical_study') && searchResults.clinical_study instanceof Array && searchResults.clinical_study.length > 0) {
                savedIndices.push(urlIndex);
                searchResults.clinical_study.forEach(function(e, i) {

                    fs.appendFile('./cancertype_nctIds.txt', e.nct_id[0] + ',' + urlConditions[urlIndex].url + '\n' , function (err) {
                        return 'error message is ' + err;
                    });

                });
                page++;
                getNctIds();

            }
            else{

                if(branchFlag)
                {
                    console.log('pausing for 10s to refetch page ', page);
                    setTimeout(getNctIds, 10000);
                }
                else{
                    urlIndex++;
                    checkNctLocks();
                }
            }



        });
    });
}

function getUrlsConditions() {

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
            checkNctLocks();
        }
    );
}



