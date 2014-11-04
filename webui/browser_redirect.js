/*eslint-disable no-undef */
if( !navigator.featuresAvailable() )
{
    location.href = "/browser_not_supported.html";
} else if(window.mobile()) {
    location.href = "/mobile";
}
/*eslint-enable no-undef */
