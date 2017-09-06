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
      this.route('contacts');
      this.route('contact');
      this.route('editMensagem', { path: '/:Mensagem_id/editMensagem' });
      this.route('editInvitations', { path: '/:invitation_id/editInvitations' });
      this.route('seeder');
    });

    this.route('libraries', function () {
      this.route('new');
      this.route('edit', { path: '/:library_id/edit' });
      this.route('form');
    });
    this.route('authors');
    this.route('books');
  });

  exports.default = Router;
});