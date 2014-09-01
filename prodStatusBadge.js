var https   = require('https');
var fs      = require('fs');
var request = require('request');

function callBackend(hostname, port, path, method, callback) {
    var options = {
        hostname: hostname,
        port: port,
        path: path,
        method: method,
        rejectUnauthorized: false
    };

    var data = "";
    console.log(method.toUpperCase() + ": https://" + hostname + ":" + port + path);

    var req = https.request(options, function (res) {
        res.on('data', function (chunk) { data += chunk; });
        res.on('end', function () { callback(data); });
    });

    if (method.toLowerCase() == "post" && postData != undefined) {
        req.write(postData);
    }

    req.end();
    req.on('error', function (e) {
        console.error(e);
        callback();
    });
}


callBackend('github.wdf.sap.corp', 443, '/api/v3/repos/bridge/bridge/tags', 'GET', function (data) 
{
    
    if(data === undefined)
    {
        console.log("GitHub not reachable");         
    }

    else
    {        
        var gitTags = JSON.parse(data);
        var latest_tag = "v0.0";
        
        //expecting format vX.Y for version
        for (var i = 0; i < gitTags.length; i++) {
            if (gitTags[i].name[1] > latest_tag[1] || (gitTags[i].name[1] == latest_tag[1] && parseInt(gitTags[i].name.substring(3)) > parseInt(latest_tag.substring(3)))) {
                latest_tag = gitTags[i].name;
            }
        }
        
        console.log("Bridge Version on Server: " + latest_tag);

        callBackend('github.wdf.sap.corp', 443, '/api/v3/repos/bridge/bridge/compare/' + latest_tag + '...master', 'GET', function (data)
        {
            var status = JSON.parse(data);
            var count = status.ahead_by;     

            var color;
            if (count === 0)
            {
                color = "green";
            } 
            else if (count > 0 && count <= 10) 
            {
                color = "yellow";                
            } 
            else 
            {
                color = "red";
            }


            var pictureUrl = "http://img.shields.io/badge/commits--behind-";
            pictureUrl += count + '-' + color + ".svg";

            function download(uri, filename, callback){
                request.head(uri, function(){
                    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
                });
            }

            download(pictureUrl, "./prodstatus.svg", function() {
                console.log("prodstatus picture created!");
            });

        });    
    }
});