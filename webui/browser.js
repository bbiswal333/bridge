function addTest(nameOfTest)
{
    window.feature_check.push( {"name" : nameOfTest, "test" : Modernizr[nameOfTest] } );
}

navigator.featuresAvailable = function()
{    
    var all_features_available = true;
    addTest("cookies");
    addTest("opacity");
    addTest("borderradius");
    addTest("cors");
    addTest("fontface");
    addTest("svg");
    addTest("inlinesvg");
    addTest("cssanimations");
    addTest("csstransforms");
    addTest("cssgradients");
    addTest("geolocation");

    for (var i = 0; i < window.feature_check.length; i++)
    {
        if(!window.feature_check[i].test) all_features_available = false;
    }
    return all_features_available;
}

//run function once to initialize feature_check
navigator.featuresAvailable();

//compatibility fix for location.origin
if (!window.location.origin) 
{
    window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
}