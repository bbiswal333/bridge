Developer Guide
===============

git installation
* install git from http://git-scm.com/downloads to (git-path)

https setup
* check if you can get https access to github via command *curl https://github.wdf.sap.corp*
* in case of error *SSL certificate problem: unable to get local issuer certificate* do the following
* download the SAPNetCA.crt file (via you browser or [here](certificates/SAPNetCA.crt))
* goto the git installation folder under (git-path)/bin
* run command *cat SAPNetCA.crt curl-ca-bundle.crt > curl-ca-bundle2.crt*
* replace *curl-ca-bundle.crt* with *curl-ca-bundle2.crt*
* set bundle in git via *git config --global http.sslcainfo "(git-path)\bin\curl-ca-bundle.crt”*

ssh setup
* run *ssh-keygen -t rsa -C "your.name@sap.com"* to generate SSH keys
* upload the public key to your github account at https://github.wdf.sap.corp/settings/ssh

clone and test locally
* close repository via *git clone https://github.wdf.sap.corp/Tools/bridge.git* or via ssh with *git clone git@github.wdf.sap.corp:Tools/bridge.git*
* to run a test instance locally, install node.js from http://nodejs.org/, fetch the package dependencies in /server via *npm install* and run "node server.js" in that directory. Then launch *https://localhost* in your browser.

