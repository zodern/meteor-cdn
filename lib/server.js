var url = Npm.require("url");
var path = Npm.require("path");
var connectHandler = WebApp.rawConnectHandlers;

Meteor.startup(function() {
	// Set the css and js prefix for the Meteor server
	// Also pass this prefix to the client, so it can be set in app.js
	if (process.env.CDN_URL){
		console.info("Using cdn: "+ process.env.CDN_URL);
		WebAppInternals.setBundledJsCssPrefix(process.env.CDN_URL);
		__meteor_runtime_config__.CDN_URL = process.env.CDN_URL;
	}

	// Set CORS headers on webfonts to avoid issue with chrome and firefox
	connectHandler.use(function (req, res, next) {
		var ext = path.extname(url.parse(req.url).pathname);
		console.log(ext)
		var whitelist = ['.woff','.ttf','.eof'];

		if (whitelist.indexOf(ext) > -1){
			res.setHeader('Strict-Transport-Security', 'max-age=2592000; includeSubDomains'); // 2592000s / 30 days
			res.setHeader("Access-Control-Allow-Origin", "*");
		}
		return next();
	});
});
