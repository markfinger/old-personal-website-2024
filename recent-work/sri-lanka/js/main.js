require.config({
  paths: {
    jquery: '../bower_components/jquery/jquery',
    lodash: '../bower_components/lodash/lodash',
    config: './config',
    events: './libs/events',
    utils: './libs/utils',
    fatcontroller: './libs/fatcontroller',
    scrollTo: '../bower_components/jquery.scrollTo/jquery.scrollTo',
    easing: '../bower_components/jquery-easing/jquery.easing',
    timelinejs: '../bower_components/timelinejs/compiled/js/storyjs-embed',
    handlebars: '../bower_components/handlebars/handlebars',
    text: '../bower_components/requirejs-text/text',
    json: '../bower_components/requirejs-plugins/src/json',
    scroll: './libs/scroll'
  },
  shim: {
    scrollTo: {
      deps: ['jquery']
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
  'events',
  'json',
  'text',
  'scroll',
  'config',
  './app/main'
],
function($, events, json, text, scroll, config, app) {
  if (config.debugEvents) {
    window.fc = events;
  }
  $(app.init);
});
