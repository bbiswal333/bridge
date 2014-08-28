var fs = require('fs'),
    request = require('request');

var array = fs.readFileSync('./coverage/results/coverage.txt').toString().split("\n");
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

var pictureUrl = "http://img.shields.io/badge/coverage-"
pictureUrl += percentage + '%-' + color + ".svg";

var download = function(uri, filename, callback){
    request.head(uri, function(err, res, body){

        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
};

download(pictureUrl, "./coverage/coverage.svg", function() {
    console.log("coverage picture created!")
});