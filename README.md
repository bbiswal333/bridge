Quick Start
===========

git installation
* install git from http://git-scm.com/downloads to (git-path)

https setup
* check if you can get https access to github via command *curl https://github.wdf.sap.corp*
* in case of error *SSL certificate problem: unable to get local issuer certificate* do the following
* download [SAPNetCA.crt](certificates/SAPNetCA.crt)
* goto the git installation folder under (git-path)/bin
* append SAPNetCA via *cat SAPNetCA.crt >> curl-ca-bundle.crt*
* configure git via *git config --global http.sslcainfo "(git-path)\bin\curl-ca-bundle.crt”*

ssh setup
* run *ssh-keygen -t rsa -C "your.name@sap.com"* to generate SSH keys
* upload the public key to your github account at https://github.wdf.sap.corp/settings/ssh

clone and test locally
* clone repository 
* install node.js from http://nodejs.org/
* fetch the package dependencies in /server via *npm install* 
* run "node server.js" in /server
* launch *https://localhost* in your browser

