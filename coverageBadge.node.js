var fs = require('fs'),
    request = require('request');

function getDirectories() {
    return fs.readdirSync('./coverage').filter(function (file) {
        return fs.statSync('./coverage/' + file).isDirectory();
    });
}

var resultDirectory = getDirectories()[0];

var array = fs.readFileSync('./coverage/' + resultDirectory + '/coverage.txt').toString().split("\n");
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
} else if (iPercentage > 60) {
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


download(pictureUrl, "./coverage/coverage.svg", function() {
    console.log("coverage picture created!");
});