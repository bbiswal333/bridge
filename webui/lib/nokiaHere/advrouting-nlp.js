(function(){ovi.provide("nokia.maps.advrouting.CalculateRouteRequestMetaInfo");ovi.provide("nokia.maps.advrouting.CalculateRouteResponse");ovi.provide("nokia.maps.advrouting.GeoWaypointParameter");ovi.provide("nokia.maps.advrouting.GetRouteRequest");ovi.provide("nokia.maps.advrouting.GetRouteRequestMetaInfo");ovi.provide("nokia.maps.advrouting.GetRouteResponse");ovi.provide("nokia.maps.advrouting.LinkPosition");ovi.provide("nokia.maps.advrouting.Maneuver");ovi.provide("nokia.maps.advrouting.Mode");ovi.provide("nokia.maps.advrouting.TravelProgress");
ovi.provide("nokia.maps.advrouting.NavigationWaypointParameter");ovi.provide("nokia.maps.advrouting.Route");ovi.provide("nokia.maps.advrouting.RouteLink");ovi.provide("nokia.maps.advrouting.RouteNote");ovi.provide("nokia.maps.advrouting.RouteRepresentationOptions");ovi.provide("nokia.maps.advrouting.RouteResponseMetaInfo");ovi.provide("nokia.maps.advrouting.RouteSegment");ovi.provide("nokia.maps.advrouting.RouteSummary");ovi.provide("nokia.maps.advrouting.RouteSummaryByCountry");ovi.provide("nokia.maps.advrouting.RouteSummaryEntry");
ovi.provide("nokia.maps.advrouting.StreetPosition");ovi.provide("nokia.maps.advrouting.TrafficUpdater");nokia.maps.advrouting.TrafficUpdater=new ovi.Class({Extends:nokia.maps.util.OObject,pollInterval:0,startTrafficUpdates:function(){},stopTrafficUpdates:function(){}});ovi.provide("nokia.maps.advrouting.TruckProfile");ovi.provide("nokia.maps.advrouting.Waypoint");ovi.provide("nokia.maps.advrouting.WaypointParameter");ovi.provide("nokia.maps.advrouting.CalculateIsolineRequest");ovi.provide("nokia.maps.advrouting.CalculateIsolineRequestMetaInfo");
ovi.provide("nokia.maps.advrouting.CalculateIsolineResponse");ovi.provide("nokia.maps.advrouting.CalculateRouteRequest");nokia.maps.advrouting.CalculateRouteRequest=new ovi.Class({Extends:nokia.maps.util.OObject,waypoints:[],avoidArea:[],avoidLinks:[],arrival:0,departure:0,modes:[],representationOptions:null,metaInfo:null,truckProfile:null,metricSystem:null,setDestination:function(e){this.waypoints.push(e)},setStart:function(e){this.waypoints=[e].concat(this.waypoints)}});ovi.provide("nokia.maps.advrouting.NavigationState");
nokia.maps.advrouting.NavigationState=new ovi.Class({Extends:nokia.maps.util.OObject,NotStarted:!1,OnRoute:!1,OnCorridor:!1,OffRoute:!1,Arrived:!1});ovi.provide("nokia.maps.advrouting.NavigationController");(function(){var e=nokia.maps.util.u;nokia.maps.advrouting.NavigationController=new ovi.Class({Extends:nokia.maps.util.OObject,startNavigation:function(){},stopNavigation:e,getNavigationState:e,getTravelProgress:e,getCurrentPosition:e,currentLink:e,distanceToNextLink:e,nextManeuver:e,distanceToManeuver:e})})();
ovi.provide("nokia.maps.advrouting._packaging.package");ovi.provide("nokia.maps.advrouting.Manager");
(function(){function e(a){return a.latitude+","+a.longitude}function l(){var a="//route{serviceMode}.nlp.nokia.com/routing/6.2/".replace("{serviceMode}",b.serviceMode==="cit"?".st":"");k.setDefaultsNS(m,{baseUrl:"http:"+a,"secure.baseUrl":"https:"+a,"getroute.interface":"getroute.json","calculateroute.interface":"calculateroute.json","calculateisoline.interface":"calculateisoline.json"})}var h=nokia.maps,d=h.geo,c=h.util,g=c.services,b=c.getRootNameSpace("nokia.maps").Settings,f=d.Shape,r=d.BoundingBox,
a=d.Coordinate,q=h.net.Request,k=h.Config,m="advrouting",p=ovi.bind,z=Math.floor,s=["calculateroute","getroute","calculateisoline"];nokia.maps.advrouting.Manager=new ovi.Class({Extends:nokia.maps.routing.navteq.Manager,ea:0,ra:!1,getRouteResponse:null,calculateRouteResponse:null,calculateIsolineResponse:null,hk:0,Wq:0,ox:!1,initialize:function(a,c){b.authenticationToken||b.set("authenticationToken","");this.qp=b.appId||"jsapi";this.calculateRouteResponse=[];this.getRouteResponse={};this.ra=!1;this.fl=
{};this.addObserver("_isolineParsed",this.Hu);this.qa=new q(q.JSONP,{callbackKey:"jsoncallback",autoSkip:!0});this._super(a,c)},calculateRoute:function(a){var b=arguments;b.length===1&&a.waypoints&&a.waypoints.length>1?(this.ra=!1,b=g.addNlpParams((a.apiVersion ? g.getBaseURL(this.xa,m,s[0]).replace("6.2", a.apiVersion) : g.getBaseURL(this.xa,m,s[0]))+"jsonAttributes=1&"+this.Vd(a,s[0])),this.fl[++this.ea]=s[0],this.qa.send(b,p(this,this.Al),this.ea++),this.set("state","started")):(this.ra=!0,this._super(b[0],b[1]));this.sa=this.calculateRouteResponse=null},getRoute:function(a){a=
g.addNlpParams(g.getBaseURL(this.xa,m,s[1])+"jsonAttributes=1&responseattributes=maneuvers,links&"+this.Vd(a,s[1]));this.ra=!1;this.fl[++this.ea]=s[1];this.qa.send(a,p(this,this.Al),this.ea++);this.set("state","started");this.sa=this.getRouteResponse=null},calculateIsoline:function(a){a=g.addNlpParams(g.getBaseURL(this.xa,m,s[2])+"jsonAttributes=1&"+this.Vd(a,s[2]));this.ra=!1;this.fl[++this.ea]=s[2];this.Ow=a;this.qa.send(a,p(this,this.Al),this.ea++);this.set("state","started");this.sa=this.calculateIsolineResponse=
null},cancel:function(){this.qa.cancelAll();this.set("state","cancelled")},getIsolines:function(){return this.isolines},Vd:function(a,f){var d=[],k=a.waypoints,g=k?k.length:0,m,p="",q,r,h,l=0,I,L,N,G,M=[],$=[],F,Z=[],ba,J,V;a.mode=a.mode||a.modes[0];try{if(f==s[0])for(h=0;h<g;h++)q=k[h],(q.position||q.streetPositions||q.linkPositions)&&d.push("waypoint"+h+this.xm(q));f==s[0]&&(F=a.alternatives)&&d.push("alternatives="+F);if(a.avoidArea){for(h=0;h<a.avoidArea.length;h++)m=a.avoidArea[h],p+="!"+e(m.topLeft)+
";"+e(m.bottomRight);d.push("avoidareas="+p.substr(1))}if(F=a.avoidLinks){for(h=0;h<F.length;h++)F[h]=encodeURIComponent(F[h]);d.push("avoidlinks="+F.join(","))}(F=a.departure)&&d.push("departure="+encodeURIComponent(F));if(F=a.metaInfo)F.requestId&&d.push("requestid="+F.requestId),f==s[2]&&F.verboseMode&&d.push("verbosemode="+F.verboseMode);if(f!=s[2]&&a.representationOptions){I=a.representationOptions;(F=I.language)?d.push("language="+F):b.defaultLanguage&&d.push("language="+b.defaultLanguage);
(F=I.representationMode)&&d.push("representation="+F);(F=I.routeAttributes)?d.push("routeattributes="+F.join(",")+",shape"):d.push("routeattributes=shape");(F=I.legAttributes)&&d.push("legattributes="+F.join(","));(F=I.maneuverAttributes)&&d.push("maneuverattributes="+F.join(","));(F=I.linkAttributes)&&d.push("linkattributes="+F.join(","));if(I.corridorOptions&&(J=I.corridorOptions,(F=J.toleranceDuration)&&d.push("toleranceduration="+F),(F=J.toleranceDistance)&&d.push("tolerancedistance="+F),J.toleranceLevel&&
J.toleranceLevel.levelMajorNetwork))V=J.toleranceLevel,F=[levelMajorNetwork],V.levelMinorNetwork&&F.push(levelMinorNetwork),V.area&&(F.push(V.area),V.areaRadius&&F.push(V.areaRadius)),d.push("tolerancelevel="+F.join(","));(F=I.viewBounds)&&d.push("viewbounds="+e(F.bottomRight)+";"+e(F.topLeft));(F=I.viewResolution)&&d.push("resolution="+F);d.push("instructionformat="+(I.instructionFormat||"text"))}else d.push("routeattributes=shape"),b.defaultLanguage&&d.push("language="+b.defaultLanguage);if(a.publicTransportProfile)L=
a.publicTransportProfile,(F=L.maxNumberOfChanges)&&d.push("maxnumberofchanges="+F),(F=L.minDurationForChange)&&d.push("mindurationforchange="+F),(F=L.avoidTransportTypes)&&d.push("avoidtransporttypes="+F.join(","));a.navigationMode&&d.push("navigationMode="+a.navigationMode);if(a.truckProfile)N=a.truckProfile,d.push("hastrailer="+(N.hasTrailer||!1)),(F=N.shippedHazardousGoods)&&d.push("shippedhazardousgoods="+F.join(",")),(F=N.permittedGrossWeight)&&d.push("permittedgrossweight="+F),(F=N.limitedWeight)&&
d.push("limitedweight="+F),(F=N.weightPerAxle)&&d.push("weightperaxle="+F),(F=N.trailerWeight)&&d.push("trailerweight="+F),(F=N.height)&&d.push("height="+F),(F=N.width)&&d.push("width="+F),(F=N.length)&&d.push("length="+F);if(a.mode){G=a.mode;(F=G.type)&&M.push(F);(F=G.transportModes)&&M.push(F.join(","));M.push("traffic:"+(G.trafficMode===void 0?"enabled":G.trafficMode));if(G.features){for(l in G.features)G.features.hasOwnProperty(l)&&typeof G.features[l]!="function"&&$.push(l+":"+G.features[l]);
M.push($.join(","))}d.push("mode="+M.join(";"))}f==s[1]&&(F=a.routeId)&&d.push("routeid="+F);f==s[1]&&(F=a.currentPosition)&&(F.position||F.streetPositions||F.linkPositions)&&d.push("pos"+this.xm(F));f==s[2]&&(F=a.start)&&d.push("start"+this.xm(F));a.distances&&a.travelTimes&&c.db("travelTime and distance should not be input at the same time.");if(f==s[2]&&(F=a.distances)){ovi.type(F)!="array"&&(F=[F]);for(h=0;h<F.length;h++)F[h]<=0&&c.db("distance should be a positive value.");d.push("distance="+
F.join(","))}else if(f==s[2]&&(F=a.travelTimes)){ovi.type(F)!="array"&&(F=[F]);for(h=0;h<F.length;h++)F[h]<=0&&c.db("travelTime should be a positive value.");for(h=0;h<F.length;h++)ba=F[h],Z[h]="PT"+z(ba/3600)+"H"+z(ba/60)%60+"M"+ba%60+"S";d.push("time="+Z.join(","))}(r=a.metricSystem||this.metricSystem)&&(r==="imperial"||r==="metric")?d.push("metricSystem="+r):r&&c.db("Illegal metric system 'imperial' or 'metric' allowed.")}catch(H){c.d(H||"the argument in advrouting Request is illegal")}return d.join("&")},
xm:function(a){var b=streetPositionsURL=linkPositionsURL="",c,f;if(a.position)return"=geo!"+e(a.position)+(a.transitRadius===void 0?"":";"+a.transitRadius);if(a.streetPositions||a.linkPositions){b=a.displayPosition?e(a.displayPosition):"";if(a.streetPositions){for(f=0;f<a.streetPositions.length;f++)c=a.streetPositions[f],streetPositionsURL+="!"+e(c.position)+(c.streetName?";"+c.streetName:"");return"=street!"+b+streetPositionsURL}for(f=0;f<a.linkPositions.length;f++)c=a.linkPositions[f],linkPositionsURL+=
"!"+encodeURIComponent(c.linkId)+(c.spot||c.spot===0?","+c.spot+(c.sideOfStreet?","+c.sideOfStreet:""):"");return"=link!"+b+linkPositionsURL}},getErrorCause:function(){return this.state==="failed"?this.sa:null},Al:function(a,b,c){c=this.fl[a.id];this.searchResponse=this.zl(a,c)},zl:function(b,c){var f,d,k=b.response;if(b.timeout)this.sa=this.Mb({type:"SystemError",subtype:"Timeout",details:"request times out"}),this.set("state","failed");else if(b.error||b.timeout||k.error||k.type&&k.subtype){if(!b.error&&
!b.timeout)this.sa=this.Mb(k.error||k);this.set("state","failed")}else if(nokia.maps.routing.navteq.Manager.Yp(k),k=k.response,c===s[0]){f=k.route;k.routes=k.route;for(d=0;d<f.length;d++)this.ur(f[d]);this.calculateRouteResponse=k;this.routes=f}else if(c===s[1]){d=k.route;this.ur(d);if(k.progress)f=k.progress.mappedPosition,k.progress.mappedPosition=new a(f.latitude,f.longitude,void 0,!0);this.getRouteResponse=k;this.routes=[d]}else if(c===s[2]){f=k.isolines;for(d=0;d<f.length;d++)f[d].value?this.xv(f,
d):f[d]=null;this.calculateIsolineResponse=k;this.isolines=f;this.hk||this.set("_isolineParsed",!0)}},xv:function(a,b){var c=this,d=a[b].value;c.hk++;f.fromLatLngArray(d.join(",").split(","),!0,function(f){a[b]=f;c.hk==++c.Wq&&c.set("_isolineParsed",!0)})},Hu:function(a,b,c){if(c)a.set("state","finished"),a.set("_isolineParsed",!1),a.hk=0,a.Wq=0},ur:function(b){var c,f,d,k,g,m=!0;if(b.waypoints)for(c=0;c<b.waypoints.length;c++)this.Ue(b.waypoints[c]);b.shape&&(m=!1,this.gi(b));if(b.boundingBox)b.boundingBox=
r.coverAll([new a(b.boundingBox.topLeft.latitude,b.boundingBox.topLeft.longitude,void 0,!0),new a(b.boundingBox.bottomRight.latitude,b.boundingBox.bottomRight.longitude,void 0,!0)]);this.Gl(b);if(b.legs){k={};g={};for(c=0;c<b.legs.length;c++){this.Ue(b.legs[c].start);this.Ue(b.legs[c].end);if(b.legs[c].maneuvers)for(f=0;f<b.legs[c].maneuvers.length;f++)k[b.legs[c].maneuvers[f].id]=b.legs[c].maneuvers[f];if(b.legs[c].links)for(f=0;f<b.legs[c].links.length;f++)g[b.legs[c].links[f].linkId]=b.legs[c].links[f]}for(d in k){if(k[d].position)k[d].position=
new a(k[d].position.latitude,k[d].position.longitude,void 0,!0);k[d].shape&&this.gi(k[d]);if(k[d].nextManeuver)k[d].nextManeuver=k[k[d].nextManeuver];if(k[d].fromLink)k[d].fromLink=g[k[d].fromLink];if(k[d].toLink)k[d].toLink=g[k[d].toLink]}for(d in g){g[d].shape&&this.gi(g[d]);if(g[d].maneuver)g[d].maneuver=k[g[d].maneuver];if(g[d].nextLink)g[d].nextLink=g[g[d].nextLink]}}if(m)this.sa={type:"ServiceError",subtype:"InvalidInputData",message:"Shape does not exist in response, it should be requested!"},
this.set("state","failed")},Mb:function(a){var b=a.details;a.additionalData&&a.additionalData.length&&(b+=" Key: "+a.additionalData[0].key+", Value: "+a.additionalData[0].value);return{type:a.type.charAt(0).toLowerCase()+a.type.substr(1),subtype:a.subtype.charAt(0).toLowerCase()+a.subtype.substr(1),message:b}},Gl:function(a){a.getStart=function(){return a.waypoints[0]};a.getDestination=function(){return a.waypoints[a.waypoints.length-1]};a.getManeuvers=function(){var b=[],c;for(c=0;c<a.legs.length;c++)b=
b.concat(a.legs[c].maneuvers);return b};a.getLinks=function(){var b=[],c;for(c=0;c<a.legs.length;c++)b=b.concat(a.legs[c].links);return b}},Ue:function(b){b.mappedPosition=new a(b.mappedPosition.latitude,b.mappedPosition.longitude,void 0,!0);b.originalPosition&&(b.originalPosition=new a(b.originalPosition.latitude,b.originalPosition.longitude,void 0,!0))}});l();b.addObserver("serviceMode",l)})();ovi.provide("nokia.maps.advrouting._packaging.package-nlp");})();
