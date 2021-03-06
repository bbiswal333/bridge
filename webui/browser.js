function addTest(nameOfTest)
{
/*eslint-disable no-undef */
    window.feature_check.push( {"name" : nameOfTest, "test" : Modernizr[nameOfTest] } );
}

navigator.featuresAvailable = function () {
/*eslint-enable no-undef */
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
    //addTest("geolocation");
    //addTest("localstorage");

/*eslint-disable no-undef */
    for (var i = 0; i < window.feature_check.length; i++) {
        if (!window.feature_check[i].test) {

            all_features_available = false;
        }
    }
    return all_features_available;
};

window.mobile = function() {
    var platform = navigator.platform;

    switch(platform) {
         case 'iPod':
         case 'iPad':
         case 'iPhone':
         case 'Pike v7.6 release 92':
         case 'Pike v7.8 release 517':
         case 'Android':
             return true;
         default:
             return false;
    }
};

if (!window.feature_check) {
    window.feature_check = [];
}
navigator.featuresAvailable();

//set client information
window.client = {};
window.client.protocol = 'https:';
window.client.hostname = "localhost";
window.client.port = 1972;

//set location and client origins
if (!window.location.origin)
{
    window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
}
if (!window.client.origin)
{
    window.client.origin = window.client.protocol + "//" + window.client.hostname + (window.client.port ? ':' + window.client.port : '');
}
/*eslint-enable no-undef */
