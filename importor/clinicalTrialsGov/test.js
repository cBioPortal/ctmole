/**
 * Created by jiaojiao on 12/11/15.
 */

var fs = require('fs');

main();
function main(){
    fs.writeFile('./nctIds.txt', 'good mornind lord' , function (err) {
        return console.log(err);
    });
}
