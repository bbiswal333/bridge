node-sso
========

Offers the possibility to make SSO authenticated web calls within node.

# Usage
```
	require('node-sso').execute(function(sso) {
        //sso.caCertificate
        //sso.passphrase

        ////////// If Windows:
        //sso.pfx
        ////////// If Mac
        //sso.certificate
        //sso.key
    });
```