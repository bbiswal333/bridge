var https_req	= require('https');
var http_req	= require('http');
var url 		= require('url');
var fs          = require('fs');
var path 		= require('path');
var setHeader	= require('./cors.js');

exports.register = function(app, user, proxy, npm, eTag)
{
	//get api modules
	var xml2js 	  	  = require("xml2js").parseString;
	var iconv 	  	  = require("iconv-lite");

	var modulesPacked;
	var javascriptPacked;
	var stylesheetsPacked;

	function callBackend(protocol, hostname, port, path, method, proxy, decode, callback, postData){

		if( port === null && protocol === 'http:')
		{
			port = 80;
		}

		if( port === null && protocol === 'https:')
		{
			port = 443;
		}

		var options =
		{
			hostname: hostname,
			port: port,
			path: path,
			method: method,
			rejectUnauthorized: false
		};

		if(proxy)
		{
			options = {
				host: "proxy.wdf.sap.corp",
			 	port: 8080,
			 	path: protocol + "//" + hostname + ":" + port + path,
			 	headers: {
			    	Host: hostname
			  	}
			};
		}

		if (method.toLowerCase() === "post" && postData !== undefined) {
			options.headers = {
				'Content-Type': 'application/json; charset=UTF-8',
				'Content-Length': (postData !== undefined ? postData.length : 0)
			};
		}

		if(!('headers' in options)) {
			options.headers = {};
		}

		options.headers['User-Agent'] = 'bridge';

		var data = "";
		console.log(method.toUpperCase() + ": " + protocol + "//" + hostname + ":" + port + path);

		var req = {};

		if( protocol === "http:")
		{
			req = http_req.request(options, function(res) {
				res.setEncoding('binary');

				var contentType = res.headers['content-type'];
				if (decode !== "none")
				{
					res.setEncoding('binary');
				}
				res.on('data', function(chunk) { data += chunk; });
				res.on('end', function(){
					if (decode === "none"){
						callback( data, contentType );
					}
					else
					{
						callback( iconv.decode(data, decode).toString('utf-8'), contentType);
					}
				});
			});
		}
		else
		{

			req = https_req.request(options, function(res) {
				res.setEncoding('binary');

				var contentType = res.headers['content-type'];
			    res.on('data', function (chunk) {
			        data += chunk;
			    });
			    res.on('end', function () {
			        callback(data, contentType);
			    });
			});
		}

		if (method.toLowerCase() === "post" && postData !== undefined)
		{
			req.write(postData);
		}

	    req.end();
		req.on('error', function (e) {
		    console.error(e);
		});
	}

	app.get('/api/status', function(request, response) {

	});

	//generic api call get
	app.get('/api/get', function(request, response) {
		var json = false;
		var proxy = false;

		if (typeof request.query.url === "undefined" || request.query.url === "")
		{
			response = setHeader( request, response );
			response.send("Paramter url needs to be set!");
			return;
		}

		if (typeof request.query.json !== "undefined" && request.query.json === "true")
		{
			json = true;
			response.setHeader('Content-Type', 'application/json');
		}

		if (typeof request.query.proxy !== "undefined" && request.query.proxy === "true")
		{
			proxy = true;
		}

		var service_url = url.parse(request.query.url);

		var decode = "none";
		if(typeof request.query.decode !== "undefined")
		{
			decode = request.query.decode;
		}


		callBackend(service_url.protocol, service_url.hostname, service_url.port, service_url.path, 'GET', proxy, decode, function (data, contentType) {
			response = setHeader( request, response );
			//console.log(contentType);
			//response.setHeader('Content-Type', contentType);
			response.set({ 'Content-Type': contentType + '; charset=UTF-8'});


			//response.charset = 'UTF-8';
			if (json) {
				try {
					xml2js(data, function (err, result) {
						if (err === undefined) {
							response.send(JSON.stringify(result));
						}
						else {
							response.send("Could not convert XML to JSON.");
						}
					});
				}
				catch(err) {
					response.send("Could not convert XML to JSON.");
				}
			}
			else
			{
				response.send(data);
			}
		});
	});

	//generic api call post
	app.options("/api/post", function(request, response){
		response = setHeader( request, response );
		response.send();
		return;
	});

	app.post("/api/post", function (request, response) {
		console.log(request);
		var body = '';
		request.on('data', function (data) {
			body += data;

			// Too much POST data, kill the connection!
			if (body.length > 1e6)
				request.connection.destroy();
		});
		request.on('end', function () {
			var service_url = url.parse(request.query.url);
			//var postData = request.rawBody;
			var postData = body;

			callBackend(service_url.protocol, service_url.hostname, service_url.port, service_url.path, "POST", false, "none", function(data) {
				response = setHeader( request, response );
				response.send(data);
			}, postData);
		});
		if (typeof request.query.url === "undefined" || request.query.url === "")
		{
			response = setHeader( request, response );
			response.send("Paramter url needs to be set!");
			return;
		}
	});

	var concatAttributes = function(array, object, mapFunction)
	{
		for (var attribute in object) {
			if (object.hasOwnProperty(attribute))
			{
			 	if(!array[attribute])
				{
				 	array[attribute] = [];
				}

				var value = object[attribute];
				if( mapFunction !== undefined )
				{
					value = mapFunction(attribute, value);
				}

				if( value !== undefined )
				{
					array[attribute] = array[attribute].concat(value);
				}
			}
		}
		return array;
	};

	function getProxyCommands() {
		var set_proxy = "";

		if( proxy )
		{
			if(process.platform === "win32") {
				set_proxy = "set http_proxy http_proxy=http://proxy:8080 && set https_proxy=http://proxy:8080";
			}
			else {
				set_proxy = "export http_proxy http_proxy=http://proxy:8080 && export https_proxy=http://proxy:8080";
			}
		}
		return set_proxy;
	}

	var loadAppNodeModules = function() {
		var npm;
		if (process.platform == "win32") {
            npm = "node/npm";
        } else {
            npm = "../../../../Resources/app.nw/node/bin/npm";
        }
		findFilesByName(path.join(__dirname, '../webui/app'), '_modules.json', function(modulePath) {
			try
    		{
    			delete require.cache[require.resolve(modulePath)];
	    		var module = require(modulePath);
				if(module.nodeModules) {
					if(typeof webkitClient !== 'undefined' && webkitClient) {
						findFilesByName(path.join(modulePath, '../../../../server/app', path.basename(path.dirname(modulePath))), 'package.json', function(packagePath, content) {
							console.log("running npm install in folder: " + path.dirname(packagePath));
							console.log("cd " + path.dirname(packagePath) + " && " + getProxyCommands() + " && " + path.join(path.dirname(process.execPath), npm) + " install");
							require('child_process').exec("cd " + path.dirname(packagePath) + " && " + getProxyCommands() + " && " + path.join(path.dirname(process.execPath), npm) + " install");
						});
					}
					for(var i = 0; i < module.nodeModules.length; i++) {
						require(path.join(modulePath, '../../../../server/app', path.basename(path.dirname(modulePath)), module.nodeModules[i]))(app);
					}
				}
			} catch(e) {
				console.log(e);
			}
		});
	};

	var findFilesByName = function(dir, filename, moduleHandler)
	{
		var files = fs.readdirSync(dir);

		for (var i = 0; i < files.length; i++){
		    var name = path.join(dir, '/', files[i]);

		    if (fs.statSync(name).isDirectory() && path.basename(name) !== "node_modules")
		    {
		    	findFilesByName(name, filename, moduleHandler);
		    }
		    else
		    {
		    	if (path.basename(name) === filename)
		    	{
		    		moduleHandler(name);
		    	}
		    }
		}
	};

	var getFiles = function(dir)
	{
		var out_files = {};
		findFilesByName(dir, '_modules.json', function(modulePath) {
			try
    		{
    			delete require.cache[require.resolve(modulePath)];
	    		var module = require(modulePath);
	    		if(module.app) {
	    			module.app.appPath = path.dirname(path.relative(__dirname, modulePath)).replace(/\\/g,"/").replace('../webui/', './');
	    		}
	    		out_files = concatAttributes(out_files, module, function(attribute_name, value)
	    		{
	    			if( attribute_name.length > 6 && attribute_name.substring(attribute_name.length - 6) === "_files" )
	    			{
	    				for (var i = 0; i < value.length; i++)
	    				{
							var filename = path.join(path.dirname(modulePath), value[i]);
							value[i] = path.relative(path.join(__dirname, '../webui'), filename);
						}
						return value;
	    			} else {
	    				return value;
	    			}
	    		});
	    	}
	    	catch(e)
	    	{
	    		console.log(e);
	    	}
		});
		return out_files;
	};

	loadAppNodeModules();

	app.get("/api/modules", function (request, response)
	{
		response = setHeader( request, response );

		//cache module files for etag if existing
		var getResponse = true;
		if(eTag !== undefined)
		{
			//response.setHeader('Cache-Control', 'no-cache, max-age=2592000');	// 30 days
            response.setHeader('Cache-Control', 'must-revalidate, private');
			response.setHeader('ETag', eTag);
            response.setHeader('Expires', '-1');
			if( request.headers['if-none-match'] === eTag)
			{
				getResponse = false;
			}
		}
		else
		{
			response.setHeader('Expires', '-1');
			//response.header('Cache-Control', 'no-cache, must-revalidate, max-stale=0, post-check=0, pre-check=0');
            response.setHeader('Cache-Control', 'must-revalidate, private');
			response.setHeader('Last-Modified', (new Date()).toUTCString());
			response.removeHeader('Etag');
		}

		if( getResponse )
		{
			if(!javascriptPacked || !stylesheetsPacked || !modulesPacked || !require("./params.js").get("cache", false)) {
				var files = {};

				var bridge_path = path.join(__dirname, '../webui/bridge');
			    var bridge_files = getFiles(bridge_path);
			    files = concatAttributes(files, bridge_files);

				var app_path = path.join(__dirname, '../webui/app');
			    var app_files = getFiles(app_path);
			    files = concatAttributes(files, app_files);

			    modulesPacked = JSON.stringify(files);

				var buildifyJS = require('buildify')(path.join(__dirname, '..', '/webui'),{ encoding: 'utf-8', eol: '\n' });
				buildifyJS.concat(files.js_files);
				// compression here only saves 60 KB as per detailed analysis
				//javascriptPacked = buildifyJS.uglify({ mangle: false }).getContent(); //mangle does not work with angular currently
				javascriptPacked = buildifyJS.getContent();

				var buildifyCSS = require('buildify')(path.join(__dirname, '..', '/webui'),{ encoding: 'utf-8', eol: '\n' });
				buildifyCSS.concat(files.css_files);
				stylesheetsPacked = buildifyCSS.cssmin().getContent();
			}

			if (typeof request.query.format === "undefined")
			    {
			    	response.setHeader('Content-Type', 'text/plain;');
					response.send(modulesPacked);
				}
				else if( request.query.format === "js")
				{
					response.setHeader('Content-Type', 'text/javascript; charset=utf-8');
					response.send(javascriptPacked);
				}
				else if( request.query.format === "css")
				{
					response.setHeader('Content-Type', 'text/css; charset=utf-8');
					response.send(stylesheetsPacked);
			}
		}
		else
		{
			response.send();
		}
	});
};
