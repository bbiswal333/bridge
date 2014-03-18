navigator.featuresAvailable = function()
{
    var feature_check = [];
    var all_features_available = true;

    feature_check.push( Modernizr.cookies );
    feature_check.push( Modernizr.opacity );
    feature_check.push( Modernizr.borderradius );
    feature_check.push( Modernizr.cors );
    feature_check.push( Modernizr.fontface );
    feature_check.push( Modernizr.svg );
    feature_check.push( Modernizr.inlinesvg );
    feature_check.push( Modernizr.cssanimations );
    feature_check.push( Modernizr.csstransforms );
    feature_check.push( Modernizr.cssgradients );
    feature_check.push( Modernizr.geolocation ); 
    //feature_check.push( false ); - for manual testing ;-)

    for (var i = 0; i < feature_check.length; i++)
    {
        if(!feature_check[i]) all_features_available = false;
    }
    return all_features_available;
}

if( !navigator.featuresAvailable() )
{
    location.href="/browser_not_supported.html";
}

//compatibility fix for location.origin
if (!window.location.origin) 
{
    window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
}