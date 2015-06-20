require.config({
  paths: {
    jquery: '../bower_components/jquery/jquery',
    lodash: '../bower_components/lodash/lodash',
    backbone: '../bower_components/backbone/backbone',
    config: './config',
    events: './app/events',
    fatcontroller: './libs/fatcontroller',
    soundManager: '../bower_components/soundmanager/script/soundmanager2',
    videojs: './libs/video.dev',
    bootstrapSwitch: '../bower_components/bootstrap-switch/static/js/bootstrap-switch',
    scPlayer: './libs/sc-player',
    highcharts: './libs/highcharts',
    scrollTo: '../bower_components/jquery.scrollTo/jquery.scrollTo',
    easing: '../bower_components/jquery-easing/jquery.easing'
  },
  shim: {
    backbone: {
      deps: ['jquery', 'lodash'],
      exports: 'Backbone'
    },
    soundManager: {
      exports: 'soundManager'
    },
    videojs: {
      exports: 'videojs'
    },
    bootstrapSwitch: {
      deps: ['jquery']
    },
    scPlayer: {
      deps: [
        './libs/soundcloud.player.api'
      ]
    },
    scrollTo: {
      deps: ['jquery']
    },
    highcharts: {
      deps: ['jquery'],
      exports: 'Highcharts'
    }
  }
});

// Defer SoundManager2 instantiation until we're ready
window.SM2_DEFER = true;

require([
  'jquery',
  'events',
  './app/main',
  'config',
  // dependencies
  'bootstrapSwitch'
],
function($, events, app, config) {
  if (config.debugEvents) {
    window.fc = events;
  }
  $(app.init);
});
