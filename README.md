Meteor-CDN
===========

Serve static content from a CDN like CloudFlare or CloudFront. This package changes the domain of the bundled css and js files to the environment variable CDN_URL. If the CDN_URL environment variable is not present, the default behaviour will be unchanged.

Installation
===============
```sh
meteor add nitrolabs:cdn
```

Setup CloudFront or CloudFlare to proxy requests to your Meteor server. Then run Meteor with:
```sh
export CDN_URL="http://mydomain.cloudfront.com" && meteor
```

Features
========

### Meteor resources are Loaded from your CDN
CDN automatically sets WebAppInternals.setBundledJsCssPrefix to match CDN_URL so the main Meteor css and js files are loaded from your CDN.

### Template helper for other static files
CDN also provides a template helper to get the CDN_URL in your templates.
The CDN_URL helper can not be used in the head block, because Meteor does
evaluate helpers in the head block.

```html
<template name="MasterLayout">
	<img src="{{CDN_URL}}/images/profile.jpg"></img>
</template>
```

### Getting CDN url in Javascript
CDN exposes function which can be used to get current CDN address.

```javascript
CDN.get_cdn_url()
```

### Webfont headers
Google Chrome and several other mainstream browsers prevent webfonts being loaded from via CORS, unless the [Strict-Transport-Security  header](https://developer.mozilla.org/en-US/docs/Web/Security/HTTP_strict_transport_security) is set correctly. This package automatically adds the correct CORS and STS headers to webfont files to prevent this issue. When setting up Cloudfront or CloudFlare you should whitelist the Host and Strict-Transport-Security header.

### Proper 404 handling (beta)
Meteor currently uses the 200 response code for every request, regardless of whether the route or static resource exists. This can cause the CDN to cache error messages for static resources. `nitrolabs:cdn` fixes this problem by:
* Only allowing static resources to be served at the CDN_URL
* Returning a proper 404 for any missing static resources

Detailed Installation Guide
===========================
nitrolabs:cdn is compatible with most production setups.

### Using MUP
When serving your app with mup the ROOT_URL and CDN_URL environment variables can be set from mup.json. See the [meteor-cdn demo](https://github.com/NitroLabs/meteor-cdn-demo/) on Github for more details.

```js
// mup.json
{
    // Normal mup settings
    // ...
    // Configure environment
    "env": {
        "PORT"                 : 80,
        "CDN_URL"              : "http://d3k17ze63872d4.cloudfront.net",
        "ROOT_URL"             : "http://www.mysite.com"
    }
}
  ```

### Using with Galaxy
CDN works perfectly with MDG Galaxy. Setup instructions:
* Add the `nitrolabs:cdn` package to your app
* Point CloudFront at galaxy-ingress.meteor.com (see setting up CloudFront)
* Set the CDN_URL environment variable to xyz.cloundfront.com

The ROOT_URL and CDN_URL environment variables can be set from settings.json
```javascript
// Settings.json
{
  "galaxy.meteor.com": {
    "env": {
        "ROOT_URL": "https://www.mydomain.com",
        "CDN_URL": "https://xyz.cloudfront.net",
        "MONGO_URL": "...",
        "MONGO_OPLOG_URL": "..."
    }
  }
}
```
### Setting up CloudFront:
* Point CloudFront at your Meteor server
* Whitelist the Host and Strict-Transport-Security headers
* Set querystring forwarding to "Yes"

Development and Testing
-----------------------
We welcome contributions from the community. We aim to test and merge within 24 hours, 
especially for pull requests that fix existing bugs or add relevant functionality. 
Please make sure all tests pass before submitting a pull request:
```sh
meteor test-packages ./
```


License
------

MIT
