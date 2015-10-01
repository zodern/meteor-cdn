Package.describe({
  name: 'maxkferg:cdn',
  version: '1.0.1',
  summary: 'Serve Meteor content from a CDN',
  git: 'https://github.com/NitroLabs/metepr',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');
  api.use('webapp','server');
  api.use('templating','client');
  api.addFiles('lib/template.js','client');
  api.addFiles('lib/client.js','client');
  api.addFiles('lib/server.js','server');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('maxkferg:cdn');
  api.addFiles('cdn-tests.js');
});
