angular.module("app.meetings", ["app.meetings.ews", "lib.utils", "notifier"]).
directive("app.meetings", [
	"$timeout",
	"$http",
    "$log",
	"app.meetings.ews.ewsUtils",
	"lib.utils.calUtils",
	"$interval",
	"app.meetings.configservice",
	"notifier",
	'$http',
	function ($timeout, $http, $log, ewsUtils, calUtils, $interval, meetingsConfigService, notifier, $http) {


		var directiveController = ['$scope', function ($scope){

			$scope.box.settingsTitle = "Configure Meeting App";
			$scope.box.settingScreenData = {
				templatePath: "meetings/settings.html",
					controller: angular.module('app.meetings').appMeetingsSettings,
					id: $scope.boxId
			};

			$scope.client = window.client;

			$scope.get_tel = function(dialIn, participantCode)
			{
				if(window.client.os === "win32")
				{
					return dialIn + 'x' + participantCode + '#';
				}
				else
				{					
					return dialIn;
				}
			};

			$scope.click_tel = function(participantCode)
			{
				if(window.client.os !== "win32" && meetingsConfigService.configItem.clipboard)
				{
					$http.get(window.client.origin + '/api/client/copy?text=' + encodeURIComponent(participantCode + '#') + '&origin=' + window.location.origin);	
				}
			};

			$scope.box.returnConfig = function(){
	            return angular.copy(meetingsConfigService);
	        }; 
		}];

		var linkFn = function ($scope) {
			/* ====================================== */
			/* CONFIGURATION */
			$scope.dayCnt = 2; // Because of time Zone issues
			$scope.hideAllDayEvents = true;
			/* ====================================== */
			
			$scope.events = [];
			$scope.loading = true;
			$scope.errMsg = null;
			var eventsRaw = {};
			var today = new Date(new Date().toDateString());

			if ($scope.appConfig !== undefined && $scope.appConfig !== {} && $scope.appConfig.configItem) {
			    meetingsConfigService.configItem = $scope.appConfig.configItem;
			} else {
				$scope.appConfig.configItem = meetingsConfigService.configItem;
			}
			$scope.box.boxSize = meetingsConfigService.configItem.boxSize;
			$scope.box.sAPConnectPreferredDialin =  $scope.appConfig.configItem.sAPConnectPreferredDialin;

			function sortByStartTime(a, b) {
			    if (a.start > b.start) {
			        return 1;
			    } else if (a.start < b.start) {
			        return -1;
			    } else {
			        return 0;
			    }
			}

			function parseExchangeData(events) {
				var dateFn = ewsUtils.parseEWSDateStringAutoTimeZone;
				$scope.events = [];

				if (typeof events === "undefined") {
					return;
				}

				for (var i = 0; i < events.length; i++) {
					//ignore events, which are over already
					if (dateFn(events[i]["t:End"][0]).getTime() <= new Date().getTime()) {
						continue;
					}

					//ignore allday events
					if ($scope.hideAllDayEvents && events[i]["t:IsAllDayEvent"][0] !== "false") {
						continue;
					}

					var start = dateFn(events[i]["t:Start"][0]);
					var end = dateFn(events[i]["t:End"][0]);

					if (start.getDate() === today.getDate()) {
						
						loadFromExchangeGI(false, events[i]["t:ItemId"][0]["$"]["Id"]);
						
						$scope.events.push({
							subject: events[i]["t:Subject"][0],
							start: start,
							startRel: calUtils.relativeTimeTo(new Date(), start, true),
							startTime: calUtils.useNDigits(start.getHours(), 2) + ":" + calUtils.useNDigits(start.getMinutes(), 2),
							end: end,
							endRel: calUtils.relativeTimeTo(new Date(), end, true),
							endTime: calUtils.useNDigits(end.getHours(), 2) + ":" + calUtils.useNDigits(end.getMinutes(), 2),
							timeZone: events[i]["t:TimeZone"][0],
							location: events[i]["t:Location"] ? events[i]["t:Location"][0] : "",
							getEventTime: function () {
							    if ($scope.events.indexOf(this) === 0) {
							        return "<b>" + this.startRel + "</b>";
							    } else {
							        return this.startTime + "<br />" + this.endTime;
							    }
							},
							isCurrent: (start.getTime() < new Date().getTime()),
							isInTheNext30Minutes: (((start.getTime() - new Date().getTime()) / 1000 / 60) <= 30),
							exchangeUid: events[i]["t:ItemId"][0]["$"]["Id"],
							changeKey: events[i]["t:ItemId"][0]["$"]["ChangeKey"]												
						});
						
					}
				}
				$scope.events = $scope.events.sort(sortByStartTime);
			}

			function loadFromExchange (withNotifications) {
				$scope.loading = true;
				$scope.errMsg = null;
				var oldEventsLength = 0;

				if(withNotifications){
					oldEventsLength = $scope.events.length;
				}

				var dateForewsCall = new Date();
				dateForewsCall.setDate(today.getDate() - 1);
				$http.get(ewsUtils.buildEWSUrl(dateForewsCall, $scope.dayCnt)).success(function (data, status) {

					try{
						eventsRaw = {};
						
						eventsRaw = data["m:FindItemResponse"]["m:ResponseMessages"][0]["m:FindItemResponseMessage"][0]["m:RootFolder"][0]["t:Items"][0]["t:CalendarItem"];

						if (typeof eventsRaw !== "undefined") {
							parseExchangeData(eventsRaw);
						}

					}catch(error){
						$scope.errMsg = "Unable to connect to Exchange Server";
						$log.log((error || $scope.errMsg));
					}
					$scope.loading = false;
				});
			}
			function loadFromExchangeGI (withNotifications, exchangeUid) {
				$scope.loading = true;
				$scope.errMsg = null;
				var oldEventsRawLength = 0;

				if(withNotifications){
					oldEventsRawLength = eventsRaw.length;
				}

				$http.get(ewsUtils.buildEWSUrl(undefined, undefined, exchangeUid)).success(function (data, status) {

					try{
						var body;
						body = data["m:GetItemResponse"]["m:ResponseMessages"][0]["m:GetItemResponseMessage"][0]["m:Items"][0]["t:CalendarItem"][0]["t:Body"][0]._;
						if (typeof body !== "undefined") {
							
							for (var i = 0; i < $scope.events.length; i++) {
								if ($scope.events[i].exchangeUid == exchangeUid) {
									$scope.events[i]["body"] = body
									//var partcode = body.match(/Participant[^0-9]+([0-9\s]+)[^0-9]/i)
									//
									// first get rid of the newlines in order to allow more proper participant code parsing 
									// New approach: try to fix the participant code to the "last" 10-digit number in the body
									//
									var partcode = body.replace(/[\r\s]/g,"").match(/Participant.*([0-9]{10})[^0-9]/i)
									
									var sapconnecturl 
									
									sapconnecturl = body.match(/https:\/\/[^\s"]*pgiconnect[^\s"]*/i)
									if ( sapconnecturl == null) {
										sapconnecturl = body.match(/https:\/\/[^\s"]*broadcast.wdf.sap.corp[^\s"]*/i)
									}
									
									
									var useTheNormalSAPConnectDialIn = true
									// A bit hacky
									// For sapemeavent we would need different dial-in number in Frankfurt and around the word,
									// for this first prototype we need to ignore participant code
									if ( sapconnecturl == null) {
										sapconnecturl = body.match(/https:\/\/[^\s"]*sapemeaevent.adobeconnect.com[^\s"]*/i)
										useTheNormalSAPConnectDialIn = false
									}
									if ( partcode != null && useTheNormalSAPConnectDialIn ) {
										$scope.events[i]["participantCode"] = partcode[1].replace(/\s/g,"")
									}
									if ( sapconnecturl != null) {
										$scope.events[i]["sapconnectUrl"] = sapconnecturl[0];
									}
								}
							}
							

						}
						if(withNotifications){
							if ($scope.events.length > oldEventsLength) {
								if ($scope.events.length === oldEventsLength + 1) {
									notifier.showInfo("Meetings", "You have a new meeting", "app.meetings");
								}
								else {
									notifier.showInfo("Meetings", "You have new meetings", "app.meetings");
								}
							}
						}
	        			$scope.errMsg = null;
					}catch(error){
						$scope.errMsg = "Unable to load item details from Exchange Server";
						$log.log((error || $scope.errMsg));
					}
					$scope.loading = false;
				});
			}

			
		    $scope.$watch("appConfig.configItem.boxSize", function () {
				if ($scope.appConfig !== undefined && $scope.appConfig !== {} && $scope.appConfig.configItem) {
					$scope.box.boxSize = $scope.appConfig.configItem.boxSize;
				}
		    }, true);

		    $scope.$watch("appConfig.configItem.sAPConnectPreferredDialin", function () {
				$scope.box.sAPConnectPreferredDialin =  $scope.appConfig.configItem.sAPConnectPreferredDialin;
		    }, true);

			
			$scope.upComingEvents = function () {
			    return $scope.events;
			};

			$scope.hasEvents = function () {
			    return ($scope.events.length !== 0);
			};

			$scope.getMeetingsLeftText = function () {
				var cnt = 0;
				for (var i = 0; i < $scope.events.length; i++) {
					if ($scope.events[i].end.getTime() > new Date().getTime()) {
						cnt++;
					}
				}

				return cnt + " meeting" + (cnt === 1 ? "" : "s") + " left for today.";
			};

			$scope.isLoading = function () {
				return $scope.loading;
			};

			function reload() {
				if (!$scope.isLoading()) {
					loadFromExchange(true);
				}
			}

			$scope.getCurrentDate = function () {
			    var date = new Date();
			    return calUtils.getWeekdays()[date.getDay() - 1].long + ", " + date.getDate() + ". " + calUtils.getMonthName(date.getMonth()).long;
			};

			var refreshInterval = null;

			$scope.$on("$destroy", function(){
				if (refreshInterval != null) {
					$interval.cancel(refreshInterval);
				}
			});

			(function springGun() {
				var i = 1;
				//Full reload every 300 seconds, refresh of UI all 30 seconds
				refreshInterval = $interval(function () {
					if (i % 10 === 0) {
						reload();
						i = 1;
					}
					else {
						parseExchangeData(eventsRaw);
						i++;
					}
				}, 30000);
			})();

			loadFromExchange(false);
		};

		return {
			restrict: "E",
			controller: directiveController,
			scope: false,
			templateUrl: "app/meetings/overview.html",
			replace: true,
	        link: linkFn 
		};
}]);
