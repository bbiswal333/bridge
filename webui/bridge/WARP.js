var swa = {
	pubToken: '50e17cae-3311-4e74-96a1-4cef7e294256',
	baseUrl: 'https://ie.warp.sap.com/tracker/',
	visitorCookieDuration: 7889232,
	dntLevel: 1,
	bannerEnabled: false
};

/*eslint-disable no-undef */
if( document.location.hostname === "bridge-master.mo.sap.corp"){
	swa.pubToken = '652c6eea-e4b4-4347-bc62-3854953443e6';
}

(function(){
	var d = document;
/*eslint-enable no-undef */
	var g = d.createElement('script');
	var s = d.getElementsByTagName('script')[0];
	g.type = 'text/javascript';
	g.defer = true;
	g.async = true;
	g.src = swa.baseUrl + 'js/privacy.js';
	s.parentNode.insertBefore(g,s);

})();
