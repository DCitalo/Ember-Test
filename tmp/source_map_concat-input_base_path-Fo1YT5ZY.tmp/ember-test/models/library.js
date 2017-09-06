define('ember-test/models/library', ['exports', 'ember-data', 'faker'], function (exports, _emberData, _faker) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberData.default.Model.extend({

    name: _emberData.default.attr('string'),
    address: _emberData.default.attr('string'),
    phone: _emberData.default.attr('string'),

    books: _emberData.default.hasMany('book', { inverse: 'library', async: true }),

    isValid: Ember.computed.notEmpty('name'),

    randomize: function randomize() {
      this.set('name', _faker.default.company.companyName() + ' Library');
      this.set('address', this._fullAddress());
      this.set('phone', _faker.default.phone.phoneNumber());

      // If you would like to use in chain.
      return this;
    },
    _fullAddress: function _fullAddress() {
      return _faker.default.address.streetAddress() + ', ' + _faker.default.address.city();
    }
  });
});