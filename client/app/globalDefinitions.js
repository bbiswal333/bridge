global.jQuery = jQuery;

global.webkitClient = {};
global.webkitClient.serverStarted = function () {
    /*var socket = io.connect('https://localhost:1972');

    socket.on('client', function (request) {
        var response = {};
        $.get(request.url, function (data) {
            response.code = 200;
            response.data = data;
            socket.emit('client_response', response);
        }).fail(function () {
            response.code = 500;
            socket.emit('client_response', response)
        });
    });*/

    alert("blub");
    var win = gui.Window.get();
    win.hide();
    createTrayIcon();
};