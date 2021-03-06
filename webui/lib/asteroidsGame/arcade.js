/**
 * arcade.js
 * Copyright (c) 2010-2011,  Martin Wendt (http://wwWendt.de)
 *
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://code.google.com/p/arcade-js/wiki/LicenseInfo
 *
 * A current version and some documentation is available at
 *     http://arcade-js.googlecode.com/
 *
 * @fileOverview A 2D game engine that provides a render loop and support for
 * multiple moving objects.
 *
 * @author Martin Wendt
 * @version 0.0.1
 */
/*******************************************************************************

 * Helpers
 */

/**
 * Taken from John Resig's http://ejohn.org/blog/simple-javascript-inheritance/
 * Inspired by base2 and Prototype
 */
(function(){
  var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;

  // The base Class implementation (does nothing)
  /**@ignore*/
  this.Class = function(){};

  // Create a new Class that inherits from this class
  Class.extend = function(prop) {
	var _super = this.prototype;

	// Instantiate a base class (but only create the instance,
	// don't run the init constructor)
	initializing = true;
	var prototype = new this();
	initializing = false;

	// Copy the properties over onto the new prototype
	for (var name in prop) {
	  // Check if we're overwriting an existing function
	  prototype[name] = typeof prop[name] == "function" &&
		typeof _super[name] == "function" && fnTest.test(prop[name]) ?
		(function(name, fn){
		  return function() {
			var tmp = this._super;

			// Add a new ._super() method that is the same method
			// but on the super-class
			this._super = _super[name];

			// The method only need to be bound temporarily, so we
			// remove it when we're done executing
			var ret = fn.apply(this, arguments);
			this._super = tmp;

			return ret;
		  };
		})(name, prop[name]) :
		prop[name];
	}

	// The dummy class constructor
	function Class() {
	  // All construction is actually done in the init method
	  if ( !initializing && this.init ){
		this.init.apply(this, arguments);
	  }
	}

	// Populate our constructed prototype object
	Class.prototype = prototype;

	// Enforce the constructor to be what we expect
	Class.constructor = Class;

	// And make this class extendable
	Class.extend = arguments.callee;

	return Class;
  };
})();


/*----------------------------------------------------------------------------*/


/**
 * Sound support based on &lt;audio> element.
 * @class
 * @example
 * var clickSound = new AudioJS('click.wav')
 * var sound2 = new AudioJS(['click.ogg', 'click.mp3'])
 * var sound3 = new AudioJS({src: ['click.ogg', 'click.mp3'], loop: true)
 * [...]
 * clickSound.play();
 * 
 * @param {string|string[]|object} opts Audio URL, list of URLs or option dictionary.
 * @param {string|string[]} opts.src Audio URL or list of URLs.
 * @param {boolean} [opts.loop=false]  
 * @param {float} [opts.volume=1] 
 */
AudioJS = function(opts){
	if(typeof opts == "string"){
		opts = {src: [opts]};
	}else if($.isArray(opts)){
		opts = {src: opts};
	}
	this.opts = $.extend({}, AudioJS.defaultOpts, opts);
	this.audio = AudioJS.load(opts.src);
}
// Static members
$.extend(AudioJS,
	/** @lends AudioJS  */
	{
	_soundElement: null,
	_audioList: {},
	/**true, if browser supports the Audio class.*/
	audioObjSupport: undefined,
	/**true, if browser supports Audio.play().*/
	basicAudioSupport: undefined,
	/**true if browser supports looping (repeating) */
	loopSupport: undefined,
	defaultOpts: {
		loop: false,
		volume: 1
	},
	/**Load and cache audio element for this URL.
	 * This internal function is called by the constructor. 
	 * @param {string} url
	 */
	load: function(src) {
		var tag;
		if(typeof src == "string"){
			tag = src;
		}else{
			tag = src.join("~");
		}
		var audio = this._audioList[tag];
		if( !audio ) {
			if( !this._soundElement ) {
				this._soundElement = document.createElement("div");
				this._soundElement.setAttribute("id", "AudioJS-sounds");
//				this._soundElement.setAttribute("hidden", true);
				document.body.appendChild(this._soundElement);
//				$(this._soundElement).bind('ended',{}, function() {
//					window.console.log("AudioJS("+this+") loaded");
//				});
			}
			audio = this._audioList[tag] = document.createElement("audio");
//			audio.setAttribute("autoplay", true);
//			audio.setAttribute("preload", true);
			audio.setAttribute("preload", "auto");
			audio.setAttribute("autobuffer", true);
//			audio.setAttribute("src", url);
			for(var i=0; i<src.length; i++){
				var srcElement = document.createElement("source");
				srcElement.setAttribute("src", src[i]);
				audio.appendChild(srcElement);
			}
			this._soundElement.appendChild(audio);
//			var audio2 = document.getElementsByTagName("audio");
//			var audio3 = document.createElement("audio");
			$(audio).bind("ended", {}, function() {
				// TODO: we can simulate looping if it is not natively supported:
//			  	$(this).trigger('play');
				if(window.console){
					window.console.log("AudioJS("+tag+") ended");
				}
			});
		}
		return audio;
	}
});
try {
	var audio = new Audio("");
	AudioJS.audioObjSupport = !!(audio.canPlayType);
	AudioJS.basicAudioSupport = !!(!AudioJS.audioObjSupport ? audio.play : false);
} catch (e) {
	AudioJS.audioObjSupport = false;
	AudioJS.basicAudioSupport = false;
}

AudioJS.prototype = {
	/**Return string representation.
	 * @returns {string}
	 */
	toString: function() {
		return "AudioJS("+this.opts.src+")";
	},
	/**Play this sound.
	 *  @param {boolean} loop Optional, default: false
	 */
	play: function(loop) {
		if(this.audio.ended === true){
			// Interrupt currently playing sound
			//this.audio.pause();
			this.audio.currentTime = 0;
		}
		try{
			this.audio.play();
		}catch(e){
			if(window.console){
				window.console.log("audio.play() failed: " + e);
			}
		}
	},
	__lastentry: undefined
}



/*----------------------------------------------------------------------------*/


var ArcadeJS = Class.extend(
/** @lends ArcadeJS.prototype */
{
	/**
	 * A canvas based 2d game engine.
	 * @param {canvas|string} canvas Canvas element or element id
	 * @param {object} opts Game configuration
	 * @param {string} [opts.name]
	 * @param {int} [opts.fps=30] 
	 * @param {string} [opts.resizeMode='adjust'] Adjust internal canvas width/height to match its outer dimensions
	 * @param {boolean} [opts.fullscreenMode=false] Resize canvas to window extensions
	 * @param {object} [opts.fullscreenMargin={top: 0, right: 0, bottom: 0, left: 0}]
	 * @param {boolean} [opts.timeCorrection=true] Adjust object velocities for constant speed when frame rate drops.
	 * @param {object} opts.debug Additional debug settings
	 * 
	 * @constructs
	 */
	init: function(canvas, opts) {
		/**Game options (ArcadeJS.defaultGameOptions + options passed to the constructor).*/
		this.opts = $.extend(true, {}, ArcadeJS.defaultGameOptions, opts);
		// TODO: required?
		this.opts.debug = $.extend({}, ArcadeJS.defaultGameOptions.debug, opts.debug);
		// Copy selected options as object attributes
		ArcadeJS.extendAttributes(this, this.opts,
			"name fps resizeMode fullscreenMode fullscreenMargin timeCorrection");

		this._logBuffer = [];
		/**HTML5 canvas element*/
		if(typeof(canvas) == "string"){
			if(canvas[0] == "#") {
				canvas = canvas.substr(1);
			}
			canvas = document.getElementById(canvas);
		}
		if(!canvas || !canvas.getContext){
			throw "Invalid canvas (expected Canvas element or element ID)";
		}
		/**The augmented HTML &lt;canvas&gt; element. 
		 * @See CanvasObject */
		this.canvas = canvas;
		/**The 2D Rendering Context*/
		this.context = canvas.getContext("2d");
		$.extend(this.context, ArcadeCanvas);

		var $canvas = $(this.canvas);
		$canvas.css("backgroundColor", this.opts.backgroundColor);

		// Adjust canvas height and width (if specified as %, it would default to 300x150)
		this.canvas.width = $canvas.width();
		this.canvas.height = $canvas.height();
		this.context.strokeStyle = this.opts.strokeStyle;
		this.context.fillStyle = this.opts.fillStyle;

		/** Usable canvas area (defaults to full extent) */
		this.canvasArea = null;
		this.resetCanvasArea();

		/** Requested viewport */
		this.viewportOrg = null;
		/** Realized viewport (adjusted according to map mode).*/
		this.viewport = null;
		/** Viewport map mode ('none', 'extend', 'trim', 'stretch').*/
		this.viewportMapMode = "none";
		this.debug("game.init()");
		this._realizeViewport();

		this.objects = [];
		this.canvasObjects = [];
		this.idMap = {};
		this.keyListeners = [ this ];
		this.mouseListeners = [ this ];
		this.touchListeners = [ this ];
		this.activityListeners = [ this ];
		this.dragListeners = [];
		this._draggedObjects = [];
		this.typeMap = {};
//		this.downKeyCodes = [];
		this._activity = "idle";

		/**Current time in ticks*/
		this.time = new Date().getTime();
		/**Total number of frames rendered so far.*/
		this.frameCount = 0;
		/**Time elapsed since previous frame in seconds.*/
		this.frameDuration = 0;
		/**Frames per second rate that was achieved recently.*/
		this.realFps = 0;
		this._sampleTime = this.time;
		this._sampleFrameCount = 0;
		/**Correction factor that will assure constant screen speed when FpS drops.*/
		this.fpsCorrection = 1.0;
		this._lastSecondTicks = 0;
		this._lastFrameTicks = 0;
		/**Temporary dictionary to store data during one render loop step.*/
		this.frameCache = {};
		this._deadCount = 0;

		this._runLoopId = null;
		this.stopRequest = false;
		this.freezeMode = false;
		this._timeout = null;
//		this._timoutCallback = null;

		/**True if the left mouse button is down. */
		this.leftButtonDown = undefined;
		/**True if the middle mouse button is down. */
		this.middleButtonDown = undefined;
		/**True if then right mouse button is down. */
		this.rightButtonDown = undefined;
		/**Current mouse position in World Coordinates. */
		this.mousePos = undefined;
		/**Current mouse position in Canvas Coordinates. */
		this.mousePosCC = undefined;
		/**Position of last mouse click in World Coordinates. */
		this.clickPos = undefined;
		/**Position of last mouse click in Canvas Coordinates. */
		this.clickPosCC = undefined;
		/**Distance between clickPos and mousePos while dragging in World Coordinates. */
		this.dragOffset = undefined;
		/**Distance between clickPos and mousePos while dragging in Canvas Coordinates. */
		this.dragOffsetCC = undefined;
		/**e.touches recorded at last touch event.*/
		this.touches = undefined;

		this.keyCode = undefined;
		this.key = undefined;
		this.downKeyCodes = [];

		if(!ArcadeJS._firstGame) {
			ArcadeJS._firstGame = this;
		}
		// Bind keyboard events
		var self = this;
		$(document).bind("keyup keydown keypress", function(e){
			if( e.type === "keyup"){
				self.keyCode = null;
				self.key = null;
				var idx = self.downKeyCodes.indexOf(e.keyCode);
				if(idx >= 0){
					self.downKeyCodes.splice(idx, 1);
				}
//            	self.debug("Keyup %s: %o", ArcadeJS.keyCodeToString(e), self.downKeyCodes);
			} else if( e.type === "keydown"){
				self.keyCode = e.keyCode;
				self.key = ArcadeJS.keyCodeToString(e);
				if( self.downKeyCodes.indexOf(self.keyCode) < 0){
					self.downKeyCodes.push(self.keyCode);
				}
//            	self.debug("Keydown %s: %o", self.key, self.downKeyCodes);
			} else { // keypress
//            	self.debug("Keypress %s: %o", self.key, e);
				// Ctrl+Shift+D toggles debug mode
				if(self.key == "ctrl+meta+D"){
					self.setDebug(!self.opts.debug.showActivity);
				}
			}
			for(var i=0; i<self.keyListeners.length; i++) {
				var obj = self.keyListeners[i];
				if(e.type == "keypress" && obj.onKeypress) {
					obj.onKeypress(e);
				} else if(e.type == "keyup" && obj.onKeyup) {
					obj.onKeyup(e, self.key);
				} else if(e.type == "keydown" && obj.onKeydown) {
					obj.onKeydown(e, self.key);
				}
			}
		});
		// Prevent context menu on right clicks
		$(document).bind("contextmenu", function(e){
			return false;
		});
		// Bind mouse events
		// Note: jquery.mousehweel.js plugin is required for Mousewheel events
		$(document).bind("mousemove mousedown mouseup mousewheel", function(e){
			// Mouse position in canvas coordinates
//        	self.mousePos = new Point2(e.clientX-e.target.offsetLeft, e.clientY-e.target.offsetTop);
			self.mousePosCC = new Point2(e.pageX - self.canvas.offsetLeft,
					e.pageY - self.canvas.offsetTop);
			self.mousePos = Point2.transform(self.mousePosCC, self.cc2wc);
//    		self.debug("%s: %s (%s)", e.type, self.mousePos, self.mousePosCC);
			var startDrag = false,
				drop = false,
				cancelDrag = false;
			switch (e.type) {
			case "mousedown":
				self.clickPosCC = self.mousePosCC.copy();
				self.clickPos = self.mousePos.copy();
				switch(e.which){
				case 1: self.leftButtonDown = true; break;
				case 2: self.middleButtonDown = true; break;
				case 3: self.rightButtonDown = true; break;
				}
				cancelDrag = !!self._dragging;
				self._dragging = false;
				break;
			case "mouseup":
				self.clickPosCC = self.clickPos = null;
				switch(e.which){
				case 1: self.leftButtonDown = false; break;
				case 2: self.middleButtonDown = false; break;
				case 3: self.rightButtonDown = false; break;
				}
				drop = !!self._dragging;
				self._dragging = false;
				break;
			case "mousemove":
//	    		self.debug("%s: %s (%s) - %s", e.type, self.clickPosCC, self.mousePosCC, self.clickPosCC.distanceTo(self.mousePosCC));
				if(self._dragging || self.clickPosCC && self.clickPosCC.distanceTo(self.mousePosCC) > 4 ){
					startDrag = !self._dragging;
					self._dragging = true;
					self.dragOffsetCC = self.clickPosCC.vectorTo(self.mousePosCC);
					self.dragOffset = self.clickPos.vectorTo(self.mousePos);
//	        		self.debug("dragging: %s (%s)", self.dragOffset, self.dragOffsetCC);
				} else {
					self.dragOffsetCC = self.dragOffset = null;
				}
				break;
			}
			for(var i=0, l=self.mouseListeners.length; i<l; i++) {
				var obj = self.mouseListeners[i];
				if(e.type == "mousemove" && obj.onMousemove) {
					obj.onMousemove(arguments[0]);
				} else if(e.type == "mousedown" && obj.onMousedown) {
					obj.onMousedown(arguments[0]);
				} else if(e.type == "mouseup" && obj.onMouseup) {
					obj.onMouseup(arguments[0]);
				} else if(e.type == "mousewheel" && obj.onMousewheel) {
					obj.onMousewheel(arguments[0], arguments[1]);
				}
			}
			if(startDrag){
				self._draggedObjects = [];
				for(var i=0; i<self.dragListeners.length; i++) {
					var obj = self.dragListeners[i];
					if(obj.useCC){
						if( obj.containsCC(self.clickPosCC) && obj.onDragstart(self.clickPosCC) === true ) {
							self._draggedObjects.push(obj);
						}
					}else{
						if( obj.contains(self.clickPos) && obj.onDragstart(self.clickPos) === true ) {
							self._draggedObjects.push(obj);
						}
					}
				}
			}else{
				for(var i=0; i<self._draggedObjects.length; i++) {
					var obj = self._draggedObjects[i],
						do2 = obj.useCC ? self.dragOffsetCC : self.dragOffset;
					if(drop && obj.onDrop) {
						obj.onDrop(do2);
					} else if(cancelDrag && obj.onDragcancel) {
						obj.onDragcancel(do2);
					} else if(self._dragging && e.type == "mousemove" && obj.onDrag) {
						obj.onDrag(do2);
					}
				}
//            	if(drop || cancelDrag)
//            		self._draggedObjects = [];
			}
		});
		// Bind touch and gesture events
		$(canvas).bind("touchstart touchend touchmove touchcancel gesturestart gestureend gesturechange", function(e){
			self.touches = e.originalEvent.touches;
//			self.touches = e.originalEvent.targetTouches;
			self.debug("game got " + e.type + ": " + e.target.nodeName + ", touches.length=" + self.touches.length);
			self.debug("    orgtarget" + e.originalEvent.target.nodeName);
			// Prevent default handling (i.e. don't scroll or dselect the canvas)
			// Standard <a> handling is OK
//			if(e.target.nodeName != "A"){
				e.originalEvent.preventDefault();
//			}

			for(var i=0, l=self.touchListeners.length; i<l; i++) {
				var obj = self.touchListeners[i];
				if(obj.onTouchevent) {
					obj.onTouchevent(e, e.originalEvent);
				}
			}
		});
		// Adjust canvas height and width on resize events
		$(window).resize(function(e){
			var $c = $(self.canvas),
				width = $c.width(),
				height = $c.height();
			self.debug("window.resize: $canvas: " + width + " x " + height + "px");
			if(self.fullscreenMode){
				var pad = self.fullscreenMargin;
				height =  $(window).height() - (pad.top + pad.bottom);
				width =  $(window).width() - (pad.left + pad.right);
				$c.css("position", "absolute")
				  .css("top", pad.top)
				  .css("left", pad.left);
			}
			// Call onResize() and let user prevent default processing
			if(!self.onResize || self.onResize(width, height, e) !== false) {
				switch(self.resizeMode) {
				case "adjust":
					var hasChanged = false;
					if(self.canvas.width != width){
						self.debug("adjsting canvas.width from " + self.canvas.width + " to " + width);
						self.canvas.width = width;
						hasChanged = true;
					}
					if(self.canvas.height != height){
						self.debug("adjsting canvas.height from " + self.canvas.height + " to " + height);
						self.canvas.height = height;
						hasChanged = true;
					}
					// Adjust WC-to-CC transformation
					if(hasChanged){
						self._realizeViewport();
					}
					break;
				default:
					// Keep current coordinate range and zoom/shrink output(default 300x150)
				}
				// Resizing resets the canvas context(?)
				self.context.strokeStyle = self.opts.strokeStyle;
				self.context.fillStyle = self.opts.fillStyle;
				// Let canvas objects adjust their positions
				var ol = self.canvasObjects;
				for(var i=0, l=ol.length; i<l; i++){
					var o = ol[i];
					if( !o._dead && o.onResize ) {
						o.onResize(width, height, e);
					}
				}
				// Trigger afterResize callback
				self.afterResize && self.afterResize(e);
			}
		});
		// Trigger first resize event on page load
		self.debug("Trigger canvas.resize on init");
		$(window).resize();
	},
	toString: function() {
		return "ArcadeJS<" + this.name + ">";
	},
	/**Enable debug output
	 *
	 */
	setDebug: function(flag){
		flag = !!flag;
		var d = this.opts.debug;
		d.showActivity = d.showKeys = d.showObjects = d.showMouse
		= d.showVelocity = d.showBCircle = flag;
	},
	/**Output string to console.
	 * @param: {string} msg
	 */
	debug: function(msg) {
		if(this.opts.debug.logToCanvas){
			// Optionally store recent x lines in a string list
			var maxLines = this.opts.debug.logBufferLength;
			while( this._logBuffer.length > maxLines ){
				this._logBuffer.shift();
			}
			var dt = new Date(),
				tag = "" + dt.getHours() + ":" + dt.getMinutes() + "." + dt.getMilliseconds(),
				s = tag + " - " + Array.prototype.join.apply(arguments, [", "]);
			this._logBuffer.push(s);
		}
		if(window.console && window.console.log) {
//        	var args = Array.prototype.slice.apply(arguments, [1]);
//			Function.prototype.call.bind(console.log, console);
			try{
				// works on Firefox, Safari and Chrome and supports '%o', etc.
				window.console.log.apply(window.console, arguments);
			}catch(e){
				// works with IE as well, but can't make use of '%o' formatters
				window.console.log(Array.prototype.join.call(arguments));
			}
		}
	},
	/**Return current activity.
	 * @returns {string}
	 */
	getActivity: function() {
		return this._activity;
	},
	/**Set current activity and trigger onSetActivity events.
	 * @param {string} activity
	 * @returns {string} previous activity
	 */
	setActivity: function(activity) {
		var prev = this._activity;
		this._activity = activity;
		for(var i=0, l=this.activityListeners.length; i<l; i++) {
			var obj = this.activityListeners[i];
			if(obj.onSetActivity){
				obj.onSetActivity(this, activity, prev);
			}
		}
		return prev;
	},
	/**Return true, if current activity is in the list.
	 * @param {string | string array} activities
	 * @returns {boolean}
	 */
	isActivity: function(activities) {
//		if(typeof activities == "string"){
//			activities = activities.replace(",", " ").split(" ");
//		}
		activities = ArcadeJS.explode(activities);
		for(var i=0, l=activities.length; i<l; i++) {
			if(activities[i] == this._activity){
				return true;
			}
		}
		return false;
	},
	/**Schedule a callback to be triggered after a number of seconds.
	 * @param {float} seconds delay until callback is triggered
	 * @param {function} [callback=this.onTimout] function to be called
	 * @param {Misc} [data] Additional data passed to callback
	 */
	later: function(seconds, callback, data) {
		var timeout = {
			id: ArcadeJS._nextTimeoutId++,
			time: new Date().getTime() + 1000 * seconds,
			frame: this.fps * seconds,
			callback: callback || this.onTimeout,
			data: (data === undefined ? null : data)
		};
		// TODO: append to a sorted list instead
		this._timeout = timeout;
		return timeout.id;
	},
	/**Define the usable part of the canvas.
	 *
	 * If set, the viewport is projected into this region.
	 * This method should be called on startup and onResize.
	 *
	 * @param {float} x upper left corner in canvas coordinates
	 * @param {float} y upper left corner in canvas coordinates
	 * @param {float} width in canvas coordinates
	 * @param {float} height in canvas coordinates
	 * @param {boolean} clip prevent drawing outside this area (default: true)
	 */
	setCanvasArea: function(x, y, width, height, clip) {
		clip = (clip !== false);
		this.canvasArea = {x: x, y: y,
				width: width, height: height,
				clip: !!clip};
		this._customCanvasArea = true;
		this.debug("setCanvasArea: %o", this.canvasArea);
		this._realizeViewport();
	},
	/**Reset the usable part of the canvas to full extent.
	 */
	resetCanvasArea: function() {
		var $canvas = $(this.canvas);
		this.canvasArea = {x: 0, y: 0,
			width: $canvas.width(), height: $canvas.height(),
//			width: this.canvas.width, height: this.canvas.height,
			clip: false};
		this.debug("resetCanvasArea: %o", this.canvasArea);
		this._customCanvasArea = false;
	},

	/**Define the visible part of the world.
	 * @param {float} x lower left corner in world coordinates
	 * @param {float} y lower left corner in world coordinates
	 * @param {float} width in world coordinate units
	 * @param {float} height in world coordinate units
	 * @param {string} mapMode 'stretch' | 'fit' | 'extend' | 'trim' | 'none'
	 */
	setViewport: function(x, y, width, height, mapMode) {
		this.viewportMapMode = mapMode || "extend";
		this.viewportOrg = {x: x, y: y, width: width, height: height};
		this.debug("setViewport('" + mapMode + "')");
		this._realizeViewport();
	},

	_realizeViewport: function() {
		// Recalc usable canvas size. (In case of custom areas the user has to
		// do this in the onResize event.)
		if(this._customCanvasArea === false){
			this.resetCanvasArea();
		}
		var mapMode = this.viewportMapMode,
			ccWidth = this.canvasArea.width,
			ccHeight = this.canvasArea.height,
			ccAspect = ccWidth / ccHeight;

		this.debug("_realizeViewport('" + mapMode + "') for canvas " + ccWidth + " x " + ccHeight + " px");
		if(mapMode == "none"){
//			this.viewport = {x: 0, y: 0, width: ccWidth, height: ccHeight};
			this.viewport = {x: 0, y: ccHeight, width: ccWidth, height: -ccHeight};
			this.viewportOrg = this.viewport;
			this.wc2cc = new Matrix3();
			this.cc2wc = new Matrix3();
			this.onePixelWC = 1;
			return;

		}
		// Calculate the adjusted viewport dimensions
		var vp = this.viewportOrg,
			vpa = {x: vp.x, y: vp.y, width: vp.width, height: vp.height},
			vpAspect = vp.width / vp.height;
		this.viewport = vpa;

		this.debug("    viewportOrg:  ", vp.x, vp.y, vp.width, vp.height, mapMode);

		switch(mapMode){
		case "fit":
		case "extend":
			if(vpAspect > ccAspect){
				// Increase viewport height
				vpa.height = vp.width / ccAspect;
				vpa.y -= 0.5 * (vpa.height - vp.height);
			}else{
				// Increase viewport width
				vpa.width = vp.height * ccAspect;
				vpa.x -= 0.5 * (vpa.width - vp.width);
			}
			break;
		case "trim":
			if(vpAspect > ccAspect){
				// Decrease viewport width
				vpa.width = vp.height * ccAspect;
				vpa.x -= 0.5 * (vpa.width - vp.width);
			}else{
				// Decrease viewport height
				vpa.height = vp.width / ccAspect;
				vpa.y -= 0.5 * (vpa.height - vp.height);
			}
			break;
		case "stretch":
			break;
		default:
			throw "Invalid mapMode: '" + vp.mapMode + "'";
		}
		this.debug("    viewport adjusted ", vpa.x, vpa.y, vpa.width, vpa.height);
		// Define transformation matrices
		this.wc2cc = new Matrix3()
			.translate(-vpa.x, -vpa.y)
			.scale(ccWidth/vpa.width, -ccHeight/vpa.height)
			.translate(0, ccHeight)
			.translate(this.canvasArea.x, this.canvasArea.y)
			;
//		this.debug("wc2cc: %s", this.wc2cc);
		this.cc2wc = this.wc2cc.copy().invert();
		this.onePixelWC = vpa.width / ccWidth;
//		this.debug("cc2wc: %s", this.cc2wc);
	},

	_renderLoop: function(){
//        try {
//        	p.focused = document.hasFocus();
//		} catch(e) {}
		// Fire timeout event, if one was scheduled
		var timeout = this._timeout;
		if(timeout &&
			((this.timeCorrection && this.time >= timeout.time)
			 || (!this.timeCorrection && this.frameCount >= timeout.frame))
			 ){
			this._timeout = null;
			this.debug(this.toString() + " timeout " + timeout);
			timeout.callback.call(this, timeout.data);
		}
//		if( this._timeout > 0) {
//			this._timeout--;
//			if( this._timeout === 0) {
//		    	var callback = this._timeoutCallback || self.onTimeout;
//				callback.call(this);
//			}
//		}
		try {
			this.frameCache = {collisionCache: {}};
			this._stepAll();
			this._redrawAll();
			if( this.stopRequest ){
				this.stopLoop();
				this.stopRequest = false;
			}
		} catch(e) {
		   this.stopLoop();
		   this.debug("Exception in render loop: %o", e);
		   throw e;
		}
	},
	_stepAll: function() {
		// Some bookkeeping and timings
		var ticks = new Date().getTime(),
			sampleDuration = .001 * (ticks - this._sampleTime);

		if(this.timeCorrection){
			this.frameDuration = .001 * (ticks - this.time);
		}else{
			this.frameDuration = 1.0 / this.fps;
		}
		this.time = ticks;
		this.frameCount++;
//		this.debug("Frame #%s, frameDuration=%s, realFps=%s", this.frameCount, this.frameDuration, this.realFps);
		// Update number of actually achieved FPS ever second
		if(sampleDuration >= 1.0){
			this.realFps = (this.frameCount - this._sampleFrameCount) / sampleDuration;
			this._sampleTime = ticks;
			this._sampleFrameCount = this.frameCount;
		}
		if(this.freezeMode){
			return;
		}
		if(this.preStep){
			this.preStep.call(this);
		}
		var ol = this.objects;
		for(var i=0, l=ol.length; i<l; i++){
			var o = ol[i];
			if( !o._dead ){
				o._step();
			}
		}
		if(this.postStep){
			this.postStep.call(this);
		}
	},
	_redrawAll: function() {
		var ctx = this.context,
			ol, i, o;

		ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		// Draw background canvas objects
		ol = this.canvasObjects;
		for(i=0, l=ol.length; i<l; i++){
			o = ol[i];
			if( !o._dead && !o.hidden && o.isBackground) {
				o._redraw(ctx);
			}
		}
		// Push current transformation and rendering context
		ctx.save();
		try{
			if(this._customCanvasArea){
				var cca = this.canvasArea;
				if(cca.clip){
					ctx.beginPath();
					ctx.rect(cca.x, cca.y, cca.width, cca.height);
//				    ctx.stroke();
					ctx.clip();
				}
			}
			ctx.transformMatrix3(this.wc2cc);
			ctx.lineWidth = this.onePixelWC;
			if(this.preDraw){
				this.preDraw(ctx);
			}
			// Draw non-canvas objects
			ol = this.objects;
			for(i=0, l=ol.length; i<l; i++){
				o = ol[i];
				if( !o._dead && !o.hidden && !o.useCC) {
					o._redraw(ctx);
				}
			}
			if(this.postDraw){
				this.postDraw(ctx);
			}
		}finally{
			// Restore previous transformation and rendering context
			ctx.restore();
		}
		// Display FpS
		if(this.opts.debug.showFps){
			ctx.save();
			ctx.font = "12px sans-serif";
			ctx.fillText(this.realFps.toFixed(1) + " fps", this.canvas.width-50, 15);
			ctx.restore();
		}
		if(this.opts.debug.logToCanvas){
			ctx.save();
			ctx.font = "12px sans-serif";
			var x = 10,
				y = this.canvas.height - 15;
			for(var i=this._logBuffer.length-1; i>0; i--){
				ctx.fillText(this._logBuffer[i], x, y);
				y -= 15;
			}
			ctx.restore();
		}
		// Draw debug infos
		var infoList = [];
		if(this.opts.debug.showActivity){
			infoList.push("Activity: '" + this._activity + "'");
		}
		if(this.opts.debug.showKeys){
			infoList.push("Keys: [" + this.downKeyCodes + "]");
			infoList.push("Mouse: [" + (this.leftButtonDown ? "L" : ".")  + (this.middleButtonDown ? "M" : ".") + (this.rightButtonDown ? "R" : ".") + "]");
		}
		if(this.opts.debug.showObjects){
			infoList.push("Objects: " + this.objects.length + " (dead: "+ this._deadCount+")");
		}
		if(this.opts.debug.showMouse && this.mousePos){
			infoList.push(this.mousePos.toString(4));
			infoList.push("CC: " + this.mousePosCC);
			var hits = this.getObjectsAtPosition(this.mousePos);
			if(hits.length){
//				infoList.push("Hits: " + hits);
				ctx.font = "12px sans-serif";
				ctx.fillStyle = this.opts.debug.strokeStyle;
				ctx.fillText(hits, 10, this.canvas.height - 20);
			}
		}
		if(infoList.length){
			ctx.save();
			ctx.font = "12px sans-serif";
			ctx.fillStyle = this.opts.debug.strokeStyle;
			ctx.fillText(infoList.join(", "), 10, this.canvas.height - 5);
			ctx.restore();
		}
		// Let derived class draw overlays in CC
		if(this.postDrawCC){
			this.postDrawCC(ctx);
		}
		// Draw foreground canvas objects
		ol = this.canvasObjects;
		for(i=0, l=ol.length; i<l; i++){
			o = ol[i];
			if( !o._dead && !o.hidden && !o.isBackground) {
				o._redraw(ctx);
			}
		}
	},
	/**Start render loop.
	 */
	startLoop: function(){
		if( !this._runLoopId) {
			this.realFps = 0;
			this._sampleTime = new Date().getTime();
			this._sampleFrameCount = this.frameCount;
			var self = this;
			this._runLoopId = window.setInterval(
				function(){
					self._renderLoop.call(self);
				}, 1000/this.fps);
		}
	},
	/**Stop render loop.
	 */
	stopLoop: function(){
		this.stopRequest = false;
		if(this._runLoopId) {
			window.clearInterval(this._runLoopId);
			this._runLoopId = null;
		}
	},
	/**Return true, if render loop is active.
	 * @returns Boolean
	 */
	isRunning: function(){
		return !!this._runLoopId;
	},
	/**Add game object to object list.
	 * @param: {Movable} o
	 * @returns {Movable}
	 */
	addObject: function(o) {
		if( this.idMap[o.id] ) {
			throw "addObject("+o.id+"): duplicate entry";
		}
		//
		o.game = this;

		this.purge(false);

		this.objects.push(o);
		if(o.useCC){
			this.canvasObjects.push(o);
		}else{
//			this.objects.push(o);
		}
		this.idMap[o.id] = o;

		if( typeof o.onKeydown === "function"
			|| typeof o.onKeypress === "function"
			|| typeof o.onKeyup === "function") {
			this.keyListeners.push(o);
		}
		if( typeof o.onMousedown === "function"
			|| typeof o.onMousemove === "function"
			|| typeof o.onMouseup === "function"
			|| typeof o.onMousewheel === "function") {
			this.mouseListeners.push(o);
		}
		if( typeof o.onTouchevent === "function") {
			this.touchListeners.push(o);
		}
		if( typeof o.onSetActivity === "function") {
			this.activityListeners.push(o);
		}
		if( typeof o.onDragstart === "function") {
			this.dragListeners.push(o);
		}
		if( this.typeMap[o.type] ) {
			this.typeMap[o.type].push(o);
		} else {
			this.typeMap[o.type] = [ o ];
		}
		// Call onResize on startup, so object can initialize o.pos
		if( typeof o.onResize === "function") {
			o.onResize(this.canvas.width, this.canvas.height);
		}
		return o;
	},
	/**Purge dead objects from object list.
	 * @param: {boolean} force false: only if opts.purgeRate is reached.
	 */
	purge: function(force) {
		var ol = this.objects;
		if( this._purging
			|| ol.length < 1
			|| (!force && (this._deadCount/ol.length) < this.opts.purgeRate)
			){
			return false;
		}
		this._purging = true;
		this.debug("Purging objects: " + this._deadCount + "/" + ol.length + " dead.");
		this.objects = [];
		this.keyListeners = [ this ];
		this.mouseListeners = [ this ];
		this.touchListeners = [ this ];
		this.activityListeners = [ this ];
		this.dragListeners = [ ];
		this.idMap = {};
		this.typeMap = {};
		for(var i=0; i<ol.length; i++){
			var o = ol[i];
			if( !o._dead ){
				this.addObject(o);
			}
		}
		this._deadCount = 0;
		this._purging = false;
		return true;
	},
	/**Return objects with a given ID or null.
	 * @param: {string} id
	 */
	getObjectById: function(id) {
		return this.idMap[id] || null;
	},
	/**Return an array of objects with a given type (array may be empty).
	 * @param: {string} type (separate multiple types with a space)
	 */
	getObjectsByType: function(types) {
//		return this.typeMap[type] ? this.typeMap[type] : [];
		types = ArcadeJS.explode(types);
		var res = [];
		for(var i=0; i<types.length; i++){
			var list = this.typeMap[types[i]];
			if(list && list.length) {
				res = res.concat(list);
			}
		}
		return res;
	},
	/**Call func(obj) for all objects.
	 * @param: {function} func callback(game, object)
	 * @param: {string} types Restrict objects to this space separated typenames
	 */
	visitObjects: function(func, types) {
		if(types){
			types = ArcadeJS.explode(types);
		}
		var self = this;
		var __visitList = function(list){
			// don't cache list.length here!! may be recalced in callback
			for(var i=0; i<list.length; i++){
				var obj = list[i];
				if(obj._dead){
					continue;
				}
				var res = func.call(self, obj);
				if(res === false){
					return false;
				}
			}
		};
		if(types && types.length){
			for(var i=0; i<types.length; i++){
				var list = this.typeMap[types[i]];
				if(list && list.length) {
					var res = __visitList(list);
					if(res === false){
						break;
					}
				}
			}
		}else{
			__visitList(this.objects);
		}
	},
	/**Return an array of objects at a given point.
	 * @param: {Point2} pt Position in world coordinates
	 * @param: {string} types Restrict search to this comma separated typenames
	 */
	getObjectsAtPosition: function(pt, types, stopOnFirst) {
		pt = pt || this.mousePos;
		var matches = [];
		this.visitObjects(function(obj){
			if(obj.contains(pt)){
				matches.push(obj);
				if(stopOnFirst){
					return false;
				}
			}
		}, types);
		return matches;
	},
	/**Return true, if a key is currently pressed.
	 * @param: {int} keyCode
	 * @returns {boolean}
	 * @see Movable.onKeypress
	 */
	isKeyDown: function(keyCode) {
		return this.downKeyCodes.indexOf(keyCode) >= 0;
	},
	/**Wide check if object1 and object2 are collision candiates.
	 * @param: {Movable} object1
	 * @param: {Movable} object2
	 * @returns {boolean}
	 */
	preCheckCollision: function(object1, object2) {
		// Objects cannot collide with themselves
		if(object1 === object2) {
			return false;
		} else if(object1.hidden || object2.hidden || object1._dead || object2._dead ) {
			return false;
		}
		var id1 = ""+object1.id,
			id2 = ""+object2.id,
			tag = (id1 < id2) ? id1 + "~" + id2 : id2 + "~" + id1,
			cc = this.frameCache.collisionCache;
		// This pair was already checked
		if( cc[tag] ) {
			return false;
		}
		cc[tag] = true;
		// Check bounding circles if possible
//		if( object1.getBoundingRadius && object2.getBoundingRadius
//			&& object1.pos.distanceTo(object2.pos) > (object1.getBoundingRadius() + object2.getBoundingRadius())) {
//			return false;
//		}
		if( object1.getBoundingCircle && object2.getBoundingCircle ){
			var bs1 = object1.getBoundingCircle(),
				bs2 = object2.getBoundingCircle();
			if( bs1.center.distanceTo(bs2.center) > (bs1.r + bs2.r)) {
				return false;
			}
		}
		// TODO: check if velocities are pointing away from each other
		// Narrow check required
		return true;
	},
	/**Callback, triggered when this.later() timeout expires (and no callback was given).
	 * @param data data object passed to this.later()
	 * @event
	 */
	onTimeout: undefined,
	/**Called when window is resized (and on start).
	 * The default processing depends on the 'resizeMode' option.
	 * @param {Int} width
	 * @param {Int} height
	 * @param {Event} e
	 * @returns false to prevent default handling
	 * @event
	 */
	onResize: undefined,
	/**Called after window was resized.
	 * @param {Event} e
	 * @event
	 */
	afterResize: undefined,
	/**Called on miscelaneous touch and gesture events.
	 * @param {Event} event jQuery event
	 * @param {OriginalEvent} originalEvent depends on mobile device
	 * @event
	 */
	onTouchevent: undefined,
	/**Called before object.step() is called on all game ojects.
	 * @event
	 */
	preStep: undefined,
	/**Called after object.step() was called on all game ojects.
	 * @event
	 */
	postStep: undefined,
	/**Called before object.render() is called on all game ojects.
	 * object.step() calls have been executed and canvas was cleared.
	 * @param ctx Canvas 2D context.
	 * @event
	 */
	preDraw: undefined,
	/**Called after object.render() was called on all game ojects.
	 * @param ctx Canvas 2D context.
	 * @event
	 */
	postDraw: undefined,
	/**Called after all rendering happened and transformations are reset.
	 * Allows accessing the full, untransformed canvas in Canvas Coordinates.
	 * @param ctx Canvas 2D context.
	 * @event
	 */
	postDrawCC: undefined,
	// --- end of class
	__lastentry: undefined
});

/**Return a string array from a space or comma separated string.
 * @param {string} s Space or comma separated string.
 */
ArcadeJS.explode = function(s){
	if($.isArray(s)){
		return s;
	}
	return s.replace(",", " ").split(" ");
};

/**Copy selected dictionary members as object attributes.
 * @param {Class} object
 * @param dict
 * @param {string} attrNames comma seperated attribute names that will be
 * shallow-copied from dict to object.
 * @throws "Attribute 'x' not found."
 */
ArcadeJS.extendAttributes = function(object, dict, attrNames){
	attrNames = ArcadeJS.explode(attrNames);
	for(var i=0; i<attrNames.length; i++){
		var name = $.trim(attrNames[i]);
		if(dict[name] === undefined){
			throw("Attribute '" + name + "' not found in dictionary.");
		}
		object[name] = dict[name];
	}
};

/**Copy all entries from `opts` as `target` properties, if there is a matching
 * entry in `template`.
 *
 * Note: this is different from `$.extend()`, because only values are copied that
 * are present in `template`. This prevents accidently overriding protected
 * members in `target`.
 * If `temnplate` members have a value of `undefined`, they are mandatory. An
 * exception will be raised, if they are not found in `opts`.
 *
 * @param {object} target Object that will receive the properties (typically `this`).
 * @param {object} template Defines names and default values of all members to copy.
 * @param {object} opts Object with methods and values that override `template` (typically passed to the target constructor).
 */
ArcadeJS.guerrillaDerive = function(target, template, source){
	var missing = [];
	for(var name in template){
		if(source.hasOwnProperty(name)){
			target[name] = source[name];
		}else if(template.hasOwnProperty(name)){
			var val = template[name];
			if(val === undefined){
				missing.unshift(name);
			}else{
				target[name] = val;
			}
		}
	}
	if(missing.length){
		alert("guerrillaDerive: Missing mandatory options '" + missing.join("', '") + "'");
	}
};

/**Raise error if .
 * @param {object} object or dictionary
 * @param {string} attrNames comma seperated attribute names that will be
 * checked.
 * @throws "Attribute 'x' not found."
 */
ArcadeJS.assertAttributes = function(object, attrNames){
	attrNames = ArcadeJS.explode(attrNames);
	for(var i=0; i<attrNames.length; i++){
		var name = $.trim(attrNames[i]);
		if(object[name] === undefined){
			throw("Attribute '" + name + "' is undefined.");
		}
	}
	return true;
};
/**Throw error, if expression is `false`.
 * @throws "Assert failed: '...'"
 */
ArcadeJS.assert = function(expression, errorMsg){
	if( !expression ){
		throw("Assert failed: '" + errorMsg + "'.");
	}
};
/**Global pointer to first created game object.*/
ArcadeJS._firstGame = null;

/**Used to generate unique object IDs.*/
ArcadeJS._nextObjectId = 1;

/**Used to generate unique timer IDs.*/
ArcadeJS._nextTimeoutId = 1;

/**Default options dictionary.*/
ArcadeJS.defaultGameOptions = {
	name: "Generic ArcadeJS application",
	//activity: "idle",
	backgroundColor: "black", // canvas background color
	strokeStyle: "#ffffff", // default line color
	fillStyle: "#c0c0c0", // default solid filll color
	fullscreenMode: false, // Resize canvas to window extensions
	fullscreenMargin: {top: 0, right: 0, bottom: 0, left: 0},
	resizeMode: "adjust", // Adjust internal canvas width/height to match its outer dimensions
	viewport: {x: 0, y: 0, width: 100, height: 100, mapMode: "stretch"},
	fps: 30,
	timeCorrection: true, // Adjust velocites for constant speed when frame rate drops
	debug: {
		level: 1,
		logToCanvas: false,
		logBufferLength: 30,
		strokeStyle: "#80ff00",
		showActivity: false,
		showKeys: false,
		showFps: true,
		showObjects: false,
		showMouse: false,
		// globally override object debug settings:
		showVelocity: undefined,
		showBCircle: undefined
	},
	purgeRate: 0.5,
	_lastEntry: undefined
}


/*----------------------------------------------------------------------------*/


/**Augmented HTML 5 canvas.
 * This functions are added to a ArcadeJS canvas.
 * @class
 * @augments Canvas
 * @see <a href='http://www.w3.org/TR/html5/the-canvas-element.html#the-canvas-element'>The canvas element</a>
 * @see <a href='https://developer.mozilla.org/en/canvas_tutorial'>Canvas tutorial</a>
 */
ArcadeCanvas =
{
	__drawCircle: function(arg1, arg2, arg3) {
		this.beginPath();
		if(arguments.length === 3){
			this.arc(arg1, arg2, arg3, 0, 2 * Math.PI, true);
		} else if(arguments.length === 2){
			this.arc(arg1.x, arg1.y, arg2, 0, 2 * Math.PI, true);
		} else {
			this.arc(arg1.center.x, arg1.center.y, arg1.r, 0, 2 * Math.PI, true);
		}
	},
	__drawScreenText: function(strokeMode, text, x, y){
		var textWidth, textHeight;
		this.save();
		this.resetTransform();
		if(x === 0){
			textWidth = this.measureText(text).width;
			x = 0.5 * (this.canvas.width - textWidth);
		}else if( x < 0){
			textWidth = this.measureText(text).width;
			x = this.canvas.width - textWidth + x;
		}
		if(y === 0){
			textHeight = this.measureText("M").width;
			y = 0.5 * (this.canvas.height - textHeight);
		}else if(y < 0){
			textHeight = this.measureText("M").width;
			y = this.canvas.height - 1 + y;
		}
		if(strokeMode){
			this.strokeText(text, x, y);
		}else{
			this.fillText(text, x, y);
		}
		this.restore();
	},
	/**Render a circle outline to a canvas.
	 *
	 * @example
	 * strokeCircle2(circle2)
	 * strokeCircle2(point2, radius)
	 * strokeCircle2(center.x, center.y, radius)
	 */
	strokeCircle2: function() {
		this.__drawCircle.apply(this, arguments);
		this.closePath();
		this.stroke();
	},
	/**Render a filled circle to a canvas.
	 * @see strokeCircle2
	 */
	fillCircle2: function() {
		this.__drawCircle.apply(this, arguments);
		this.fill();
	},
	/**Render a Polygon2 outline to a canvas.
	 *
	 * @param {Polygon2} pg
	 * @param {Boolean} closed (optional) default: true
	 */
	strokePolygon2: function(pg, closed){
		var xy = pg.xyList;
		this.beginPath();
		this.moveTo(xy[0], xy[1]);
		for(var i=2; i<xy.length; i+=2){
			this.lineTo(xy[i], xy[i+1]);
		}
		if(closed !== false){
			this.closePath();
		}
		this.stroke();
	},
	/**Render a filled Polygon2 to a canvas.
	 *
	 * @param {Polygon2} pg
	 */
	fillPolygon2: function(pg){
		var xy = pg.xyList;
		this.beginPath();
		this.moveTo(xy[0], xy[1]);
		for(var i=2; i<xy.length; i+=2){
			this.lineTo(xy[i], xy[i+1]);
		}
		this.fill();
	},
	/**Render a vector to the canvas.
	 * @param {Vec2} vec
	 * @param {Point2} origin (optional) default: (0/0)
	 * @param {float} tipSize (optional) default: 5
	 */
	strokeVec2: function(vec, origin, tipSize) {
		origin = origin || new Point2(0, 0);
		tipSize = tipSize || 5;
		this.beginPath();
		this.moveTo(origin.x, origin.y);
		var ptTip = origin.copy().translate(vec);
		var pt = ptTip.copy();
		this.lineTo(pt.x, pt.y);
		this.closePath();
		this.stroke();
		if(vec.isNull()){
			return;
		}
		this.beginPath();
		var v = vec.copy().setLength(-tipSize);
		var vPerp = v.copy().perp().scale(.5);
		pt.translate(v).translate(vPerp);
		this.lineTo(pt.x, pt.y);
		pt.translate(vPerp.scale(-2));
		this.lineTo(pt.x, pt.y);
		this.lineTo(ptTip.x, ptTip.y);
//			this.lineTo(origin.x, origin.y);
		this.closePath();
		this.stroke();
	},
	/**Render a Point2 to the canvas.
	 * @param {Point2} pt
	 * @param {float} size (optional) default: 4
	 */
	strokePoint2: function(){
		if( pt.x ) {
			var size = arguments[1] || 4;
			this.rect(pt.x, pt.y, size, size);
		} else {
			var size = arguments[2] || 4;
			this.rect(arguments[0], arguments[1], size, size);
		}
	},
	/**Set context transformation to identity (so we can use pixel coordinates).
	 */
	resetTransform: function(){
		this.setTransform(1, 0, 0, 1, 0, 0);
	},
	/**Apply transformation matrix.
	 * This method takes care of transposing m, so it fits the canvas
	 * representation. The matrix is treated as affine (last row being [0 0 1]).
	 * @param {Matrix3} m
	 */
	transformMatrix3: function(m){
		m = m.m;
		this.transform(m[0], m[3], m[1], m[4], m[6], m[7]);
	},
	/**Set transformation matrix.
	 * This method takes care of transposing m, so it fits the canvas
	 * representation. The matrix is treated as affine (last row being [0 0 1]).
	 * @param {Matrix3} m
	 */
	setTransformMatrix3: function(m){
		m = m.m;
		this.setTransform(m[0], m[3], m[1], m[4], m[6], m[7]);
	},
	/**Render a text field to the canvas using canvas coordinates.
	 * Negative coordinates will align to opposite borders.
	 * Pass x = 0 or y = 0 for centered output.
	 * @param {string} text
	 * @param {float} x Horizontal position in CC (use negative value to align at right border)
	 * @param {float} y Vertical position in CC (use negative value to align at bottom)
	 */
	strokeScreenText: function(text, x, y){
		this.__drawScreenText(true, text, x, y);
	},
	fillScreenText: function(text, x, y){
		this.__drawScreenText(false, text, x, y);
	},
	__lastentry: undefined
}


/**
 * Return a nice string for a keyboard event. This function was inspired by
 * progressive.js.
 *
 * @param {Event} e A jQuery event object.
 * @returns {string} 'a' for the key 'a', 'A' for Shift+a, '^a' for Ctrl+a,
 *          '[shift]' for
 */
ArcadeJS.keyCodeToString = function(e) {
	var code = e.keyCode;
	var shift = !!e.shiftKey;
	var key = null;

	// Map "shift + keyCode" to this code
	var shiftMap = {
		// Numbers
		48: 41, // )
		49: 33, // !
		50: 64, // @
		51: 35, // #
		52: 36, // $
		53: 37, // %
		54: 94, // ^
		55: 38, // &
		56: 42, // *
		57: 40, // (
		// Symbols and their shift-symbols
		107: 43,  // +
		219: 123, // {
		221: 125, // }
		222: 34   // "
	};
	// Coded keys
	var codeMap = {
			188: 44, // ,
			109: 45, // -
			190: 46, // .
			191: 47, // /
			192: 96, // ~
			219: 91, // [
			220: 92, // \
			221: 93, // ]
			222: 39  // '
		};
	var specialMap = {
		8: "backspace",
		9: "tab",
		10: "enter",
		13: "return",
		16: "shift",
		17: "control",
		18: "alt",
		27: "esc",
		37: "left",
		38: "up",
		39: "right",
		40: "down",
		127: "delete"
		};

	// Letters
	if ( code >= 65 && code <= 90) { // A-Z
		// Keys return ASCII for upcased letters.
		// Convert to downcase if shiftKey is not pressed.
		if ( !shift )
			code = code + 32;
		shift = false;
		key = String.fromCharCode(code);
	} else if (shiftMap[code]) {
		code = shiftMap[code];
		shift = false;
		key = String.fromCharCode(code);
	} else if (codeMap[code]) {
		code = codeMap[code];
		key = String.fromCharCode(code);
	} else if (specialMap[code]) {
		key = specialMap[code];
	} else {
		key = String.fromCharCode(code);
	}
	var prefix = "";
	if(shift && code != 16){
		prefix = "shift+" + prefix;
	}
	if(e.metaKey){
		prefix = "meta+" + prefix;
	}
	if(e.ctrlKey && code != 17){
		prefix = "ctrl+" + prefix;
	}
	if(e.altKey && code != 18){
		prefix = "alt+" + prefix;
	}
	//window.console.log("keyCode:%s -> using %s, '%s'", e.keyCode,  code, prefix + key);

	return prefix + key;
}

/* ****************************************************************************/

var Movable = Class.extend(
/** @lends Movable.prototype */
{
	/**Represents a game object with kinetic properties.
	 * Used as base class for all game objects.
	 *  
	 * @constructs
	 * @param {string} type Instance type identifier used to filter objects.
	 * @param [opts] Additional options.
	 * @param {string} [opts.id=random] Unique instance identifier.
	 * @param {object} [opts.debug] Additional debug options.
	 * @see Movable.defaultOptions
	 */
	init: function(type, opts) {
		/**Type identifier used to filter objects.*/
		this.type = type;
		/**Unique ID (automatically assigned if ommited).*/
		this.id = (opts && opts.id) ? opts.id : "#" + ArcadeJS._nextObjectId++;
		/**Parent ArcadeJS object (set by game.addObject() method).*/
		this.game = undefined;
		/**True, if object is hidden and not tested for collisions*/
		this.hidden = false;
		this._dead = false;
		this._activity = null;
		// Set options
		this.opts = $.extend(true, {}, Movable.defaultOptions, opts);
		// TODO: required?
		if(opts){
			this.opts.debug = $.extend({}, Movable.defaultOptions.debug, opts.debug);
		}
		opts = this.opts;
		// Copy some options as direct attributes
		/**True, if this control uses native Canvas Coords instead of WC viewport.*/
		this.useCC = !!opts.useCC;
		/**Object position in World Coordinates (center of mass).*/
		this.pos = opts.pos ? new Point2(opts.pos) : new Point2(0, 0);
/*
		if(this.useCC){
			if( opts.pos ){ throw("'pos' is not allowed with useCC mode."); }
			if( !opts.posCC ){ throw("Missing required option: 'posCC'."); }
			this.pos = undefined;
			this.posCC = opts.posCC;
		}else{
			if( opts.posCC ){ throw("'pos' is only allowed in useCC mode."); }
			this.pos = opts.pos ? new Point2(opts.pos) : new Point2(0, 0);
			this.posCC = undefined;
		}
*/
		/** Object scale.*/
		this.scale = opts.scale ? +opts.scale : 1.0;
		/** Object orientation in radians.*/
		this.orientation = opts.orientation ? +opts.orientation : 0;
		this.mc2wc = null;
		this.wc2mc = null;
		this._updateTransformations();

		this.mass = opts.mass ? +opts.mass : 1;
		this.velocity = opts.velocity ? new Vec2(opts.velocity) : new Vec2(0, 0);
		this.translationStep = new Vec2(0, 0);
		this.rotationalSpeed = opts.rotationalSpeed || null; //0.0 * LinaJS.DEG_TO_RAD;  // rad / tick
		this.rotationStep = 0;
		/**Defines, what happens when object leaves the viewport to the left or right.
		 * Values: ('none', 'wrap', 'stop', 'bounce')*/
		this.clipModeX = opts.clipModeX || "none";
		/**Defines, what happens when object leaves the viewport to the left or right.
		 * @See Movable#clipModeX
		 */
		this.clipModeY = opts.clipModeY || "none";
		this._timeout = null; //+opts.timeout;

//        this.tran = new BiTran2();.translate();
	},
	toString: function() {
		var DEGS = String.fromCharCode(176);
		return "Movable<"+this.type+"> '" + this.id + "' @ "
			+ this.pos.toString(4) + " " + (this.orientation * LinaJS.R2D).toFixed(0) + DEGS
			+ " acivity: '" + this._activity + "'";
	},
	/**Return current activity.
	 * @returns {string}
	 */
	getActivity: function() {
		return this._activity;
	},
	/**Set current activity and trigger onSetActivity events.
	 * @param {string} activity
	 * @returns {string} previous activity
	 */
	setActivity: function(activity) {
		var prev = this._activity;
		this._activity = activity;
		for(var i=0; i<this.game.activityListeners.length; i++) {
			var obj = this.game.activityListeners[i];
			if(obj.onSetActivity)
				obj.onSetActivity(this, activity, prev);
		}
		return prev;
	},
	/**Return true, if current activity is in the list.
	 * @param {string | string array} activities (seperate multiple entries with space)
	 * @returns {boolean}
	 */
	isActivity: function(activities) {
//		if(typeof activities == "string"){
//			activities = activities.replace(",", " ").split(" ");
//		}
		activities = ArcadeJS.explode(activities);
		for(var i=0, l=activities.length; i<l; i++) {
			if(activities[i] == this._activity){
				return true;
			}
		}
		return false;
	},
	/**Schedule a callback to be triggered after a number of seconds.
	 * @param {float} seconds delay until callback is triggered
	 * @param {function} [callback=this.onTimeout] Function to be called.
	 * @param {Misc} [data] Additional data passed to callback
	 */
	later: function(seconds, callback, data) {
		var timeout = {
			id: ArcadeJS._nextTimeoutId++,
			time: new Date().getTime() + 1000 * seconds,
			// if later() is called in the constructor, 'game' may not be set
			frame: (this.game ? this.game.fps : ArcadeJS._firstGame.fps) * seconds,
			callback: callback || this.onTimeout,
			data: (data === undefined ? null : data)
		};
		// TODO: append to a sorted list instead
		this._timeout = timeout;
		return timeout.id;
	},

	/**Set MC-to-WC transformation matrix and inverse from this.pos, .orientation and .scale.
	 */
	_updateTransformations: function() {
		// TODO: Use negative orientation??
		// Otherwise ctx.tran_redraw
//		this.mc2wc = new Matrix3().scale(this.scale).rotate(this.orientation).translate(this.pos.x, this.pos.y);
		this.mc2wc = new Matrix3().scale(this.scale).rotate(-this.orientation).translate(this.pos.x, this.pos.y);
		this.wc2mc = this.mc2wc.copy().invert();
	},

	/**
	 *
	 */
	_step: function() {
		// Fire timeout event, if one was scheduled
		var timeout = this._timeout;
		if(timeout &&
			((this.game.timeCorrection && this.game.time >= timeout.time)
			 || (!this.game.timeCorrection && this.game.frameCount >= timeout.frame))
			 ){
			this._timeout = null;
			this.game.debug(this.toString() + " timeout " + timeout);
			timeout.callback.call(this, timeout.data);
		}
		// Kill this instance and fire 'die' event, if time-to-live has expired
//		if( this.ttl > 0) {
//			this.ttl--;
//			if( this.ttl === 0) {
//				this.die();
//			}
//		}
		// Save previous values
		this.prevPos = this.pos.copy();
		this.prevOrientation = this.orientation;
		this.prevVelocity = this.velocity.copy();
		this.prevRotationalSpeed = this.rotationalSpeed;
		// Update position in world coordinates
		var factor = this.game.frameDuration;
		this.translationStep = this.velocity.copy().scale(factor);
		this.rotationStep = factor * this.rotationalSpeed;
		this.orientation += this.rotationStep;
		if(this.velocity && !this.velocity.isNull()) {
			this.pos.translate(this.translationStep);
			// wrap around at screen borders
			var viewport = this.game.viewport;
			switch(this.clipModeX){
			case "wrap":
				this.pos.x = (Math.abs(viewport.width) + this.pos.x) % viewport.width;
				break;
			case "stop":
				this.pos.x = LinaJS.clamp(this.pos.x, viewport.x, viewport.x + viewport.width);
				break;
			case "die":
				if(this.pos.x < viewport.x || this.pos.x > viewport.x + viewport.width){
					this.die();
				}
				break;
			}
			switch(this.clipModeY){
			case "wrap":
				this.pos.y = (Math.abs(viewport.height) + this.pos.y) % viewport.height;
				break;
			case "stop":
				this.pos.y = LinaJS.clamp(this.pos.y, viewport.y, viewport.y + viewport.height);
				break;
			case "die":
				if(this.pos.y < viewport.y || this.pos.y > viewport.y + viewport.height){
					this.die();
				}
				break;
			}
		}
		// Update MC-to-WC transformation
		this._updateTransformations();
		// Let derived class change it
		if(typeof this.step == "function"){
			this.step();
		}
	},
	_redraw: function(ctx) {
		if( this.hidden ) {
			return;
		}
		// Push current transformation and rendering context
		ctx.save();
		try{
			// Render optional debug infos
			ctx.save();
			if(this.getBoundingCircle && (this.opts.debug.showBCircle || this.game.opts.debug.showBCircle)){
				ctx.strokeStyle = this.game.opts.debug.strokeStyle;
				ctx.strokeCircle2(this.getBoundingCircle());
			}
			if(this.velocity && !this.velocity.isNull() && (this.opts.debug.showVelocity || this.game.opts.debug.showVelocity)){
				ctx.strokeStyle = this.game.opts.debug.strokeStyle;
				var v = Vec2.scale(this.velocity, this.opts.debug.velocityScale);
				ctx.strokeVec2(v, this.pos, 5 * this.game.onePixelWC);
			}
			ctx.restore();
			// Apply object translation, rotation and scale
			// TODO: this currently works, but only if we apply a *negative*
			// orientation in _updateTransformations():
			//   this.mc2wc = new Matrix3().scale(this.scale).rotate(-this.orientation).translate(this.pos.x, this.pos.y);
			ctx.transformMatrix3(this.mc2wc);
			// This also works (note that we apply a positive orientaion here,
			// and the order is differnt from mc2wc:
/*
			ctx.translate(this.pos.x, this.pos.y);
			if( this.scale && this.scale != 1.0 ){
				ctx.scale(this.scale, this.scale);
			}
			if( this.orientation ){
				ctx.rotate(this.orientation);
			}
*/
			// Let object render itself in its own modelling coordinates
			this.render(ctx);
		}finally{
			// Restore previous transformation and rendering context
			ctx.restore();
		}
	},
	/**@function Return bounding circle for fast a-priory collision checking.
	 * @returns {Circle2} bounding circle in world coordinates.
	 * in modelling coordinates.
	 */
	getBoundingCircle: undefined,
	/**@function Return bounding box for fast a-priory collision checking.
	 * in modelling coordinates.
	 */
	getBoundingBox: undefined,
	/**Remove this object from the game.
	 */
	die: function() {
		if( this._dead ){
			return;
		}
		this._dead = true;
		this.hidden = true;
		if( this.onDie ){
			this.onDie();
		}
		if(this._dead){
			this.game._deadCount++;
			if(!this.game.purge(false)){
				// If we did not purge, make sure it is at least removed from the type map
				var typeMap = this.game.typeMap[this.type];
				var idx = typeMap.indexOf(this);
				typeMap.splice(idx, 1);
			}
		}
	},
	isDead: function() {
		return !!this._dead;
	},
	/**Return true, if point hits this object.
	 * @param {Point2} pt Point in world coordinates
	 * @returns {boolean}
	 */
	contains: function(pt) {
		if(this.getBoundingCircle) {
			var boundsWC = this.getBoundingCircle();//.copy().transform(this.mc2wc);
			return boundsWC.center.distanceTo(pt) <= boundsWC.r;
		}
		return undefined;
	},
	/**Return true, if object intersects with this object.
	 * @param {Movable} otherObject
	 * @returns {boolean}
	 */
	intersectsWith: function(otherObject) {
		if( this.getBoundingCircle && otherObject.getBoundingCircle) {
			var boundsWC = this.getBoundingCircle(),//.copy().transform(this.mc2wc),
				boundsWC2 = otherObject.getBoundingCircle();//.copy().transform(otherObect.mc2wc);
			return boundsWC.center.distanceTo(boundsWC2.center) <= (boundsWC.r + boundsWC2.r);
		}
		return undefined;
	},
	/**Override this to apply additional transformations.
	 * @event
	 */
	step: undefined,
	/**Draw the object to the canvas.
	 * The objects transformation is already applied to the canvas when this
	 * function is called. Therefore drawing commands should use modeling
	 * coordinates.
	 * @param ctx Canvas 2D context.
	 * @event
	 */
	render: undefined,
	/**Callback, triggered when document keydown event occurs.
	 * @param {Event} e
	 * @param {string} key stringified key, e.g. 'a', 'A', 'ctrl+a', or 'shift+enter'.
	 * @event
	 */
	onKeydown: undefined,
	/**Callback, triggered when document keyup event occurs.
	 * @param {Event} e
	 * @param {string} key stringified key, e.g. 'a', 'A', 'ctrl+a', or 'shift+enter'.
	 * @event
	 */
	onKeyup: undefined,
	/**Callback, triggered when document keypress event occurs.
	 * Synchronous keys are supported
	 * @param {Event} e
	 * @see ArcadeJS.isKeyDown(keyCode)
	 * @event
	 */
	onKeypress: undefined,
	/**Callback, triggered when mouse wheel was used.
	 * Note: this requires to include the jquery.mouseweheel.js plugin.
	 * @param {Event} e
	 * @param {int} delta +1 or -1
	 * @event
	 */
	onMousewheel: undefined,
	/**Callback, triggered when a mouse drag starts over this object.
	 * @param {Point2} clickPos
	 * @returns {boolean} must return true, if object wants to receive drag events
	 * @event
	 */
	onDragstart: undefined,
	/**Callback, triggered while this object is dragged.
	 * @param {Vec2} dragOffset
	 * @event
	 */
	onDrag: undefined,
	/**Callback, triggered when a drag operation is cancelled.
	 * @param {Vec2} dragOffset
	 * @event
	 */
	onDragcancel: undefined,
	/**Callback, triggered when a drag operation ends with mouseup.
	 * @param {Vec2} dragOffset
	 * @event
	 */
	onDrop: undefined,
	/**Called on miscelaneous touch... and gesture... events.
	 * @param {Event} event jQuery event
	 * @param {OriginalEvent} originalEvent depends on mobile device
	 * @event
	 */
	onTouchevent: undefined,
	/**Callback, triggered when game or an object activity changes.
	 * @param {Movable} target object that changed its activity (May be the ArcadeJS object too).
	 * @param {string} activity new activity
	 * @param {string} prevActivity previous activity
	 * @event
	 */
	onSetActivity: undefined,
	/**Callback, triggered when timeout expires (and no callback was given).
	 * @param data data object passed to later()
	 * @event
	 */
	onTimeout: undefined,
	/**Callback, triggered when this object dies.
	 * @event
	 */
	onDie: undefined,
	/**Adjust velocity (by applying acceleration force) to move an object towards
	 * a target position.
	 * @param {float} stepTime
	 * @param {Point2} targetPos
	 * @param {float} eps
	 * @param {float} maxSpeed
	 * @param {float} turnRate
	 * @param {float} maxAccel
	 * @param {float} maxDecel
	 * @returns {booelan} true, if target position is reached (+/- eps)
	 */
	driveToPosition: function(stepTime, targetPos, eps, maxSpeed, turnRate, maxAccel, maxDecel){
		var vTarget = this.pos.vectorTo(targetPos),
			dTarget = vTarget.length(),
			aTarget = LinaJS.angleDiff(this.orientation + 90*LinaJS.D2R, vTarget.angle()),
			curSpeed = this.velocity.length();

		if(dTarget <= eps && curSpeed < eps){
			this.velocity.setNull();
			return true;
		}
		if(this.velocity.isNull()){
//			this.velocity = vTarget.copy().setLength(stepTime * maxAccel).limit(maxSpeed);
			this.velocity = LinaJS.polarToVec(this.orientation, LinaJS.EPS);
			curSpeed = this.velocity.length();
			maxAccel = 0;
		}
		// Turn to target (within 0.1∞ accuracy)
		if(Math.abs(aTarget) > 0.1 * LinaJS.D2R){
			if(aTarget > 0){
				this.orientation += Math.min(aTarget, stepTime * turnRate);
			}else{
				this.orientation -= Math.min(-aTarget, stepTime * turnRate);
			}
			this.velocity.setAngle(this.orientation + 90*LinaJS.D2R);
//			this.game.debug("driveToPosition: turning to " + this.orientation * LinaJS.R2D + "∞");
		}
		// Decelerate, if desired and target is in reach
		if(maxDecel > 0 && dTarget < curSpeed){
			this.velocity.setLength(Math.max(LinaJS.EPS, curSpeed - stepTime * maxDecel));
//			this.game.debug("driveToPosition: breaking to speed = " + this.velocity.length());
		}else if(maxAccel > 0 && maxSpeed > 0 && Math.abs(curSpeed - maxSpeed) > LinaJS.EPS){
			// otherwise accelerate to max speed, if this is desired
			this.velocity.setLength(Math.min(maxSpeed, curSpeed + stepTime * maxAccel));
//			this.game.debug("driveToPosition: accelerating to speed = " + this.velocity.length());
		}
		return false;
	},
///**
// * Adjust velocity (by applying acceleration force) to move an object towards
// * a target position.
// */
//	floatToPosition: function(targetPos, maxAccel, maxSpeed, maxDecel){
//		//TODO
//		var vDest = this.pos.vectorTo(targetPos);
//		this.velocity.accelerate(vDest.setLength(maxAccel), maxSpeed);
//		// make sure we are heading to the moving direction
//		this.orientation = this.velocity.angle() - 90*LinaJS.D2R;
////		this.game.debug("v: " + this.velocity);
////		if( this.attackMode && vTarget.length() < minFireDist
////				&& Math.abs(vTarget.angle() - this.orientation - 90*LinaJS.D2R) < 25*LinaJS.D2R){
////			this.fire();
////		}
//	},


	/**Turn game object to direction or target point.
	 * @param {float} stepTime
	 * @param {float | Vec2 | Point2} target angle, vector or position
	 * @param {float} turnRate
	 * @returns {booelan} true, if target angle is reached
	 */
	turnToDirection: function(stepTime, target, turnRate){
		var angle = target;
		if(target.x !== undefined){
			// target is a point: calc angle from current pos top this point
			angle = this.pos.vectorTo(target).angle();
		}else if(target.dx !== undefined){
			// target is a vector
			angle = target.angle();
		}
		// now calc the delta-angle
		angle = LinaJS.angleDiff(this.orientation + 90*LinaJS.D2R, angle);
		// Turn to target (within 0.1∞ accuracy)
		if(Math.abs(angle) <= 0.1 * LinaJS.D2R){
			return true;
		}
		if(angle > 0){
			this.orientation += Math.min(angle, stepTime * turnRate);
		}else{
			this.orientation -= Math.min(-angle, stepTime * turnRate);
		}
		this.velocity.setAngle(this.orientation + 90*LinaJS.D2R);
		// return true, if destination orientation was reached
		return Math.abs(angle) <= stepTime * turnRate;
	},

	// --- end of class
	__lastentry: undefined
});

/**Default options used when a Movable or derived object is constructed. */
Movable.defaultOptions = {
	pos: null,
	clipModeX: "wrap",
	clipModeY: "wrap",
	debug: {
		level: 1,
		showLabel: false,
		showBBox: false,
		showBCircle: false,
		showVelocity: false,
		velocityScale: 1.0
	},
	__lastentry: undefined
}
