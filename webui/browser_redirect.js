/*eslint-disable no-undef */
if( !navigator.featuresAvailable() )
{
    location.href = "/browser_not_supported.html";
} else {
    switch(window.device) {
        case 0:
            location.href = "/index_smartphone.html";
            break;
        case 1:
            location.href = "/index_tablet.html";
            break;
        case 2:
            break;
    }
}
/*eslint-enable no-undef */
