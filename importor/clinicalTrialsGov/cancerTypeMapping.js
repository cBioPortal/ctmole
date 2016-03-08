/**
 * Created by jiaojiao on 1/18/16.
 * save OncoKB
 */
var mongoose = require('mongoose'),
    _ = require('lodash');
var	Cancertype = require('../../app/models/cancertype.server.model');
var fs = require('fs'), readline = require('readline');
var tumorMappings = [];

function worker1(){

    var rd = readline.createInterface({
        input: fs.createReadStream(process.cwd() + '/tumorTypesMapping.txt'),
        output: process.stdout,
        terminal: false
    });

   var tumorData = [];
    rd.on('line', function(line) {
        tumorData = line.split(',');
        tumorMappings.push({CTtumorType: tumorData[0].trim(), OncoKBtumortype: tumorData[1].trim() });
    });


    rd.on('close', function(){

        mongoose.connect('mongodb://localhost/firstDB');
        mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
        mongoose.connection.once('open', function callback () {

            worker2();

        });


    });
}

function worker2(){
    var cancers = _.map(tumorMappings, function(e){return e.CTtumorType;});
    Cancertype.find({}).stream()
        .on('data', function(item){
            var index = cancers.indexOf(item.cancer);
            if(index !== -1){
                Cancertype.update({cancer: tumorMappings[index].CTtumorType},{$set: {OncoKBCancerType: tumorMappings[index].OncoKBtumortype}}).exec(function(data, err){
                    if(err)console.log('Error happened ', err);
                });
            }
        })
        .on('error', function(err){
            console.log('Error happended ', err);
        })
        .on('end', function(){
            console.log('Insert tumortype mapping done!');
            mongoose.connection.close();
        })
}

function main(){
    worker1();
}

main();
