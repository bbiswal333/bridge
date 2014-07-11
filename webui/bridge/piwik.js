var _paq = _paq || []; 
(function () {
    var destination = ((document.location.protocol === "https:") ? "https://tracking.mo.sap.corp/piwik/" : "http://tracking.mo.sap.corp/piwik/");

    if( document.location.hostname === "localhost" || document.location.hostname === "bridge-master.mo.sap.corp"){
      _paq.push(['setSiteId', 9]);
    }

    if( document.location.hostname === "bridge.mo.sap.corp"){
      _paq.push(['setSiteId', 8]); 
    }

    _paq.push(['setTrackerUrl', destination + 'piwik.php']);
    _paq.push(['trackPageView']);
    _paq.push(['enableLinkTracking']);

    var piwikScript = document.createElement('script'),
        firstScript = document.getElementsByTagName('script')[0];

    piwikScript.type = 'text/javascript';
    piwikScript.defer = true;
    piwikScript.async = true;
    piwikScript.src = destination + 'piwik.js';

    firstScript.parentNode.insertBefore(piwikScript, firstScript);
})();
