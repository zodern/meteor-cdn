var url = Npm.require("url");
var path = Npm.require("path");


CONTROLLER = new CDN._controllerClass();

// These tests directly influence the Meteor server that
// is running them. Therefore the ROOT_URL and
// CDN_URL must be reset after every test
function resetState(){
  CONTROLLER._setCdnUrl(process.env.CDN_URL);
  CONTROLLER._setRootUrl(process.env.ROOT_URL);
}


// ValidateSettings should return True if the settings are valid
Tinytest.add(
  'Server Side - CDN._validateSettings - valid settings',
  function (test) {
    var result;
    var cdn = "http://www.cloudfront.com/s9ufe3u2rns/";
    var root1 = "https://www.meteor.com/e9043utosn/";
    var root2 = "http://www.meteor.com/e9043utosn/";

    result = CONTROLLER._validateSettings(root1,cdn);
    test.isTrue(result, "validateSettings should return True if the settings are valid");

    result = CONTROLLER._validateSettings(root2,cdn);
    test.isTrue(result, "validateSettings should return True if the settings are valid");
    resetState();
  }
);



// validateSettings should false if the settings are insufficient
Tinytest.add(
  'Server Side - CDN._validateSettings - CDN_URL invalid',
  function (test) {
    cdn = "https://www.cloudfront.com/s9ufe3u2rns/";
    root = "https://www.meteor.com/e9043utosn/";

    result = CONTROLLER._validateSettings(undefined,cdn);
    test.isFalse(result, "validateSettings should return False if the settings are insufficient");

    result = CONTROLLER._validateSettings(root,undefined);
    test.isFalse(result, "validateSettings should return False if the settings are insufficient");

    result = CONTROLLER._validateSettings(undefined,undefined);
    test.isFalse(result, "validateSettings should return False if the settings are insufficient");
    resetState();
  }
);



// validateSettings should throw an error if the settings are fatal
Tinytest.add(
  'Server Side - CDN._validateSettings - ROOT_URL invalid',
  function (test) {
    cdnValid = "http://www.cloudfront.com/s9ufe3u2rns/";
    cdnInvalid1 = "ddp://www.cloudfront.com/s9ufe3u2rns/";
    cdnInvalid2 = "www.cloudfront.com/s9ufe3u2rns/";
    rootValid = "http://www.meteor.com/e9043utosn/"
    rootInvalid1 = "ddp://www.meteor.com/e9043utosn/";
    rootInvalid2 = "www.meteor.com/e9043utosn/"

    test.throws(function(){
      CONTROLLER._validateSettings(rootInvalid1,cdnValid);
    }, "ROOT_URL must use http or https protocol, not ddp:");

    test.throws(function(){
      CONTROLLER._validateSettings(rootInvalid2,cdnValid);
    }, "ROOT_URL must use http or https protocol, not null");

    test.throws(function(){
      CONTROLLER._validateSettings(rootValid,cdnInvalid1);
    }, "CDN_URL must use http or https protocol, not ddp:");

    test.throws(function(){
      CONTROLLER._validateSettings(rootValid,cdnInvalid2);
    }, "CDN_URL must use http or https protocol, not null");
    resetState();
  }
);




// If the CDN url does not exist, the default behaviour should be unchanged
Tinytest.add(
  'Server Side - CDN Disabled - CDN_URL missing',
  function (test) {
  	CONTROLLER._setCdnUrl(undefined);
  	CONTROLLER._setRootUrl("http://www.meteor.com/e9043utosn/");
  	test.equal(__meteor_runtime_config__.CDN_URL, undefined, 'Expected Meteor environment to be unchanged');
    resetState();
  }
);



// If the CDN is valid, the runtime config and css prefic should match CDN_URL
Tinytest.add(
  'Server Side - CDN Enabled - CDN_URL valid',
  function (test) {
  	cdn = "http://www.cloudfront.com/s9ufe3u2rns/";
  	root = "http://www.meteor.com/e9043utosn/";
  	CONTROLLER._setRootUrl(root);
    CONTROLLER._setCdnUrl(cdn);

    // We would expect the slashes to be stripped
    cdn = cdn.slice(0,-1);
    root = root.slice(0,-1);

    test.equal(__meteor_runtime_config__.CDN_URL, cdn, 'Expected Meteor environment to be setup correctly');
    resetState();
  }
);



// Create MOCK request objects
var req = { headers: {}};

var res = { status:0,
            headers: {},
            write: function(){},
            end: function(){},
            writeHead:function(status){
              this.status = status;
            },
            setHeader:function(key,value){
              this.headers[key] = value;
            }
          };

var nextCalls = 0;

var next = function(){
  nextCalls += 1;
}


// Scenario: static item is requested from the ROOT
// Requests to the ROOT_URL should not be effected by this package
Tinytest.add(
  'Server Side - ROOT Serving - Return 200 for missing static',
  function (test) {
    var status;
    var cdn = "http://www.cloudfront.com/s9ufe3u2rns/";
    var root = "http://www.meteor.com/e9043utosn/";
    var staticUrl1 = root + "myimages.js";
    var staticUrl2 = root + "images/myImage.js";
    CONTROLLER._setRootUrl(root);
    CONTROLLER._setCdnUrl(cdn);

    req.url = staticUrl1;
    req.headers.host = root;
    res.status = 200;
    CONTROLLER._static404connectHandler(req,res,next);
    test.equal(res.status,200);

    req.url = staticUrl2;
    req.headers.host = root;
    CONTROLLER._static404connectHandler(req,res,next);
    test.equal(res.status,200);
    resetState();
  }
);



// Scenario: Index is requested from the ROOT
// If any valid page is requested from the ROOT it should return a 200
Tinytest.add(
  'Server Side - ROOT Serving - Return 200 for valid page',
  function (test) {
    var status;
    var cdn = "http://www.cloudfront.com/";
    var root = "http://www.meteor.com/";
    CONTROLLER._setRootUrl(root)
    CONTROLLER._setCdnUrl(cdn);

    req.url = root;
    req.headers.host = root;
    res.status = 200;
    CONTROLLER._static404connectHandler(req,res,next);
    test.equal(res.status,200);
    resetState();
  }
);



// Scenario: Index is requested from the CDN
// If any page is requested from the CDN it should return a 404
Tinytest.add(
  'Server Side - CDN Serving - Return 404 for valid page',
  function (test) {
    var status;
    var cdn = "https://www.cloudfront.com/";
    var root = "https://www.meteor.com/";
    CONTROLLER._setRootUrl(root);
    CONTROLLER._setCdnUrl(cdn);

    req.url = cdn;
    req.headers.host = url.parse(cdn).host;
    res.nextCalls = nextCalls;

    CONTROLLER._static404connectHandler(req,res,next);
    test.equal(res.status,404);
    test.equal(nextCalls,res.nextCalls);
    resetState();
  }
);



// Scenario: static item is requested from the CDN
// If a missing static item is requested from the CDN it should return a 404
Tinytest.add(
  'Server Side - CDN Serving - Return 404 for missing static',
  function (test) {
    var status;
    var cdn = "http://www.cloudfront.com/";
    var root = "https://www.meteor.com/";
    var staticUrl1 = cdn + "myimages.js";
    var staticUrl2 = cdn + "images/myImage.js";
    CONTROLLER._setRootUrl(root);
    CONTROLLER._setCdnUrl(cdn);

    req.url = staticUrl1;
    req.headers.host = url.parse(cdn).host;
    res.nextCalls = nextCalls;

    CONTROLLER._static404connectHandler(req,res,next);
    test.equal(res.status,404);
    test.equal(nextCalls,res.nextCalls);

    req.url = staticUrl2;
    req.headers.cdn = root;

    CONTROLLER._static404connectHandler(req,res,next);
    test.equal(res.status,404);
    test.equal(nextCalls,res.nextCalls);
    resetState();
  }
);



// Scenario: static item is requested from the CDN
// If a missing static item is requested from the CDN it should return a 404
Tinytest.add(
  'Server Side - CDN Serving - Return 200 for valid static',
  function (test) {
    var status;
    var cdn = "https://www.cloudfront.com/";
    var root = "http://www.meteor.com/";
    var staticUrl = cdn + "packages/underscore.js";

    CONTROLLER._setRootUrl(root)
    CONTROLLER._setCdnUrl(cdn);

    req.url = staticUrl;
    req.headers.host = url.parse(cdn).host;
    res.status = 200;
    res.nextCalls = nextCalls;

    CONTROLLER._static404connectHandler(req,res,next);
    test.equal(res.status,200);
    test.equal(nextCalls-res.nextCalls,1);
    resetState();
  }
);



// Scenario: font is requested from the CDN
// All fonts should have the access-control-allow-origin header
Tinytest.add(
  'Server Side - Font Headers - Add headers to font files',
  function (test) {
    var status;
    var cdn = "https://www.cloudfront.com/";
    var root = "http://www.meteor.com/";
    var fixtures = cdn + "packages/local-test_maxkferg_cdn/tests/fixtures/";

    var fonts = [];
    fonts.push(fixtures + "icomoon.otf");
    fonts.push(fixtures + "icomoon.eot");
    fonts.push(fixtures + "icomoon.svg");
    fonts.push(fixtures + "icomoon.ttf");
    fonts.push(fixtures + "icomoon.woff");

    CONTROLLER._setRootUrl(root)
    CONTROLLER._setCdnUrl(cdn);

    req.headers.host = url.parse(cdn).host;
    res.status = 200;

    for (var i=1; i<fonts.length; i++){
      req.url = fonts[i];
      res.headers = {};
      res.nextCalls = nextCalls;
      CONTROLLER._CORSconnectHandler(req,res,next);
      test.equal(res.status,200);
      test.equal(nextCalls-res.nextCalls,1);
      test.equal(res.headers['Strict-Transport-Security'],'max-age=2592000; includeSubDomains','Missing STS Header')
      test.equal(res.headers['Access-Control-Allow-Origin'], '*', 'Missing ACAO Header');
    }
    resetState();
  }
);





// Scenario: font is requested from the CDN with querystring
// All fonts should have the access-control-allow-origin header
Tinytest.add(
  'Server Side - Font Headers - Ignore font query string',
  function (test) {
    var status;
    var cdn = "https://www.cloudfront.com/";
    var root = "http://www.meteor.com/";
    var fixtures = cdn + "packages/local-test_maxkferg_cdn/tests/fixtures/";
    var font = fixtures + "icomoon.woff?-acxumy";

    CONTROLLER._setRootUrl(root)
    CONTROLLER._setCdnUrl(cdn);

    req.url = font
    req.headers.host = url.parse(cdn).host;
    res.headers = {};

    CONTROLLER._CORSconnectHandler(req,res,next);
    test.equal(res.headers['Strict-Transport-Security'],'max-age=2592000; includeSubDomains','Missing STS Header')
    test.equal(res.headers['Access-Control-Allow-Origin'], '*', 'Missing ACAO Header');
    resetState()
  }
);



// Scenario: a css file is requested from the CDN with querystring
// Only font files should have the two headers, not css files
Tinytest.add(
  'Server Side - Font Headers - Negative test',
  function (test) {
    var status;
    var cdn = "https://www.cloudfront.com/";
    var root = "http://www.meteor.com/";
    var fixtures = cdn + "packages/local-test_maxkferg_cdn/tests/fixtures/";
    var filepath = fixtures + "icomoon.css";

    CONTROLLER._setRootUrl(root);
    CONTROLLER._setCdnUrl(cdn);

    req.url = filepath;
    req.headers.host = url.parse(cdn).host;
    res.headers = {};

    CONTROLLER._CORSconnectHandler(req,res,next);
    test.equal(res.headers['Strict-Transport-Security'], undefined, 'Extra STS Header');
    test.equal(res.headers['Access-Control-Allow-Origin'], undefined, 'Extra ACAO Header');
    resetState()
  }
);




