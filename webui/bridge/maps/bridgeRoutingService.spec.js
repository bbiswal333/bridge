describe("bridge map service", function() {
	var ROUTES_RESPONSE = {"response":{"metaInfo":{"timestamp":"2015-01-08T10:11:30Z","mapVersion":"8.30.56.155","moduleVersion":"7.2.52.0_CD-1094_1","interfaceVersion":"2.6.6"},"route":[{"routeId":"AHsACAAAAB4AAAA4AAAAmwAAAJYAAAB42mOYxsDAxMQABCxWqm0rpvAmM0BB50MDsfe89jYM//9DBD7sZ0ACXEC8WjU4i4mh0tGwratYGa6xR9FIzIHB3hKPxvQlWvqMQIvhgtkTHwX7AOkjAUwcDoZAxzAAABpKGWw6gHSP","mode":{"type":"fastest","transportModes":["car"],"trafficMode":"disabled","feature":[]}},{"routeId":"AH4ACAAAAB4AAAA4AAAAmwAAAJoAAAB42mOYxcDAxMQABCxWqm0rpvAmM0BB50MDsfe89jYM//9DBD7sZ0ACXEC8WjU4i4mh0tGwratYGa6xR9FIzIHB3hKPxvQlWvqMQIvhglfVF5/OBNJHAg4BxVkEExiYGhgYAJGbGwGVelwR","mode":{"type":"fastest","transportModes":["car"],"trafficMode":"disabled","feature":[]}},{"routeId":"AH4ACAAAAB4AAAA4AAAAmwAAAJoAAAB42mOYxcDAxMQABCxWqm0rpvAmM0BB50MDsfe89jYM//9DBD7sZ0ACXEC8WjU4i4mh0tGwratYGa6xR9FIzIHB3hKPxvQlWvqMQIvhgtc9iz8UAOkjAYeA4hwMDhLMDA4MAJJzGs0Ftw8p","mode":{"type":"fastest","transportModes":["car"],"trafficMode":"disabled","feature":[]}}],"language":"en-us"}};
	var ROUTES_RESPONSE_ONE_ROUTE_NOT_EXISTING = {"response":{"metaInfo":{"timestamp":"2015-01-08T10:11:30Z","mapVersion":"8.30.56.155","moduleVersion":"7.2.52.0_CD-1094_1","interfaceVersion":"2.6.6"},"route":[{"routeId":"NotExisting","mode":{"type":"fastest","transportModes":["car"],"trafficMode":"disabled","feature":[]}},{"routeId":"AH4ACAAAAB4AAAA4AAAAmwAAAJoAAAB42mOYxcDAxMQABCxWqm0rpvAmM0BB50MDsfe89jYM//9DBD7sZ0ACXEC8WjU4i4mh0tGwratYGa6xR9FIzIHB3hKPxvQlWvqMQIvhglfVF5/OBNJHAg4BxVkEExiYGhgYAJGbGwGVelwR","mode":{"type":"fastest","transportModes":["car"],"trafficMode":"disabled","feature":[]}},{"routeId":"AH4ACAAAAB4AAAA4AAAAmwAAAJoAAAB42mOYxcDAxMQABCxWqm0rpvAmM0BB50MDsfe89jYM//9DBD7sZ0ACXEC8WjU4i4mh0tGwratYGa6xR9FIzIHB3hKPxvQlWvqMQIvhgtc9iz8UAOkjAYeA4hwMDhLMDA4MAJJzGs0Ftw8p","mode":{"type":"fastest","transportModes":["car"],"trafficMode":"disabled","feature":[]}}],"language":"en-us"}};
	var ROUTE_RESPONSE = {"response":{"metaInfo":{"timestamp":"2015-01-08T09:14:43Z","mapVersion":"8.30.56.155","moduleVersion":"7.2.52.0_CD-1094_1","interfaceVersion":"2.6.6"},"route":{"routeId":"AHsACAAAAB4AAAA4AAAAmwAAAJYAAAB42mOYxsDAxMQABCxWqm0rpvAmM0BB50MDsfe89jYM//9DBD7sZ0ACXEC8WjU4i4mh0tGwratYGa6xR9FIzIHB3hKPxvQlWvqMQIvhgtkTHwX7AOkjAUwcDoZAxzAAABpKGWw6gHSP","waypoint":[{"linkId":"+1599025847254060527","mappedPosition":{"latitude":49.2931652,"longitude":8.6422384},"originalPosition":{"latitude":49.2933509,"longitude":8.641992},"type":"stopOver","spot":0.0,"sideOfStreet":"left","mappedRoadName":"Dietmar-Hopp-Allee","label":"Dietmar-Hopp-Allee","shapeIndex":0},{"linkId":"-1599377703809515584","mappedPosition":{"latitude":49.4134889,"longitude":8.7080697},"originalPosition":{"latitude":49.4134899,"longitude":8.7080699},"type":"stopOver","spot":0.4927536,"sideOfStreet":"neither","mappedRoadName":"Neckarstaden","label":"Neckarstaden - B37","shapeIndex":181}],"mode":{"type":"fastest","transportModes":["car"],"trafficMode":"enabled","feature":[]},"shape":["49.2931652,8.6422384","49.2938519,8.6432683","49.295032,8.6449206","49.2960083,8.6463583","49.2961693,8.6465514","49.2963409,8.6467016","49.2965126,8.6467552","49.2967701,8.6467767","49.2968774,8.6467767","49.2968345,8.6457467","49.2967916,8.6452746","49.296577,8.6435366","49.296416,8.641938","49.2963946,8.6409187","49.296459,8.6399961","49.2965662,8.6392343","49.2967165,8.6384618","49.2968452,8.6379683","49.2969954,8.6374748","49.2974997,8.636198","49.2978752,8.6354148","49.2983902,8.6344385","49.2991626,8.6331725","49.2996883,8.6321855","49.2999029,8.6317348","49.300096,8.6312735","49.3005681,8.6300611","49.3005896,8.6299968","49.3008578,8.6301684","49.3010294,8.6302543","49.301126,8.6302757","49.3013191,8.6302865","49.3015337,8.6302328","49.3020165,8.6299324","49.302156,8.6298895","49.3023169,8.629868","49.3025422,8.6298788","49.3025851,8.6297178","49.3026066,8.629514","49.302671,8.6280227","49.3027139,8.6275935","49.3027782,8.627454","49.3028533,8.6273575","49.3030357,8.6272824","49.3034434,8.627218","49.3062973,8.6278939","49.3070805,8.6280656","49.3076062,8.6282051","49.3081534,8.6283231","49.3087542,8.628484","49.3099988,8.6287737","49.3109965,8.6289775","49.312005,8.6291707","49.3124986,8.629235","49.3137324,8.6293852","49.3151271,8.6295033","49.3178952,8.6296535","49.3195367,8.6297178","49.3216825,8.6298251","49.3261671,8.6300826","49.3286133,8.6302006","49.335587,8.6305869","49.345125,8.6310697","49.349277,8.6313057","49.3508434,8.6313701","49.3526351,8.6314881","49.3633211,8.632046","49.3671191,8.6322606","49.3701982,8.6324108","49.3705201,8.632443","49.3729234,8.632561","49.3733525,8.6325932","49.3739963,8.632679","49.3748546,8.6328506","49.375509,8.6330116","49.3765175,8.6333764","49.3771935,8.6336446","49.377408,8.6337626","49.3775904,8.6338377","49.3780196,8.6340523","49.3797898,8.6350501","49.3803048,8.6353612","49.382633,8.6367023","49.384017,8.6374748","49.3847144,8.6378181","49.3858731,8.6382687","49.3865061,8.6384833","49.3870318,8.6386228","49.387933,8.6388052","49.3884265,8.6388803","49.3889952,8.6389446","49.3894351,8.6389661","49.3901646,8.6389661","49.3909049,8.6389339","49.4022346,8.637464","49.4047558,8.6371207","49.4058931,8.6369491","49.4063973,8.636831","49.4073951,8.6365414","49.4088221,8.6360049","49.4107747,8.635211","49.4110429,8.6351037","49.4113219,8.635093","49.4116759,8.634975","49.4125021,8.6347711","49.4133496,8.6345994","49.4137681,8.6345994","49.4143903,8.6345565","49.4147336,8.6345994","49.4148517,8.6346316","49.4150448,8.6347175","49.4152057,8.6348248","49.4153666,8.634975","49.4156241,8.6353612","49.4157314,8.635565","49.4158065,8.6358225","49.4158709,8.6360693","49.4159138,8.6363161","49.4159353,8.6366165","49.4159245,8.6368954","49.415828,8.6374319","49.4156349,8.6381078","49.4155061,8.638376","49.4152164,8.6392343","49.4150984,8.639642","49.4150341,8.6400497","49.4146156,8.6412621","49.4142401,8.6425495","49.4138753,8.6438799","49.4116652,8.652302","49.4097447,8.6594796","49.4089293,8.662709","49.4087684,8.6632454","49.4084895,8.6644149","49.4083285,8.6653054","49.4081247,8.6670434","49.4081247,8.6674297","49.4080818,8.6686742","49.4080603,8.6689854","49.4080925,8.6691463","49.4081247,8.6692321","49.4083607,8.6694145","49.4089615,8.6697149","49.4091654,8.6697578","49.4090688,8.6703479","49.408865,8.6719036","49.4088435,8.6725473","49.4088328,8.6741567","49.408865,8.6744356","49.4089293,8.674736","49.4090152,8.6748862","49.409101,8.6750257","49.4094551,8.6754656","49.4095409,8.6756051","49.4096696,8.6759377","49.4097447,8.6763668","49.4097662,8.6784053","49.4100022,8.6826646","49.4100022,8.6829758","49.4099057,8.6841452","49.4099057,8.6844993","49.4099271,8.6848962","49.4101524,8.6862266","49.4108713,8.6899388","49.4109786,8.6904001","49.4110858,8.6907434","49.4111824,8.6909902","49.4114506,8.6918592","49.4115579,8.6924279","49.4117939,8.6944771","49.4121909,8.697331","49.4122016,8.6978352","49.4122553,8.6987364","49.4122982,8.6989832","49.412384,8.6992407","49.4123948,8.6994123","49.4125128,8.7001312","49.4126952,8.7015474","49.4134247,8.7065578","49.4134891,8.7071371","49.4134998,8.7075984","49.4134889,8.7080697"],"boundingBox":{"topLeft":{"latitude":49.4159353,"longitude":8.627218},"bottomRight":{"latitude":49.2931652,"longitude":8.7080697}},"leg":[{"start":{"linkId":"+1599025847254060527","mappedPosition":{"latitude":49.2931652,"longitude":8.6422384},"originalPosition":{"latitude":49.2933509,"longitude":8.641992},"type":"stopOver","spot":0.0,"sideOfStreet":"left","mappedRoadName":"Dietmar-Hopp-Allee","label":"Dietmar-Hopp-Allee","shapeIndex":0},"end":{"linkId":"-1599377703809515584","mappedPosition":{"latitude":49.4134889,"longitude":8.7080697},"originalPosition":{"latitude":49.4134899,"longitude":8.7080699},"type":"stopOver","spot":0.4927536,"sideOfStreet":"neither","mappedRoadName":"Neckarstaden","label":"Neckarstaden - B37","shapeIndex":181},"length":20612,"travelTime":1281,"maneuver":[{"position":{"latitude":49.2931652,"longitude":8.6422384},"instruction":"Head northeast on Dietmar-Hopp-Allee. Go for 527 m.","travelTime":111,"length":527,"note":[],"toLink":"+1599025847254060527","roadName":"","nextRoadName":"Dietmar-Hopp-Allee","roadNumber":"","id":"M1"},{"position":{"latitude":49.2967701,"longitude":8.6467767},"instruction":"Turn left onto Südumgehung (L723). Go for 1.4 km.","travelTime":111,"length":1379,"note":[],"toLink":"+1599025847254060871","roadName":"Dietmar-Hopp-Allee","nextRoadName":"Südumgehung","roadNumber":"","id":"M2"},{"position":{"latitude":49.3005896,"longitude":8.6299968},"instruction":"Turn right and then enter the A5 highway toward Frankfurt. Go for 12.5 km.","travelTime":467,"length":12547,"note":[{"type":"traffic","code":"roadworks","text":"bridge maintenance work ","additionalData":[{"key":"severity","value":"high"}]}],"toLink":"+1599025842908758185","roadName":"Südumgehung","nextRoadName":"","roadNumber":"B291","id":"M3"},{"position":{"latitude":49.4110429,"longitude":8.6351037},"instruction":"Take exit 37 toward Heidelberg onto A656. Go for 3.1 km.","travelTime":194,"length":3144,"note":[],"toLink":"+1599377686612869120","roadName":"","nextRoadName":"","roadNumber":"A5","id":"M4"},{"position":{"latitude":49.4080603,"longitude":8.6689854},"instruction":"Keep left onto B37. Go for 143 m.","travelTime":30,"length":143,"note":[],"toLink":"+1599377695219581129","roadName":"","nextRoadName":"","roadNumber":"B37","id":"M5"},{"position":{"latitude":49.4091654,"longitude":8.6697578},"instruction":"Turn right onto Vangerowstraße (B37). Go for 323 m.","travelTime":50,"length":323,"note":[],"toLink":"-1599377695219581103","roadName":"","nextRoadName":"Vangerowstraße","roadNumber":"B37","id":"M6"},{"position":{"latitude":49.4088328,"longitude":8.6741567},"instruction":"Keep left onto Vangerowstraße (B37). Go for 2.5 km.","travelTime":318,"length":2549,"note":[],"toLink":"+1599377695219581111","roadName":"Vangerowstraße","nextRoadName":"Vangerowstraße","roadNumber":"B37","id":"M7"},{"position":{"latitude":49.4134889,"longitude":8.7080697},"instruction":"Arrive at Neckarstaden (B37).","travelTime":0,"length":0,"note":[{"type":"info","code":"previousIntersection","text":"The last intersection is Am Brückentor"},{"type":"info","code":"nextIntersection","text":"If you reach Am Hackteufel, you’ve gone too far"}],"roadName":"Neckarstaden","nextRoadName":"","roadNumber":"B37","id":"M8"}]}],"note":[],"summary":{"distance":20612,"trafficTime":1281,"baseTime":1182,"flags":["motorway","builtUpArea"],"text":"The trip takes 20.6 km and 21 mins.","travelTime":1281}},"language":"en-us"}};
	var ROUTE_NOT_EXISTING = {"type":"ApplicationError","subtype":"RouteNotReconstructed","details":"Error is NGEO_ERROR_INVALID_PARAMETERS","additionalData":[{"key":"error_code","value":"NGEO_ERROR_INVALID_PARAMETERS"}],"metaInfo":{"timestamp":"2015-01-08T11:45:35Z","mapVersion":"8.30.56.155","moduleVersion":"7.2.52.0_CD-1094_1","interfaceVersion":"2.6.6"}};
	var REBUILD_ROUTE_ID = {"response":{"metaInfo":{"timestamp":"2015-01-08T13:40:25Z","mapVersion":"8.30.56.155","moduleVersion":"7.2.52.0_CD-1094_1","interfaceVersion":"2.6.6"},"route":[{"routeId":"AHsACAAAAB4AAAA4AAAAmwAAAJYAAAB42mOYxsDAxMQABCxWqm0rpvAmM0BB50MDsfe89jYM//9DBD7sZ0ACXEC8WjU4i4mh0tGwratYGa6xR9FIzIHB3hKPxvQlWvqMQIvhgtkTHwX7AOkjAUwcDoZAxzAAABpKGWw6gHSP","mode":{"type":"fastest","transportModes":["car"],"trafficMode":"disabled","feature":[]}}],"language":"en-us"}};

	var mapService, httpBackend, interval;
	beforeEach(function() {
		module("bridge.service");
		inject(["bridge.service.maps.routing", "$httpBackend", "$interval", function(_mapService, $httpBackend, $interval) {
			mapService = _mapService;
			httpBackend = $httpBackend;
			interval = $interval;

			httpBackend.whenGET(new RegExp('https:\\/\\/geocoder.api.here.com\\/6.2\\/geocode.json\\?searchtext=ServerError.*')).respond(500, '');
			httpBackend.whenGET(new RegExp('https:\\/\\/geocoder.api.here.com\\/6.2\\/geocode.json\\?searchtext=NotExisting.*')).respond({"response":{"metaInfo":{"Timestamp":"2015-01-05T15:01:09.271+0000"},"view":[]}});
			httpBackend.whenGET(new RegExp('https:\\/\\/geocoder.api.here.com\\/6.2\\/geocode.json\\?searchtext=Walldor.*')).respond({"response":{"metaInfo":{"timestamp":"2015-01-12T14:06:22.121+0000"},"view":[{"result":[{"relevance":0.88,"matchLevel":"city","matchQuality":{"city":0.88},"location":{"locationId":"NT_6MOwXJ0PGaCJadMAWktQ4C","locationType":"point","displayPosition":{"latitude":50.6108208,"longitude":10.38836},"navigationPosition":[{"latitude":50.6108208,"longitude":10.38836}],"mapView":{"topLeft":{"latitude":50.6398506,"longitude":10.3478403},"bottomRight":{"latitude":50.5916405,"longitude":10.4217701}},"address":{"label":"Walldorf, Thüringen, Deutschland","country":"DEU","state":"Thüringen","county":"Schmalkalden-Meiningen","city":"Walldorf","postalCode":"98639","additionalData":[{"value":"Deutschland","key":"CountryName"},{"value":"Thüringen","key":"StateName"}]}}},{"relevance":0.88,"matchLevel":"city","matchQuality":{"city":0.88},"location":{"locationId":"NT_wJC34V0lJsFPhwS8YLZQfC","locationType":"point","displayPosition":{"latitude":49.3028908,"longitude":8.6429796},"navigationPosition":[{"latitude":49.3028908,"longitude":8.6429796}],"mapView":{"topLeft":{"latitude":49.3269615,"longitude":8.5952501},"bottomRight":{"latitude":49.2753487,"longitude":8.66856}},"address":{"label":"Walldorf, Baden-Württemberg, Deutschland","country":"DEU","state":"Baden-Württemberg","county":"Rhein-Neckar-Kreis","city":"Walldorf","postalCode":"69190","additionalData":[{"value":"Deutschland","key":"CountryName"},{"value":"Baden-Württemberg","key":"StateName"}]}}}],"viewId":0}]}});
			httpBackend.whenGET(new RegExp('https:\\/\\/route.nlp.nokia.com\\/routing\\/7.2\\/calculateroute.json\\?waypoint0=geo!49.293351,8.641992&waypoint1=geo!49.41349,8.70807&alternatives=2&routeattributes=none,routeId&language=en-US&mode=fastest;car;traffic:disabled.*')).respond(ROUTES_RESPONSE);
			httpBackend.whenGET(new RegExp('https:\\/\\/route.nlp.nokia.com\\/routing\\/7.2\\/calculateroute.json\\?waypoint0=geo!\\Server,Down&waypoint1=geo!49.41349,8.70807&alternatives=2&routeattributes=none,routeId&language=en-US&mode=fastest;car;traffic:disabled.*')).respond(500, '');
			httpBackend.whenGET(new RegExp('https:\\/\\/route.nlp.nokia.com\\/routing\\/7.2\\/calculateroute.json\\?waypoint0=geo!thisWillCause,OneRouteToBeNotExisting&waypoint1=geo!49.41349,8.70807&alternatives=2&routeattributes=none,routeId&language=en-US&mode=fastest;car;traffic:disabled.*')).respond(ROUTES_RESPONSE_ONE_ROUTE_NOT_EXISTING);
			httpBackend.whenGET(new RegExp('https:\\/\\/route.nlp.nokia.com\\/routing\\/7.2\\/calculateroute.json\\?waypoint0=geo!1599025847,254060527&waypoint1=geo!49.41349,8.70807&alternatives=2&routeattributes=none,routeId&language=en-US&mode=fastest;car;traffic:disabled.*')).respond(ROUTES_RESPONSE);
			httpBackend.whenGET(new RegExp('https:\\/\\/route.nlp.nokia.com\\/routing\\/7.2\\/calculateroute.json\\?waypoint0=geo!NotAvailable,Link&waypoint1=geo!49.41349,8.70807&alternatives=2&routeattributes=none,routeId&language=en-US&mode=fastest;car;traffic:disabled.*')).respond({"type":"ApplicationError","subtype":"LinkIdNotFound","details":"LinkId(s) specified in request are not available","additionalData":[{"key":"LinkId[0]","value":"-49411249870807"}],"metaInfo":{"timestamp":"2015-01-07T14:34:40Z","mapVersion":"8.30.56.155","moduleVersion":"7.2.52.0_CD-1094_1","interfaceVersion":"2.6.6"}});
			httpBackend.whenGET(new RegExp('https:\\/\\/route.nlp.nokia.com\\/routing\\/7.2\\/calculateroute.json\\?waypoint0=geo!49.2931652,8.6422384&waypoint1=geo!49.2931652,8.6422384&waypoint2=geo!49.2967701,8.6467767&waypoint3=geo!49.3005896,8.6299968&waypoint4=geo!49.4110429,8.6351037&waypoint5=geo!49.4080603,8.6689854&waypoint6=geo!49.4091654,8.6697578&waypoint7=geo!49.4088328,8.6741567&alternatives=0&routeattributes=none,routeId&language=en-US&mode=fastest;car;traffic:disabled.*')).respond(REBUILD_ROUTE_ID);
			httpBackend.whenGET(new RegExp('https:\\/\\/route.nlp.nokia.com\\/routing\\/7.2\\/getroute.json\\?routeId=AHsACAAAAB4AAAA4AAAAmwAAAJYAAAB42mOYxsDAxMQABCxWqm0rpvAmM0BB50MDsfe89jYM//9DBD7sZ0ACXEC8WjU4i4mh0tGwratYGa6xR9FIzIHB3hKPxvQlWvqMQIvhgtkTHwX7AOkjAUwcDoZAxzAAABpKGWw6gHSP&mode=fastest;car;traffic:enabled&routeattributes=wp,sm,sh,bb,lg,no,shape&legattributes=wp,mn,le,tt&maneuverattributes=tt,le,ti,li,pt,pl,rn,nr,no,ru&instructionformat=text.*')).respond(ROUTE_RESPONSE);
			httpBackend.whenGET(new RegExp('https:\\/\\/route.nlp.nokia.com\\/routing\\/7.2\\/getroute.json\\?routeId=AH4ACAAAAB4AAAA4AAAAmwAAAJoAAAB42mOYxcDAxMQABCxWqm0rpvAmM0BB50MDsfe89jYM//9DBD7sZ0ACXEC8WjU4i4mh0tGwratYGa6xR9FIzIHB3hKPxvQlWvqMQIvhglfVF5/OBNJHAg4BxVkEExiYGhgYAJGbGwGVelwR&mode=fastest;car;traffic:enabled&routeattributes=wp,sm,sh,bb,lg,no,shape&legattributes=wp,mn,le,tt&maneuverattributes=tt,le,ti,li,pt,pl,rn,nr,no,ru&instructionformat=text.*')).respond(JSON.parse(JSON.stringify(ROUTE_RESPONSE).replace("AHsACAAAAB4AAAA4AAAAmwAAAJYAAAB42mOYxsDAxMQABCxWqm0rpvAmM0BB50MDsfe89jYM//9DBD7sZ0ACXEC8WjU4i4mh0tGwratYGa6xR9FIzIHB3hKPxvQlWvqMQIvhgtkTHwX7AOkjAUwcDoZAxzAAABpKGWw6gHSP", "AH4ACAAAAB4AAAA4AAAAmwAAAJoAAAB42mOYxcDAxMQABCxWqm0rpvAmM0BB50MDsfe89jYM//9DBD7sZ0ACXEC8WjU4i4mh0tGwratYGa6xR9FIzIHB3hKPxvQlWvqMQIvhglfVF5/OBNJHAg4BxVkEExiYGhgYAJGbGwGVelwR")));
			httpBackend.whenGET(new RegExp('https:\\/\\/route.nlp.nokia.com\\/routing\\/7.2\\/getroute.json\\?routeId=AH4ACAAAAB4AAAA4AAAAmwAAAJoAAAB42mOYxcDAxMQABCxWqm0rpvAmM0BB50MDsfe89jYM//9DBD7sZ0ACXEC8WjU4i4mh0tGwratYGa6xR9FIzIHB3hKPxvQlWvqMQIvhgtc9iz8UAOkjAYeA4hwMDhLMDA4MAJJzGs0Ftw8p&mode=fastest;car;traffic:enabled&routeattributes=wp,sm,sh,bb,lg,no,shape&legattributes=wp,mn,le,tt&maneuverattributes=tt,le,ti,li,pt,pl,rn,nr,no,ru&instructionformat=text.*')).respond(ROUTE_RESPONSE);
			httpBackend.whenGET(new RegExp('https:\\/\\/route.nlp.nokia.com\\/routing\\/7.2\\/getroute.json\\?routeId=NotExisting&mode=fastest;car;traffic:enabled&routeattributes=wp,sm,sh,bb,lg,no,shape&legattributes=wp,mn,le,tt&maneuverattributes=tt,le,ti,li,pt,pl,rn,nr,no,ru&instructionformat=text.*')).respond(ROUTE_NOT_EXISTING);
		}]);
	});

	it("can be instantiated", function() {
		expect(mapService).toBeDefined();
	});

	it("enables to search for a location / street", function() {
		mapService.search("Walldor", function(results) {
			expect(results.error).toBeFalsy();
			expect(results.data.length).toEqual(2);
			expect(results.data[0].location.address.label).toEqual("Walldorf, Thüringen, Deutschland");
			expect(results.data[1].location.address.label).toEqual("Walldorf, Baden-Württemberg, Deutschland");
		});
		httpBackend.flush();

		mapService.search("NotExisting", function(results) {
			expect(results.error).toBeFalsy();
			expect(results.data.length).toEqual(0);
		});
		httpBackend.flush();

		mapService.search("ServerError", function(results) {
			expect(results.error).toBeTruthy();
			expect(results.data.length).toEqual(0);
		});
		httpBackend.flush();
	});

	it("should fetch route information by routeId", function() {
		mapService.getRouteByRouteId("AHsACAAAAB4AAAA4AAAAmwAAAJYAAAB42mOYxsDAxMQABCxWqm0rpvAmM0BB50MDsfe89jYM//9DBD7sZ0ACXEC8WjU4i4mh0tGwratYGa6xR9FIzIHB3hKPxvQlWvqMQIvhgtkTHwX7AOkjAUwcDoZAxzAAABpKGWw6gHSP").then(function(response) {
			expect(response.error).toBeFalsy();
			expect(response.route.routeId).toEqual("AHsACAAAAB4AAAA4AAAAmwAAAJYAAAB42mOYxsDAxMQABCxWqm0rpvAmM0BB50MDsfe89jYM//9DBD7sZ0ACXEC8WjU4i4mh0tGwratYGa6xR9FIzIHB3hKPxvQlWvqMQIvhgtkTHwX7AOkjAUwcDoZAxzAAABpKGWw6gHSP");
			expect(response.route.summary.distance).toBeDefined();
			expect(response.route.summary.baseTime).toBeDefined();
			expect(response.route.summary.trafficTime).toBeDefined();
			expect(response.route.shape).toBeDefined();
			expect(response.route.shape instanceof nokia.maps.geo.Shape).toBeTruthy();
			expect(response.route.incidents.length).toEqual(1);
			expect(response.route.incidents[0].text).toEqual("bridge maintenance work ");
			expect(response.route.color).toEqual("#418AC9");

			expect(response.route.calculatedWaypoints.length).toEqual(8);
			expect(response.route.waypoints.length).toEqual(2);
		});
		httpBackend.flush();
	});

	it("should cope with not existing routeIds", function() {
		mapService.getRouteByRouteId("NotExisting").then(function() {}, function(response) {
			expect(response.error).toBeTruthy();
			expect(response.route).not.toBeDefined();
		});
		httpBackend.flush();
	});

	it("should calculate routes between two points (lat/lon)", function() {
		mapService.calculateAlternativeRoutesBetween({position: {"latitude":49.293351,"longitude":8.641992}}, {position: {"latitude":49.41349,"longitude":8.70807}}, function(results) {
			expect(results.error).toBeFalsy();
			expect(results.routes.length).toEqual(3);
		});
		httpBackend.flush();
	});

	it("should calculate routes between two points (lat/lon) with another format of input parameters", function() {
		mapService.calculateAlternativeRoutesBetween({"latitude":49.293351,"longitude":8.641992}, {"latitude":49.41349,"longitude":8.70807}, function(results) {
			expect(results.error).toBeFalsy();
			expect(results.routes.length).toEqual(3);
		});
		httpBackend.flush();
	});

	it("should calculate routes between link and point (lat/lon)", function() {
		mapService.calculateAlternativeRoutesBetween({position: {latitude: "1599025847", longitude: "254060527"}}, {position: {"latitude":49.41349,"longitude":8.70807}}, function(results) {
			expect(results.error).toBeFalsy();
			expect(results.routes.length).toEqual(3);
		});
		httpBackend.flush();
	});

	it("should assign different colors to alternative routes", function() {
		mapService.calculateAlternativeRoutesBetween({position: {"latitude":49.293351,"longitude":8.641992}}, {position: {"latitude":49.41349,"longitude":8.70807}}, function(results) {
			expect(results.routes[0].route.color).toEqual("#418AC9");
			expect(results.routes[1].route.color).toEqual("#8561C5");
			expect(results.routes[2].route.color).toEqual("#707070");
		});
		httpBackend.flush();
	});

	it("should fail to calculate routes between unknown points", function() {
		mapService.calculateAlternativeRoutesBetween({position: {latitude: "NotAvailable", longitude: "Link"}}, {position: {"latitude":49.41349,"longitude":8.70807}}, function(results) {
			expect(results.error).toBeTruthy();
			expect(results.routes.length).toEqual(0);
		});
		httpBackend.flush();
	});

	it("should fail to calculate routes if the server is down", function() {
		mapService.calculateAlternativeRoutesBetween({position: {latitude: "Server", longitude: "Down"}}, {position: {"latitude":49.41349,"longitude":8.70807}}, function(results) {
			expect(results.error).toBeTruthy();
			expect(results.routes.length).toEqual(0);
		});
		httpBackend.flush();
	});

	it("should create route objects also if one routeResolution fails", function() {
		mapService.calculateAlternativeRoutesBetween({position: {"latitude":"thisWillCause","longitude":"OneRouteToBeNotExisting"}}, {position: {"latitude":49.41349,"longitude":8.70807}}, function(results) {
			var failedRoute = results.routes[0];
			var successfulRoute = results.routes[1];
			expect(failedRoute.error).toBeFalsy();
			expect(successfulRoute.route.routeId).toEqual("AH4ACAAAAB4AAAA4AAAAmwAAAJoAAAB42mOYxcDAxMQABCxWqm0rpvAmM0BB50MDsfe89jYM//9DBD7sZ0ACXEC8WjU4i4mh0tGwratYGa6xR9FIzIHB3hKPxvQlWvqMQIvhglfVF5/OBNJHAg4BxVkEExiYGhgYAJGbGwGVelwR");
		});
		httpBackend.flush();
	});

	it("should rebuild a route from a number of given waypoints (mixed coordinates and links)", function() {
		mapService.rebuildRouteFromWaypoints([{position: {latitude: 49.2931652, longitude: 8.6422384}}, {position: {latitude: 49.2931652, longitude: 8.6422384}}, {position: {latitude: 49.2967701, longitude: 8.6467767}}, {position: {latitude: 49.3005896, longitude: 8.6299968}}, {position: {latitude: 49.4110429, longitude: 8.6351037}}, {position: {latitude: 49.4080603, longitude: 8.6689854}}, {position: {latitude: 49.4091654, longitude: 8.6697578}}, {position: {latitude: 49.4088328, longitude: 8.6741567}}], function(result) {
			expect(result.error).toBeFalsy();
			expect(result.route.summary.trafficTime).toEqual(1281);
		});
		httpBackend.flush();
	});

	it("should take care that routes update their data each 2.5 minutes", function() {
		var TEST_RESPONSE = angular.copy(ROUTE_RESPONSE);
		TEST_RESPONSE.response.route.routeId = "AHsACAAAAB4AAAA4AAAAmwAAAJYAAAB42mOYxsDAxMQABCxWqm0rpvAmM0BB50MDsfe89jYM//9DBD7sZ0ACXEC8WjU4i4mh0tGwratYGa6xR9FIzIHB3hKPxvQlWvqMQIvhgtkTHwX7AOkjAUwcDoZAxzAAABpKGWw6gHSb";

		var route;
		mapService.getRouteByRouteId("AHsACAAAAB4AAAA4AAAAmwAAAJYAAAB42mOYxsDAxMQABCxWqm0rpvAmM0BB50MDsfe89jYM//9DBD7sZ0ACXEC8WjU4i4mh0tGwratYGa6xR9FIzIHB3hKPxvQlWvqMQIvhgtkTHwX7AOkjAUwcDoZAxzAAABpKGWw6gHSb").then(function(response) {
			route = response.route;
		});
		httpBackend.expectGET(new RegExp('https:\\/\\/route.nlp.nokia.com\\/routing\\/7.2\\/getroute.json\\?routeId=AHsACAAAAB4AAAA4AAAAmwAAAJYAAAB42mOYxsDAxMQABCxWqm0rpvAmM0BB50MDsfe89jYM//9DBD7sZ0ACXEC8WjU4i4mh0tGwratYGa6xR9FIzIHB3hKPxvQlWvqMQIvhgtkTHwX7AOkjAUwcDoZAxzAAABpKGWw6gHSb&mode=fastest;car;traffic:enabled&routeattributes=wp,sm,sh,bb,lg,no,shape&legattributes=wp,mn,le,tt&maneuverattributes=tt,le,ti,li,pt,pl,rn,nr,no,ru&instructionformat=text.*')).respond(TEST_RESPONSE);
		httpBackend.flush();

		expect(route.summary.trafficTime).toEqual(1281);
		httpBackend.expectGET(new RegExp('https:\\/\\/route.nlp.nokia.com\\/routing\\/7.2\\/getroute.json\\?routeId=AHsACAAAAB4AAAA4AAAAmwAAAJYAAAB42mOYxsDAxMQABCxWqm0rpvAmM0BB50MDsfe89jYM//9DBD7sZ0ACXEC8WjU4i4mh0tGwratYGa6xR9FIzIHB3hKPxvQlWvqMQIvhgtkTHwX7AOkjAUwcDoZAxzAAABpKGWw6gHSb&mode=fastest;car;traffic:enabled&routeattributes=wp,sm,sh,bb,lg,no,shape&legattributes=wp,mn,le,tt&maneuverattributes=tt,le,ti,li,pt,pl,rn,nr,no,ru&instructionformat=text.*')).respond(JSON.parse(JSON.stringify(TEST_RESPONSE).replace('"trafficTime":1281', '"trafficTime":1291')));
		interval.flush(120000);
		httpBackend.flush();
		expect(route.summary.trafficTime).toEqual(1291);
	});

	it("should rebuild the route from waypoints if routeId can't be found anymore", function() {
		var route;
		var TEST_RESPONSE = angular.copy(ROUTE_RESPONSE);
		TEST_RESPONSE.response.route.routeId = "AHsACAAAAB4AAAA4AAAAmwAAAJYAAAB42mOYxsDAxMQABCxWqm0rpvAmM0BB50MDsfe89jYM//9DBD7sZ0ACXEC8WjU4i4mh0tGwratYGa6xR9FIzIHB3hKPxvQlWvqMQIvhgtkTHwX7AOkjAUwcDoZAxzAAABpKGWw6gHSb";
		httpBackend.expectGET(new RegExp('https:\\/\\/route.nlp.nokia.com\\/routing\\/7.2\\/getroute.json\\?routeId=AHsACAAAAB4AAAA4AAAAmwAAAJYAAAB42mOYxsDAxMQABCxWqm0rpvAmM0BB50MDsfe89jYM//9DBD7sZ0ACXEC8WjU4i4mh0tGwratYGa6xR9FIzIHB3hKPxvQlWvqMQIvhgtkTHwX7AOkjAUwcDoZAxzAAABpKGWw6gHSb&mode=fastest;car;traffic:enabled&routeattributes=wp,sm,sh,bb,lg,no,shape&legattributes=wp,mn,le,tt&maneuverattributes=tt,le,ti,li,pt,pl,rn,nr,no,ru&instructionformat=text.*')).respond(JSON.parse(JSON.stringify(TEST_RESPONSE).replace('"trafficTime":1281', '"trafficTime":1291')));
		mapService.getRouteByRouteId("AHsACAAAAB4AAAA4AAAAmwAAAJYAAAB42mOYxsDAxMQABCxWqm0rpvAmM0BB50MDsfe89jYM//9DBD7sZ0ACXEC8WjU4i4mh0tGwratYGa6xR9FIzIHB3hKPxvQlWvqMQIvhgtkTHwX7AOkjAUwcDoZAxzAAABpKGWw6gHSb").then(function(response) {
			route = response.route;
		});
		httpBackend.flush();

		expect(route.shape).toBeDefined();
		expect(route.summary.trafficTime).toEqual(1291);

		httpBackend.expectGET(new RegExp('https:\\/\\/route.nlp.nokia.com\\/routing\\/7.2\\/getroute.json\\?routeId=AHsACAAAAB4AAAA4AAAAmwAAAJYAAAB42mOYxsDAxMQABCxWqm0rpvAmM0BB50MDsfe89jYM//9DBD7sZ0ACXEC8WjU4i4mh0tGwratYGa6xR9FIzIHB3hKPxvQlWvqMQIvhgtkTHwX7AOkjAUwcDoZAxzAAABpKGWw6gHSb&mode=fastest;car;traffic:enabled&routeattributes=wp,sm,sh,bb,lg,no,shape&legattributes=wp,mn,le,tt&maneuverattributes=tt,le,ti,li,pt,pl,rn,nr,no,ru&instructionformat=text.*')).respond(ROUTE_NOT_EXISTING);
		interval.flush(120000);
		httpBackend.flush();
		expect(route.summary.trafficTime).toEqual(1281);
	});

	it("should make a route disengageable", function() {
		var TEST_RESPONSE = angular.copy(ROUTE_RESPONSE);
		TEST_RESPONSE.response.route.routeId = "AHsACAAAAB4AAAA4AAAAmwAAAJYAAAB42mOYxsDAxMQABCxWqm0rpvAmM0BB50MDsfe89jYM//9DBD7sZ0ACXEC8WjU4i4mh0tGwratYGa6xR9FIzIHB3hKPxvQlWvqMQIvhgtkTHwX7AOkjAUwcDoZAxzAAABpKGWw6gHSb";

		var route;
		mapService.getRouteByRouteId("AHsACAAAAB4AAAA4AAAAmwAAAJYAAAB42mOYxsDAxMQABCxWqm0rpvAmM0BB50MDsfe89jYM//9DBD7sZ0ACXEC8WjU4i4mh0tGwratYGa6xR9FIzIHB3hKPxvQlWvqMQIvhgtkTHwX7AOkjAUwcDoZAxzAAABpKGWw6gHSb").then(function(response) {
			route = response.route;
		});
		httpBackend.expectGET(new RegExp('https:\\/\\/route.nlp.nokia.com\\/routing\\/7.2\\/getroute.json\\?routeId=AHsACAAAAB4AAAA4AAAAmwAAAJYAAAB42mOYxsDAxMQABCxWqm0rpvAmM0BB50MDsfe89jYM//9DBD7sZ0ACXEC8WjU4i4mh0tGwratYGa6xR9FIzIHB3hKPxvQlWvqMQIvhgtkTHwX7AOkjAUwcDoZAxzAAABpKGWw6gHSb&mode=fastest;car;traffic:enabled&routeattributes=wp,sm,sh,bb,lg,no,shape&legattributes=wp,mn,le,tt&maneuverattributes=tt,le,ti,li,pt,pl,rn,nr,no,ru&instructionformat=text.*')).respond(TEST_RESPONSE);
		httpBackend.flush();

		expect(route.isActive).toBeTruthy();
		route.toggleIsActive();
		expect(route.isActive).toBeFalsy();

		expect(route.summary.trafficTime).toEqual(1281);
		httpBackend.expectGET(new RegExp('https:\\/\\/route.nlp.nokia.com\\/routing\\/7.2\\/getroute.json\\?routeId=AHsACAAAAB4AAAA4AAAAmwAAAJYAAAB42mOYxsDAxMQABCxWqm0rpvAmM0BB50MDsfe89jYM//9DBD7sZ0ACXEC8WjU4i4mh0tGwratYGa6xR9FIzIHB3hKPxvQlWvqMQIvhgtkTHwX7AOkjAUwcDoZAxzAAABpKGWw6gHSb&mode=fastest;car;traffic:enabled&routeattributes=wp,sm,sh,bb,lg,no,shape&legattributes=wp,mn,le,tt&maneuverattributes=tt,le,ti,li,pt,pl,rn,nr,no,ru&instructionformat=text.*')).respond(JSON.parse(JSON.stringify(TEST_RESPONSE).replace('"trafficTime":1281', '"trafficTime":1291')));
		interval.flush(120000);
		expect(route.summary.trafficTime).toEqual(1281);
	});

	it("should be possible to give a route new waypoints", function() {
		var route;
		mapService.getRouteByRouteId("AHsACAAAAB4AAAA4AAAAmwAAAJYAAAB42mOYxsDAxMQABCxWqm0rpvAmM0BB50MDsfe89jYM//9DBD7sZ0ACXEC8WjU4i4mh0tGwratYGa6xR9FIzIHB3hKPxvQlWvqMQIvhgtkTHwX7AOkjAUwcDoZAxzAAABpKGWw6gHSP").then(function(response) {
			route = response.route;
		});
		httpBackend.flush();
		expect(route.summary.trafficTime).toEqual(1281);
		expect(route.waypoints.length).toEqual(2);

		var waypoints = route.waypoints;
		waypoints.push({latitude: 49.486398, longitude: 8.465373});
		httpBackend.expectGET(new RegExp('https:\\/\\/route.nlp.nokia.com\\/routing\\/7.2\\/calculateroute.json\\?waypoint0=geo!49.2931652,8.6422384&waypoint1=geo!49.4134889,8.7080697&waypoint2=geo!49.486398,8.465373&alternatives=0&routeattributes=none,routeId&language=en-US&mode=fastest;car;traffic:disabled.*')).respond({"response":{"metaInfo":{"timestamp":"2015-01-14T12:10:30Z","mapVersion":"8.30.56.155","moduleVersion":"7.2.52.0_CD-1094_1","interfaceVersion":"2.6.6"},"route":[{"routeId":"AJ0ACAAAAB4AAAA4AAAAmwAAAOkAAAB42mN4ycDAxMyABXQ+NBB7z2tvw/j/P0TggT2yNBcQG/m5CzJhaOxRNBJzYLC3ZMKtMWHlhyhGhp9CrG2+Ow2SYTKNisZiPDz2NgwwjR/2o2tc38vUzsjIwIDq4s0zRAy/AukjAUwcDoYMDCwMB1iEgHxGBUEJJgaOBiagFgEHVgBcZx+LtZtO0w==","mode":{"type":"fastest","transportModes":["car"],"trafficMode":"disabled","feature":[]}}],"language":"en-us"}});
		httpBackend.expectGET(new RegExp('https:\\/\\/route.nlp.nokia.com\\/routing\\/7.2\\/getroute.json\\?routeId=AJ0ACAAAAB4AAAA4AAAAmwAAAOkAAAB42mN4ycDAxMyABXQ\\+NBB7z2tvw/j/P0TggT2yNBcQG/m5CzJhaOxRNBJzYLC3ZMKtMWHlhyhGhp9CrG2\\+Ow2SYTKNisZiPDz2NgwwjR/2o2tc38vUzsjIwIDq4s0zRAy/AukjAUwcDoYMDCwMB1iEgHxGBUEJJgaOBiagFgEHVgBcZx\\+LtZtO0w==&mode=fastest;car;traffic:enabled&routeattributes=wp,sm,sh,bb,lg,no,shape&legattributes=wp,mn,le,tt&maneuverattributes=tt,le,ti,li,pt,pl,rn,nr,no,ru&instructionformat=text.*')).respond({"response":{"metaInfo":{"timestamp":"2015-01-14T12:11:50Z","mapVersion":"8.30.56.155","moduleVersion":"7.2.52.0_CD-1094_1","interfaceVersion":"2.6.6"},"route":{"routeId":"AH0ACAAAAB4AAAA4AAAAmwAAAJwAAAB42mOYw8DAxMQABPwZqm2mgfzJDFDQ+dBAbCuDvTXD//8QgQ/7GZAAFxBPmXP0KhMDcyhrW+s+A7jGRkVjMUP8Gg03G89nBFoMF7Q8FPWxAcwIYLolwODAIMLBwdDAwAgAuHoa/P1SSLk=","waypoint":[{"linkId":"-1599025847237279925","mappedPosition":{"latitude":49.3028901,"longitude":8.6429826},"originalPosition":{"latitude":49.30289,"longitude":8.6429799},"type":"stopOver","spot":0.5081967,"sideOfStreet":"neither","mappedRoadName":"Bahnhofstraße","label":"Bahnhofstraße","shapeIndex":0},{"linkId":"-1599659131575140401","mappedPosition":{"latitude":49.486508,"longitude":8.466788},"originalPosition":{"latitude":49.48651,"longitude":8.46679},"type":"stopOver","spot":0.5,"sideOfStreet":"neither","mappedRoadName":"N2","label":"N2","shapeIndex":257}],"mode":{"type":"fastest","transportModes":["car"],"trafficMode":"enabled","feature":[]},"shape":["49.3028901,8.6429826","49.3023169,8.6430967","49.3019414,8.6432362","49.3012655,8.6435473","49.3010616,8.6436975","49.3009222,8.643837","49.3007505,8.6440945","49.3005252,8.6445451","49.3003643,8.644985","49.2999458,8.6460042","49.2998385,8.646208","49.2997205,8.6464548","49.2996669,8.6464334","49.2996347,8.6464226","49.2995918,8.6464441","49.2995596,8.6464655","49.2995381,8.6465085","49.2995167,8.6465836","49.2995167,8.6466587","49.2995489,8.6467552","49.2995918,8.6467981","49.2992699,8.6479676","49.2990124,8.6486435","49.2988086,8.6490941","49.2984653,8.64977","49.2981112,8.6503494","49.2979503,8.6505747","49.2978859,8.6505103","49.297843,8.6504996","49.2977679,8.6505532","49.2972851,8.6498451","49.297092,8.6495876","49.296813,8.6492765","49.2967057,8.6491907","49.2965984,8.6491263","49.2966843,8.6487722","49.2967916,8.6481607","49.2968345,8.6477745","49.2968774,8.6467767","49.2968345,8.6457467","49.2967916,8.6452746","49.296577,8.6435366","49.296416,8.641938","49.2963946,8.6409187","49.296459,8.6399961","49.2965662,8.6392343","49.2967165,8.6384618","49.2968452,8.6379683","49.2969954,8.6374748","49.2974997,8.636198","49.2978752,8.6354148","49.2983902,8.6344385","49.2991626,8.6331725","49.2996883,8.6321855","49.2999029,8.6317348","49.300096,8.6312735","49.3005681,8.6300611","49.3005896,8.6299968","49.3008578,8.6301684","49.3010294,8.6302543","49.301126,8.6302757","49.3013191,8.6302865","49.3015337,8.6302328","49.3020165,8.6299324","49.302156,8.6298895","49.3023169,8.629868","49.3025422,8.6298788","49.3025851,8.6297178","49.3026066,8.629514","49.302671,8.6280227","49.3027139,8.6275935","49.3027782,8.627454","49.3028533,8.6273575","49.3030357,8.6272824","49.3034434,8.627218","49.3062973,8.6278939","49.3070805,8.6280656","49.3076062,8.6282051","49.3081534,8.6283231","49.3087542,8.628484","49.3099988,8.6287737","49.3109965,8.6289775","49.312005,8.6291707","49.3124986,8.629235","49.3137324,8.6293852","49.3151271,8.6295033","49.3178952,8.6296535","49.3195367,8.6297178","49.3216825,8.6298251","49.3261671,8.6300826","49.3286133,8.6302006","49.335587,8.6305869","49.345125,8.6310697","49.349277,8.6313057","49.3508434,8.6313701","49.3526351,8.6314881","49.3633211,8.632046","49.3671191,8.6322606","49.3701982,8.6324108","49.3705201,8.632443","49.3729234,8.632561","49.3733525,8.6325932","49.3739963,8.632679","49.3748546,8.6328506","49.375509,8.6330116","49.3765175,8.6333764","49.3771935,8.6336446","49.377408,8.6337626","49.3775904,8.6338377","49.3780196,8.6340523","49.3797898,8.6350501","49.3803048,8.6353612","49.382633,8.6367023","49.384017,8.6374748","49.3847144,8.6378181","49.3858731,8.6382687","49.3865061,8.6384833","49.3870318,8.6386228","49.387933,8.6388052","49.3884265,8.6388803","49.3889952,8.6389446","49.3894351,8.6389661","49.3901646,8.6389661","49.3909049,8.6389339","49.4022346,8.637464","49.4047558,8.6371207","49.4058931,8.6369491","49.4063973,8.636831","49.4073951,8.6365414","49.4088221,8.6360049","49.4107747,8.635211","49.4110429,8.6351037","49.4113219,8.635093","49.4116759,8.634975","49.4125021,8.6347711","49.4131136,8.6346531","49.414959,8.6342454","49.4157851,8.6341059","49.4165039,8.6340201","49.4169652,8.6339664","49.4183922,8.6338806","49.4186604,8.6340415","49.4187784,8.6341381","49.4189608,8.6344385","49.4190037,8.6346209","49.4190145,8.6348355","49.4189823,8.6350393","49.4189179,8.6352324","49.4188321,8.6353827","49.418714,8.6354685","49.4185746,8.6355221","49.4184351,8.6355221","49.4183064,8.6354685","49.4181991,8.6353719","49.4181132,8.6352217","49.4180489,8.6350393","49.4180167,8.6348248","49.4180274,8.6346316","49.4181454,8.6341059","49.4183171,8.6338806","49.4184351,8.6336446","49.4185424,8.6334729","49.4186282,8.6332583","49.4188643,8.6327863","49.4210207,8.6291277","49.4220722,8.6271214","49.4221473,8.6268425","49.4283593,8.6160386","49.4343352,8.6055672","49.4356549,8.6032927","49.4363737,8.6020052","49.4368458,8.6012006","49.4372749,8.6004066","49.4384551,8.5984004","49.4396245,8.5963511","49.4403434,8.5950637","49.4405258,8.5947096","49.4412553,8.5931754","49.4416201,8.5923278","49.4425213,8.5899997","49.4430685,8.5884976","49.4433045,8.5878968","49.4453108,8.5825109","49.4465768,8.5790455","49.4497633,8.5706234","49.4498384,8.5703766","49.4509113,8.5674691","49.4580781,8.5482001","49.4603312,8.5421813","49.4611681,8.5398531","49.4624019,8.5360551","49.4637322,8.5315919","49.4658136,8.524425","49.4661891,8.5230088","49.466908,8.5205519","49.4677877,8.517741","49.4682169,8.5164857","49.4689572,8.5144794","49.4720685,8.5065615","49.4727767,8.5048127","49.4735277,8.5031176","49.4740212,8.501873","49.4744718,8.5006607","49.4754267,8.4982038","49.4763386,8.4958863","49.4764566,8.4956288","49.4766068,8.4953928","49.4767892,8.495146","49.4770467,8.4948885","49.4773579,8.4944701","49.4774437,8.4942877","49.4775617,8.4939659","49.4776046,8.4938049","49.4776475,8.493365","49.4776797,8.4926784","49.4777977,8.4921527","49.4778836,8.4919059","49.477948,8.491745","49.477036,8.490876","49.4768965,8.4906828","49.4768322,8.4904897","49.4767785,8.4902537","49.4767034,8.4897709","49.4765103,8.4887409","49.4764245,8.4884512","49.4763708,8.4883654","49.4762421,8.4882152","49.4760168,8.4880972","49.4754159,8.48755","49.475255,8.4873247","49.4743323,8.4864342","49.4741929,8.486284","49.4740963,8.4861445","49.4740319,8.4859729","49.473989,8.4857368","49.4739783,8.4855652","49.4739676,8.4847391","49.473989,8.4840095","49.474107,8.4820783","49.4742036,8.481617","49.4742787,8.4814346","49.4750297,8.4799862","49.4751155,8.4797394","49.4757056,8.4788167","49.476285,8.4779692","49.4764996,8.4777546","49.4785702,8.4752226","49.4792783,8.4743214","49.4804907,8.4728408","49.4807053,8.4725082","49.4812846,8.4712422","49.4837737,8.4649229","49.484117,8.464011","49.4848788,8.4647083","49.4857264,8.465513","49.4861233,8.465867","49.4866705,8.4663606","49.486508,8.466788"],"boundingBox":{"topLeft":{"latitude":49.4866705,"longitude":8.464011},"bottomRight":{"latitude":49.2963946,"longitude":8.6505747}},"leg":[{"start":{"linkId":"-1599025847237279925","mappedPosition":{"latitude":49.3028901,"longitude":8.6429826},"originalPosition":{"latitude":49.30289,"longitude":8.6429799},"type":"stopOver","spot":0.5081967,"sideOfStreet":"neither","mappedRoadName":"Bahnhofstraße","label":"Bahnhofstraße","shapeIndex":0},"end":{"linkId":"-1599659131575140401","mappedPosition":{"latitude":49.486508,"longitude":8.466788},"originalPosition":{"latitude":49.48651,"longitude":8.46679},"type":"stopOver","spot":0.5,"sideOfStreet":"neither","mappedRoadName":"N2","label":"N2","shapeIndex":257},"length":31641,"travelTime":2004,"maneuver":[{"position":{"latitude":49.3028901,"longitude":8.6429826},"instruction":"Head toward Schulstraße on Bahnhofstraße. Go for 461 m.","travelTime":71,"length":461,"note":[],"toLink":"-1599025847237279925","roadName":"","nextRoadName":"Bahnhofstraße","roadNumber":"","id":"M1"},{"position":{"latitude":49.2997205,"longitude":8.6464548},"instruction":"Take the 2nd exit from roundabout onto Wieslocher Straße. Go for 380 m.","travelTime":41,"length":380,"note":[],"toLink":"-1599025847237279947","roadName":"Bahnhofstraße","nextRoadName":"Wieslocher Straße","roadNumber":"","id":"M2"},{"position":{"latitude":49.2979503,"longitude":8.6505747},"instruction":"Take the 1st exit from roundabout. Go for 190 m.","travelTime":34,"length":190,"note":[],"toLink":"-1599025847237279941","roadName":"Wieslocher Straße","nextRoadName":"","roadNumber":"","id":"M3"},{"position":{"latitude":49.2965984,"longitude":8.6491263},"instruction":"Turn right onto Südumgehung (L723). Go for 1.5 km.","travelTime":99,"length":1541,"note":[],"toLink":"+1599025847203725368","roadName":"","nextRoadName":"Südumgehung","roadNumber":"","id":"M4"},{"position":{"latitude":49.3005896,"longitude":8.6299968},"instruction":"Turn right and then enter the A5 highway toward Frankfurt. Go for 12.5 km.","travelTime":688,"length":12547,"note":[{"type":"traffic","code":"congestion","text":"queuing traffic ","additionalData":[{"key":"severity","value":"veryHigh"}]}],"toLink":"+1599025842908758185","roadName":"Südumgehung","nextRoadName":"","roadNumber":"B291","id":"M5"},{"position":{"latitude":49.4110429,"longitude":8.6351037},"instruction":"Take exit 37 toward Mannheim onto A656. Go for 13.5 km.","travelTime":590,"length":13482,"note":[],"toLink":"+1599377686612869120","roadName":"","nextRoadName":"","roadNumber":"A5","id":"M6"},{"position":{"latitude":49.4778836,"longitude":8.4919059},"instruction":"Turn left onto Schubertstraße (B37). Go for 335 m.","travelTime":70,"length":335,"note":[],"toLink":"+1599588767109153313","roadName":"Wilhelm-Varnholt-Allee","nextRoadName":"Schubertstraße","roadNumber":"B37","id":"M7"},{"position":{"latitude":49.4763708,"longitude":8.4883654},"instruction":"Turn left onto Möhlstraße (B37). Go for 2.3 km.","travelTime":338,"length":2339,"note":[],"toLink":"-1599588767109153034","roadName":"Seckenheimer Straße","nextRoadName":"Möhlstraße","roadNumber":"B37","id":"M8"},{"position":{"latitude":49.484117,"longitude":8.464011},"instruction":"Turn right onto L1. Go for 98 m.","travelTime":17,"length":98,"note":[],"toLink":"+1599659131591920645","roadName":"L2","nextRoadName":"L1","roadNumber":"B37","id":"M9"},{"position":{"latitude":49.4848788,"longitude":8.4647083},"instruction":"Continue on M1. Go for 111 m.","travelTime":19,"length":111,"note":[],"toLink":"+1599659131591920644","roadName":"L1","nextRoadName":"M1","roadNumber":"","id":"M10"},{"position":{"latitude":49.4857264,"longitude":8.465513},"instruction":"Continue on N2. Go for 122 m.","travelTime":30,"length":122,"note":[],"toLink":"+1599659131591918190","roadName":"M1","nextRoadName":"N2","roadNumber":"","id":"M11"},{"position":{"latitude":49.4866705,"longitude":8.4663606},"instruction":"Turn right onto N2. Go for 35 m.","travelTime":7,"length":35,"note":[],"toLink":"-1599659131575140401","roadName":"N2","nextRoadName":"N2","roadNumber":"","id":"M12"},{"position":{"latitude":49.486508,"longitude":8.466788},"instruction":"Arrive at N2.","travelTime":0,"length":0,"note":[{"type":"info","code":"previousIntersection","text":"The last intersection is O2"}],"roadName":"N2","nextRoadName":"","roadNumber":"","id":"M13"}]}],"note":[],"summary":{"distance":31641,"trafficTime":2004,"baseTime":1671,"flags":["motorway","builtUpArea"],"text":"The trip takes 31.6 km and 33 mins.","travelTime":2004}},"language":"en-us"}});
		route.updateFromNewWaypoints(waypoints).then(function() {
		});
		httpBackend.flush();
		expect(route.summary.trafficTime).toEqual(2004);
		expect(route.waypoints.length).toEqual(2);
	});
});

//TODO: create route Polyline
//TODO: bridgeMap lib -> Displays map, displays route and creates route polylines


/*
(1) API for route calculation of alternatives:
https://route.nlp.nokia.com/routing/7.2/calculateroute.json?jsonAttributes=1&waypoint0=geo!49.30289,8.64298&waypoint1=geo!49.48651,8.46679&alternatives=2&routeattributes=shape,routeId&language=en-US&mode=fastest;car;traffic:disabled&app_id=TSCNwGZFblBU5DnJLAH8&app_code=OvJJVLXUQZGWHmYf1HZCFg

(3) API to get routeId for route through points
https://route.nlp.nokia.com/routing/7.2/calculateroute.json?jsonAttributes=1&waypoint0=geo!49.3028901,8.6429826&waypoint1=geo!49.40315130977793,8.565532596093703&waypoint2=geo!49.486508,8.466788&routeattributes=shape,routeId&language=en-US&mode=fastest;car;traffic:disabled&app_id=TSCNwGZFblBU5DnJLAH8&app_code=OvJJVLXUQZGWHmYf1HZCFg

(4) API to get route by routeId
https://route.nlp.nokia.com/routing/7.2/getroute.json?jsonAttributes=1&routeId=AH0ACAAAAB4AAAA4AAAAmwAAAJwAAAB42mOYw8DAxMQABPwZqm2mgfzJDFDQ+dBAbCuDvTXD//8QgQ/7GZAAFxBPmXP0KhMDcyhrW+s+A7jGRkVjMUP8Gg03G89nBFoMF7Q8FPWxAcwIYLolwODAIMLBwdDAwAgAuHoa/P1SSLk=&mode=fastest;car;traffic:enabled&routeattributes=wp,sm,sh,bb,lg,no,shape&legattributes=wp,mn,le,tt&maneuverattributes=tt,le,ti,li,pt,pl,rn,nr,no,ru&instructionformat=text&app_id=TSCNwGZFblBU5DnJLAH8&app_code=OvJJVLXUQZGWHmYf1HZCFg

Zuerst suche des Start und Ziels
Dann Aufruf der API (1). Nach erhalt, erstellen eines Route-Objektes und sofortiger Call der API (4) um korrekte Traffic Informationen zu bekommen.
Gegebenenfalls anpassen der Route über (3), dann wieder sofort über (4) die eigentlichen Traffic-Informationen holen

Gespeichert werden alle maneuver einer Route (toLink und position Attribut)
Beim ersten Maneuver Position unt toLink separat als Wegpunkte, beim letzten nur position
*/
