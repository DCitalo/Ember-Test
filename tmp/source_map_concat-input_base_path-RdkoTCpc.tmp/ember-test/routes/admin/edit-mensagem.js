define('ember-test/routes/admin/edit-mensagem', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({
    model: function model(params) {
      return this.store.findRecord('Mensagem', params.Mensagem_id);
    },


    actions: {
      saveMensagem: function saveMensagem(Mensagem) {
        var _this = this;

        Mensagem.save().then(function () {
          return _this.transitionTo('admin.contact');
        });
      },
      willTransition: function willTransition(transition) {

        var model = this.controller.get('model');

        if (model.get('hasDirtyAttributes')) {
          var confirmation = confirm("Você ainda não salvou. Tem certeza que quer sair?");

          if (confirmation) {
            model.rollbackAttributes();
          } else {
            transition.abort();
          }
        }
      }
    }
  });
});