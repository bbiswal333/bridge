module.exports = function(request, response)
{
	var originPattern = /^(https:\/\/)(bridge\.mo\.sap\.corp|bridge-master\.mo\.sap\.corp|localhost)(:\d+)?($|\/)/;
	if ( request.headers.origin !== undefined && originPattern.test(request.headers.origin))
	{
		response.setHeader('Access-Control-Allow-Origin', request.headers.origin);
		response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept' );
		response.setHeader('Access-Control-Allow-Credentials', 'true' );
		response.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS' );
	}    	
	return response;
};

