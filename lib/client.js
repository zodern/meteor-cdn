Meteor.startup(function(){
  // Set the ROOT_URL_PATH_PREFIX to point to the cdn url
  // This is only required to fix a bug when Meteor hot-loads our css file
  // Meteor uses the client function Meteor._relativeToSiteRootUrl(css_url) to 
  // determine the path to css file when hot-reloading styles
  if (__meteor_runtime_config__.CDN_URL){
	__meteor_runtime_config__.ROOT_URL_PATH_PREFIX =__meteor_runtime_config__.CDN_URL; 	
  }
});