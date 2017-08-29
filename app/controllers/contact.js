// app/controllers/index.js
import Ember from 'ember';

export default Ember.Controller.extend({

  emailAddress: '',
  contato: '',
  isValidEmail: Ember.computed.match('emailAddress', /^.+@.+\..+$/),
  isValidMessage: Ember.computed.gte('contato', /5/),
  isValid: Ember.computed.and('isValidEmail' , 'isValidMessage'),
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