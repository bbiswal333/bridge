navigator.featuresAvailable = function()
{
    var feature_check = [];

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

    return feature_check.every(Boolean);    
}

if( !navigator.featuresAvailable() )
{
    location.href="/browser_not_supported.html";
}
