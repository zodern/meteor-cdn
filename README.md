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
    <link href='{{CDN_URL}}/public/css/custom.css' rel='stylesheet' type='text/css'>
</head>

<template name="MasterLayout">
	<img src="{{CDN_URL}}/images/profile.jpg"></img>
</template>
```

## Proper 404 handling
Meteor currently uses the 200 response code for every request, regardless of whether the route or static resource exists. This can cause the CDN to cache error messages for static resources. Meteor fixes this problem by:
* Only allowing static resources to be served at the CDN_URL
* Returning a proper 404 for any missing static resources

## Meteor Cluster
CDN can be used with Meteor-Cluster but there are some important restrictions
* Don't use Cluster with force-ssl: It can cause circular 302 redirects
* Ensure that CloudFront (or other CDN) points at the primary cluster server otherwise the hot-reload client will try and load bundled resources before they exist. In this case CloudFront may cache error responses from the server.
* Don't point CloudFront to a server that uses cluster balancing - for the same reason

## What it does
* Changes the url of the bundled css and js file
* Adds CORS headers to font (.eot .otf .ttf .woff) files
* Changes ROOT_URL_PATH_PREFIX of the client to ensure hot reload works correctly
* Provides a template helper

License
----

Creative Commons
