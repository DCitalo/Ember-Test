define('ember-test/components/fader-label', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({
    tagName: 'span',

    classNames: ['label label-success label-fade'],
    classNameBindings: ['isShowing:label-show'],

    isShowing: false,

    isShowingChanged: Ember.observer('isShowing', function () {
      var _this = this;

      // User can navigate away from this page in less than 3 seconds, so this component will be destroyed,
      // however our "setTimeout" task try to run.
      // We save this task in a local variable, so it can be cleaned up during the destroy process.
      // Otherwise you will see a "calling set on destroyed object" error.
      this._runLater = Ember.run.later(function () {
        return _this.set('isShowing', false);
      }, 3000);
    }),

    resetRunLater: function resetRunLater() {
      this.set('isShowing', false);
      Ember.run.cancel(this._runLater);
    },
    willDestroy: function willDestroy() {
      this.resetRunLater();
      this._super.apply(this, arguments);
    }
  });
});