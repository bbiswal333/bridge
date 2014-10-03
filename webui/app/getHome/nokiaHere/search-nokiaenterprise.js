(function(){ovi.provide("nokia.maps.search.component.GeocodeComponent");
(function(e){var l=e.search,h=e.util.u;l.component.GeocodeComponent=new ovi.Class({Extends:e.map.component.Component,c:"Geocode",n:"0.0.0.1",initialize:function(d){this.Wa=d||new l.Manager;this.Wa.addObserver("state",this.gv,this)},attach:function(d){this._super(d)},detach:function(d){this._super(d)},geocode:function(d){this.gx=!0;this.Wa.geocode(d)},gv:function(){},showMapMarkers:function(){this.nd=(new nokia.maps.search.component.SearchResultSet(this.Wa.locations)).container;this.mapDisplay.objects.add(this.nd);
this.mapDisplay.zoomTo(this.nd.getBoundingBox());this.Wa.clear()},clearMapMarkers:function(){this.nd&&this.mapDisplay.objects.remove(this.nd)},prevPage:h,nextPage:h})})(nokia.maps);ovi.provide("nokia.maps.search.component.SearchComponent");
(function(e){var l=e.search,h=e.util.u;l.component.SearchComponent=new ovi.Class({Extends:e.map.component.Component,c:"Search",n:"0.0.0.1",initialize:function(d){this.Wa=d||new l.Manager;this.Wa.addObserver("state",this.nv,this)},attach:function(d){this._super(d)},detach:function(d){this._super(d)},search:function(d){this.cw=!0;this.Wa.search(d)},nv:function(){},showMapMarkers:function(){this.nd=(new l.component.SearchResultSet(this.Wa.locations)).container;this.mapDisplay.objects.add(this.nd);this.mapDisplay.zoomTo(this.nd.getBoundingBox());
this.Wa.clear()},clearMapMarkers:function(){this.nd&&this.mapDisplay.objects.remove(this.nd)},cw:!1,prevPage:h,nextPage:h})})(nokia.maps);ovi.provide("nokia.maps.search.component.SearchResultSet");
(function(e){var l=e.map;e.search.component.SearchResultSet=new ovi.Class({initialize:function(h){for(var d,c=0,g=h?h.length:0,b,f=this.container=new l.Container;c<g;c++)d=h[c],coord=new e.geo.Coordinate(+d.displayPosition.latitude,+d.displayPosition.longitude),b=new l.StandardMarker(coord,{text:""+(c+1)}),b.set("$locationData",d),f.objects.add(b)},container:null})})(nokia.maps);ovi.provide("nokia.maps.search.Address");ovi.provide("nokia.maps.search.Location");ovi.provide("nokia.maps.search.LocationFilter");
ovi.provide("nokia.maps.search.Place");ovi.provide("nokia.maps.search.ServiceError");ovi.provide("nokia.maps.search._packaging.package");ovi.provide("nokia.maps.search.Manager");(function(e){if(!e.util.getConstructor(e.search.Manager))var l=e.search.Manager=new ovi.Class({Extends:e.util.OObject,initialize:function(h,d){var c=h||{};this.xa=d||new e.Config;if(this.constructor===l)return new l.Hb(c);this._super(c)},Statics:{setDefImpl:function(e){return this.Hb?!0:(this.Hb=e)&&!1}}})})(nokia.maps);ovi.provide("nokia.maps.search.navteq.Manager");
(function(e){function l(){var a=c.serviceMode,b={},d;for(d in p)p.hasOwnProperty(d)&&(b[d]=p[d].replace("{serviceMode}",a?"."+a:""));r.setDefaultsNS(k,h.flatMerge({"geocode.interface":"geocode.json","reversegeocode.interface":"reversegeocode.json","placesearch.interface":"placesearch.json","search.interface":"search.json"},b))}var h=e.util,d=encodeURIComponent,c=h.getRootNameSpace("nokia.maps").Settings,g=e.geo,b=g.Coordinate,f=g.BoundingBox,r=e.Config,a=h.services,q=e.net.Request,k="search",m=h.d,
p;p={baseUrl:"http://{service}{serviceMode}.api.here.com/6.2/","china.baseUrl":"http://{service}{serviceMode}.api.heremaps.cn/6.2/","secure.baseUrl":"https://{service}{serviceMode}.api.here.com/6.2/","china.secure.baseUrl":"https://{service}{serviceMode}.api.heremaps.cn/6.2/"};var z={locationid:1,country:1,state:1,county:1,city:1,district:1,street:1,housenumber:1,postalcode:1},e=nokia.maps.search.navteq.Manager=new ovi.Class({Extends:nokia.maps.search.Manager,gen:3,locations:[],places:[],state:"initial",
Of:null,Yf:null,Tr:null,Ja:!1,initialize:function(a,b){this.qa=new q(q.JSONP,{callbackKey:"jsoncallback"});this.maxResults=20;this._super(a,b)},geocode:function(b,e){var f,g=!1,h=a.getBaseURL(this.xa,k,"geocode",!0).replace("{service}","geocoder");(this.maxResults||this.maxResults===0)&&(h+="maxresults="+this.maxResults+"&");if(ovi.type(b)=="string")h+="searchtext="+d(b)+"&",g=!0;else if(ovi.type(b)=="object")for(f in b)ovi.type(f)=="string"&&z[f.toLowerCase()]&&(g=!0,f.toLowerCase()=="street"&&ovi.type(b[f])==
"array"?b[f].length===1?h+=f.toLowerCase()+"="+d(b[f][0])+"&":b[f].length===2&&(h+="street0="+d(b[f][0])+"&street1="+d(b[f][1])+"&"):h+=f.toLowerCase()+"="+d(b[f])+"&");g||m("No valid searchtext or location filter submitted!");e&&(h+=this.Ej(e));c.defaultLanguage&&(h+="languages="+c.defaultLanguage+"&");h+="gen="+this.gen+"&";h+="jsonAttributes=1";h=a.addNlpParams(h,!0);this.qa.send(h,ovi.bind(this,this.ym));this.ae(0);this.set("state","started")},reverseGeocode:function(b){var d=b.latitude,b=b.longitude,
e=a.getBaseURL(this.xa,k,"reversegeocode",!0).replace("{service}","reverse.geocoder");(d===void 0||b===void 0)&&m("the argument in reverse geocode request is illegal");(this.maxResults||this.maxResults===0)&&(e+="maxresults="+this.maxResults+"&");e+="prox="+d+","+b+",100&mode=RetrieveAddresses&";e+="gen="+this.gen+"&";c.defaultLanguage&&(e+="languages="+c.defaultLanguage+"&");e+="jsonAttributes=1";e=a.addNlpParams(e,!0);this.qa.send(e,ovi.bind(this,this.ym));this.ae(1);this.set("state","started")},
placeSearch:function(){var b=arguments,d,e=a.getBaseURL(this.xa,k,"placesearch",!0).replace("{service}","geocoder");(this.maxResults||this.maxResults===0)&&(e+="maxresults="+this.maxResults+"&");b.length==2?(ovi.type(b[0])=="array"?e+="categoryids="+b[0].join(";")+"&":d='"categories"',ovi.type(b[1])=="object"?e+=this.Ej(b[1]):d='"spatialFilter"'):b.length==3?(ovi.type(b[0])=="string"?e+="name="+b[0]+"&":d='"searchText"',ovi.type(b[1])=="array"?e+="categoryids="+b[1].join(";")+"&":d='"categories"',
ovi.type(b[2])=="object"?e+=this.Ej(b[2]):d='"spatialFilter"'):d="number";d&&m("the argument "+d+" in placesearch Request is illegal");e+="placescore=3&";c.defaultLanguage&&(e+="languages="+c.defaultLanguage+"&");e+="jsonAttributes=1";e=a.addNlpParams(e,!0);this.qa.send(e,ovi.bind(this,this.ho));this.ae(3);this.set("state","started")},search:function(b,e){var f,g=a.getBaseURL(this.xa,k,"search",!0).replace("{service}","geocoder");(this.maxResults||this.maxResults===0)&&(g+="maxresults="+this.maxResults+
"&");ovi.type(b)=="string"&&(f=e,e=b,b=f);ovi.type(e)=="string"?(g+="searchtext="+d(e)+"&",b&&(g+=this.Ej(b))):m('the argument in "searchText" search Request is illegal');c.defaultLanguage&&(g+="languages="+c.defaultLanguage+"&");g+="jsonAttributes=1";g=a.addNlpParams(g,!0);this.qa.send(g,ovi.bind(this,this.ho));this.ae(4);this.set("state","started")},Ej:function(a){var b="";if(a.center)b+="prox="+a.center.latitude+","+a.center.longitude+(a.radius||a.radius===0?","+a.radius:"")+"&";else if(a.bottomRight&&
a.topLeft)b+="bbox="+a.topLeft.latitude+","+a.topLeft.longitude+";"+a.bottomRight.latitude+","+a.bottomRight.longitude+"&";else if(a.line){var c=[],d,e=a.line;for(d=0;d<e.length;d++)coord=e[d],c.push(coord[0]+","+coord[1]);b+="corridor="+c.join(";")+";"+a.width+"&"}else m("the argument in spatial filter is illegal");return b},getPlaces:function(){return this.places},getLocations:function(){return this.locations},ym:function(a){a.timeout?(this.sa=this.Mb({type:"SystemError",subtype:"Timeout",details:"request times out"}),
this.set("state","failed")):(this.au(a.response),this.set("state",this.Ja?"failed":"finished"))},au:function(a){try{if(a.error)this.Ja=!0,this.sa=this.Mb(a.error);else{var b,c,d,e,f,g,k,h,l=[];b=a.response;if(b.metaInfo)d=b.metaInfo,this.Of=d.nextPageInformation,this.Yf=d.previousPageInformation;if(b.view){c=b.view;for(f=0;f<c.length;f++){e=c[f];g=e.result;for(k=0;k<g.length;k++)h=g[k],h.location&&l.push(this.Po(h.location))}}this.locations=l}}catch(m){this.Ja=!0}},ho:function(a){a.timeout?(this.sa=
this.Mb({type:"SystemError",subtype:"Timeout",details:"request times out"}),this.set("state","failed")):(this.dw(a.response),this.set("state",this.Ja?"failed":"finished"))},Po:function(a){var c={},d,e;a.displayPosition&&(c.displayPosition=new b(a.displayPosition.latitude,a.displayPosition.longitude,a.displayPosition.altitude,!0));if(a.navigationPosition)d=a.navigationPosition[0],c.navigationPosition=new b(d.latitude,d.longitude,d.altitude,!0);else if(c.displayPosition)c.navigationPosition=c.displayPosition;
if(a.mapView)e=a.mapView,d=new b(e.bottomRight.latitude,e.bottomRight.longitude,e.bottomRight.altitude,!0),e=new b(e.topLeft.latitude,e.topLeft.longitude,e.topLeft.altitude,!0),c.mapView=new f(e,d);a.label&&(c.label=a.label);if(a=a.address)c.address={label:a.label||"",country:a.country||"",state:a.state||"",county:a.county||"",city:a.city||"",district:a.district||"",street:a.street||"",houseNumber:a.houseNumber||"",postalCode:a.postalCode||""};return c},dw:function(a){try{if(a.error)this.Ja=!0,this.sa=
this.Mb(a.error);else{var b,c,d,e,f,g,k,h,l,m,q,p,r,z,G,M,$,F,Z,ba,J,V,H,P,za=[],T=[],pa,fa,K,da;b=a.response;if(b.metaInfo)d=b.metaInfo,this.Of=d.nextPageInformation,this.Yf=d.previousPageInformation;if(b.view){c=b.view;for(f=0;f<c.length;f++){e=c[f];g=e.result;for(k=0;k<g.length;k++)if(h=g[k],h.location||h.place)if(h.place){l=h.place;m={};m.name=l.name||"";if(l.contact){pa=l.contact;for(K=0;K<pa.length;K++)fa=pa[K],da=fa.type,da=da.substring(0,1).toUpperCase()+da.substring(1),m["primary"+da]||(m["primary"+
da]=fa.value)}if(l.category){q=l.category;z=[];for(p=0;p<q.length;p++)r=q[p],r.categoryId&&(G=r.categoryId),r.categorySystemId&&(M=r.categorySystemId),z.push({categoryId:G,categorySystemId:M});m.categories=z}if(l.suppliers){ba=l.suppliers;H=[];for(J=0;J<ba.length;J++)V=ba[J],V.supplierId&&(P=V.supplierId),H.push({supplierId:P});m.suppliers=H}m.locations=[];if(Z=l.locations)for($=0;$<Z.length;$++)F=Z[$],clientLocation=this.Po(F),m.locations.push(clientLocation),T.push(clientLocation);za.push(m)}else T.push(this.Po(h.location))}}this.locations=
T;this.places=za}}catch(W){this.Ja=!0}},requestTypeSuggestions:function(){},requestTypeSuggestions:function(){},ae:function(a){this.Ja=!1;this.sa=null;this.Tr=a;this.Yf=this.Of=null},nextPage:function(){this.rr(!0)},previousPage:function(){this.rr(!1)},rr:function(b){if(!this.Of||!this.Yf){var c=a.getBaseURL(this.xa,k,"aggregation"),d=this.config;c+="app_id="+this.qp+"&";switch(this.Tr){case 0:c+=d.get(k+".geocode.interface")+"?";case 1:c+=d.get(k+".reversegeocode.interface")+"?";case 2:c+="maxresults="+
this.maxResults+"&pageinformation="+b?this.Of:this.Yf;this.qa.send(c,ovi.bind(this,this.ym));break;case 3:c+=d.get(k+".placesearch.interface")+"?";case 4:c+=d.get(k+".search.interface")+"?";case 5:c+="maxresults="+this.maxResults+"&pageinformation="+ +b?this.Of:this.Yf,this.qa.send(c,ovi.bind(this,this.ho))}this.set("state","started")}},Mb:function(a){var b=a.details;a.additionalData&&(b+=" Key: "+a.additionalData[0].key+", Value: "+a.additionalData[0].value);return{type:a.type.charAt(0).toLowerCase()+
a.type.substr(1),subtype:a.subtype.charAt(0).toLowerCase()+a.subtype.substr(1),message:b}},getErrorCause:function(){return this.state=="failed"?this.sa:null},clear:function(){this.places=[];this.locations=[];this.sa=null;this.Ja=!1;this.set("state","cleared")}});nokia.maps.search.Manager.setDefImpl(e);c.addObserver("serviceMode",l);l()})(nokia.maps);ovi.provide("nokia.maps.search._packaging.package-nokiaenterprise");})();
