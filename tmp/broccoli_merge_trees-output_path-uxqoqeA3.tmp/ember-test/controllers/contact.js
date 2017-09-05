define('ember-test/controllers/contact', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Controller.extend({

		headerMessage: 'Fale Conosco',
		responseMessage: '',
		emailAddress: '',
		contato: '',
		isValidEmail: Ember.computed.match('emailAddress', /^.+@.+\..+$/),
		isValidMessage: Ember.computed.gte('contato', /5/),
		isValid: Ember.computed.and('isValidEmail', 'isValidMessage'),
		isDisabled: Ember.computed.not('isValid'),

		actions: {
			SaveMessage: function SaveMessage() {
				var _this = this;

				var email = this.get('emailAddress');
				var contato = this.get('contato');

				var newMessage = this.store.createRecord('mensagem', {
					email: email,
					contato: contato
				});

				newMessage.save().then(function (response) {
					alert('Seu e-mail: ' + _this.get('emailAddress') + '; Sua opini\xE3o:' + _this.get('contato') + ' ;');
					_this.set('responseMessage', 'Muito Obrigado! Estaremos entrando em contato em breve.');
					_this.set('emailAddress', '');
					_this.set('contato', '');
				});
			}
		}

	});
});