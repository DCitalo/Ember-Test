define('ember-test/components/library-item-form', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({
    buttonLabel: 'Save',

    actions: {
      buttonClicked: function buttonClicked(param) {
        this.sendAction('action', param);
      }
    }
  });
});