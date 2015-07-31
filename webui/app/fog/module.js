angular.module('app.fog', []).run(['$templateCache', function($templateCache) {
    $templateCache.put('app/fog/detail/template.html', '<app.fog.detail></app.fog.detail>');
    $templateCache.put('app/fog/settings/template.html', '<app.fog.settings></app.fog.settings>');
}]);
