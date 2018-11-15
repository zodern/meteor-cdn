Package.describe({
  name: 'zodern:cdn',
  version: '1.4.0',
  summary: 'Serve Meteor content from a CDN',
  git: 'https://github.com/zodern/meteor-cdn',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.4');
  api.export('CDN','server');
  api.export('CDN','client');
  api.use('webapp','server');
  api.use('templating','client');
  api.use('browser-policy', {weak: true});
  api.addFiles('lib/template.js','client');
  api.addFiles('lib/client.js','client');
  api.addFiles('lib/server.js','server');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('zodern:cdn');
  api.addFiles('tests/client.js','client');
  api.addFiles('tests/server.js','server');

  api.addFiles('tests/fixtures/icomoon.eot', 'client', {isAsset: true});
  api.addFiles('tests/fixtures/icomoon.svg', 'client', {isAsset: true});
  api.addFiles('tests/fixtures/icomoon.ttf', 'client', {isAsset: true});
  api.addFiles('tests/fixtures/icomoon.woff', 'client', {isAsset: true});
  api.addFiles('tests/fixtures/icomoon.otf', 'client', {isAsset: true});
});
