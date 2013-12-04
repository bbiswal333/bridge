Developer Guide
===============

## `git` installation
* download `git` from [git-scm](http://git-scm.com/downloads) and install it to `git-path`
* for pushing changes to `git`, you need to setup `https` or `ssh` (the `Git Read-Only` link works without that)
* `https` setup for `git`
  * check if you can get `https` access to github via command `curl https://github.wdf.sap.corp`
  * in case of error `SSL certificate problem: unable to get local issuer certificate` do the following
  * download the `SAPNetCA.crt` file from your browser
  * goto the `git` installation folder under `git-path/bin`
  * append `SAPNetCA.crt` via `cat SAPNetCA.crt >> curl-ca-bundle.crt`
  * execute `git config --global http.sslcainfo "(git-path)\bin\curl-ca-bundle.crt”`
* ssh setup for `git`
  * run `ssh-keygen -t rsa -C "your.name@sap.com"` to generate SSH keys
  * upload the public key to your github account [here](https://github.wdf.sap.corp/settings/ssh)

## setup local environment
* clone bridge repository via `git clone`
* install `node.js` from [here](http://nodejs.org/)
* run `set http_proxy=http://proxy:8080` and `set https_proxy=http://proxy:8080` in command line
* fetch the node.js package dependencies in `/server` via `npm install`
* export certificate on a windows pc/ wts from [here](https://wiki.wdf.sap.corp/wiki/download/attachments/1065226200/SSOCertificateExportWizard.hta)
* download .sso file to `/server` directory
* create `certificate.json` in `/server` directory and set the .sso filename and passphrase entered when exporting the certificate

```json
	{
		"certificate_file": 		"d050049.sso",
		"certificate_passphrase": 	"my_passphrase"
	}
```

## launch local bridge server
* on windows goto `/nw-windows` and execute "nw ../"
* on mac ??
* on linux ??


