var fs      = require('fs');
var request = require('request');
var path    = require('path');

var resultDirectory = "results";

var array = fs.readFileSync(path.join( __dirname ,'../coverage/' + resultDirectory + '/coverage.txt')).toString().split("\n");
for(var i in array) {
    var percentage;
    if (array[i].indexOf("Statements") !== -1) {
        var dotIndex = array[i].indexOf('.');
        percentage = array[i].substring(dotIndex - 2, dotIndex);
    }
}

var iPercentage = parseInt(percentage);
var color;
if (iPercentage > 94){
    color = "green";
} else if (iPercentage > 59) {
    color = "yellow";
} else {
    color = "red";
}

var pictureUrl = "http://img.shields.io/badge/coverage-";
pictureUrl += percentage + '%-' + color + ".svg";

function download(uri, filename, callback){
    request.head(uri, function(){
        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
}

download(pictureUrl, path.join(__dirname, "./coverage.svg"), function() {
    console.log("coverage picture created!");
});