angular.module("app.unifiedticketing").service("app.unifiedticketing.ticketData", ["$rootScope", "$http", "$q", "$location", "bridgeDataService", "app.unifiedticketing.config", "notifier",
    function($rootScope, $http, $q, $location, bridgeDataService, unifiedticketingConfigService) {
        var Data = function(appId) {
            var that = this;
            this.appId = appId;
            var unifiedticketingConfig = unifiedticketingConfigService.getConfigForAppId(this.appId);
            unifiedticketingConfig.syncHistory = ' ';
            var counter = true;
            var statusBuffer = [];
            var globalData = {
               statusesWithGroups: [],
               statusGroups: {
                    1: {
                        order: 1,
                        text: "Closed"
                    },
                    2: {
                        order: 4,
                        text: "Action required"
                    },
                    3: {
                        order: 2,
                        text: "In Process"
                    },
                    4: {
                        order: 3,
                        text: "Solution proposed"
                    }
                },

                frendlyStatuses: {
                    0: {
                        "NAME": "All",
                        "KEY": ""
                    },
                    2: {
                        "NAME": "Action required",
                        "KEY": 2
                    },
                    4: {
                        "NAME": "Solution proposed",
                        "KEY": 4
                    },
                    3: {
                        "NAME": "In Process",
                        "KEY": 3
                    },
                    1: {
                        "NAME": "Closed",
                        "KEY": 1
                    }
                }
            };

            this.isInitialized = {
                value: false
            };

            this.prios = [{
                    key: "01",
                    description: "ZFMR",
                    name: "FacilityDirect",
                    active: false
                }, {
                    key: "02",
                    description: "ZSIM",
                    name: "Security Incident",
                    active: false
                }, {
                    key: "03",
                    description: "ZINC",
                    name: "ITdirect",
                    active: false
                }, {
                    key: "04",
                    description: "YHRR",
                    name: "HRdirect",
                    active: false
                }, {
                    key: "05",
                    description: "YFIN",
                    name: "TravelDirect",
                    active: false
                }, {
                    key: "06",
                    description: "ZGCR",
                    name: "GCOdirect",
                    active: false
                }

            ];
            var processTypes = [{
                    id: "ZINE",
                    name: "ITdirect Ticket",
                    ico: "sap-icon://travel-expense",
                    create: "x",
                    edit: ""
                }, {
                    id: "ZSER",
                    name: "IT Service",
                    ico: "sap-icon://request",
                    create: "",
                    edit: "x"
                }, {
                    id: "ZINC",
                    name: "IT Incident",
                    ico: "sap-icon://sys-monitor",
                    create: "",
                    edit: "x"
                }, {
                    id: "YHRR",
                    name: "HRdirect",
                    ico: "sap-icon://group",
                    create: "x",
                    edit: "x"
                }, {
                    id: "ZGCR",
                    name: "GCOdirect",
                    ico: "sap-icon://customer-view",
                    create: "x",
                    edit: "x"
                }, {
                    id: "YFIN",
                    name: "TRAVELdirect",
                    ico: "sap-icon://travel-expense",
                    create: "x",
                    edit: "x"
                }, {
                    id: "ZFMR",
                    name: "FACILITYdirect",
                    ico: "sap-icon://wrench",
                    create: "x",
                    edit: "x"
                }, {
                    id: "ZSIM",
                    name: "Security Incident",
                    ico: "sap-icon://locked",
                    create: "x",
                    edit: "x"
                }

            ];

            this.tickets = {};
            this.tickets.assigned_me = [];
            this.tickets.savedSearch = [];
            this.lastTickets = null;
            this.ticketsFromNotifications = {};
            this.ticketsFromNotifications.assigned_me = [];
            this.ticketsFromNotifications.savedSearch = [];

            this.sAppIdentifier = "";


            this.prepareStatusBufferData = function(oData) {
                var statusList = oData.StatusBuffer.results;
                statusList.forEach(function(entry) {
               var pType = entry.PROCESS_TYPE;
                    if (that.checkIfProceessTypeSupported(pType)) {
                        if (!statusBuffer[pType]) {
                            statusBuffer[pType] = [];
                        }
                    var newStatusData = {
                            "PROCESS_TYPE": entry.PROCESS_TYPE,
                            "STATUS_FROM": entry.STATUS_FROM,
                            "STATUS_TO": entry.STATUS_TO,
                            "STATUS_FROM_TEXT": entry.STATUS_FROM_TEXT,
                            "STATUS_TO_TEXT": entry.STATUS_TO_TEXT,
                            "LABEL_ID": entry.LABEL_ID,
                            "BUTTON_LABEL": entry.BUTTON_LABEL,
                            "ACTIVE": entry.ACTIVE,
                            "FILTER": entry.FILTER,
                            "KEY": entry.KEY,
                            "OnScreen": entry.OnScreen,
                            "EditModeButton": entry.EditModeButton,
                            "MandatoryNotes": entry.MandatoryNotes
                        };
                        statusBuffer[pType].push(newStatusData);
                        globalData.statusesWithGroups.push(newStatusData);
                  }
            });
        };

            $http.get('app/unifiedTicketing/StatusBuffer.json').success(function(data) {
             that.prepareStatusBufferData(data.d);
            });

           this.checkIfProceessTypeSupported = function(type) {
                var ID = "id";
            for (var i = 0; i < processTypes.length; i++) {
                    if (processTypes[i][ID] === type) {
                        return true;
                    }
                }
                return false;
            };

            this.loadTicketData = function() {
                var promiseArray = [];
                var deferAssignedToMe = $q.defer();
                var filteredTickets = [];
                if (counter === true) {
                    unifiedticketingConfig.syncHistory = "";
                    unifiedticketingConfig.Status = null;
                    counter = false;
                 }

                $("#spinner").show();
                $("#utContainer").hide();
                $http.get("https://pgtmain.wdf.sap.corp/sap/opu/odata/sap/ZUNIF_TICKET;mo/TicketCollection?$filter=CHANGED_AT_F eq '" + unifiedticketingConfig.syncHistory + "'and%20COMPLETED%20eq%20%27X%27").success(function(data) {
                        $("#spinner").hide();
                        $("#utContainer").show();
                        that.tickets.assigned_me.length = 0;
                        var statusFound = false;
                        var FILTER = "FILTER";
                       angular.forEach(data.d.results, function(backendTicket) {
                            if (unifiedticketingConfig.Status) {
                                for (var i = 0; i < statusBuffer[backendTicket.PROCESS_TYPE].length; i++) {
                                    if (statusBuffer[backendTicket.PROCESS_TYPE][i].STATUS_FROM === backendTicket.USER_STATUS) {
                                        backendTicket[FILTER] = statusBuffer[backendTicket.PROCESS_TYPE][i].FILTER;
                                        filteredTickets.push(backendTicket);
                                        statusFound = true;
                                        break;
                                    }
                                }
                                if(statusFound === false){
                                    backendTicket[FILTER] = "Closed";
                                    filteredTickets.push(backendTicket);
                                }
                            } else {
                                that.tickets.assigned_me.push(backendTicket);
                            }
                       });
                        if (filteredTickets) {
                           for (var i = 0; i < filteredTickets.length; i++) {
                                if (filteredTickets[i].FILTER === unifiedticketingConfig.Status) {
                                    that.tickets.assigned_me.push(filteredTickets[i]);
                                }
                            }
                        }

                        deferAssignedToMe.resolve();
                    })
                    .error(function() {
                        deferAssignedToMe.reject();
                    });
                promiseArray.push(deferAssignedToMe.promise);
                var pAllRequestsFinished = $q.all(promiseArray);
                return pAllRequestsFinished;
            };

             this.activatePrio = function(sPrioKey) {

                angular.forEach(that.prios, function(prio) {
                    // reset all prios first
                    prio.active = false;

                    if (prio.key === sPrioKey) {
                        prio.active = true;
                    }
                });
            };

            this.activateAllPrios = function() {
                angular.forEach(that.prios, function(prio) {
                    prio.active = true;
                });
            };

            this.initialize = function(sAppIdentifier) {
                this.sAppIdentifier = sAppIdentifier;

                var loadTicketPromise = this.loadTicketData();
                loadTicketPromise.then(function success() {
                    that.isInitialized.value = true;
                });

                return loadTicketPromise;
            };
        };

        var instances = {};
        this.getInstanceForAppId = function(appId) {
            if (instances[appId] === undefined) {
                instances[appId] = new Data(appId);
            }
            return instances[appId];
        };
    }
]);
