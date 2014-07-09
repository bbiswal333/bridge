angular.module('app.weather').service("app.weather.configservice", function () 
{

	this.configItem = 
	{
		fahrenheit : false,
		location:
		{
			name: "Walldorf",
			latitude: 49.293351,
			longitude: 8.641992
		}
	};
});