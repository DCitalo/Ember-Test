define('ember-test/routes/admin/contact', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({
    model: function model() {
      return this.store.findAll('Mensagem');
    },


    actions: {
      deleteLibrary: function deleteLibrary(Mensagem) {
        var confirmation = confirm('Are you sure?');

        if (confirmation) {
          Mensagem.destroyRecord();
        }
      }
    }

  });
});