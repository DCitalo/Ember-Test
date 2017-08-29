// app/controllers/index.js
import Ember from 'ember';

export default Ember.Controller.extend({

	headerMessage: 'Fale Conosco',
	responseMessage: '',
  	emailAddress: '',
  	contato: '',
	isValidEmail: Ember.computed.match('emailAddress', /^.+@.+\..+$/),
  	isValidMessage: Ember.computed.gte('contato', /5/),
  	isValid: Ember.computed.and('isValidEmail' , 'isValidMessage'),
  	isDisabled: Ember.computed.not('isValid'),

  	actions: {

	    SaveMessage() {
	    	const email = this.get('emailAddress');
	    	const contato = this.get('contato');

	    	const newMessage = this.store.createRecord('mensagem', {
	        	email: email,
	        	contato: contato
	      	});

	    	newMessage.save().then((response) => {
		      alert(`Seu e-mail: ${this.get('emailAddress')}; Sua opinião:${this.get('contato')} ;`);
		      this.set('responseMessage', `Muito Obrigado! Estaremos entrando em contato em breve.`);
		      this.set('emailAddress', '');
		      this.set('contato', '');
	  		});
	    }
	}

});