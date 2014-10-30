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
			$scope.filter = {};
			$scope.filter.val = "";
			$scope.loaded = false;
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
				// The items we get here can be of really bad data quality

				//TEST
				//if (item.TASKTYPE === "ADMI") {
				//  return;
				//}

				// Service that reads the template on weekly basis
				// Minimal item would be only TASKTYPE: "MAIN" with RAUFNR and other IDs empty
				// There coult also be only TASKTYPE and RAUFNR filled
				// Maximum there could be also ZCPR_EXTID AND ZCPR_OBJEXTID filled

				// Service that reads the 4 month compliance
				//  RAUFNR: ""
				//  TASKTYPE: "ADMI"
				//  ZCPR_OBJGEXTID: "ADMI"
				//  ZCPR_OBJGUID: "ADMI"
				//  projectDesc: "Administrative"
				//  taskDesc: "ADMI"
				// or
				//  RAUFNR: "000505220105"
				//  TASKTYPE: ""
				//  UNIT: undefined
				//  ZCPR_EXTID: "I2M_2013_RESEARCH_INNOV"
				//  ZCPR_OBJGEXTID: "00000000000000617094"
				//  projectDesc: "I2M_2013_RESEARCH_INNOV"
				//  taskDesc: "I2M Research & Innovation"
				var found = false;
				var color = null;
				$scope.blocks.some(function(block) { // is allocation bar block or a favourite item
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

			function addNewProjectItem(item) {
				var newItem = configService.enhanceTask(item);

				markItemIfSelected(item);

				var allreadyExists = false;

				if (catsUtils.isFixedTask(item)) { // don't add "fixed" tasks to favorites
					return;
				}
				configService.catsItems.some(function(oldItem) {
					if (catsUtils.isSameTask(item, oldItem)) {
						allreadyExists = true;
						return exitLoop;
					}
				});

				if (!allreadyExists) {
					configService.catsItems.push(newItem);
				}
			}

			function addItemsFromTemplate(items) {
				// Write header
				if (items.length > 0) {
					var header = {};
					header.DESCR = "Tasks from CAT2 template using profile " + configService.getCatsProfile() + "...";
					header.TASKTYPE = "BRIDGE_HEADER";
					header.RAUFNR = "1";
					addNewProjectItem(header);
				}
				items.forEach(function(item) {
					addNewProjectItem(item);
				});
			}

			function getDataFromCatsTemplate(forceUpdate_b) {
				var deferred = $q.defer();

				var week = calenderUtils.getWeekNumber(new Date());
				catsBackend.requestTasksFromTemplate(week.year, week.weekNo, addItemsFromTemplate, forceUpdate_b).then(function() {
					deferred.resolve();
				});

				return deferred.promise;
			}

			function getCatsData(forceUpdate_b) {
				var deferred = $q.defer();
				getDataFromCatsTemplate(forceUpdate_b).then(function() {
					catsBackend.requestTasksFromWorklist(forceUpdate_b).then(function(dataFromWorklist) {
						if ($scope.blocks === undefined) {
							$scope.blocks = [];
						}

						// Write header
						if (dataFromWorklist.length > 0) {
							var header = {};
							header.DESCR = "Additional tasks from cPro work list...";
							header.TASKTYPE = "BRIDGE_HEADER";
							header.RAUFNR = "2";
							addNewProjectItem(header);
						}

						dataFromWorklist.forEach(function(entry) {
							addNewProjectItem(entry);
							configService.updateLastUsedDescriptions(entry, true);
						});

						deferred.resolve();
					});
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
				colorUtils.setColorScheme(configService.colorScheme);
				if (configService.favoriteItems.length > 0 && !$scope.forSettingsView) {
					$scope.items = angular.copy(configService.favoriteItems);
				} else {
					$scope.items = angular.copy(configService.catsItems);
					addItemsFromFavoriteList(); // if favorite list contains items, that are not in the worklist or template anymore
				}
				$scope.items.forEach(function(item) {
					configService.updateDescription(item);
				});
			}

			function markProjectItems() {
				$scope.items.forEach(function(item) {
					markItemIfSelected(item);
				});
			}

			function loadProjects(forceUpdate_b) {
				if (forceUpdate_b || !configService.loaded || $scope.forSettingsView) {
					if (forceUpdate_b) {
						$scope.items = [];
						$scope.filter = {};
						$scope.filter.val = "";
						$scope.loaded = false;
						$scope.toEdit = -1;
						configService.catsItems = [];
					}
					getCatsData(forceUpdate_b).then(function() {
						configService.loaded = true;
						initProjectItems();
						addItemsFromBlocks();
						validateItems($scope.items);

						markProjectItems();
						$scope.loaded = true;
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

			loadProjects();

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
