"use strict";



define('ember-test/adapters/application', ['exports', 'emberfire/adapters/firebase'], function (exports, _firebase) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _firebase.default.extend({});
});
define('ember-test/app', ['exports', 'ember-test/resolver', 'ember-load-initializers', 'ember-test/config/environment'], function (exports, _resolver, _emberLoadInitializers, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var App = Ember.Application.extend({
    modulePrefix: _environment.default.modulePrefix,
    podModulePrefix: _environment.default.podModulePrefix,
    Resolver: _resolver.default
  });

  (0, _emberLoadInitializers.default)(App, _environment.default.modulePrefix);

  exports.default = App;
});
define('ember-test/components/fader-label', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({
    tagName: 'span',

    classNames: ['label label-success label-fade'],
    classNameBindings: ['isShowing:label-show'],

    isShowing: false,

    isShowingChanged: Ember.observer('isShowing', function () {
      var _this = this;

      // User can navigate away from this page in less than 3 seconds, so this component will be destroyed,
      // however our "setTimeout" task try to run.
      // We save this task in a local variable, so it can be cleaned up during the destroy process.
      // Otherwise you will see a "calling set on destroyed object" error.
      this._runLater = Ember.run.later(function () {
        return _this.set('isShowing', false);
      }, 3000);
    }),

    resetRunLater: function resetRunLater() {
      this.set('isShowing', false);
      Ember.run.cancel(this._runLater);
    },
    willDestroy: function willDestroy() {
      this.resetRunLater();
      this._super.apply(this, arguments);
    }
  });
});
define('ember-test/components/library-item-form', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({
    buttonLabel: 'Save',

    actions: {
      buttonClicked: function buttonClicked(param) {
        this.sendAction('action', param);
      }
    }
  });
});
define('ember-test/components/library-item', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({});
});
define('ember-test/components/nav-link-to', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.LinkComponent.extend({
    tagName: 'li'
  });
});
define('ember-test/components/number-box', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({

    classNames: ['panel', 'panel-warning']

  });
});
define('ember-test/components/seeder-block', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var MAX_VALUE = 100;

  exports.default = Ember.Component.extend({

    counter: null,

    isCounterValid: Ember.computed.lte('counter', MAX_VALUE),
    isCounterNotValid: Ember.computed.not('isCounterValid'),
    placeholder: 'Max ' + MAX_VALUE,

    generateReady: false,
    deleteReady: false,

    generateInProgress: false,
    deleteInProgress: false,

    generateIsDisabled: Ember.computed.or('isCounterNotValid', 'generateInProgress', 'deleteInProgress'),
    deleteIsDisabled: Ember.computed.or('generateInProgress', 'deleteInProgress'),

    actions: {
      generateAction: function generateAction() {
        if (this.get('isCounterValid')) {

          // Action up to Seeder Controller with the requested amount
          this.sendAction('generateAction', this.get('counter'));
        }
      },
      deleteAction: function deleteAction() {
        this.sendAction('deleteAction');
      }
    }
  });
});
define('ember-test/components/welcome-page', ['exports', 'ember-welcome-page/components/welcome-page'], function (exports, _welcomePage) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _welcomePage.default;
    }
  });
});
define('ember-test/controllers/admin/seeder', ['exports', 'faker'], function (exports, _faker) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend({

    actions: {
      generateLibraries: function generateLibraries(volume) {
        var _this = this;

        // Progress flag, data-down to seeder-block where our lovely button will show a spinner...
        this.set('generateLibrariesInProgress', true);

        var counter = parseInt(volume);
        var savedLibraries = [];

        for (var i = 0; i < counter; i++) {

          // Collect all Promise in an array
          savedLibraries.push(this._saveRandomLibrary());
        }

        // Wait for all Promise to fulfill so we can show our label and turn off the spinner.
        Ember.RSVP.all(savedLibraries).then(function () {
          _this.set('generateLibrariesInProgress', false);
          _this.set('libDone', true);
        });
      },
      deleteLibraries: function deleteLibraries() {
        var _this2 = this;

        // Progress flag, data-down to seeder-block button spinner.
        this.set('deleteLibrariesInProgress', true);

        // Our local _destroyAll return a promise, we change the label when all records destroyed.
        this._destroyAll(this.get('libraries'))

        // Data down via seeder-block to fader-label that we ready to show the label.
        // Change the progress indicator also, so the spinner can be turned off.
        .then(function () {
          _this2.set('libDelDone', true);
          _this2.set('deleteLibrariesInProgress', false);
        });
      },
      generateBooksAndAuthors: function generateBooksAndAuthors(volume) {
        var _this3 = this;

        // Progress flag, data-down to seeder-block button spinner.
        this.set('generateBooksInProgress', true);

        var counter = parseInt(volume);
        var booksWithAuthors = [];

        for (var i = 0; i < counter; i++) {

          // Collect Promises in an array.
          var books = this._saveRandomAuthor().then(function (newAuthor) {
            return _this3._generateSomeBooks(newAuthor);
          });
          booksWithAuthors.push(books);
        }

        // Let's wait until all async save resolved, show a label and turn off the spinner.
        Ember.RSVP.all(booksWithAuthors)

        // Data down via seeder-block to fader-label that we ready to show the label
        // Change the progress flag also, so the spinner can be turned off.
        .then(function () {
          _this3.set('authDone', true);
          _this3.set('generateBooksInProgress', false);
        });
      },
      deleteBooksAndAuthors: function deleteBooksAndAuthors() {
        var _this4 = this;

        // Progress flag, data-down to seeder-block button to show spinner.
        this.set('deleteBooksInProgress', true);

        var authors = this.get('authors');
        var books = this.get('books');

        // Remove authors first and books later, finally show the label.
        this._destroyAll(authors).then(function () {
          return _this4._destroyAll(books);
        })

        // Data down via seeder-block to fader-label that we ready to show the label
        // Delete is finished, we can turn off the spinner in seeder-block button.
        .then(function () {
          _this4.set('authDelDone', true);
          _this4.set('deleteBooksInProgress', false);
        });
      }
    },

    // Private methods

    // Create a new library record and uses the randomizator, which is in our model and generates some fake data in
    // the new record. After we save it, which is a promise, so this returns a promise.
    _saveRandomLibrary: function _saveRandomLibrary() {
      return this.store.createRecord('library').randomize().save();
    },
    _saveRandomAuthor: function _saveRandomAuthor() {
      return this.store.createRecord('author').randomize().save();
    },
    _generateSomeBooks: function _generateSomeBooks(author) {
      var _this5 = this;

      var bookCounter = _faker.default.random.number(10);
      var books = [];

      var _loop = function _loop(j) {
        var library = _this5._selectRandomLibrary();

        // Creating and saving book, saving the related records also are take while, they are all a Promise.
        var bookPromise = _this5.store.createRecord('book').randomize(author, library).save().then(function () {
          return author.save();
        })

        // guard library in case if we don't have any
        .then(function () {
          return library && library.save();
        });
        books.push(bookPromise);
      };

      for (var j = 0; j < bookCounter; j++) {
        _loop(j);
      }

      // Return a Promise, so we can manage the whole process on time
      return Ember.RSVP.all(books);
    },
    _selectRandomLibrary: function _selectRandomLibrary() {

      // Please note libraries are records from store, which means this is a DS.RecordArray object, it is extended from
      // Ember.ArrayProxy. If you need an element from this list, you cannot just use libraries[3], we have to use
      // libraries.objectAt(3)
      var libraries = this.get('libraries');
      var size = libraries.get('length');

      // Get a random number between 0 and size-1
      var randomItem = _faker.default.random.number(size - 1);
      return libraries.objectAt(randomItem);
    },
    _destroyAll: function _destroyAll(records) {

      // destroyRecord() is a Promise and will be fulfilled when the backend database is confirmed the delete
      // lets collect these Promises in an array
      var recordsAreDestroying = records.map(function (item) {
        return item.destroyRecord();
      });

      // Wrap all Promise in one common Promise, RSVP.all is our best friend in this process. ;)
      return Ember.RSVP.all(recordsAreDestroying);
    }
  });
});
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
define('ember-test/controllers/index', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend({

    headerMessage: 'Coming Soon',
    responseMessage: '',
    emailAddress: '',

    isValid: Ember.computed.match('emailAddress', /^.+@.+\..+$/),
    isDisabled: Ember.computed.not('isValid'),

    actions: {
      saveInvitation: function saveInvitation() {
        var _this = this;

        var email = this.get('emailAddress');

        var newInvitation = this.store.createRecord('invitation', {
          email: email
        });

        newInvitation.save().then(function (response) {
          _this.set('responseMessage', 'Thank you! We saved your email address with the following id: ' + response.get('id'));
          _this.set('emailAddress', '');
        });
      }
    }

  });
});
define('ember-test/helpers/app-version', ['exports', 'ember-test/config/environment', 'ember-cli-app-version/utils/regexp'], function (exports, _environment, _regexp) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.appVersion = appVersion;
  var version = _environment.default.APP.version;
  function appVersion(_) {
    var hash = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (hash.hideSha) {
      return version.match(_regexp.versionRegExp)[0];
    }

    if (hash.hideVersion) {
      return version.match(_regexp.shaRegExp)[0];
    }

    return version;
  }

  exports.default = Ember.Helper.helper(appVersion);
});
define('ember-test/helpers/pluralize', ['exports', 'ember-inflector/lib/helpers/pluralize'], function (exports, _pluralize) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _pluralize.default;
});
define('ember-test/helpers/singularize', ['exports', 'ember-inflector/lib/helpers/singularize'], function (exports, _singularize) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _singularize.default;
});
define('ember-test/initializers/app-version', ['exports', 'ember-cli-app-version/initializer-factory', 'ember-test/config/environment'], function (exports, _initializerFactory, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var _config$APP = _environment.default.APP,
      name = _config$APP.name,
      version = _config$APP.version;
  exports.default = {
    name: 'App Version',
    initialize: (0, _initializerFactory.default)(name, version)
  };
});
define('ember-test/initializers/container-debug-adapter', ['exports', 'ember-resolver/resolvers/classic/container-debug-adapter'], function (exports, _containerDebugAdapter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'container-debug-adapter',

    initialize: function initialize() {
      var app = arguments[1] || arguments[0];

      app.register('container-debug-adapter:main', _containerDebugAdapter.default);
      app.inject('container-debug-adapter:main', 'namespace', 'application:main');
    }
  };
});
define('ember-test/initializers/data-adapter', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'data-adapter',
    before: 'store',
    initialize: function initialize() {}
  };
});
define('ember-test/initializers/ember-data', ['exports', 'ember-data/setup-container', 'ember-data'], function (exports, _setupContainer) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'ember-data',
    initialize: _setupContainer.default
  };
});
define('ember-test/initializers/ember-faker', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.initialize = initialize;
  function initialize() /* container, application */{
    // application.inject('route', 'foo', 'service:foo');
  };

  exports.default = {
    name: 'ember-faker',
    initialize: initialize
  };
});
define('ember-test/initializers/emberfire', ['exports', 'emberfire/initializers/emberfire'], function (exports, _emberfire) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberfire.default;
});
define('ember-test/initializers/export-application-global', ['exports', 'ember-test/config/environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.initialize = initialize;
  function initialize() {
    var application = arguments[1] || arguments[0];
    if (_environment.default.exportApplicationGlobal !== false) {
      var theGlobal;
      if (typeof window !== 'undefined') {
        theGlobal = window;
      } else if (typeof global !== 'undefined') {
        theGlobal = global;
      } else if (typeof self !== 'undefined') {
        theGlobal = self;
      } else {
        // no reasonable global, just bail
        return;
      }

      var value = _environment.default.exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = Ember.String.classify(_environment.default.modulePrefix);
      }

      if (!theGlobal[globalName]) {
        theGlobal[globalName] = application;

        application.reopen({
          willDestroy: function willDestroy() {
            this._super.apply(this, arguments);
            delete theGlobal[globalName];
          }
        });
      }
    }
  }

  exports.default = {
    name: 'export-application-global',

    initialize: initialize
  };
});
define('ember-test/initializers/injectStore', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'injectStore',
    before: 'store',
    initialize: function initialize() {}
  };
});
define('ember-test/initializers/store', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'store',
    after: 'ember-data',
    initialize: function initialize() {}
  };
});
define('ember-test/initializers/transforms', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'transforms',
    before: 'store',
    initialize: function initialize() {}
  };
});
define("ember-test/instance-initializers/ember-data", ["exports", "ember-data/instance-initializers/initialize-store-service"], function (exports, _initializeStoreService) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: "ember-data",
    initialize: _initializeStoreService.default
  };
});
define('ember-test/models/author', ['exports', 'ember-data', 'faker'], function (exports, _emberData, _faker) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberData.default.Model.extend({

    name: _emberData.default.attr('string'),
    books: _emberData.default.hasMany('book', { inverse: 'author', async: true }),

    isNotValid: Ember.computed.empty('name'),

    randomize: function randomize() {
      this.set('name', _faker.default.name.findName());
      return this;
    }
  });
});
define('ember-test/models/book', ['exports', 'ember-data', 'faker'], function (exports, _emberData, _faker) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberData.default.Model.extend({

    title: _emberData.default.attr('string'),
    releaseYear: _emberData.default.attr('date'),

    author: _emberData.default.belongsTo('author', { inverse: 'books', async: true }),
    library: _emberData.default.belongsTo('library', { inverse: 'books', async: true }),

    randomize: function randomize(author, library) {
      this.set('title', this._bookTitle());
      this.set('author', author);
      this.set('releaseYear', this._randomYear());
      this.set('library', library);

      return this;
    },
    _bookTitle: function _bookTitle() {
      return _faker.default.commerce.productName() + ' Cookbook';
    },
    _randomYear: function _randomYear() {
      return new Date(this._getRandomArbitrary(1900, 2015).toPrecision(4));
    },
    _getRandomArbitrary: function _getRandomArbitrary(min, max) {
      return Math.random() * (max - min) + min;
    }
  });
});
define('ember-test/models/invitation', ['exports', 'ember-data'], function (exports, _emberData) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberData.default.Model.extend({
    email: _emberData.default.attr('string')
  });
});
define('ember-test/models/library', ['exports', 'ember-data', 'faker'], function (exports, _emberData, _faker) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberData.default.Model.extend({

    name: _emberData.default.attr('string'),
    address: _emberData.default.attr('string'),
    phone: _emberData.default.attr('string'),

    books: _emberData.default.hasMany('book', { inverse: 'library', async: true }),

    isValid: Ember.computed.notEmpty('name'),

    randomize: function randomize() {
      this.set('name', _faker.default.company.companyName() + ' Library');
      this.set('address', this._fullAddress());
      this.set('phone', _faker.default.phone.phoneNumber());

      // If you would like to use in chain.
      return this;
    },
    _fullAddress: function _fullAddress() {
      return _faker.default.address.streetAddress() + ', ' + _faker.default.address.city();
    }
  });
});
define('ember-test/models/mensagem', ['exports', 'ember-data'], function (exports, _emberData) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberData.default.Model.extend({
    email: _emberData.default.attr('string'),
    contato: _emberData.default.attr('string')
  });
});
define('ember-test/resolver', ['exports', 'ember-resolver'], function (exports, _emberResolver) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberResolver.default;
});
define('ember-test/router', ['exports', 'ember-test/config/environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var Router = Ember.Router.extend({
    location: _environment.default.locationType
  });

  Router.map(function () {
    this.route('about');
    this.route('contact');

    this.route('admin', function () {
      this.route('invitations');
      this.route('contacts');
      this.route('contact');
      this.route('editMensagem', { path: '/:Mensagem_id/editMensagem' });
      this.route('editInvitations', { path: '/:invitation_id/editInvitations' });
      this.route('seeder');
    });

    this.route('libraries', function () {
      this.route('new');
      this.route('edit', { path: '/:library_id/edit' });
      this.route('form');
    });
    this.route('authors');
    this.route('books');
  });

  exports.default = Router;
});
define('ember-test/routes/about', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({});
});
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
define('ember-test/routes/admin/edit-invitations', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({
    model: function model(params) {
      return this.store.findRecord('Invitation', params.invitation_id);
    },


    actions: {
      saveInvitation: function saveInvitation(Invitation) {
        var _this = this;

        Invitation.save().then(function () {
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
define('ember-test/routes/admin/invitations', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({
    model: function model() {
      return this.store.findAll('invitation');
    },


    actions: {
      deleteInvitation: function deleteInvitation(invitation) {
        var confirmation = confirm('Are you sure?');

        if (confirmation) {
          invitation.destroyRecord();
        }
      }
    }
  });
});
define('ember-test/routes/admin/seeder', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({
    model: function model() {
      return Ember.RSVP.hash({
        libraries: this.store.findAll('library'),
        books: this.store.findAll('book'),
        authors: this.store.findAll('author')
      });
    },
    setupController: function setupController(controller, model) {
      controller.set('libraries', model.libraries);
      controller.set('books', model.books);
      controller.set('authors', model.authors);

      this._super(controller, model);
    }
  });
});
define('ember-test/routes/authors', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({
    model: function model() {
      return this.store.findAll('author');
    },


    actions: {
      editAuthor: function editAuthor(author) {
        author.set('isEditing', true);
      },
      cancelAuthorEdit: function cancelAuthorEdit(author) {
        author.set('isEditing', false);
        author.rollbackAttributes();
      },
      saveAuthor: function saveAuthor(author) {

        if (author.get('isNotValid')) {
          return;
        }

        author.set('isEditing', false);
        author.save();
      }
    }
  });
});
define('ember-test/routes/books', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({
    model: function model() {
      return Ember.RSVP.hash({
        books: this.store.findAll('book'),
        authors: this.store.findAll('author'),
        libraries: this.store.findAll('library')
      });
    },
    setupController: function setupController(controller, model) {
      var books = model.books;
      var authors = model.authors;
      var libraries = model.libraries;

      this._super(controller, books);

      controller.set('authors', authors);
      controller.set('libraries', libraries);
    },


    actions: {
      editBook: function editBook(book) {
        book.set('isEditing', true);
      },
      cancelBookEdit: function cancelBookEdit(book) {
        book.set('isEditing', false);
        book.rollbackAttributes();
      },
      saveBook: function saveBook(book) {
        if (book.get('isNotValid')) {
          return;
        }

        book.set('isEditing', false);
        book.save();
      },
      editAuthor: function editAuthor(book) {
        book.set('isAuthorEditing', true);
      },
      cancelAuthorEdit: function cancelAuthorEdit(book) {
        book.set('isAuthorEditing', false);
        book.rollbackAttributes();
      },
      saveAuthor: function saveAuthor(author, book) {
        // Firebase adapter is buggy, we have to manually remove the previous relation
        book.get('author').then(function (previousAuthor) {
          previousAuthor.get('books').then(function (previousAuthorBooks) {
            previousAuthorBooks.removeObject(book);
            previousAuthor.save();
          });
        });

        // Setup the new relation
        book.set('author', author);
        book.save().then(function () {
          return author.save();
        });
        book.set('isAuthorEditing', false);
      },
      editLibrary: function editLibrary(book) {
        book.set('isLibraryEditing', true);
      },
      cancelLibraryEdit: function cancelLibraryEdit(book) {
        book.set('isLibraryEditing', false);
        book.rollbackAttributes();
      },
      saveLibrary: function saveLibrary(library, book) {
        // Firebase adapter is buggy, we have to manually remove the previous relation.
        // You don't need this callback mess when your adapter properly manages relations.
        // If Firebase fix this bug, we can remove this part.
        book.get('library').then(function (previousLibrary) {
          previousLibrary.get('books').then(function (previousLibraryBooks) {
            previousLibraryBooks.removeObject(book);
            previousLibrary.save();
          });
        });

        book.set('library', library);
        book.save().then(function () {
          return library.save();
        });
        book.set('isLibraryEditing', false);
      }
    }
  });
});
define('ember-test/routes/contact', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({});
});
define('ember-test/routes/libraries/edit', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({
    model: function model(params) {
      return this.store.findRecord('library', params.library_id);
    },
    setupController: function setupController(controller, model) {
      this._super(controller, model);

      controller.set('title', 'Edit library');
      controller.set('buttonLabel', 'Save changes');
    },
    renderTemplate: function renderTemplate() {
      this.render('libraries/form');
    },


    actions: {
      saveLibrary: function saveLibrary(library) {
        var _this = this;

        library.save().then(function () {
          return _this.transitionTo('libraries');
        });
      },
      willTransition: function willTransition(transition) {
        var model = this.controller.get('model');

        if (model.get('hasDirtyAttributes')) {
          var confirmation = confirm("Your changes haven't saved yet. Would you like to leave this form?");

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
define('ember-test/routes/libraries/form', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({});
});
define('ember-test/routes/libraries/index', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({
    model: function model() {
      return this.store.findAll('library');
    },


    actions: {
      deleteLibrary: function deleteLibrary(library) {
        var confirmation = confirm('Are you sure?');

        if (confirmation) {
          library.destroyRecord();
        }
      }
    }

  });
});
define('ember-test/routes/libraries/new', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({

    model: function model() {
      return this.store.createRecord('library');
    },

    setupController: function setupController(controller, model) {
      this._super(controller, model);

      controller.set('title', 'Create a new library');
      controller.set('buttonLabel', 'Create');
    },

    renderTemplate: function renderTemplate() {
      this.render('libraries/form');
    },


    actions: {
      saveLibrary: function saveLibrary(newLibrary) {
        var _this = this;

        newLibrary.save().then(function () {
          return _this.transitionTo('libraries');
        });
      },
      willTransition: function willTransition() {
        var model = this.controller.get('model');

        if (model.get('isNew')) {
          model.destroyRecord();
        }
      }
    }
  });
});
define('ember-test/services/ajax', ['exports', 'ember-ajax/services/ajax'], function (exports, _ajax) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _ajax.default;
    }
  });
});
define('ember-test/services/firebase-app', ['exports', 'emberfire/services/firebase-app'], function (exports, _firebaseApp) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _firebaseApp.default;
});
define('ember-test/services/firebase', ['exports', 'emberfire/services/firebase'], function (exports, _firebase) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _firebase.default;
});
define("ember-test/templates/about", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "nsqTmCAs", "block": "{\"statements\":[[11,\"h1\",[]],[13],[0,\"About Page\"],[14],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "ember-test/templates/about.hbs" } });
});
define("ember-test/templates/admin/contact", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "LQ1SKAUX", "block": "{\"statements\":[[4,\" app/templates/admin/contact.hbs \"],[0,\"\\n\\n\"],[11,\"h1\",[]],[13],[0,\"Mensagens\"],[14],[0,\"\\n\\n\"],[11,\"table\",[]],[15,\"class\",\"table table-bordered table-striped\"],[13],[0,\"\\n  \"],[11,\"thead\",[]],[13],[0,\"\\n    \"],[11,\"tr\",[]],[13],[0,\"\\n      \"],[11,\"th\",[]],[13],[0,\"ID\"],[14],[0,\"\\n      \"],[11,\"th\",[]],[13],[0,\"E-mail\"],[14],[0,\"\\n      \"],[11,\"th\",[]],[13],[0,\"Mensagem\"],[14],[0,\"\\n      \"],[11,\"th\",[]],[13],[0,\"Editar\"],[14],[0,\"\\n      \"],[11,\"th\",[]],[13],[0,\"Excluir\"],[14],[0,\"\\n    \"],[14],[0,\"\\n  \"],[14],[0,\"\\n  \"],[11,\"tbody\",[]],[13],[0,\"\\n\"],[6,[\"each\"],[[28,[\"model\"]]],null,{\"statements\":[[0,\"    \"],[11,\"tr\",[]],[13],[0,\"\\n      \"],[11,\"th\",[]],[13],[1,[28,[\"Mensagem\",\"id\"]],false],[14],[0,\"\\n      \"],[11,\"td\",[]],[13],[1,[28,[\"Mensagem\",\"email\"]],false],[14],[0,\"\\n      \"],[11,\"td\",[]],[13],[1,[28,[\"Mensagem\",\"contato\"]],false],[14],[0,\"\\n      \"],[11,\"td\",[]],[13],[6,[\"link-to\"],[\"admin.editMensagem\",[28,[\"Mensagem\",\"id\"]]],[[\"class\"],[\"btn btn-success btn-xs\"]],{\"statements\":[[0,\"Editar\"]],\"locals\":[]},null],[14],[0,\"\\n      \"],[11,\"td\",[]],[13],[11,\"button\",[]],[15,\"class\",\"btn btn-danger btn-xs\"],[5,[\"action\"],[[28,[null]],\"deleteMensagem\",[28,[\"Mensagem\"]]]],[13],[0,\"Excluir\"],[14],[14],[0,\"\\n    \"],[14],[0,\"\\n\"]],\"locals\":[\"Mensagem\"]},null],[0,\"  \"],[14],[0,\"\\n\"],[14]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "ember-test/templates/admin/contact.hbs" } });
});
define("ember-test/templates/admin/edit-invitations", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "gOBfSB1X", "block": "{\"statements\":[[11,\"h2\",[]],[13],[0,\"Editar Invitation\"],[14],[0,\"\\n\\n\"],[11,\"div\",[]],[15,\"class\",\"form-horizontal\"],[13],[0,\"\\n  \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n    \"],[11,\"label\",[]],[15,\"class\",\"col-sm-2 control-label\"],[13],[0,\"E-mail\"],[14],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"col-sm-10\"],[13],[0,\"\\n      \"],[1,[33,[\"input\"],null,[[\"type\",\"value\",\"class\",\"placeholder\"],[\"text\",[28,[\"model\",\"email\"]],\"form-control\",\"E-mail\"]]],false],[0,\"\\n    \"],[14],[0,\"\\n  \"],[14],[0,\"\\n  \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"col-sm-offset-2 col-sm-10\"],[13],[0,\"\\n      \"],[11,\"button\",[]],[15,\"type\",\"submit\"],[15,\"class\",\"btn btn-default\"],[5,[\"action\"],[[28,[null]],\"saveInvitation\",[28,[\"model\"]]]],[13],[0,\"Save changes\"],[14],[0,\"\\n    \"],[14],[0,\"\\n  \"],[14],[0,\"\\n\"],[14],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "ember-test/templates/admin/edit-invitations.hbs" } });
});
define("ember-test/templates/admin/edit-mensagem", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "sm+T98m9", "block": "{\"statements\":[[11,\"h2\",[]],[13],[0,\"Editar Mensagem\"],[14],[0,\"\\n\\n\"],[11,\"div\",[]],[15,\"class\",\"form-horizontal\"],[13],[0,\"\\n  \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n    \"],[11,\"label\",[]],[15,\"class\",\"col-sm-2 control-label\"],[13],[0,\"E-mail\"],[14],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"col-sm-10\"],[13],[0,\"\\n      \"],[1,[33,[\"input\"],null,[[\"type\",\"value\",\"class\",\"placeholder\"],[\"text\",[28,[\"model\",\"email\"]],\"form-control\",\"E-mail\"]]],false],[0,\"\\n    \"],[14],[0,\"\\n  \"],[14],[0,\"\\n  \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n    \"],[11,\"label\",[]],[15,\"class\",\"col-sm-2 control-label\"],[13],[0,\"Mensagem\"],[14],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"col-sm-10\"],[13],[0,\"\\n      \"],[1,[33,[\"input\"],null,[[\"type\",\"value\",\"class\",\"placeholder\"],[\"text\",[28,[\"model\",\"contato\"]],\"form-control\",\"Mensagem\"]]],false],[0,\"\\n    \"],[14],[0,\"\\n  \"],[14],[0,\"\\n  \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"col-sm-offset-2 col-sm-10\"],[13],[0,\"\\n      \"],[11,\"button\",[]],[15,\"type\",\"submit\"],[15,\"class\",\"btn btn-default\"],[5,[\"action\"],[[28,[null]],\"saveMensagem\",[28,[\"model\"]]]],[13],[0,\"Save changes\"],[14],[0,\"\\n    \"],[14],[0,\"\\n  \"],[14],[0,\"\\n\"],[14],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "ember-test/templates/admin/edit-mensagem.hbs" } });
});
define("ember-test/templates/admin/invitations", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "megAHYCQ", "block": "{\"statements\":[[4,\" app/templates/admin/invitations.hbs \"],[0,\"\\n\\n\"],[11,\"h1\",[]],[13],[0,\"Invitations\"],[14],[0,\"\\n\\n\"],[11,\"table\",[]],[15,\"class\",\"table table-bordered table-striped\"],[13],[0,\"\\n  \"],[11,\"thead\",[]],[13],[0,\"\\n    \"],[11,\"tr\",[]],[13],[0,\"\\n      \"],[11,\"th\",[]],[13],[0,\"ID\"],[14],[0,\"\\n      \"],[11,\"th\",[]],[13],[0,\"E-mail\"],[14],[0,\"\\n      \"],[11,\"th\",[]],[13],[0,\"Editar\"],[14],[0,\"\\n      \"],[11,\"th\",[]],[13],[0,\"Excluir\"],[14],[0,\"\\n    \"],[14],[0,\"\\n  \"],[14],[0,\"\\n  \"],[11,\"tbody\",[]],[13],[0,\"\\n\"],[6,[\"each\"],[[28,[\"model\"]]],null,{\"statements\":[[0,\"    \"],[11,\"tr\",[]],[13],[0,\"\\n      \"],[11,\"th\",[]],[13],[1,[28,[\"invitation\",\"id\"]],false],[14],[0,\"\\n      \"],[11,\"td\",[]],[13],[1,[28,[\"invitation\",\"email\"]],false],[14],[0,\"\\n      \"],[11,\"td\",[]],[13],[6,[\"link-to\"],[\"admin.editInvitations\",[28,[\"invitation\",\"id\"]]],[[\"class\"],[\"btn btn-success btn-xs\"]],{\"statements\":[[0,\"Edit\"]],\"locals\":[]},null],[14],[0,\"\\n      \"],[11,\"td\",[]],[13],[11,\"button\",[]],[15,\"class\",\"btn btn-danger btn-xs\"],[5,[\"action\"],[[28,[null]],\"deleteInvitation\",[28,[\"invitation\"]]]],[13],[0,\"Delete\"],[14],[14],[0,\"\\n    \"],[14],[0,\"\\n\"]],\"locals\":[\"invitation\"]},null],[0,\"  \"],[14],[0,\"\\n\"],[14]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "ember-test/templates/admin/invitations.hbs" } });
});
define("ember-test/templates/admin/seeder", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "ZipOgwqv", "block": "{\"statements\":[[4,\" app/templates/admin/seeder.hbs \"],[0,\"\\n\"],[11,\"h1\",[]],[13],[0,\"Seeder, our Data Center\"],[14],[0,\"\\n\\n\"],[11,\"div\",[]],[15,\"class\",\"row\"],[13],[0,\"\\n \"],[11,\"div\",[]],[15,\"class\",\"col-md-4\"],[13],[1,[33,[\"number-box\"],null,[[\"title\",\"number\"],[\"Libraries\",[28,[\"libraries\",\"length\"]]]]],false],[14],[0,\"\\n \"],[11,\"div\",[]],[15,\"class\",\"col-md-4\"],[13],[1,[33,[\"number-box\"],null,[[\"title\",\"number\"],[\"Authors\",[28,[\"authors\",\"length\"]]]]],false],[14],[0,\"\\n \"],[11,\"div\",[]],[15,\"class\",\"col-md-4\"],[13],[1,[33,[\"number-box\"],null,[[\"title\",\"number\"],[\"Books\",[28,[\"books\",\"length\"]]]]],false],[14],[0,\"\\n\"],[14],[0,\"\\n\\n\"],[1,[33,[\"seeder-block\"],null,[[\"sectionTitle\",\"generateAction\",\"deleteAction\",\"generateReady\",\"deleteReady\",\"generateInProgress\",\"deleteInProgress\"],[\"Libraries\",\"generateLibraries\",\"deleteLibraries\",[28,[\"libDone\"]],[28,[\"libDelDone\"]],[28,[\"generateLibrariesInProgress\"]],[28,[\"deleteLibrariesInProgress\"]]]]],false],[0,\"\\n\\n\"],[1,[33,[\"seeder-block\"],null,[[\"sectionTitle\",\"generateAction\",\"deleteAction\",\"generateReady\",\"deleteReady\",\"generateInProgress\",\"deleteInProgress\"],[\"Authors with Books\",\"generateBooksAndAuthors\",\"deleteBooksAndAuthors\",[28,[\"authDone\"]],[28,[\"authDelDone\"]],[28,[\"generateBooksInProgress\"]],[28,[\"deleteBooksInProgress\"]]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "ember-test/templates/admin/seeder.hbs" } });
});
define("ember-test/templates/application", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "Iia1+1NY", "block": "{\"statements\":[[11,\"div\",[]],[15,\"class\",\"container\"],[13],[0,\"\\n  \"],[19,\"navbar\"],[0,\"\\n  \"],[1,[26,[\"outlet\"]],false],[0,\"\\n\"],[14]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":true}", "meta": { "moduleName": "ember-test/templates/application.hbs" } });
});
define("ember-test/templates/authors", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "7cl5nT3S", "block": "{\"statements\":[[4,\" app/templates/authors.hbs \"],[0,\"\\n\"],[11,\"h1\",[]],[13],[0,\"Authors\"],[14],[0,\"\\n\\n\"],[11,\"table\",[]],[15,\"class\",\"table table-bordered table-striped\"],[13],[0,\"\\n  \"],[11,\"thead\",[]],[13],[0,\"\\n  \"],[11,\"tr\",[]],[13],[0,\"\\n    \"],[11,\"th\",[]],[13],[0,\"\\n      Name\\n      \"],[11,\"br\",[]],[13],[14],[11,\"small\",[]],[15,\"class\",\"small not-bold\"],[13],[0,\"(Click on name for editing)\"],[14],[0,\"\\n    \"],[14],[0,\"\\n    \"],[11,\"th\",[]],[15,\"class\",\"vtop\"],[13],[0,\"Books\"],[14],[0,\"\\n  \"],[14],[0,\"\\n  \"],[14],[0,\"\\n  \"],[11,\"tbody\",[]],[13],[0,\"\\n\"],[6,[\"each\"],[[28,[\"model\"]]],null,{\"statements\":[[0,\"    \"],[11,\"tr\",[]],[13],[0,\"\\n      \"],[11,\"td\",[]],[13],[0,\"\\n\"],[6,[\"if\"],[[28,[\"author\",\"isEditing\"]]],null,{\"statements\":[[0,\"          \"],[11,\"form\",[]],[15,\"class\",\"form-inline\"],[5,[\"action\"],[[28,[null]],\"saveAuthor\",[28,[\"author\"]]],[[\"on\"],[\"submit\"]]],[13],[0,\"\\n            \"],[11,\"div\",[]],[15,\"class\",\"input-group\"],[13],[0,\"\\n              \"],[1,[33,[\"input\"],null,[[\"value\",\"class\"],[[28,[\"author\",\"name\"]],\"form-control\"]]],false],[0,\"\\n              \"],[11,\"div\",[]],[15,\"class\",\"input-group-btn\"],[13],[0,\"\\n                \"],[11,\"button\",[]],[15,\"type\",\"submit\"],[15,\"class\",\"btn btn-success\"],[16,\"disabled\",[28,[\"author\",\"isNotValid\"]],null],[13],[0,\"Save\"],[14],[0,\"\\n                \"],[11,\"button\",[]],[15,\"class\",\"btn btn-danger\"],[5,[\"action\"],[[28,[null]],\"cancelAuthorEdit\",[28,[\"author\"]]]],[13],[0,\"Cancel\"],[14],[0,\"\\n              \"],[14],[0,\"\\n            \"],[14],[0,\"\\n          \"],[14],[0,\"\\n\"]],\"locals\":[]},{\"statements\":[[0,\"          \"],[11,\"span\",[]],[5,[\"action\"],[[28,[null]],\"editAuthor\",[28,[\"author\"]]]],[13],[1,[28,[\"author\",\"name\"]],false],[14],[0,\"\\n\"]],\"locals\":[]}],[0,\"      \"],[14],[0,\"\\n      \"],[11,\"td\",[]],[13],[0,\"\\n        \"],[11,\"ul\",[]],[13],[0,\"\\n\"],[6,[\"each\"],[[28,[\"author\",\"books\"]]],null,{\"statements\":[[0,\"            \"],[11,\"li\",[]],[13],[1,[28,[\"book\",\"title\"]],false],[14],[0,\"\\n\"]],\"locals\":[\"book\"]},null],[0,\"        \"],[14],[0,\"\\n      \"],[14],[0,\"\\n    \"],[14],[0,\"\\n\"]],\"locals\":[\"author\"]},null],[0,\"  \"],[14],[0,\"\\n\"],[14],[0,\" \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "ember-test/templates/authors.hbs" } });
});
define("ember-test/templates/books", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "DF2hiFTy", "block": "{\"statements\":[[11,\"h1\",[]],[13],[0,\"Books\"],[14],[0,\"\\n\\n\"],[11,\"table\",[]],[15,\"class\",\"table table-bordered table-striped\"],[13],[0,\"\\n  \"],[11,\"thead\",[]],[13],[0,\"\\n  \"],[11,\"tr\",[]],[13],[0,\"\\n    \"],[11,\"th\",[]],[15,\"class\",\"vtop wider\"],[13],[0,\"\\n      Author\\n      \"],[11,\"br\",[]],[13],[14],[11,\"small\",[]],[15,\"class\",\"small not-bold\"],[13],[0,\"(Click on the name for editing)\"],[14],[0,\"\\n    \"],[14],[0,\"\\n    \"],[11,\"th\",[]],[13],[0,\"\\n      Title\\n      \"],[11,\"br\",[]],[13],[14],[11,\"small\",[]],[15,\"class\",\"small not-bold\"],[13],[0,\"(Click on the title for editing)\"],[14],[0,\"\\n    \"],[14],[0,\"\\n    \"],[11,\"th\",[]],[15,\"class\",\"vtop\"],[13],[0,\"Release Year\"],[14],[0,\"\\n    \"],[11,\"th\",[]],[15,\"class\",\"vtop\"],[13],[0,\"\\n      Library\\n      \"],[11,\"br\",[]],[13],[14],[11,\"small\",[]],[15,\"class\",\"small not-bold\"],[13],[0,\"(Click on the name for editing)\"],[14],[0,\"    \"],[14],[0,\"\\n  \"],[14],[0,\"\\n  \"],[14],[0,\"\\n  \"],[11,\"tbody\",[]],[13],[0,\"\\n\"],[6,[\"each\"],[[28,[\"model\"]]],null,{\"statements\":[[0,\"    \"],[11,\"tr\",[]],[13],[0,\"\\n\\n      \"],[11,\"td\",[]],[13],[0,\"\\n\"],[6,[\"if\"],[[28,[\"book\",\"isAuthorEditing\"]]],null,{\"statements\":[[0,\"\\t\\t\\t\"],[11,\"form\",[]],[15,\"class\",\"form-inline\"],[5,[\"action\"],[[28,[null]],\"saveAuthor\",[28,[\"author\"]]],[[\"on\"],[\"submit\"]]],[13],[0,\"\\n            \"],[11,\"div\",[]],[15,\"class\",\"input-group\"],[13],[0,\"\\n              \"],[1,[33,[\"input\"],null,[[\"value\",\"class\"],[[28,[\"book\",\"author\",\"name\"]],\"form-control\"]]],false],[0,\"\\n              \"],[11,\"div\",[]],[15,\"class\",\"input-group-btn\"],[13],[0,\"\\n                \"],[11,\"button\",[]],[15,\"type\",\"submit\"],[15,\"class\",\"btn btn-success\"],[16,\"disabled\",[28,[\"author\",\"isNotValid\"]],null],[13],[0,\"Save\"],[14],[0,\"\\n                \"],[11,\"button\",[]],[15,\"class\",\"btn btn-danger\"],[5,[\"action\"],[[28,[null]],\"cancelAuthorEdit\",[28,[\"author\"]]]],[13],[0,\"Cancel\"],[14],[0,\"\\n              \"],[14],[0,\"\\n            \"],[14],[0,\"\\n          \"],[14],[0,\"\\n\\n\"]],\"locals\":[]},{\"statements\":[[0,\"          \"],[11,\"span\",[]],[5,[\"action\"],[[28,[null]],\"editAuthor\",[28,[\"book\"]]]],[13],[1,[28,[\"book\",\"author\",\"name\"]],false],[14],[0,\"\\n\"]],\"locals\":[]}],[0,\"      \"],[14],[0,\"\\n\\n      \"],[11,\"td\",[]],[13],[0,\"\\n\"],[6,[\"if\"],[[28,[\"book\",\"isEditing\"]]],null,{\"statements\":[[0,\"          \"],[11,\"form\",[]],[15,\"class\",\"form-inline\"],[5,[\"action\"],[[28,[null]],\"saveBook\",[28,[\"book\"]]],[[\"on\"],[\"submit\"]]],[13],[0,\"\\n            \"],[11,\"div\",[]],[15,\"class\",\"input-group\"],[13],[0,\"\\n              \"],[1,[33,[\"input\"],null,[[\"value\",\"class\"],[[28,[\"book\",\"title\"]],\"form-control\"]]],false],[0,\"\\n              \"],[11,\"div\",[]],[15,\"class\",\"input-group-btn\"],[13],[0,\"\\n                \"],[11,\"button\",[]],[15,\"type\",\"submit\"],[15,\"class\",\"btn btn-success\"],[16,\"disabled\",[28,[\"book\",\"isNotValid\"]],null],[13],[0,\"Save\"],[14],[0,\"\\n                \"],[11,\"button\",[]],[15,\"class\",\"btn btn-danger\"],[5,[\"action\"],[[28,[null]],\"cancelBookEdit\",[28,[\"book\"]]]],[13],[0,\"Cancel\"],[14],[0,\"\\n              \"],[14],[0,\"\\n            \"],[14],[0,\"\\n          \"],[14],[0,\"\\n\"]],\"locals\":[]},{\"statements\":[[0,\"          \"],[11,\"span\",[]],[5,[\"action\"],[[28,[null]],\"editBook\",[28,[\"book\"]]]],[13],[1,[28,[\"book\",\"title\"]],false],[14],[0,\"\\n\"]],\"locals\":[]}],[0,\"      \"],[14],[0,\"\\n\\n      \"],[11,\"td\",[]],[13],[1,[28,[\"book\",\"releaseYear\"]],false],[14],[0,\"\\n      \"],[11,\"td\",[]],[13],[0,\"\\n\\n\"],[6,[\"if\"],[[28,[\"book\",\"isLibraryEditing\"]]],null,{\"statements\":[[0,\"\\n          \"],[1,[33,[\"library-select\"],null,[[\"book\",\"libraries\",\"default\",\"action\"],[[28,[\"book\"]],[28,[\"libraries\"]],[28,[\"book\",\"library\"]],\"saveLibrary\"]]],false],[0,\"\\n\\n          \"],[11,\"button\",[]],[15,\"class\",\"btn btn-danger\"],[5,[\"action\"],[[28,[null]],\"cancelLibraryEdit\",[28,[\"book\"]]]],[13],[0,\"Cancel\"],[14],[0,\"\\n\\n\"]],\"locals\":[]},{\"statements\":[[0,\"          \"],[11,\"span\",[]],[5,[\"action\"],[[28,[null]],\"editLibrary\",[28,[\"book\"]]]],[13],[1,[28,[\"book\",\"library\",\"name\"]],false],[14],[0,\"\\n\"]],\"locals\":[]}],[0,\"      \"],[14],[0,\"\\n    \"],[14],[0,\"\\n\"]],\"locals\":[\"book\"]},null],[0,\"  \"],[14],[0,\"\\n\"],[14]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "ember-test/templates/books.hbs" } });
});
define("ember-test/templates/components/fader-label", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "Dg1Z408u", "block": "{\"statements\":[[4,\" app/templates/components/fader-label.hbs \"],[0,\"\\n\"],[18,\"default\"]],\"locals\":[],\"named\":[],\"yields\":[\"default\"],\"hasPartials\":false}", "meta": { "moduleName": "ember-test/templates/components/fader-label.hbs" } });
});
define("ember-test/templates/components/library-item-form", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "Ohr5Ig9b", "block": "{\"statements\":[[4,\" app/templates/components/library-item-form.hbs \"],[0,\"\\n\"],[11,\"div\",[]],[15,\"class\",\"form-horizontal\"],[13],[0,\"\\n    \"],[11,\"div\",[]],[16,\"class\",[34,[\"form-group has-feedback \",[33,[\"if\"],[[28,[\"item\",\"isValid\"]],\"has-success\"],null]]]],[13],[0,\"\\n        \"],[11,\"label\",[]],[15,\"class\",\"col-sm-2 control-label\"],[13],[0,\"Name*\"],[14],[0,\"\\n        \"],[11,\"div\",[]],[15,\"class\",\"col-sm-10\"],[13],[0,\"\\n          \"],[1,[33,[\"input\"],null,[[\"type\",\"value\",\"class\",\"placeholder\"],[\"text\",[28,[\"item\",\"name\"]],\"form-control\",\"The name of the Library\"]]],false],[0,\"\\n          \"],[6,[\"if\"],[[28,[\"item\",\"isValid\"]]],null,{\"statements\":[[11,\"span\",[]],[15,\"class\",\"glyphicon glyphicon-ok form-control-feedback\"],[13],[14]],\"locals\":[]},null],[0,\"\\n        \"],[14],[0,\"\\n    \"],[14],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n        \"],[11,\"label\",[]],[15,\"class\",\"col-sm-2 control-label\"],[13],[0,\"Address\"],[14],[0,\"\\n        \"],[11,\"div\",[]],[15,\"class\",\"col-sm-10\"],[13],[0,\"\\n          \"],[1,[33,[\"input\"],null,[[\"type\",\"value\",\"class\",\"placeholder\"],[\"text\",[28,[\"item\",\"address\"]],\"form-control\",\"The address of the Library\"]]],false],[0,\"\\n        \"],[14],[0,\"\\n    \"],[14],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n        \"],[11,\"label\",[]],[15,\"class\",\"col-sm-2 control-label\"],[13],[0,\"Phone\"],[14],[0,\"\\n        \"],[11,\"div\",[]],[15,\"class\",\"col-sm-10\"],[13],[0,\"\\n          \"],[1,[33,[\"input\"],null,[[\"type\",\"value\",\"class\",\"placeholder\"],[\"text\",[28,[\"item\",\"phone\"]],\"form-control\",\"The phone number of the Library\"]]],false],[0,\"\\n        \"],[14],[0,\"\\n    \"],[14],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n        \"],[11,\"div\",[]],[15,\"class\",\"col-sm-offset-2 col-sm-10\"],[13],[0,\"\\n            \"],[11,\"button\",[]],[15,\"type\",\"submit\"],[15,\"class\",\"btn btn-default\"],[16,\"disabled\",[33,[\"unless\"],[[28,[\"item\",\"isValid\"]],true],null],null],[5,[\"action\"],[[28,[null]],\"buttonClicked\",[28,[\"item\"]]]],[13],[1,[26,[\"buttonLabel\"]],false],[14],[0,\"\\n        \"],[14],[0,\"\\n    \"],[14],[0,\"\\n\"],[14]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "ember-test/templates/components/library-item-form.hbs" } });
});
define("ember-test/templates/components/library-item", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "BIrbnvgk", "block": "{\"statements\":[[4,\" app/templates/components/library-item.hbs \"],[0,\"\\n\"],[11,\"div\",[]],[15,\"class\",\"panel panel-default library-item\"],[13],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"panel-heading\"],[13],[0,\"\\n        \"],[11,\"h3\",[]],[15,\"class\",\"panel-title\"],[13],[1,[28,[\"item\",\"name\"]],false],[14],[0,\"\\n    \"],[14],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"panel-body\"],[13],[0,\"\\n        \"],[11,\"p\",[]],[13],[0,\"Address: \"],[1,[28,[\"item\",\"address\"]],false],[14],[0,\"\\n        \"],[11,\"p\",[]],[13],[0,\"Phone: \"],[1,[28,[\"item\",\"phone\"]],false],[14],[0,\"\\n    \"],[14],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"panel-footer text-right\"],[13],[0,\"\\n      \"],[18,\"default\"],[0,\"\\n    \"],[14],[0,\"\\n\"],[14],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[\"default\"],\"hasPartials\":false}", "meta": { "moduleName": "ember-test/templates/components/library-item.hbs" } });
});
define("ember-test/templates/components/nav-link-to", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "6sz+V3N/", "block": "{\"statements\":[[4,\" app/templates/components/nav-link-to.hbs \"],[0,\"\\n\"],[11,\"a\",[]],[15,\"href\",\"\"],[13],[18,\"default\"],[14]],\"locals\":[],\"named\":[],\"yields\":[\"default\"],\"hasPartials\":false}", "meta": { "moduleName": "ember-test/templates/components/nav-link-to.hbs" } });
});
define("ember-test/templates/components/number-box", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "yCz56r4t", "block": "{\"statements\":[[4,\" app/templates/components/number-box.hbs \"],[0,\"\\n\"],[11,\"div\",[]],[15,\"class\",\"panel-heading\"],[13],[0,\"\\n  \"],[11,\"h3\",[]],[15,\"class\",\"text-center\"],[13],[1,[26,[\"title\"]],false],[14],[0,\"\\n  \"],[11,\"h1\",[]],[15,\"class\",\"text-center\"],[13],[1,[33,[\"if\"],[[28,[\"number\"]],[28,[\"number\"]],\"...\"],null],false],[14],[0,\"\\n\"],[14]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "ember-test/templates/components/number-box.hbs" } });
});
define("ember-test/templates/components/seeder-block", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "SWM2GOxA", "block": "{\"statements\":[[4,\" app/templates/components/seeder-block.hbs \"],[0,\"\\n\"],[11,\"div\",[]],[15,\"class\",\"well well-sm extra-padding-bottom\"],[13],[0,\"\\n  \"],[11,\"h3\",[]],[13],[1,[26,[\"sectionTitle\"]],false],[14],[0,\"\\n  \\n  \"],[11,\"div\",[]],[15,\"class\",\"form-inline\"],[13],[0,\"\\n  \\n   \"],[11,\"div\",[]],[16,\"class\",[34,[\"form-group has-feedback \",[33,[\"unless\"],[[28,[\"isCounterValid\"]],\"has-error\"],null]]]],[13],[0,\"\\n     \"],[11,\"label\",[]],[15,\"class\",\"control-label\"],[13],[0,\"Number of new records:\"],[14],[0,\"\\n     \"],[1,[33,[\"input\"],null,[[\"value\",\"class\",\"placeholder\"],[[28,[\"counter\"]],\"form-control\",[28,[\"placeholder\"]]]]],false],[0,\"\\n   \"],[14],[0,\"\\n  \\n   \"],[11,\"button\",[]],[15,\"class\",\"btn btn-primary\"],[16,\"disabled\",[26,[\"generateIsDisabled\"]],null],[5,[\"action\"],[[28,[null]],\"generateAction\"]],[13],[0,\"\\n\"],[6,[\"if\"],[[28,[\"generateInProgress\"]]],null,{\"statements\":[[0,\"       \"],[11,\"span\",[]],[15,\"class\",\"glyphicon glyphicon-refresh spinning\"],[13],[14],[0,\" Generating...\\n\"]],\"locals\":[]},{\"statements\":[[0,\"       Generate \"],[1,[26,[\"sectionTitle\"]],false],[0,\"\\n\"]],\"locals\":[]}],[0,\"   \"],[14],[0,\"\\n   \"],[6,[\"fader-label\"],null,[[\"isShowing\"],[[28,[\"generateReady\"]]]],{\"statements\":[[0,\"Created!\"]],\"locals\":[]},null],[0,\"\\n  \\n   \"],[11,\"button\",[]],[15,\"class\",\"btn btn-danger\"],[16,\"disabled\",[26,[\"deleteIsDisabled\"]],null],[5,[\"action\"],[[28,[null]],\"deleteAction\"]],[13],[0,\"\\n\"],[6,[\"if\"],[[28,[\"deleteInProgress\"]]],null,{\"statements\":[[0,\"       \"],[11,\"span\",[]],[15,\"class\",\"glyphicon glyphicon-refresh spinning\"],[13],[14],[0,\" Deleting...\\n\"]],\"locals\":[]},{\"statements\":[[0,\"       Delete All \"],[1,[26,[\"sectionTitle\"]],false],[0,\"\\n\"]],\"locals\":[]}],[0,\"   \"],[14],[0,\"\\n   \"],[6,[\"fader-label\"],null,[[\"isShowing\"],[[28,[\"deleteReady\"]]]],{\"statements\":[[0,\"Deleted!\"]],\"locals\":[]},null],[0,\"\\n  \"],[14],[0,\"\\n\"],[14]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "ember-test/templates/components/seeder-block.hbs" } });
});
define("ember-test/templates/contact", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "m1RWGbc3", "block": "{\"statements\":[[11,\"h1\",[]],[13],[0,\"Fale Conosco\"],[14],[0,\"\\n\"],[11,\"div\",[]],[15,\"class\",\"jumbotron text-center\"],[13],[0,\"\\n\\t\"],[11,\"form\",[]],[13],[0,\"\\n\\t  \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n\\t    \"],[1,[33,[\"input\"],null,[[\"type\",\"value\",\"class\",\"placeholder\",\"autofocus\"],[\"email\",[28,[\"emailAddress\"]],\"form-control\",\"Por favor digite seu e-mail.\",\"autofocus\"]]],false],[0,\"\\n\\t  \"],[14],[0,\"\\n\\t  \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n\\t    \"],[1,[33,[\"textarea\"],null,[[\"value\",\"class\",\"placeholder\",\"rows\"],[[28,[\"contato\"]],\"form-control\",\"Deixe aqui a sua opinião. (Pelo menos 5 caracteres.)\",\"7\"]]],false],[0,\"\\n\\t  \"],[14],[0,\"\\n\\t  \"],[11,\"button\",[]],[15,\"class\",\"btn btn-primary btn-lg btn-block\"],[16,\"disabled\",[26,[\"isDisabled\"]],null],[5,[\"action\"],[[28,[null]],\"SaveMessage\"]],[13],[0,\"ENVIAR\"],[14],[0,\"\\n\"],[6,[\"if\"],[[28,[\"responseMessage\"]]],null,{\"statements\":[[0,\"\\t     \"],[11,\"div\",[]],[15,\"class\",\"alert alert-success\"],[13],[1,[26,[\"responseMessage\"]],false],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"\\t\"],[14],[0,\"\\n\"],[14]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "ember-test/templates/contact.hbs" } });
});
define("ember-test/templates/index", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "HJHdPll8", "block": "{\"statements\":[[4,\" app/templates/index.hbs \"],[0,\"\\n\"],[11,\"div\",[]],[15,\"class\",\"jumbotron text-center\"],[13],[0,\"\\n   \"],[11,\"h1\",[]],[13],[0,\"Coming Soon\"],[14],[0,\"\\n\\n   \"],[11,\"br\",[]],[13],[14],[11,\"br\",[]],[13],[14],[0,\"\\n\\n   \"],[11,\"p\",[]],[13],[0,\"Don't miss our launch date, request an invitation now.\"],[14],[0,\"\\n\\n   \"],[11,\"div\",[]],[15,\"class\",\"form-horizontal form-group form-group-lg row\"],[13],[0,\"\\n     \"],[11,\"div\",[]],[15,\"class\",\"col-xs-10 col-xs-offset-1 col-sm-6 col-sm-offset-1 col-md-5 col-md-offset-2\"],[13],[0,\"\\n       \"],[1,[33,[\"input\"],null,[[\"type\",\"value\",\"class\",\"placeholder\",\"autofocus\"],[\"email\",[28,[\"emailAddress\"]],\"form-control\",\"Please type your e-mail address.\",\"autofocus\"]]],false],[0,\"\\n     \"],[14],[0,\"\\n     \"],[11,\"div\",[]],[15,\"class\",\"col-xs-10 col-xs-offset-1 col-sm-offset-0 col-sm-4 col-md-3\"],[13],[0,\"\\n       \"],[11,\"button\",[]],[15,\"class\",\"btn btn-primary btn-lg btn-block\"],[16,\"disabled\",[26,[\"isDisabled\"]],null],[5,[\"action\"],[[28,[null]],\"saveInvitation\"]],[13],[0,\"Request invitation\"],[14],[0,\"\\n     \"],[14],[0,\"\\n   \"],[14],[0,\"\\n\\n\"],[6,[\"if\"],[[28,[\"responseMessage\"]]],null,{\"statements\":[[0,\"     \"],[11,\"div\",[]],[15,\"class\",\"alert alert-success\"],[13],[1,[26,[\"responseMessage\"]],false],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"\\n   \"],[11,\"br\",[]],[13],[14],[11,\"br\",[]],[13],[14],[0,\"\\n\\n\"],[14]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "ember-test/templates/index.hbs" } });
});
define("ember-test/templates/libraries", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "lSVJqhkP", "block": "{\"statements\":[[4,\" app/templates/libraries.hbs \"],[0,\"\\n\"],[11,\"h1\",[]],[13],[0,\"Libraries\"],[14],[0,\"\\n\\n\"],[11,\"div\",[]],[15,\"class\",\"well\"],[13],[0,\"\\n  \"],[11,\"ul\",[]],[15,\"class\",\"nav nav-pills\"],[13],[0,\"\\n    \"],[6,[\"nav-link-to\"],[\"libraries.index\"],null,{\"statements\":[[0,\"List all\"]],\"locals\":[]},null],[0,\"\\n    \"],[6,[\"nav-link-to\"],[\"libraries.new\"],null,{\"statements\":[[0,\"Add new\"]],\"locals\":[]},null],[0,\"\\n  \"],[14],[0,\"\\n\"],[14],[0,\"\\n\\n\"],[1,[26,[\"outlet\"]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "ember-test/templates/libraries.hbs" } });
});
define("ember-test/templates/libraries/edit", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "lDVu7GDl", "block": "{\"statements\":[[11,\"h2\",[]],[13],[0,\"Edit Library\"],[14],[0,\"\\n\\n\"],[11,\"div\",[]],[15,\"class\",\"row\"],[13],[0,\"\\n\\n  \"],[11,\"div\",[]],[15,\"class\",\"col-md-6\"],[13],[0,\"\\n    \"],[1,[33,[\"library-item-form\"],null,[[\"item\",\"buttonLabel\",\"action\"],[[28,[\"model\"]],\"Save changes\",\"saveLibrary\"]]],false],[0,\"\\n  \"],[14],[0,\"\\n\\n  \"],[11,\"div\",[]],[15,\"class\",\"col-md-4\"],[13],[0,\"\\n\"],[6,[\"library-item\"],null,[[\"item\"],[[28,[\"model\"]]]],{\"statements\":[[0,\"      \"],[11,\"br\",[]],[13],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"  \"],[14],[0,\"\\n\\n\"],[14]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "ember-test/templates/libraries/edit.hbs" } });
});
define("ember-test/templates/libraries/form", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "SdQfCl8S", "block": "{\"statements\":[[4,\" /app/templates/libraries/form.hbs \"],[0,\"\\n\"],[11,\"h2\",[]],[13],[1,[26,[\"title\"]],false],[14],[0,\"\\n\\n\"],[11,\"div\",[]],[15,\"class\",\"row\"],[13],[0,\"\\n\\n  \"],[11,\"div\",[]],[15,\"class\",\"col-md-6\"],[13],[0,\"\\n    \"],[1,[33,[\"library-item-form\"],null,[[\"item\",\"buttonLabel\",\"action\"],[[28,[\"model\"]],[28,[\"buttonLabel\"]],\"saveLibrary\"]]],false],[0,\"\\n  \"],[14],[0,\"\\n\\n  \"],[11,\"div\",[]],[15,\"class\",\"col-md-4\"],[13],[0,\"\\n\"],[6,[\"library-item\"],null,[[\"item\"],[[28,[\"model\"]]]],{\"statements\":[[0,\"      \"],[11,\"br\",[]],[13],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"  \"],[14],[0,\"\\n\\n\"],[14]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "ember-test/templates/libraries/form.hbs" } });
});
define("ember-test/templates/libraries/index", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "kAelLbiZ", "block": "{\"statements\":[[11,\"h2\",[]],[13],[0,\"List\"],[14],[0,\"\\n\"],[11,\"div\",[]],[15,\"class\",\"row\"],[13],[0,\"\\n\"],[6,[\"each\"],[[28,[\"model\"]]],null,{\"statements\":[[0,\"    \"],[11,\"div\",[]],[15,\"class\",\"col-md-4\"],[13],[0,\"\\n\"],[6,[\"library-item\"],null,[[\"item\"],[[28,[\"library\"]]]],{\"statements\":[[0,\"        \"],[6,[\"link-to\"],[\"libraries.edit\",[28,[\"library\",\"id\"]]],[[\"class\"],[\"btn btn-success btn-xs\"]],{\"statements\":[[0,\"Edit\"]],\"locals\":[]},null],[0,\"\\n        \"],[11,\"button\",[]],[15,\"class\",\"btn btn-danger btn-xs\"],[5,[\"action\"],[[28,[null]],\"deleteLibrary\",[28,[\"library\"]]]],[13],[0,\"Delete\"],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"    \"],[14],[0,\"\\n\"]],\"locals\":[\"library\"]},null],[14]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "ember-test/templates/libraries/index.hbs" } });
});
define("ember-test/templates/navbar", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "XuZTSTFn", "block": "{\"statements\":[[4,\" app/templates/navbar.hbs \"],[0,\"\\n\"],[11,\"nav\",[]],[15,\"class\",\"navbar navbar-inverse\"],[13],[0,\"\\n  \"],[11,\"div\",[]],[15,\"class\",\"container-fluid\"],[13],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"navbar-header\"],[13],[0,\"\\n      \"],[11,\"button\",[]],[15,\"type\",\"button\"],[15,\"class\",\"navbar-toggle collapsed\"],[15,\"data-toggle\",\"collapse\"],[15,\"data-target\",\"#main-navbar\"],[13],[0,\"\\n        \"],[11,\"span\",[]],[15,\"class\",\"sr-only\"],[13],[0,\"Toggle navigation\"],[14],[0,\"\\n        \"],[11,\"span\",[]],[15,\"class\",\"icon-bar\"],[13],[14],[0,\"\\n        \"],[11,\"span\",[]],[15,\"class\",\"icon-bar\"],[13],[14],[0,\"\\n        \"],[11,\"span\",[]],[15,\"class\",\"icon-bar\"],[13],[14],[0,\"\\n      \"],[14],[0,\"\\n      \"],[6,[\"link-to\"],[\"index\"],[[\"class\"],[\"navbar-brand\"]],{\"statements\":[[0,\"Library App\"]],\"locals\":[]},null],[0,\"\\n    \"],[14],[0,\"\\n\\n    \"],[11,\"div\",[]],[15,\"class\",\"collapse navbar-collapse\"],[15,\"id\",\"main-navbar\"],[13],[0,\"\\n      \"],[11,\"ul\",[]],[15,\"class\",\"nav navbar-nav\"],[13],[0,\"\\n        \"],[6,[\"nav-link-to\"],[\"index\"],null,{\"statements\":[[0,\"Home\"]],\"locals\":[]},null],[0,\"\\n        \"],[6,[\"nav-link-to\"],[\"libraries\"],null,{\"statements\":[[0,\"Libraries\"]],\"locals\":[]},null],[0,\"\\n        \"],[6,[\"nav-link-to\"],[\"authors\"],null,{\"statements\":[[0,\"Authors\"]],\"locals\":[]},null],[0,\"\\n        \"],[6,[\"nav-link-to\"],[\"books\"],null,{\"statements\":[[0,\"Books\"]],\"locals\":[]},null],[0,\"\\n        \"],[6,[\"nav-link-to\"],[\"about\"],null,{\"statements\":[[0,\"About\"]],\"locals\":[]},null],[0,\"\\n        \"],[6,[\"nav-link-to\"],[\"contact\"],null,{\"statements\":[[0,\"Contact\"]],\"locals\":[]},null],[0,\"\\n      \"],[14],[0,\"\\n\\n      \"],[11,\"ul\",[]],[15,\"class\",\"nav navbar-nav navbar-right\"],[13],[0,\"\\n        \"],[11,\"li\",[]],[15,\"class\",\"dropdown\"],[13],[0,\"\\n          \"],[11,\"a\",[]],[15,\"class\",\"dropdown-toggle\"],[15,\"data-toggle\",\"dropdown\"],[15,\"role\",\"button\"],[15,\"aria-haspopup\",\"true\"],[15,\"aria-expanded\",\"false\"],[13],[0,\"\\n            Admin\"],[11,\"span\",[]],[15,\"class\",\"caret\"],[13],[14],[0,\"\\n          \"],[14],[0,\"\\n          \"],[11,\"ul\",[]],[15,\"class\",\"dropdown-menu\"],[13],[0,\"\\n            \"],[6,[\"nav-link-to\"],[\"admin.invitations\"],null,{\"statements\":[[0,\"Invitations\"]],\"locals\":[]},null],[0,\"\\n            \"],[6,[\"nav-link-to\"],[\"admin.contact\"],null,{\"statements\":[[0,\"Contacts\"]],\"locals\":[]},null],[0,\"\\n            \"],[6,[\"nav-link-to\"],[\"admin.seeder\"],null,{\"statements\":[[0,\"Seeder\"]],\"locals\":[]},null],[0,\"\\n          \"],[14],[0,\"\\n        \"],[14],[0,\"\\n      \"],[14],[0,\"\\n    \"],[14],[4,\" /.navbar-collapse \"],[0,\"\\n  \"],[14],[4,\" /.container-fluid \"],[0,\"\\n\"],[14]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "ember-test/templates/navbar.hbs" } });
});
define('ember-test/torii-providers/firebase', ['exports', 'emberfire/torii-providers/firebase'], function (exports, _firebase) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _firebase.default;
});


define('ember-test/config/environment', ['ember'], function(Ember) {
  var prefix = 'ember-test';
try {
  var metaName = prefix + '/config/environment';
  var rawConfig = document.querySelector('meta[name="' + metaName + '"]').getAttribute('content');
  var config = JSON.parse(unescape(rawConfig));

  var exports = { 'default': config };

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

});

if (!runningTests) {
  require("ember-test/app")["default"].create({"LOG_ACTIVE_GENERATION":true,"LOG_TRANSITIONS":true,"LOG_TRANSITIONS_INTERNAL":true,"LOG_VIEW_LOOKUPS":true,"name":"ember-test","version":"0.0.0+cec1cc66"});
}
//# sourceMappingURL=ember-test.map
