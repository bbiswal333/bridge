//Implemented according to: https://developer.mozilla.org/en-US/docs/Web/API/notification (visited: 12.03.2014, 13:50)
function notify() {
  var noti = new Notifier("Bridge can now send you desktop notifications", undefined, "../img/notifier_tick.png", "10", 7000);
  noti.onshow = function (id) {
  };
  setTimeout(function() {
    noti.show();
  }, 100); 
}

function Notifier(text, body, icon, tag, duration) {
  var self = this;
  var n;

  this.text = text;
  this.body = (body || "");
  this.icon = (icon || "");
  this.tag = (tag || "");
  this.duration = (duration || -1);

  this.onshow = undefined;
  this.onclick = undefined;
  this.onclose = undefined;
  this.onerror = undefined;

  this.show = function (){
    checkPermission(function () {
      n = new Notification(self.text, {
        body: self.body,
        icon: self.icon,
        tag: self.tag
      });
      n.onshow = function () {
        if (typeof self.onshow != "undefined") self.onshow(n.tag);
        if (duration >= 0) {
          setTimeout(function () {
            self.close();
          }, self.duration);
        }
      };
      n.onclick = function () {
        if (typeof self.onclick != "undefined") self.onclick(n.tag);
      };
      n.onclose = function () {
        if (typeof self.onclose != "undefined") self.onclose(n.tag);
      };
      n.onerror = function () {
        if (typeof self.onerror != "undefined") self.onerror(n.tag);
      };
    }, function () {
      alert("You did not allow notifications!");
    }, function () {
      alert("Your browser does not support the Notification API");
    });
  };

  this.close = function () {
    if (typeof n != "undefined") {
      n.close();
    }
  };

  this.getInstance = function () {
    return n;
  };

  function checkPermission(callbackGranted_fn, callbackDenied_fn, callbackNoSupport_fn) {
    if (typeof window.Notification == "undefined") { 
      callbackNoSupport_fn();
    }
    else if (Notification.permission === "granted") {
      callbackGranted_fn();
    }
    else if (Notification.permission !== "denied") {
      Notification.requestPermission(function (perm) {
        if (perm === "granted") {
          callbackGranted_fn();
        }
        else {
          callbackDenied_fn();
        }
      });
    }
    else {
      callbackDenied_fn();
    }
  }
} 