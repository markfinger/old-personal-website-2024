require.config({
  paths: {
    jquery: '../bower_components/jquery/jquery',
    lodash: '../bower_components/lodash/dist/lodash',
    settings: './settings',
    events: './libs/events',
    fatcontroller: './libs/fatcontroller',
    viewport: './libs/viewport',
    scroll: './libs/scroll',
    scrollTo: '../bower_components/jquery.scrollTo/jquery.scrollTo',
    mediaUtils: './libs/media-utils',
    shims: './libs/shims'
  },
  shim: {
    scrollTo: {
      deps: ['jquery']
    }
  },
  packages: [{
    name: 'fc',
    location: '../bower_components/fatcontroller'
  }]
});

require([
  'shims',
  'jquery',
  'settings',
  'fc',
  './app/main'
],
function(shims, $, settings, fc, app) {
  fc.debug = settings.debugEvents;
  $(app.init);
});
