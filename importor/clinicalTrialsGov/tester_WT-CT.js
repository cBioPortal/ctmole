/**
 * Created by jiaojiao on 12/7/15.
 */
//wrote this script to help Ritika create xml file from information in clinicaltrial.gov for 5 trials
var request = require('request');
var parseString = require('xml2js').parseString;
var jsdom = require('jsdom');
var fs = require('fs');
var _ = require('underscore');

var XMLWriter = require('xml-writer');
xw = new XMLWriter;
xw.startDocument();



var ws = fs.createWriteStream('./foo.xml');
ws.on('close', function() {
    console.log(fs.readFileSync('./foo.xml', 'UTF-8'));
});
xw = new XMLWriter(true, function(string, encoding) {
    ws.write(string, encoding);
});




var nctIds = ["NCT02248805", "NCT02448810", "NCT02573220", "NCT02508077", "NCT02318901"];

function worker(index){
    var url = 'http://clinicaltrials.gov/show/' + nctIds[index] + '?displayxml=true';
    request(url, function(error, response, body){
        parseString(body, {trim: true, attrkey: '__attrkey', charkey: '__charkey'}, function (err, result) {
            if(result.hasOwnProperty('clinical_study')) {

                xw.startElement('clinical_trial');

                xw.startElement('trial_id');
                xw.text(result.clinical_study.id_info[0].nct_id[0].toString());
                xw.endElement('trial_id');

                xw.startElement('title');
                xw.text(result.clinical_study.brief_title.toString());
                xw.endElement('title');

                xw.startElement('purpose');
                xw.text(result.clinical_study.brief_summary[0].textblock[0].toString());
                xw.endElement('purpose');

                xw.startElement('recruiting_status');
                xw.text(result.clinical_study.overall_status[0].toString());
                xw.endElement('recruiting_status');

                xw.startElement('eligibility_criteria');
                xw.text(result.clinical_study.eligibility[0].criteria[0].textblock[0].toString());
                xw.endElement('eligibility_criteria');


                xw.startElement('phase');
                xw.text(result.clinical_study.phase[0].toString());
                xw.endElement('phase');

                if(result.clinical_study.intervention_browse !== undefined)
                {
                    _.each(result.clinical_study.intervention_browse[0].mesh_term, function(item){

                        xw.startElement('intervention');
                        xw.text(item.toString());
                        xw.endElement('intervention');
                    });

                }

                _.each(result.clinical_study.condition, function(item){
                    xw.startElement('condition');
                    xw.text(item.toString());
                    xw.endElement('condition');
                });




                xw.endElement('clinical_trial');
                if(index < 4){
                    index++;
                    worker(index);
                }


            }else {
                console.log('\t\t', nctIds[index], 'does not have clinical study attribute.');
            }


        });
    });


}

function main(){
    worker(0);
    xw.endDocument();

};


main();

