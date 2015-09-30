# Meteor-CDN

Serve static content from a CDN like CloudFlare or CloudFront. This package changes the domain of the bundled css and js files to the environment variable CDN_URL. If the environment variable is not present, the default behaviour will be unchanged.

## Installation
```sh
meteor add maxkferg:cdn
```

Setup CloudFront or CloudFlare to request and cache static resources from your Meteor server. Then run Meteor with:
```sh
export CDN_URL="mydomain.cloudfront.com" && meteor
```


## Template Helpers
CDN also provides a template helper to get the CDN_URL your templates

```html
<head>
    <link href='https://fonts.googleapis.com/css?family=Roboto' rel='stylesheet'  type='text/css'>  
    <link href='{{ CDN_URL}}/public/css/custom.css' rel='stylesheet' type='text/css'>
</head>

<template name="MasterLayout">
	<img src="{{ CDN_URL}}/images/profile.jpg"></img>
</template>
```

## What it does
* Changes the url of the bundled css and js file
* Adds CORS headers to font (.eot .ttf .woff) files
* Changes ROOT_URL_PATH_PREFIX of the client to ensure hot reload works correctly
* Provides a template helper

License
----

Creative Commons# meteor-cdn
