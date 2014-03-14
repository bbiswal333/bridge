var authenticator = function(URL, callback){
	var http = require('http');
	var nodeURL = require("url");
	var querystring = require('querystring');
	var htmlparser = require("htmlparser");
		
	var WIRE_URL = URL;
	var parsedWireURL = nodeURL.parse(WIRE_URL);
	
	var IDP_URL = "https://accounts.sap.com/saml2/idp/sso/accounts.sap.com";
	var parsedIDPURL = nodeURL.parse(IDP_URL);
	
	//options for first call to wire
	var post_options_proxy = {
		host: "proxy",
		port: 8080,
		path: WIRE_URL,
		method: "POST",
		headers: {
			'Host': parsedWireURL.host,
			'Content-Type': 'application/x-www-form-urlencoded'	
		}			
	};

	//first request to wire
	 var request = http.request(post_options_proxy, function (res) {
		var data = '';
		
		res.on('data', function (chunk) {
			//build the whole response
			data += chunk.toString();
		});

		//extract the cookies that are later necessary. wireCookie is used for the request to wire after successful login in sap.accounts
		var first_cookie = res.headers['set-cookie'][0].split(";")[0];
		var second_cookie = res.headers['set-cookie'][1].split(";")[0];
		var wireCookie = first_cookie + "; "+ second_cookie;

		res.on('end', function () {		
			//the handler is used to parse the html-responsestring to a dom-object
			var handler = new htmlparser.DefaultHandler(function (error, dom) {
				if (error){
					console.log(error);
				}						
				else{			
					console.log('RES:' + data);		
					//get the SAMLRequest and RelayState information from the devwire-website
					var SAMLRequestValue = dom[0].children[1].children[2].children[0].attribs.value;				
					var requestRelayStateValue = dom[0].children[1].children[2].children[1].attribs.value;
					
					//postData for request to Identity Provider (IDP)
					var SAMLRequestData = querystring.stringify({SAMLRequest: SAMLRequestValue,	RelayState: requestRelayStateValue, j_username:"aliceonwire@gmail.com", j_password:"Aliceonwire42"});
					//connection settings for call to IDP
					var post_options_proxy2 = {
						host: "proxy",
						port: 8080,
						path: IDP_URL,
						method: "POST",
						Connection: "keep-alive",
						headers: {
							'Host': parsedIDPURL.host,
							'Content-Type': 'application/x-www-form-urlencoded',
							'Referer': "https://testwire.hana.ondemand.com/mobile",
							'Content-Length': SAMLRequestData.length							
						}			
					};
					
					//request to IDP
					var request2 = http.request(post_options_proxy2, function (res) {
						var data = '';
						res.setEncoding('utf8');
						res.on('data', function (chunk) {
							data += chunk.toString();
						});
						res.on('end', function () {			
							
							//extract the session id
							var JSESSIONID_number = res.headers['set-cookie'][1].split(";")[0];
							var number = JSESSIONID_number.split("=")[1];

							//handler for the IDP-response
							var handler2 = new htmlparser.DefaultHandler(function (error, dom) {
								
								//get the SAMLResponse and RelayState information from the IDP-website
								var SAMLResponseValue = dom[2].children[3].children[1].children[4].children[0].children[0].children[1].children[1].children[5].children[1].children[1].attribs.value;			
								var responseRelayStateValue = dom[2].children[3].children[1].children[4].children[0].children[0].children[1].children[1].children[5].children[1].children[3].attribs.value;
								
								//post content is built for second call to wire-api
								var SAMLResponseData = querystring.stringify({SAMLResponse: SAMLResponseValue, RelayState: responseRelayStateValue});	
								//connection settings for second call to wire-api
								var post_options_proxy3 = {
									host: "proxy",
									port: 8080,
									path: WIRE_URL,
									method: "POST",
									Connection: 'keep-alive',
									headers: {
										'Host': parsedWireURL.host,
										'Content-Type': 'application/x-www-form-urlencoded',
										'Referer': "https://accounts.sap.com/saml2/idp/sso/accounts.sap.com;jsessionid="+number,
										"Cookie": wireCookie,
										'Content-Length': SAMLResponseData.length							
									}			
								};
								
								//second request to wire-api
								var request3 = http.request(post_options_proxy3, function (res) {
									var data = '';
									//extract the cookies that wire sends after successful login and concatenate it with one of the former cookies wire sent before the login
									var third_cookie = res.headers['set-cookie'][2].split(";")[0];
									var fourth_cookie = res.headers['set-cookie'][3].split(";")[0];
									var finalCookie = second_cookie + "; " + third_cookie + "; " + fourth_cookie;

									
									res.on('data', function (chunk) {
										//build the whole response
										data += chunk.toString();			
									});

									res.on('end', function () {	
										console.log(data);	
									});

									//this callback is used to start the bot (it conntects to wire with the final cookie)
									//console.log(finalCookie);
									callback(finalCookie);

									res.on('err', function (err) {
										console.log(err);
									});
								});
								
								//second request to wire after login
								request3.write(SAMLResponseData);
								request3.end();
							});
							
							// parser for the IDP-request					
							var parser2 = new htmlparser.Parser(handler2);
							parser2.parseComplete(data);
						});
						res.on('err', function (err) {
							console.log(err);
						});
					});
					
					//request to IDP
					request2.write(SAMLRequestData);
					request2.end();
				}
							
			});
			
			//parser for the first wire-request to login
			var parser = new htmlparser.Parser(handler);
			parser.parseComplete(data);
			
		});
		
		res.on('err', function (err) {
			console.log(err);
		});
	});
	
	//first request to wire before login
	request.end();
}

module.exports = authenticator;