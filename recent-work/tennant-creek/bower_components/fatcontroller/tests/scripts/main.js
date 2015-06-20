require.config({
  paths: {
    jquery: '../components/jquery/jquery',
    lodash: '../components/lodash/dist/lodash',
    QUnit: '../components/qunit/qunit/qunit'
  },
  shim: {
    QUnit: {
      exports: 'QUnit',
      init: function() {
        QUnit.config.autoload = false;
        QUnit.config.autostart = false;
      }
    }
  },
  packages: [{
    name: 'fc',
    location: '../..'
  }]
});

require([
  'jquery',
  'unit-tests'
], function($, unitTests) {
  $(unitTests.test);
});