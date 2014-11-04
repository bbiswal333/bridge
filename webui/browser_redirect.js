/*eslint-disable no-undef */
if( !navigator.featuresAvailable() )
{
    location.href = "/browser_not_supported.html";
} else {
    switch(window.device) {
        case 0:
        case 1:
            // location.href = "/mobile";
            break;
        case 2:
            break;
    }
}
/*eslint-enable no-undef */
