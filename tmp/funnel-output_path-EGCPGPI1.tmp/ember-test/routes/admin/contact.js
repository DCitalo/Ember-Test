// app/routes/admin/invitations.js
import Ember from 'ember';

export default Ember.Route.extend({

  model() {
    return this.store.findAll('Mensagem');
  },

  actions: {

    deleteLibrary(Mensagem) {
      let confirmation = confirm('Are you sure?');

      if (confirmation) {
        Mensagem.destroyRecord();
      }
    }
  }
  
});