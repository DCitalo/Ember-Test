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
      deleteMensagem: function deleteMensagem(Mensagem) {
        var confirmation = confirm('Têm certeza?');

        if (confirmation) {
          Mensagem.destroyRecord();
        }
      }
    }

  });
});