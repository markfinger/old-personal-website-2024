define([
  'QUnit',
  'fc'
], function(QUnit, fc) {

  var test = function() {

    QUnit.test('Triggers bindings', 3, function() {
      var someFunction = function() {
        ok(true, 'called bound function');
      };

      fc.on('test:trigger', someFunction);

      fc.trigger('test:trigger');

      fc.on('test:trigger', someFunction);

      fc.trigger('test:trigger');
    });

    QUnit.test('Once only fires once', 1, function() {
      var someFunction = function() {
        ok(true, 'called bound function');
      };

      fc.once('test:once', someFunction);

      fc.trigger('test:once');
      fc.trigger('test:once');
    });

    QUnit.test('After triggers when bound after an event occurred', function() {

      var someFunction = function() {
        ok(true, 'called bound function');
      };

      fc.trigger('test:after1');

      fc.after('test:after1', someFunction);

    });

    QUnit.test('After triggers when bound before and after an event occurs', 2, function() {

      var someFunction = function() {
        ok(true, 'called bound function');
      };

      fc.after('test:after2', someFunction);

      fc.trigger('test:after2');

      fc.after('test:after2', someFunction);

    });

    QUnit.test('Off removes event bindings', 0, function() {

      var someFunction = function() {
        ok(false, 'should not be called');
      };

      fc.on('test:off1', someFunction);

      fc.off('test:off1');

      fc.trigger('test:off1');

    });

    QUnit.test('Off removes a specific binding', 1, function() {

      var someFunction = function() {
        ok(false, 'should not be called');
      };

      var someOtherFunction = function() {
        ok(true, 'called bound function');
      };

      fc.on('test:off2', someFunction);
      fc.on('test:off2', someOtherFunction);

      fc.off('test:off2', someFunction);

      fc.trigger('test:off2');

    });

    // Start QUnit
    QUnit.load();
    QUnit.start();

  };

  return {
    test: test
  };

});