angular.module('app.translator', [ 'app.translator.data' ]);
angular
		.module('app.translator')
		.directive(
				'app.translator',
				[
						'app.translator.configService',
						'app.translator.dataService',
						function(configService, dataService) {

							var directiveController = [
									'$scope',
									function($scope, element) {
										
										// Required information to get settings
										// icon/ screen
										$scope.box.settingsTitle = "Configure Translator App";
										$scope.box.settingScreenData = {
											templatePath : "translator/settings.html",
											controller : angular
													.module('app.translator').appTestSettings,
											id : $scope.boxId
										};
																				
										$scope.isWarning = false;
										$scope.translatedText = "Never translate sensitive data! \n For further information, please check https://go.sap.corp/l02"
										
										$scope.languages = [ {
											value : 'english',
											label : 'en'
										}, {
											value : 'german',
											label : 'de'
										}, {
											value : 'french',
											label : 'fr'
										}, {
											value : 'italian',
											label : 'it'
										}, {
											value : 'spanish',
											label : 'es'
										} ];

										$scope.selectedLanguageFrom = $scope.languages[0];
										$scope.selectedLanguageTo = $scope.languages[1];

										// Bridge framework function to enable
										// saving the config
										$scope.box.returnConfig = function() {
											return angular.copy(configService);
										};
										
										// Translate
										$scope.translateText = function() {

											if ($scope.textToTranslate === undefined || $scope.textToTranslate.length < 1) {
												$scope.translatedText = "";
												return;
											}

											var url = "https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20140810T152933Z.4c6a63149a1d7b01.f8f72735285e0db3249529d5c04f9ca2584a1ccf&lang="
													+ $scope.selectedLanguageFrom.label
													+ "-"
													+ $scope.selectedLanguageTo.label
													+ "&text="
													+ $scope.textToTranslate;

											$
													.get(
															url,
															function(response) {
																$scope.isWarning = true;
																$scope.translatedText = response.text[0];
															})
													.done(
															function(response) {
																console
																		.log("Translation succeeded.");
															})
													.fail(
															function(response) {
																console
																		.log("Translation failed.")
															});

										};

									} ];

							var linkFn = function($scope) {

								// get own instance of config service,
								// $scope.appConfig contains the configuration
								// from the backend
								configService.initialize($scope.appConfig);

								// watch on any changes in the settings screen
								$scope
										.$watch(
												"appConfig.values.boxSize",
												function() {
													$scope.box.boxSize = $scope.appConfig.values.boxSize;
												}, true);
							};

							return {
								restrict : 'E',
								templateUrl : 'app/translator/overview.html',
								controller : directiveController,
								link : linkFn
							};
						} ]);