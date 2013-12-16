Developer Guide
===============

## git installation & ssh setup
* download `git` from [git-scm](http://git-scm.com/downloads)
* for pushing changes to `git`, setup `ssh`
  * run `ssh-keygen -t rsa -C "your.name@sap.com"` to generate SSH keys (private & public key)
  * upload the public key to your github account [here](https://github.wdf.sap.corp/settings/ssh)

## setup local environment
* clone bridge repository via `git clone git@github.wdf.sap.corp:Tools/bridge.git`
* install `node.js` from [here](http://nodejs.org/)
* for windows, set proxy via `set http_proxy=http://proxy:8080` and `set https_proxy=http://proxy:8080`
* for mac os, set proxy via `export http_proxy=http://proxy:8080` and `export https_proxy=http://proxy:8080`
* fetch `node.js` package dependencies in the `/server` directory via `npm install`

## launch and execute application
* run `node server/server.js`
* open `http://localhost:8000`