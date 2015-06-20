require.config({
  paths: {
    jquery: '../bower_components/jquery/jquery',
    lodash: '../bower_components/lodash/lodash',
    d3: '../bower_components/d3/d3',
    config: './config',
    fatcontroller: './libs/fatcontroller',
    events: './libs/events',
    utils: './libs/utils',
    scroll: './libs/scroll',
    scrollTo: '../bower_components/jquery.scrollTo/jquery.scrollTo',
    easing: '../bower_components/jquery-easing/jquery.easing',
    timelinejs: '../bower_components/timelinejs/compiled/js/storyjs-embed',
    handlebars: '../bower_components/handlebars/handlebars',
    text: '../bower_components/requirejs-text/text',
    json: '../bower_components/requirejs-plugins/src/json'
  },
  shim: {
    scrollTo: {
      deps: ['jquery']
    },
    d3: {
      exports: 'd3'
    },
    timelinejs: {
      deps: ['jquery']
    },
    handlebars: {
      exports: 'Handlebars'
    }
  }
});

require([
  'jquery',
  'd3',
  'events',
  'json',
  'text',
  'config',
  './app/main'
],
function($, d3, events, json, text, config, app) {
  // TODO: remove events and integrate the debug code into `fc`
  if (config.debugEvents) {
    window.fc = events;
  }
  $(app.init);
});
