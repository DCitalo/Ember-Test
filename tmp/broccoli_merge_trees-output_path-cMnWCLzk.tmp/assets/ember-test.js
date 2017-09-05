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
define('ember-test/models/invitation', ['exports', 'ember-data'], function (exports, _emberData) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberData.default.Model.extend({
    email: _emberData.default.attr('string')
  });
});
define('ember-test/models/library', ['exports', 'ember-data'], function (exports, _emberData) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberData.default.Model.extend({
    name: _emberData.default.attr('string'),
    address: _emberData.default.attr('string'),
    phone: _emberData.default.attr('string')
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
    });

    this.route('libraries', function () {
      this.route('new');
      this.route('edit', { path: '/:library_id/edit' });
    });
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
define('ember-test/routes/libraries/index', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({
    model: function model() {
      return this.store.findAll('library');
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
  exports.default = Ember.HTMLBars.template({ "id": "UCjix3JD", "block": "{\"statements\":[[4,\" app/templates/admin/invitations.hbs \"],[0,\"\\n\\n\"],[11,\"h1\",[]],[13],[0,\"Mensagems\"],[14],[0,\"\\n\\n\"],[11,\"table\",[]],[15,\"class\",\"table table-bordered table-striped\"],[13],[0,\"\\n  \"],[11,\"thead\",[]],[13],[0,\"\\n    \"],[11,\"tr\",[]],[13],[0,\"\\n      \"],[11,\"th\",[]],[13],[0,\"ID\"],[14],[0,\"\\n      \"],[11,\"th\",[]],[13],[0,\"E-mail\"],[14],[0,\"\\n      \"],[11,\"th\",[]],[13],[0,\"Mensagem\"],[14],[0,\"\\n    \"],[14],[0,\"\\n  \"],[14],[0,\"\\n  \"],[11,\"tbody\",[]],[13],[0,\"\\n\"],[6,[\"each\"],[[28,[\"model\"]]],null,{\"statements\":[[0,\"    \"],[11,\"tr\",[]],[13],[0,\"\\n      \"],[11,\"th\",[]],[13],[1,[28,[\"Mensagem\",\"id\"]],false],[14],[0,\"\\n      \"],[11,\"td\",[]],[13],[1,[28,[\"Mensagem\",\"email\"]],false],[14],[0,\"\\n      \"],[11,\"td\",[]],[13],[1,[28,[\"Mensagem\",\"contato\"]],false],[14],[0,\"\\n    \"],[14],[0,\"\\n\"]],\"locals\":[\"Mensagem\"]},null],[0,\"  \"],[14],[0,\"\\n\"],[14]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "ember-test/templates/admin/contact.hbs" } });
});
define("ember-test/templates/admin/invitations", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "jtF5Wh8N", "block": "{\"statements\":[[4,\" app/templates/admin/invitations.hbs \"],[0,\"\\n\\n\"],[11,\"h1\",[]],[13],[0,\"Invitations\"],[14],[0,\"\\n\\n\"],[11,\"table\",[]],[15,\"class\",\"table table-bordered table-striped\"],[13],[0,\"\\n  \"],[11,\"thead\",[]],[13],[0,\"\\n    \"],[11,\"tr\",[]],[13],[0,\"\\n      \"],[11,\"th\",[]],[13],[0,\"ID\"],[14],[0,\"\\n      \"],[11,\"th\",[]],[13],[0,\"E-mail\"],[14],[0,\"\\n    \"],[14],[0,\"\\n  \"],[14],[0,\"\\n  \"],[11,\"tbody\",[]],[13],[0,\"\\n\"],[6,[\"each\"],[[28,[\"model\"]]],null,{\"statements\":[[0,\"    \"],[11,\"tr\",[]],[13],[0,\"\\n      \"],[11,\"th\",[]],[13],[1,[28,[\"invitation\",\"id\"]],false],[14],[0,\"\\n      \"],[11,\"td\",[]],[13],[1,[28,[\"invitation\",\"email\"]],false],[14],[0,\"\\n    \"],[14],[0,\"\\n\"]],\"locals\":[\"invitation\"]},null],[0,\"  \"],[14],[0,\"\\n\"],[14]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "ember-test/templates/admin/invitations.hbs" } });
});
define("ember-test/templates/application", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "Iia1+1NY", "block": "{\"statements\":[[11,\"div\",[]],[15,\"class\",\"container\"],[13],[0,\"\\n  \"],[19,\"navbar\"],[0,\"\\n  \"],[1,[26,[\"outlet\"]],false],[0,\"\\n\"],[14]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":true}", "meta": { "moduleName": "ember-test/templates/application.hbs" } });
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
  exports.default = Ember.HTMLBars.template({ "id": "a1NLuxuF", "block": "{\"statements\":[[4,\" app/templates/libraries.hbs \"],[0,\"\\n\"],[11,\"h1\",[]],[13],[0,\"Libraries\"],[14],[0,\"\\n\\n\"],[11,\"div\",[]],[15,\"class\",\"well\"],[13],[0,\"\\n  \"],[11,\"ul\",[]],[15,\"class\",\"nav nav-pills\"],[13],[0,\"\\n    \"],[6,[\"link-to\"],[\"libraries.index\"],[[\"tagName\"],[\"li\"]],{\"statements\":[[11,\"a\",[]],[15,\"href\",\"\"],[13],[0,\"List all\"],[14]],\"locals\":[]},null],[0,\"\\n    \"],[6,[\"link-to\"],[\"libraries.new\"],[[\"tagName\"],[\"li\"]],{\"statements\":[[11,\"a\",[]],[15,\"href\",\"\"],[13],[0,\"Add new\"],[14]],\"locals\":[]},null],[0,\"\\n  \"],[14],[0,\"\\n\"],[14],[0,\"\\n\\n\"],[1,[26,[\"outlet\"]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "ember-test/templates/libraries.hbs" } });
});
define("ember-test/templates/libraries/edit", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "CCxPd5Zy", "block": "{\"statements\":[[11,\"h2\",[]],[13],[0,\"Edit Library\"],[14],[0,\"\\n\\n\"],[11,\"div\",[]],[15,\"class\",\"form-horizontal\"],[13],[0,\"\\n  \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n    \"],[11,\"label\",[]],[15,\"class\",\"col-sm-2 control-label\"],[13],[0,\"Name\"],[14],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"col-sm-10\"],[13],[0,\"\\n      \"],[1,[33,[\"input\"],null,[[\"type\",\"value\",\"class\",\"placeholder\"],[\"text\",[28,[\"model\",\"name\"]],\"form-control\",\"The name of the Library\"]]],false],[0,\"\\n    \"],[14],[0,\"\\n  \"],[14],[0,\"\\n  \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n    \"],[11,\"label\",[]],[15,\"class\",\"col-sm-2 control-label\"],[13],[0,\"Address\"],[14],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"col-sm-10\"],[13],[0,\"\\n      \"],[1,[33,[\"input\"],null,[[\"type\",\"value\",\"class\",\"placeholder\"],[\"text\",[28,[\"model\",\"address\"]],\"form-control\",\"The address of the Library\"]]],false],[0,\"\\n    \"],[14],[0,\"\\n  \"],[14],[0,\"\\n  \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n    \"],[11,\"label\",[]],[15,\"class\",\"col-sm-2 control-label\"],[13],[0,\"Phone\"],[14],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"col-sm-10\"],[13],[0,\"\\n      \"],[1,[33,[\"input\"],null,[[\"type\",\"value\",\"class\",\"placeholder\"],[\"text\",[28,[\"model\",\"phone\"]],\"form-control\",\"The phone number of the Library\"]]],false],[0,\"\\n    \"],[14],[0,\"\\n  \"],[14],[0,\"\\n  \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"col-sm-offset-2 col-sm-10\"],[13],[0,\"\\n      \"],[11,\"button\",[]],[15,\"type\",\"submit\"],[15,\"class\",\"btn btn-default\"],[5,[\"action\"],[[28,[null]],\"saveLibrary\",[28,[\"model\"]]]],[13],[0,\"Save changes\"],[14],[0,\"\\n    \"],[14],[0,\"\\n  \"],[14],[0,\"\\n\"],[14]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "ember-test/templates/libraries/edit.hbs" } });
});
define("ember-test/templates/libraries/index", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "LpU1qz6c", "block": "{\"statements\":[[4,\" app/templates/libraries/index.hbs \"],[0,\"\\n\"],[11,\"h2\",[]],[13],[0,\"List\"],[14],[0,\"\\n\"],[11,\"div\",[]],[15,\"class\",\"row\"],[13],[0,\"\\n\"],[6,[\"each\"],[[28,[\"model\"]]],null,{\"statements\":[[0,\"    \"],[11,\"div\",[]],[15,\"class\",\"col-md-4\"],[13],[0,\"\\n      \"],[11,\"div\",[]],[15,\"class\",\"panel panel-default library-item\"],[13],[0,\"\\n        \"],[11,\"div\",[]],[15,\"class\",\"panel-heading\"],[13],[0,\"\\n          \"],[11,\"h3\",[]],[15,\"class\",\"panel-title\"],[13],[1,[28,[\"library\",\"name\"]],false],[14],[0,\"\\n        \"],[14],[0,\"\\n        \"],[11,\"div\",[]],[15,\"class\",\"panel-body\"],[13],[0,\"\\n          \"],[11,\"p\",[]],[13],[0,\"Address: \"],[1,[28,[\"library\",\"address\"]],false],[14],[0,\"\\n          \"],[11,\"p\",[]],[13],[0,\"Phone: \"],[1,[28,[\"library\",\"phone\"]],false],[14],[0,\"\\n        \"],[14],[0,\"\\n        \"],[11,\"div\",[]],[15,\"class\",\"panel-footer text-right\"],[13],[0,\"\\n          \"],[6,[\"link-to\"],[\"libraries.edit\",[28,[\"library\",\"id\"]]],[[\"class\"],[\"btn btn-success btn-xs\"]],{\"statements\":[[0,\"Edit\"]],\"locals\":[]},null],[0,\"\\n          \"],[11,\"button\",[]],[15,\"class\",\"btn btn-danger btn-xs\"],[5,[\"action\"],[[28,[null]],\"deleteLibrary\",[28,[\"library\"]]]],[13],[0,\"Delete\"],[14],[0,\"\\n        \"],[14],[0,\"\\n      \"],[14],[0,\"\\n    \"],[14],[0,\"\\n\"]],\"locals\":[\"library\"]},null],[14]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "ember-test/templates/libraries/index.hbs" } });
});
define("ember-test/templates/libraries/new", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "ku2R7F/M", "block": "{\"statements\":[[4,\" app/templates/libraries/new.hbs \"],[0,\"\\n\"],[11,\"h2\",[]],[13],[0,\"Add a new local Library\"],[14],[0,\"\\n\\n\"],[11,\"div\",[]],[15,\"class\",\"form-horizontal\"],[13],[0,\"\\n  \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n    \"],[11,\"label\",[]],[15,\"class\",\"col-sm-2 control-label\"],[13],[0,\"Name\"],[14],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"col-sm-10\"],[13],[0,\"\\n      \"],[1,[33,[\"input\"],null,[[\"type\",\"value\",\"class\",\"placeholder\"],[\"text\",[28,[\"model\",\"name\"]],\"form-control\",\"The name of the Library\"]]],false],[0,\"\\n    \"],[14],[0,\"\\n  \"],[14],[0,\"\\n  \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n    \"],[11,\"label\",[]],[15,\"class\",\"col-sm-2 control-label\"],[13],[0,\"Address\"],[14],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"col-sm-10\"],[13],[0,\"\\n      \"],[1,[33,[\"input\"],null,[[\"type\",\"value\",\"class\",\"placeholder\"],[\"text\",[28,[\"model\",\"address\"]],\"form-control\",\"The address of the Library\"]]],false],[0,\"\\n    \"],[14],[0,\"\\n  \"],[14],[0,\"\\n  \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n    \"],[11,\"label\",[]],[15,\"class\",\"col-sm-2 control-label\"],[13],[0,\"Phone\"],[14],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"col-sm-10\"],[13],[0,\"\\n      \"],[1,[33,[\"input\"],null,[[\"type\",\"value\",\"class\",\"placeholder\"],[\"text\",[28,[\"model\",\"phone\"]],\"form-control\",\"The phone number of the Library\"]]],false],[0,\"\\n    \"],[14],[0,\"\\n  \"],[14],[0,\"\\n  \"],[11,\"div\",[]],[15,\"class\",\"form-group\"],[13],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"col-sm-offset-2 col-sm-10\"],[13],[0,\"\\n      \"],[11,\"button\",[]],[15,\"type\",\"submit\"],[15,\"class\",\"btn btn-default\"],[5,[\"action\"],[[28,[null]],\"saveLibrary\",[28,[\"model\"]]]],[13],[0,\"Add to library list\"],[14],[0,\"\\n    \"],[14],[0,\"\\n  \"],[14],[0,\"\\n\"],[14]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "ember-test/templates/libraries/new.hbs" } });
});
define("ember-test/templates/navbar", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "Ifj7bUiK", "block": "{\"statements\":[[11,\"nav\",[]],[15,\"class\",\"navbar navbar-inverse\"],[13],[0,\"\\n  \"],[11,\"div\",[]],[15,\"class\",\"container-fluid\"],[13],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"navbar-header\"],[13],[0,\"\\n      \"],[11,\"button\",[]],[15,\"type\",\"button\"],[15,\"class\",\"navbar-toggle collapsed\"],[15,\"data-toggle\",\"collapse\"],[15,\"data-target\",\"#main-navbar\"],[13],[0,\"\\n        \"],[11,\"span\",[]],[15,\"class\",\"sr-only\"],[13],[0,\"Toggle navigation\"],[14],[0,\"\\n        \"],[11,\"span\",[]],[15,\"class\",\"icon-bar\"],[13],[14],[0,\"\\n        \"],[11,\"span\",[]],[15,\"class\",\"icon-bar\"],[13],[14],[0,\"\\n        \"],[11,\"span\",[]],[15,\"class\",\"icon-bar\"],[13],[14],[0,\"\\n      \"],[14],[0,\"\\n      \"],[6,[\"link-to\"],[\"index\"],[[\"class\"],[\"navbar-brand\"]],{\"statements\":[[0,\"Ember Test\"]],\"locals\":[]},null],[0,\"\\n    \"],[14],[0,\"\\n\\n    \"],[11,\"div\",[]],[15,\"class\",\"collapse navbar-collapse\"],[15,\"id\",\"main-navbar\"],[13],[0,\"\\n      \"],[11,\"ul\",[]],[15,\"class\",\"nav navbar-nav\"],[13],[0,\"\\n            \"],[6,[\"link-to\"],[\"index\"],[[\"tagName\"],[\"li\"]],{\"statements\":[[11,\"a\",[]],[15,\"href\",\"\"],[13],[0,\"Home\"],[14]],\"locals\":[]},null],[0,\"\\n            \"],[6,[\"link-to\"],[\"libraries\"],[[\"tagName\"],[\"li\"]],{\"statements\":[[11,\"a\",[]],[15,\"href\",\"\"],[13],[0,\"Libraries\"],[14]],\"locals\":[]},null],[0,\"\\n            \"],[6,[\"link-to\"],[\"about\"],[[\"tagName\"],[\"li\"]],{\"statements\":[[11,\"a\",[]],[15,\"href\",\"\"],[13],[0,\"About\"],[14]],\"locals\":[]},null],[0,\"\\n            \"],[6,[\"link-to\"],[\"contact\"],[[\"tagName\"],[\"li\"]],{\"statements\":[[11,\"a\",[]],[15,\"href\",\"\"],[13],[0,\"Contact\"],[14]],\"locals\":[]},null],[0,\"\\n      \"],[14],[0,\"\\n      \"],[11,\"ul\",[]],[15,\"class\",\"nav navbar-nav navbar-right\"],[13],[0,\"\\n          \"],[11,\"li\",[]],[15,\"class\",\"dropdown\"],[13],[0,\"\\n            \"],[11,\"a\",[]],[15,\"class\",\"dropdown-toggle\"],[15,\"data-toggle\",\"dropdown\"],[15,\"role\",\"button\"],[15,\"aria-haspopup\",\"true\"],[15,\"aria-expanded\",\"false\"],[13],[0,\"\\n              Admin\"],[11,\"span\",[]],[15,\"class\",\"caret\"],[13],[14],[0,\"\\n            \"],[14],[0,\"\\n            \"],[11,\"ul\",[]],[15,\"class\",\"dropdown-menu\"],[13],[0,\"\\n            \"],[6,[\"link-to\"],[\"admin.invitations\"],[[\"tagName\"],[\"li\"]],{\"statements\":[[11,\"a\",[]],[15,\"href\",\"\"],[13],[0,\"Invitations\"],[14]],\"locals\":[]},null],[0,\"\\n            \"],[6,[\"link-to\"],[\"admin.contact\"],[[\"tagName\"],[\"li\"]],{\"statements\":[[11,\"a\",[]],[15,\"href\",\"\"],[13],[0,\"Contacts\"],[14]],\"locals\":[]},null],[0,\"\\n            \"],[14],[0,\"\\n          \"],[14],[0,\"\\n        \"],[14],[0,\"\\n    \"],[14],[4,\" /.navbar-collapse \"],[0,\"\\n  \"],[14],[4,\" /.container-fluid \"],[0,\"\\n\"],[14]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "ember-test/templates/navbar.hbs" } });
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
  require("ember-test/app")["default"].create({"LOG_ACTIVE_GENERATION":true,"LOG_TRANSITIONS":true,"LOG_TRANSITIONS_INTERNAL":true,"LOG_VIEW_LOOKUPS":true,"name":"ember-test","version":"0.0.0+0effc2d7"});
}
//# sourceMappingURL=ember-test.map
