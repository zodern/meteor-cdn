/**
 * CDN_URL
 * Return the CDN_URL environment variable or "" 
 */
Template.registerHelper("CDN_URL", function () {
    return __meteor_runtime_config__.CDN_URL || "";
});