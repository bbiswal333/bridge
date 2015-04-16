var swa = {
	pubToken: '',
	baseUrl: 'https://poc.warp.sap.com/tracker/',
	visitorCookieDuration: 7776000000,
	dntLevel: 1,
	bannerEnabled: false
};

/*eslint-disable no-undef */
if( document.location.hostname === "localhost" || document.location.hostname === "bridge-master.mo.sap.corp"){
	swa.pubToken = '3b086d85-047d-4532-b6ed-d2957722d900';
} else if( document.location.hostname === "bridge.mo.sap.corp"){
/*eslint-enable no-undef */
	swa.pubToken = 'c2b7d999-bf31-43d9-9259-68190a2b9135';
}

(function(){
/*eslint-disable no-undef */
	var d = document;
/*eslint-enable no-undef */
	var g = d.createElement('script');
	var s = d.getElementsByTagName('script')[0];
	g.type = 'text/javascript'; g.defer = true; g.async = true; g.src = swa.baseUrl + 'js/privacy.js';
	s.parentNode.insertBefore(g,s);
})();
