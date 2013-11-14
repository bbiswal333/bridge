Bridge
======

The bridge application gives you a quick overview over different systems for you and your team. Currently this application is still in development.

Developer Quick Start
=====================

* install git from http://git-scm.com/downloads to <git-path>
* check if you can get https access to github via command *curl https://github.wdf.sap.corp*
* in case of error *SSL certificate problem: unable to get local issuer certificate* do the following
** download the SAPNetCA.crt file
** goto the git installation folder under <git-path>/bin
** run command *cat SAPNetCA.crt curl-ca-bundle.crt > curl-ca-bundle2.crt
** rename curl-ca-bundle.crt to _curl-ca-bundle.crt
** rename curl-ca-bundle2.crt to curl-ca-bundle.crt
* set bundle in git via *git config --global http.sslcainfo "<git-path>\bin\curl-ca-bundle.crt”

* close repository via *git clone https://github.wdf.sap.corp/Tools/bridge.git*
* to run a test instance locally, install node.js from http://nodejs.org/, fetch the package dependencies in /server via *npm install* and run "node server.js" in that directory. Then launch *https://localhost* in your browser.

