// app/routes/admin/editMensagem.js
import Ember from 'ember';

export default Ember.Route.extend({

  model(params) {
    return this.store.findRecord('Mensagem', params.Mensagem_id);
  },

  actions: {

    saveMensagem(Mensagem) {
      Mensagem.save().then(() => this.transitionTo('admin.contact'));
    },

    willTransition(transition) {

      let model = this.controller.get('model');

      if (model.get('hasDirtyAttributes')) {
        let confirmation = confirm("Você ainda não salvou. Tem certeza que quer sair?");

        if (confirmation) {
          model.rollbackAttributes();
        } else {
          transition.abort();
        }
      }
    }
  }
});