define('ember-test/adapters/application', ['exports', 'emberfire/adapters/firebase'], function (exports, _firebase) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _firebase.default.extend({});
});