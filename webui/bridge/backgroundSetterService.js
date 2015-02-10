angular.module("bridge.service").service("bridge.service.backgroundSetter", [function() {
    this.setBackgroundColor = function(sColor) {
        if (sColor === 'DEFAULT') {
            $('body').css('background-image', "url(https://bridge.mo.sap.corp/img/276245_l_srgb_s_gl_2.jpg)");
        } else {
            $('body').css("background-image", "");
            $('body').css('background-color', (sColor));
        }
    };
}]);
