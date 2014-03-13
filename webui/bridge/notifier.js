angular.module("notifier", []).factory("notifier", function () {
  var icons = [];
  icons.push("../img/notifier_info.png");      // Info
  icons.push("../img/notifier_tick.png");      // Success
  icons.push("../img/notifier_red_cross.png"); // Error
  var DEFAULT_DURATION = 4000;

  function showMsg(title_s, body_s, icon_i, tag_s, onCLick_fn) {
      var notifier = new Notifier(title_s, body_s, icons[icon_i], tag_s, DEFAULT_DURATION);
      notifier.onclick = onCLick_fn;
      notifier.show();
  }

  return {
    showInfo: function (title_s, body_s, tag_s, onCLick_fn) {
      showMsg(title_s, body_s, 0, tag_s, onCLick_fn);
    },
    showSuccess: function (title_s, body_s, tag_s, onCLick_fn) {
      showMsg(title_s, body_s, 1, tag_s, onCLick_fn);
    },
    showError: function (title_s, body_s, tag_s, onCLick_fn) {
      showMsg(title_s, body_s, 2, tag_s, onCLick_fn);
    }
  };

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
});