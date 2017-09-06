// app/routes/admin/invitations.js
import Ember from 'ember';

export default Ember.Route.extend({

    init() {
    debugger;
  },

  beforeModel(transition) {
    debugger;
  },

  model(params, transition) {
    debugger;
  },

  afterModel(model, transition) {
    debugger;
  },

  activate() {
    debugger;
  },

  setupController(controller, model) {
    debugger;
  },

  renderTemplate(controller, model) {
    debugger;
  }
  
  model() {
    return this.store.findAll('Mensagem');
  },

  actions: {

    deleteMensagem(Mensagem) {
      let confirmation = confirm('Têm certeza?');

      if (confirmation) {
        Mensagem.destroyRecord();
      }
    }
  }

});