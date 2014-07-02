var _paq = _paq || []; 
(function(){ var u=(("https:" == document.location.protocol) ? "https://tracking.mo.sap.corp/piwik/" : "http://tracking.mo.sap.corp/piwik/");

if( document.location.hostname == "localhost" || document.location.hostname == "bridge-master.mo.sap.corp")
{
  _paq.push(['setSiteId', 9]);
}
if( document.location.hostname == "bridge.mo.sap.corp")
{
  _paq.push(['setSiteId', 8]); 
}
_paq.push(['setTrackerUrl', u+'piwik.php']);
_paq.push(['trackPageView']);
_paq.push(['enableLinkTracking']);
var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0]; g.type='text/javascript'; g.defer=true; g.async=true; g.src=u+'piwik.js';
s.parentNode.insertBefore(g,s); })();
