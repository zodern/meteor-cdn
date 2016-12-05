
/*
 * Monkey patch: Meteor._relativeToSiteRootUrl
 *
 * Meteor uses the function _relativeToSiteRootUrl internally
 * to add ROOT_URL_PATH_PREFIX to any path that starts with /.
 *
 * In production ROOT_URL_PATH_PREFIX is added to the compiled
 * css and js files, as well as the websocket info request (/sockjs/info).
 *
 * The desired behaviour is to use CDN_URL for the compiled
 * css and js files, while leaving the default behaviour unchanged for
 * all other requests.
 *
 * This code is particularly sensitive to two scenarios:
 * 1) Hot reloading js and css files from the CDN
 * 2) Re-establishing websocket connection after it is dropped (/sock/js call)
 *
 */
const STATIC = ['.css','.js'];



/*
 * Overide the default Meteor._relativeToSiteRootUrl()
 *
 */
override(Meteor, '_relativeToSiteRootUrl', function(original) {
  return function(link) {
    var CDN_URL = __meteor_runtime_config__.CDN_URL;
  	var extension = getExtension(link);
  	if (CDN_URL && STATIC.indexOf(extension) > -1) {
      return pathJoin([CDN_URL, link]);
  	} else {
  		return original.apply(this, arguments);
  	}
  }
});

/* overide helper
 *
 * Abstract way to override a object method
 * @callback should return a function to be called in place of the
 * original method. @callback is passed the original method as the
 * first argument
 *
 * Inspired by http://me.dt.in.th/page/JavaScript-override/
 *
 */
function override(object, methodName, callback) {
  object[methodName] = callback(object[methodName]);
}

/* getExtension
 *
 * Return the file extension from url
 * File extensions include the '.'
 *
 * Handles the following cases elegantly:
 * getExtension("/somefile.css") -> ".css"
 * getExtension("/url/somefile.css") -> ".css"
 * getExtension("/url/somefile.css?version") -> ".css"
 * getExtension("/url/somefile.css?version=3.4.5") -> ".css"
 */
function getExtension(url) {
    return (url = url.substr(1 + url.lastIndexOf("/")).split(/\#|\?/)[0]).substr(url.lastIndexOf("."));
}

/**
 * pathJoin
 * Join multiple path components and avoid duplicate separators
 */
function pathJoin(parts){
  return parts.map(function(path){
    if (path[0] === "/"){
      path = path.slice(1);
    }
    if (path[path.length - 1] === "/"){
      path = path.slice(0, path.length - 1);
    }
    return path;
  }).join("/");
}

// Export the CDN object
CDN = {};

// Add CDN_URL available through the CDN object
CDN.get_cdn_url = function(){
  return __meteor_runtime_config__.CDN_URL || "";
}