define('ember-test/models/author', ['exports', 'ember-data', 'faker'], function (exports, _emberData, _faker) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberData.default.Model.extend({

    name: _emberData.default.attr('string'),
    books: _emberData.default.hasMany('book', { inverse: 'author', async: true }),

    isNotValid: Ember.computed.empty('name'),

    randomize: function randomize() {
      this.set('name', _faker.default.name.findName());
      return this;
    }
  });
});