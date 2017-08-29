// app/controllers/index.js
import Ember from 'ember';

export default Ember.Controller.extend({

  emailAddress: '',
  contato: '',

  isValid: Ember.computed.match('emailAddress', /^.+@.+\..+$/),
  isDisabled: Ember.computed.not('isValid'),
  isValid: Ember.computed.match('contato', /^./),
  isDisabled: Ember.computed.not('isValid'),

  actions: {

    saveInvitation() {
      alert(`Seu e-mail: ${this.get('emailAddress')}; Sua opinião:${this.get('contato')} ;`);
      this.set('responseMessage', `Muito Obrigado! Estaremos entrando em contato em breve.`);
      this.set('emailAddress', '');
      this.set('contato', '');
    }
  }

});