var	fs = require('fs');

//set user certificate and passphrase
exports.certificate = fs.readFileSync('d050049.sso');
exports.passphrase = 'XXX';