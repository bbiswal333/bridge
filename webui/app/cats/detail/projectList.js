angular.module("app.cats.maintenanceView.projectList", ["app.cats.dataModule", "app.cats.utilsModule", "app.cats.allocationBar.utils"]).
directive("app.cats.maintenanceView.projectList", [
	"app.cats.cat2BackendZDEVDB",
	"app.cats.catsUtils",
	"$timeout",
	"app.cats.allocationBar.utils.colorUtils",
	"lib.utils.calUtils",
	"app.cats.configService",
	"$q",
	"$window",
	function(catsBackend, catsUtils, $timeout, colorUtils, calenderUtils, configService, $q, $window) {
		var linkFn = function($scope) {
			$scope.items = [];
			$scope.itemsFromBlocks = [];
			$scope.filter = {};
			$scope.filter.val = "";
			$scope.loaded = false;
			$scope.hasError = false;
			$scope.toEdit = -1;
			var exitLoop = true;
			var continueLoop = false;

			var config = {};

			$scope.scrollbar = function(direction, autoResize) {
				config.direction = direction;
				config.autoResize = autoResize;
				return config;
			};

			$scope.onPressEnter = function(event) {
				if (event.which === 13) {
					$window.document.getElementById("projectButton").focus();
				}
			};

            $scope.getDescription = function (item) {
                var desc = item.DESCR;
                if (item.ZCPR_EXTID) {
                    desc = desc + "\n" + item.ZCPR_EXTID;
                }
                if (item.RAUFNR) {
                    desc = desc + "\nOrder:    " + item.RAUFNR.replace(/^0+/, '');
                }
                if (item.ZCPR_OBJGEXTID) {
                    desc = desc + "\ncProID:  " + item.ZCPR_OBJGEXTID.replace(/^0+/, '');
                }
                if (item.TASKTYPE) {
                    desc = desc + "\nType:     " + item.TASKTYPE;
                }
                if (item.ZZSUBTYPE) {
                    desc = desc + "\nSubtype: " + item.ZZSUBTYPE;
                }
                return desc;
            };
			$scope.showEditButton = function(id) {
				$scope.toEdit = id;
			};

			function getIndexForId(id) {
				var index = -1;
				var foundIndex = index;
				$scope.items.some(function(item) {
					index++;
					if (id === item.id) {
						foundIndex = index;
						return exitLoop;
					}
				});
				return foundIndex;
			}

			$scope.editTask = function(id) {
				var index = getIndexForId(id);
				if ($scope.forSettingsView) {
					configService.selectedTask = $scope.items[index];
					$scope.onProjectEdit({
						id: id
					});
				}
			};

			$scope.toogleSelect = function(id) {
				var index = getIndexForId(id);
				$scope.items[index].selected = !$scope.items[index].selected;

				if ($scope.items[index].selected) {
					if ($scope.forSettingsView) {
						configService.selectedTask = $scope.items[index];
					}

					var ok = $scope.onProjectChecked({
						desc_s: $scope.items[index].DESCR,
						val_i: null,
						task: $scope.items[index],
						id: id
					});

					if (!ok) {
						$scope.items[index].selected = false;
					}
				} else {
					$scope.onProjectUnchecked({
						task: $scope.items[index]
					});
				}
				// document.getElementById("filterTextfield").focus();
			};

			$scope.resetFilter = function() {
				$scope.filter.val = "";
			};

			function markItemIfSelected(item) {
				var found = false;
				var color = null;
				$scope.blocks.some(function(block) { // is allocation bar block or a favorite item
					if (!block) {
						return found;
					}

					if (block.task) {
						if (catsUtils.isSameTask(item, block.task) && block.value !== 0) {
							found = true;
							color = colorUtils.getColorForBlock(block);
						}
					} else {
						if (catsUtils.isSameTask(item, block)) {
							found = true;
						}
					}

					return found;
				});
				item.selected = found;
				item.color = color;
			}

			// This is required if the cPro task got renamed recently
			function updateZCPR_EXTID(item) {
				var newItem = configService.enhanceTask(item);
				for (var i = 0; i < configService.catsItems.length; i++) {
					if (catsUtils.isSameTask(newItem, configService.catsItems[i])) {
						configService.catsItems[i].ZCPR_EXTID = newItem.ZCPR_EXTID;
						configService.catsItems[i] = configService.enhanceTask(configService.catsItems[i]);
					}
				}
			}

			function addNewProjectItem(item) {
				var newItem = configService.enhanceTask(item);

				markItemIfSelected(item);

				var alreadyExists = false;

				if (catsUtils.isFixedTask(item)) { // don't add "fixed" tasks to favorites
					return;
				}
				configService.catsItems.some(function(oldItem) {
					if (catsUtils.isSameTask(item, oldItem)) {
						alreadyExists = true;
						return exitLoop;
					}
				});

				if (!alreadyExists) {
					configService.catsItems.push(newItem);
				}
			}

			function addItemsFromTemplate(items) {
				catsBackend.determineCatsProfileFromBackend()
				.then(function(catsProfile) {
					if (catsProfile !== null) {
						$scope.hasError = false;
						// Write header
						if (items.length > 0) {
							var header = {};
							header.DESCR = "CAT2 tasks (profile " + catsProfile + ")";
							header.TASKTYPE = "BRIDGE_HEADER";
							header.RAUFNR = "1";
							addNewProjectItem(header);
						}
						items.forEach(function(item) {
							addNewProjectItem(item);
						});
					} else {
						$scope.hasError = true;
						$scope.errorText = "Oops! Sorry, the CAT2 backend system ISP seems to be unresponsive/ unavailable. Please try again later.";
					}
				}, function() {
					$scope.hasError = true;
					$scope.errorText = "Oops! Sorry, the CAT2 backend system ISP seems to be unresponsive/ unavailable. Please try again later.";
				});
			}

			function getDataFromCatsTemplate() {
				var deferred = $q.defer();

				var week = calenderUtils.getWeekNumber(new Date());
				catsBackend.requestTasksFromTemplate(week.year, week.weekNo)
				.then(function(itemFromCatsTemplate) {
					addItemsFromTemplate(itemFromCatsTemplate);
					deferred.resolve();
				}, function(errorText) {
					$scope.hasError = true;
					if(errorText) {
						$scope.errorText = errorText;
					} else {
						$scope.errorText = "Oops! Sorry, the CAT2 backend system ISP seems to be unresponsive/ unavailable. Please try again later.";
					}
					deferred.reject($scope.errorText);
				});

				return deferred.promise;
			}

			function doesOneAdditionalItemExist(list) {
				for (var i = 0; i < list.length; i++) {
					var alreadyExists = false;
					for (var j = 0; j < configService.catsItems.length; j++) {
						if (catsUtils.isSameTask(list[i], configService.catsItems[j])) {
							alreadyExists = true;
						}
					}
					if (alreadyExists === false) {
						return true;
					}
				}
			}

			function getCatsData() {
				var deferred = $q.defer();
				catsBackend.requestTasksFromWorklist()
				.then(function(dataFromWorklist) {
					$scope.hasError = false;
					getDataFromCatsTemplate()
					.then(function() {
						if ($scope.blocks === undefined) {
							$scope.blocks = [];
						}

						// Write header
						if (dataFromWorklist && doesOneAdditionalItemExist(dataFromWorklist)) {
							var header = {};
							header.DESCR = "Additional cPro tasks";
							header.TASKTYPE = "BRIDGE_HEADER";
							header.RAUFNR = "2";
							addNewProjectItem(header);

							dataFromWorklist.forEach(function(entry) {
								addNewProjectItem(entry);
								updateZCPR_EXTID(entry);
								configService.updateLastUsedDescriptions(entry, true);
							});
						}
						deferred.resolve();
					}, function(errorText) {
						$scope.hasError = true;
						if(errorText) {
							$scope.errorText = errorText;
						} else {
							$scope.errorText = "Oops! Sorry, the CAT2 backend system ISP seems to be unresponsive/ unavailable. Please try again later.";
						}
					});
				}, function() {
					$scope.hasError = true;
					$scope.errorText = "Oops! Sorry, the CAT2 backend system ISP seems to be unresponsive/ unavailable. Please try again later.";
				});
				return deferred.promise;
			}

			function addItemsFromBlocks() {
				$scope.blocks.some(function(blockItem) {
					if (!blockItem.task) {
						return exitLoop;
					}

					if (catsUtils.isFixedTask(blockItem.task)) {
						return continueLoop;
					}

					var allreadyExists = false;
					$scope.items.some(function(item) {
						if (catsUtils.isSameTask(blockItem.task, item)) {
							allreadyExists = true;
							return exitLoop;
						}
					});
					if (!allreadyExists) {
						$scope.items.push(configService.enhanceTask(blockItem.task));
						$scope.itemsFromBlocks.push(configService.enhanceTask(blockItem.task));
					}
				});
			}

			function addItemsFromFavoriteList() {
				var favoriteItems = angular.copy(configService.favoriteItems);
				if (favoriteItems.length === 0) {
					return;
				}

				favoriteItems.forEach(function(favoriteItem) {
					var allreadyExists = false;
					$scope.items.some(function(item) {
						if (catsUtils.isSameTask(favoriteItem, item)) {
							allreadyExists = true;
							// item = favoriteItem;
							return exitLoop;
						}
					});
					if (!allreadyExists) {
						$scope.items.push(configService.enhanceTask(favoriteItem));
					}
				});
			}

			function validateItems(items) {
				var index = items.length;
				while (index--) {
					if (!catsUtils.isValid(items[index])) {
						items.splice(index, 1);
					}
				}
			}

			function initProjectItems() {

				catsBackend.determineCatsProfileFromBackend()
				.then(function(catsProfile) {
					// IF using favorite list
					if (configService.favoriteItems.length > 0 && !$scope.forSettingsView) {
						$scope.items = angular.copy(configService.favoriteItems);
						var header1 = {};
						header1.DESCR = "Bridge favorite tasks (profile " + catsProfile + ")";
						header1.infoLink = "https://github.wdf.sap.corp/bridge/bridge/wiki/FAQ-for-CAT2#what-is-the-bridge-favorite-task-list-and-where-can-i-find-it";
						header1.infoLinkText = "You are using a task list that is configured in Bridge! Changes from ISP or cPro worklist will not appear automatically.";
						header1.TASKTYPE = "BRIDGE_HEADER";
						header1.RAUFNR = "3";
						$scope.items.unshift(header1);

						if ($scope.itemsFromBlocks.length > 0) {

							var header2 = {};
							header2.DESCR = "Additional tasks";
							header2.TASKTYPE = "BRIDGE_HEADER";
							header2.RAUFNR = "4";
							$scope.items.push(header2);

							$scope.itemsFromBlocks.forEach(function(itemFromBlock) {
								var allreadyExists = false;
								$scope.items.some(function(item) {
									if (catsUtils.isSameTask(itemFromBlock, item)) {
										allreadyExists = true;
										return exitLoop;
									}
								});
								if (!allreadyExists) {
									$scope.items.push(configService.enhanceTask(itemFromBlock));
								}
							});

						}
					// ELSE using CAT2 data
					} else {
						$scope.items = angular.copy(configService.catsItems);
						addItemsFromFavoriteList(); // if favorite list contains items, that are not in the worklist or template anymore
					}
					$scope.items.forEach(function(item) {
						configService.updateDescription(item);
					});

				}, function() {
					$scope.hasError = true;
					$scope.errorText = "Oops! Sorry, the CAT2 backend system ISP seems to be unresponsive/ unavailable. Please try again later.";
				});

			}

			function markProjectItems() {
				$scope.items.forEach(function(item) {
					markItemIfSelected(item);
				});
			}

			function loadProjects(forceUpdate_b) {
				$scope.hasError = false;
				if (forceUpdate_b || !configService.loaded || $scope.forSettingsView) {
					if (forceUpdate_b) {
						$scope.items = [];
						$scope.filter = {};
						$scope.filter.val = "";
						$scope.loaded = false;
						$scope.toEdit = -1;
						configService.catsItems = [];
					}
					getCatsData(forceUpdate_b)
					.then(function() {
						configService.loaded = true;
						initProjectItems();
						addItemsFromBlocks();
						validateItems($scope.items);

						markProjectItems();
						$scope.loaded = true;
					}, function() {
						$scope.hasError = true;
						$scope.errorText = "Oops! Sorry, the CAT2 backend system ISP seems to be unresponsive/ unavailable. Please try again later.";
					});
				} else {
					initProjectItems();
					validateItems($scope.items);

					$scope.loaded = true;
				}

				$timeout(function() {
					$scope.$broadcast('rebuild:me');
				}, 100);
			}

			$scope.backendData = catsBackend.CAT2AllocationDataForWeeks;

			$scope.$watch("backendData", function(newValue,oldValue) {
				if (newValue && newValue !== oldValue) {
					loadProjects(true);
				}
			}, true);

			$scope.$watch("blocks", function() {
				initProjectItems();
				addItemsFromBlocks();
				validateItems($scope.items);

				markProjectItems();
			}, true);

			$scope.$watch("items", function() {
				markProjectItems();
			}, true);

			$scope.$watch("action", function(newValue) {
				if(newValue !== undefined) {
					configService.favoriteItems = [];
					loadProjects(true);
				}
			}, true);

			loadProjects(true);

		};

		return {
			restrict: "E",
			scope: {
				onProjectChecked: "&onprojectchecked",
				onProjectUnchecked: "&onprojectunchecked",
				onProjectEdit: "&onprojectedit",
				blocks: "=blocks",
				action: "=action",
				heightOfList: "@heightoflist",
				forSettingsView: "@forSettingsView"
			},
			replace: true,
			link: linkFn,
			templateUrl: "app/cats/detail/projectList.tmpl.html"
		};
	}
]);
