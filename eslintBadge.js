var fs      = require('fs');
var request = require('request');
var xml2js  = require("xml2js").Parser();


var xml = fs.readFileSync('checkstyle.xml').toString();

try {
    xml2js.parseString(xml, function (err, result) {                
        if (err === undefined || err === null) 
        {            
            var count = 0;
            var array = result.checkstyle.file;
            for(var i = 0; i < array.length; i++)
            {
                if(array[i].error !== undefined)
                {

                    count += array[i].error.length;                    
                }
            }            
            console.log(count);

            var color;
            if (count === 0)
            {
                color = "green";
            } 
            else if (count > 0 && count <= 25) 
            {
                color = "yellow";                
            } 
            else 
            {
                color = "red";
            }


            var pictureUrl = "http://img.shields.io/badge/eslint-";
            pictureUrl += count + '-' + color + ".svg";

            function download(uri, filename, callback){
                request.head(uri, function(){
                    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
                });
            }

            download(pictureUrl, "./eslint.svg", function() {
                console.log("coverage picture created!");
            });


        }
        else 
        {            
            console.log("Error when converting XML.")
        }
    });
}
catch(err) 
{
    console.log("Could not convert XML to JSON.");
}