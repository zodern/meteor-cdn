
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
  object[methodName] = callback(object[methodName])
}

/*
 * Overide the default Meteor._relativeToSiteRootUrl()
 *
 */
override(Meteor, '_relativeToSiteRootUrl', function(original) {
  return function(link) {
    var CDN_URL = __meteor_runtime_config__.CDN_URL;
  	var extension = getExtension(link);
  	if (CDN_URL && STATIC.indexOf(extension) > -1) {
      console.log('09345')
  		j= pathJoin([CDN_URL, link]);
      console.log('>>>>'+j)
      return j
  	} else {
  		return original.apply(this, arguments);
  	}
  }
})

