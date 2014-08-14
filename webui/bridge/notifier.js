angular.module("notifier", []).factory("notifier", ["$log", function ($log) {
  var icons = [];
  icons.push("../img/notifier_info.png");      // Info
  icons.push("../img/notifier_tick.png");      // Success
  icons.push("../img/notifier_red_cross.png"); // Error
  var DEFAULT_DURATION = 5000;
  var notifications = JSON.parse(localStorage.getItem('notifcations')) || [];
  
  //var Notifier = function (text, body, icon, tag, duration) {
  var Notifier = function(notification){
    var self = this;
    var n;

      if (notification) {
          this.notification = notification;
          this.text = notification.title;
          this.body = (notification.body || "");
          this.icon = (icons[notification.icon] || "");
          this.tag = (notification.app || "");
          this.duration = (notification.duration || -1);
          this.onclick = notification.callback;
      }else {
          this.text = "";
          this.body = "";
          this.icon = "";
          this.tag = "";
          this.duration = -1;
          this.onclick = undefined;
      }

    this.onshow = undefined;
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
            $log.log("seems like you need to activate once");
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
      //alert("Your browser does not support the Notification API");
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
            if (self.duration >= 0) {
                setTimeout(function () {
                    self.close();
                }, self.duration);
            }
        };
        n.onclick = function () {
            if (typeof self.onclick !== "undefined") {
                self.onclick(self.notification);
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

    this.permissionCallback = function () {};

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

    function storeAllNotificationsInLocale() {
        localStorage.setItem('notifcations', JSON.stringify(notifications));
    }

  function showMsg(title_s, body_s, icon_i, appIdentifier_s, onCLick_fn, kindOf_s) {
      var notification = {
          title: title_s,
          body: body_s,
          icon: icon_i,
          app: appIdentifier_s || "",
          callback: function(notification) {
              notification.state = 'read';
              onCLick_fn(notification.app);
          },
          timestamp: new Date().getTime(),
          kindOf: kindOf_s,
          state: 'new',
          duration: DEFAULT_DURATION
      };

      var notifier = new Notifier(notification);
      notifier.show();

      notifications.unshift(notification);
      storeAllNotificationsInLocale();
  }

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
      localStorage.setItem('notifcations', JSON.stringify([]));
    },
    store: function() {
      storeAllNotificationsInLocale();
    }
  };  
}]);