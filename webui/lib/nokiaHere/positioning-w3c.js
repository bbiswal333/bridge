(function(){ovi.provide("nokia.maps.positioning.Manager");(function(e){var l=e.positioning.Manager=new ovi.Class({Extends:e.util.OObject,initialize:function(e){e=e||{};if(this.constructor===l)return new l.Hb(e)},Statics:{setDefImpl:function(e){return this.Hb?!0:(this.Hb=e)&&!1}}})})(nokia.maps);ovi.provide("nokia.maps.positioning.w3c.Manager");
(function(e){var l,h=nokia.maps.util.d,d=e.w3c.Manager=new ovi.Class({Extends:e.Manager,initialize:function(){(!navigator||!("geolocation"in navigator)||!navigator.geolocation.getCurrentPosition)&&h("w3c positioning is not available in the environment");l=navigator.geolocation;this._super()},getCurrentPosition:function(c,d,b){l.getCurrentPosition(c,d,b)},watchPosition:function(c,d,b){return l.watchPosition(c,d,b)},clearWatch:function(c){l.clearWatch(c)}});e.Manager.setDefImpl(d)})(nokia.maps.positioning);
ovi.provide("nokia.maps.positioning._packaging.package-w3c");(function(e){var l=e.positioning;l.component=l.component||{};l.component.Positioning=l.component.Positioning||function(){ovi.warn("There is no UI defined for the display. Are you missing the UI package?");var h=new e.map.component.Component;h.c="PositioningDummy";h.n="0";return h}})(nokia.maps);})();
