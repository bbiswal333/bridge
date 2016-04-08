describe("Upport Notes config", function() {
	var upportNotesConfigService, bridgeDataService;

	beforeEach(function () {
        module("bridge.service");
        module("app.upportNotes", function($provide){
            var mockDataService = {
                hasConfigForUpportNotes: false,
                getAppConfigById: function () {
                    if (this.hasConfigForUpportNotes) {
                        return JSON.parse('{"configItems":[{"programs": [{"PRG_ID": "PROGRAM1"}, {"PRG_ID": "PROGRAM2"}], "softwareComponents": [{"Component": "Comp1"}, {"Component": "Comp2"}]}, {"programs": [], "softwareComponents": [{"Component": "Comp3", "exclude": true}]}]}');
                    } else {
                        return {};
                    }
                },
                getUserInfo: function () {
                    return {};
                }
            };

            $provide.value("bridgeDataService", mockDataService);
        });

        inject(["app.upportNotes.configService", "bridgeDataService", function (_upportNotesConfigService, _bridgeDataService) {
            upportNotesConfigService = _upportNotesConfigService.getConfigForAppId("app.test");
            bridgeDataService = _bridgeDataService;
        }]);

        //$httpBackend.whenGET(/https:\/\/mithdb\.wdf\.sap\.corp/).respond({"d":{"results":[{"__metadata": {"type":"irep.reporting.internalIncidents.components.ComponentType","uri":"https://mithdb.wdf.sap.corp/irep/reporting/internalIncidents/components.xsodata/Component('AC')"},"PS_POSID":"CA-CS","DEV_UID_DM":"D022544","DEV_UID_DLVRY_M":"D022544","DEV_UID_PRDOWNER":"I844258","SL3_DEV_HANDOVER":" "}]}});
    });

	describe("items collection", function() {
		it("should be empty at the beginning", function() {
	    	expect(upportNotesConfigService.getItems().length).toEqual(0);
	    });

	    it("should be addable", function() {
	    	expect(upportNotesConfigService.getItems().length).toEqual(0);
	    	var configItem = upportNotesConfigService.getNewItem();
	    	expect(upportNotesConfigService.getItems().length).toEqual(0);
	    	upportNotesConfigService.addItem(configItem);
	    	expect(upportNotesConfigService.getItems().length).toEqual(1);
	    });

	    it("should be removeable", function() {
	    	var configItem = upportNotesConfigService.getNewItem();
	    	upportNotesConfigService.addItem(configItem);
	    	upportNotesConfigService.removeItem(configItem);
	    	expect(upportNotesConfigService.getItems().length).toEqual(0);
	    });
	});

	describe("item", function() {
		var configItem;
		beforeEach(function() {
			configItem = upportNotesConfigService.getNewItem();
		});

		describe("programs", function() {
			it("should be addable", function() {
				expect(configItem.getPrograms().length).toEqual(0);
				configItem.addProgram("PROGRAM_GUID", "Program Name");
				expect(configItem.getPrograms()).toEqual([{"PRG_ID": "PROGRAM_GUID", "DisplayText": "Program Name", "exclude": false}]);
			});

			it("should be addable only once", function() {
				configItem.addProgram("PROGRAM_GUID", "Program Name");
				configItem.addProgram("PROGRAM_GUID", "Program Name");
				expect(configItem.getPrograms()).toEqual([{"PRG_ID": "PROGRAM_GUID", "DisplayText": "Program Name", "exclude": false}]);
			});

			it("should be removeable", function() {
				var program = configItem.addProgram("PROGRAM_GUID", "Program Name");
				configItem.removeProgram(program);
				expect(configItem.getPrograms().length).toEqual(0);
			});

			it("should not return the original array", function() {
				configItem.addProgram("PROGRAM_GUID", "Program Name");
				expect(configItem.getPrograms()).not.toBe(configItem.getPrograms());
			});
		});

		describe("software components", function() {
			it("should be addable", function() {
				expect(configItem.getSoftwareComponents().length).toEqual(0);
				configItem.addSoftwareComponent("COMP1");
				expect(configItem.getSoftwareComponents()).toEqual([{"Component": "COMP1", "exclude": false}]);
			});

			it("should be addable only once", function() {
				configItem.addSoftwareComponent("COMP1");
				configItem.addSoftwareComponent("COMP1");
				expect(configItem.getSoftwareComponents()).toEqual([{"Component": "COMP1", "exclude": false}]);
			});

			it("should be removeable", function() {
				var component = configItem.addSoftwareComponent("COMP1");
				configItem.removeSoftwareComponent(component);
				expect(configItem.getSoftwareComponents().length).toEqual(0);
			});

			it("should not return the original array", function() {
				configItem.addSoftwareComponent("COMP1");
				expect(configItem.getSoftwareComponents()).not.toBe(configItem.getSoftwareComponents());
			});
		});

		describe("edit mode", function() {
			it("should allow users to edit a config item and apply the changes", function() {
				var tmpConfigItem = configItem.startEditing();
				tmpConfigItem.addProgram("PROGRAM_GUID", "Program");
				expect(configItem.getPrograms().length).toEqual(0);
				expect(tmpConfigItem.getPrograms()).toEqual([{"PRG_ID": "PROGRAM_GUID", "DisplayText": "Program", "exclude": false}]);
				tmpConfigItem.applyChanges();
				expect(configItem.getPrograms()).toEqual([{"PRG_ID": "PROGRAM_GUID", "DisplayText": "Program", "exclude": false}]);
			});

			it("confirmation should only be possible on derived config items", function() {
				expect(configItem.applyChanges).not.toBeDefined();
			});
		});
	});

	describe("persistence", function() {
		beforeEach(function() {
			bridgeDataService.hasConfigForUpportNotes = true;
		});

		it("should load the config", function() {
			upportNotesConfigService.initialize();
			expect(upportNotesConfigService.getItems().length).toEqual(2);
			expect(upportNotesConfigService.getItems()[0].getPrograms().length).toEqual(2);
			expect(upportNotesConfigService.getItems()[0].getSoftwareComponents().length).toEqual(2);
			expect(upportNotesConfigService.getItems()[1].getPrograms().length).toEqual(0);
			expect(upportNotesConfigService.getItems()[1].getSoftwareComponents().length).toEqual(1);
		});

		it("should load the config only once", function() {
			upportNotesConfigService.initialize();
			upportNotesConfigService.getItems()[0].addProgram("PROGRAM3", "Text");
			upportNotesConfigService.initialize();
			expect(upportNotesConfigService.getItems().length).toEqual(2);
			expect(upportNotesConfigService.getItems()[0].getPrograms().length).toEqual(3);
		});

		it("should serialize the config to json", function() {
			upportNotesConfigService.initialize();
			var json = upportNotesConfigService.toJSON();
			expect(json.configItems.length).toEqual(2);
			expect(json.configItems[0].programs.length).toEqual(2);
			expect(json.configItems[0].softwareComponents.length).toEqual(2);
			expect(json.configItems[1].programs.length).toEqual(0);
			expect(json.configItems[1].softwareComponents.length).toEqual(1);
		});
	});
});