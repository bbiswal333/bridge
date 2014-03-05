exports.get = function(parameter_name, parameter_default)
{
	var parameter_identifier = '-' + parameter_name;
	var parameter_value = parameter_default;

	for (var i = 0; i < process.argv.length; i++) 
	{
		if( i % 2 == 0)
		{
			if( process.argv[i] == parameter_identifier )
			{
				parameter_value = process.argv[i+1];
				if(parameter_value == "true") parameter_value = true;
				if(parameter_value == "false") parameter_value = false;
 			}		
		}
	}
	console.log(parameter_name + ': ' + parameter_value);
	return parameter_value;
}