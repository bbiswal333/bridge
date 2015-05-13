/******************************************
 * In this file, the global object is filled, which allows us to pass objects from the nw.js context
 * (where we have jQuery, gui and so on) to the node.js context (all the files which are loaded via require run
 * in the node.js context)
 */
var gui = require('nw.gui');
global.webkitClient = {};
global.webkitClient.showInTaskbar = true;
//
////make version available from package.json
global.webkitClient.version = gui.App.manifest.version;

global.webkitClient.jQuery = jQuery;
global.webkitClient.gui = gui;
