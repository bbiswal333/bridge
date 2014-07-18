angular.module("notifier", []).factory("notifier", function () {
  var icons = [];
  icons.push("../img/notifier_info.png");      // Info
  icons.push("../img/notifier_tick.png");      // Success
  icons.push("../img/notifier_red_cross.png"); // Error
  var DEFAULT_DURATION = 5000;
  var notifications = JSON.parse(localStorage.getItem('notifcations')) || [];
  
  var Notifier = function (text, body, icon, tag, duration) {
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
    this.permissionCallback = undefined;

    function checkPermission(callbackGranted_fn, callbackDenied_fn, callbackNoSupport_fn, callbackPermissionRequest_fn) {
        if (typeof window.Notification === "undefined") {
            callbackNoSupport_fn();
        }
        else if (Notification.permission === "granted") {
            callbackGranted_fn();
        }
        else if (Notification.permission === "default") {
            console.log("seems like you need to activate once");
            callbackPermissionRequest_fn();
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

    this.onNotificationsNotSupported = function () {
      alert("Your browser does not support the Notification API");
    };
    this.onNotificationsDenied = function () {
      alert("You did not allow notifications!");
    };

    this.show = function (){
      checkPermission(function () {
        n = new Notification(self.text, {
          body: self.body,
          icon: self.icon,
          tag: self.tag
        });
        n.onshow = function () {
            if (typeof self.onshow !== "undefined") {
                self.onshow(n.tag);
            }
            if (duration >= 0) {
                setTimeout(function () {
                    self.close();
                }, self.duration);
            }
        };
        n.onclick = function () {
            if (typeof self.onclick !== "undefined") {
                self.onclick(n.tag);
            }
        };
        n.onclose = function () {
            if (typeof self.onclose !== "undefined") {
                self.onclose(n.tag);
            }
        };
        n.onerror = function () {
            if (typeof self.onerror !== "undefined") {
                self.onerror(n.tag);
            }
        };
      }, self.onNotificationsDenied, self.onNotificationsNotSupported, function () {
          if (typeof self.permissionCallback !== "undefined") {
              self.permissionCallback();
          }
      });
    };

    this.close = function () {
      if (typeof n !== "undefined") {
        n.close();
      }
    };

    this.getInstance = function () {
      return n;
    };

    this.getPermission = function () {
     if (typeof window.Notification === "undefined") { 
        return undefined;
      }
      else if (Notification.permission === "granted") {
        return true;
      }
      else if (Notification.permission === "denied") {
        return false;
      }
      else {
        return 'pleaseAsk';
      }
    };
  };

  //Because Chromium has a quite special implementation (Explicit user action is required for calling Notification.requestPermission()),
  //we need to check whether notifications are granted/denied or permissions have never been requested for this page. In case permission has never been requested
  //we need to display a screen where the user can explicitly take an action (press a button etc.) calling the requestPermission()-Method
  //Also see here: http://stackoverflow.com/questions/5040107/webkit-notifications-requestpermission-function-doesnt-work
  Notifier.prototype.chromePreCheckRequestNeeded = function () {
    if (typeof window.Notification !== "undefined") {
      return (Notification.permission === "default");  
    }
    return false;
  };

  Notifier.prototype.requestPermission = function (callback_fn) {
    if (typeof window.Notification !== "undefined") {
      Notification.requestPermission(callback_fn);
    }
  };

  function showMsg(title_s, body_s, icon_i, appIdentifier_s, onCLick_fn, kindOf_s) {
      var notifier = new Notifier(title_s, body_s, icons[icon_i], appIdentifier_s, DEFAULT_DURATION);
      notifier.onclick = onCLick_fn;
      notifier.show();
      notifications.unshift({
        title: title_s,
        body: body_s,
        icon: icon_i,
        app: appIdentifier_s || "",
        callback: onCLick_fn,
        timestamp: new Date().getTime(),
        kindOf: kindOf_s,
        state: 'new',
      });
      storeAllNotificationsInLocale();
  };

  function storeAllNotificationsInLocale() {
    localStorage.setItem('notifcations', JSON.stringify(notifications));
  };

  var instance = new Notifier();

  return {
    showInfo: function (title_s, body_s, appIdentifier_s, onClick_fn) {
      showMsg(title_s, body_s, 0, appIdentifier_s, onClick_fn, "info");
    },
    showSuccess: function (title_s, body_s, appIdentifier_s, onClick_fn) {
      showMsg(title_s, body_s, 1, appIdentifier_s, onClick_fn, "success");
    },
    showError: function (title_s, body_s, appIdentifier_s, onClick_fn) {
      showMsg(title_s, body_s, 2, appIdentifier_s, onClick_fn, "error");
    },
    chromePreCheckRequestNeeded: function () {
      return instance.chromePreCheckRequestNeeded();
    },
    requestPermission: function (callback_fn) {
      instance.requestPermission(function () {
        callback_fn();
      });
    },
    getPermission: function () {
      return instance.getPermission();
    },
    allNotifications: function() {
      return notifications;
    },
    clearNotifications: function() {
      notifications.length = 0;
      localStorage.clear();
    },
    store: function() {
      storeAllNotificationsInLocale();
    },
  };  
});