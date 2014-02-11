	var clickstream = {
		pubToken: '4cf672f0-649e-4129-aed4-1b48d5491094',
		baseUrl: 'https://webanalytics.hana.ondemand.com/',
		bannerEnabled: false,
		loggingEnabled: true,
		visitorCookieDuration: 7776000000
	};
	
	(function(){
		var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
		g.type='text/javascript'; g.defer=true; g.async=true; g.src=clickstream.baseUrl+'js/privacy.js';
		s.parentNode.insertBefore(g,s);
	})();
