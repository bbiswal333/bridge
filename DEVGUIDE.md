Developer Guide
===============

git installation
* install git from http://git-scm.com/downloads to (git-path)

https setup
* check if you can get https access to github via command *curl https://github.wdf.sap.corp*
* in case of error *SSL certificate problem: unable to get local issuer certificate* do the following
* download the SAPNetCA.crt file (via you browser or [here](certificates/SAPNetCA.crt))
* goto the git installation folder under (git-path)/bin
* append SAPNetCA.crt via *cat SAPNetCA.crt >> curl-ca-bundle.crt*
* execute *git config --global http.sslcainfo "(git-path)\bin\curl-ca-bundle.crt”*

ssh setup
* run *ssh-keygen -t rsa -C "your.name@sap.com"* to generate SSH keys
* upload the public key to your github account at https://github.wdf.sap.corp/settings/ssh

clone repository
* clone repository
* install node.js from http://nodejs.org/
* fetch the package dependencies in /server via *npm install*

get certificate
* export certificate via https://wiki.wdf.sap.corp/wiki/download/attachments/1065226200/SSOCertificateExportWizard.hta
* download .sso file to server directory
* create certificate.json in server directory and set filename and passphrase

{
	"certificate_file": "d050049.sso",
	"certificate_passphrase": "my_passphrase"
}

start local server
* dowload node-webkit from https://github.com/rogerwang/node-webkit
* launch nw with complete bridge directory "nw ../" from nw-os directory


