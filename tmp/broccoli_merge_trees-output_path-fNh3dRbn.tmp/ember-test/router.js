define('ember-test/router', ['exports', 'ember-test/config/environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var Router = Ember.Router.extend({
    location: _environment.default.locationType
  });

  Router.map(function () {

    this.route('about');
    this.route('contact');

    this.route('admin', function () {
      this.route('invitations');
      this.route('contact');
    });

    this.route('libraries', function () {
      this.route('new');
    });
  });

  exports.default = Router;
});