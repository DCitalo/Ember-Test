define('ember-test/tests/helpers/destroy-firebase-apps', ['exports', 'firebase'], function (exports, _firebase) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = destroyFirebaseApps;
  var run = Ember.run;


  /**
   * Destroy all Firebase apps.
   */
  function destroyFirebaseApps() {
    var deletions = _firebase.default.apps.map(function (app) {
      return app.delete();
    });
    Ember.RSVP.all(deletions).then(function () {
      return run(function () {
        // NOOP to delay run loop until the apps are destroyed
      });
    });
  }
});