/* eslint-env node */
/*eslint no-unused-vars: "error"*/
'use strict';

module.exports = function(environment) {
  let ENV = {
    modulePrefix: 'ember-test',
    environment,
    rootURL: '/',
    locationType: 'auto',
    firebase: {
      apiKey: 'AIzaSyDL4VXER9vFpzQP7DWnDocP1AW9yd197Ik',
      authDomain: 'ember-test-b877c.firebaseapp.com',
      databaseURL: 'https://ember-test-b877c.firebaseio.com',
      storageBucket: 'ember-test-b877c.appspot.com',
      messagingSenderId: "129835383043"
    },
    // if using ember-cli-content-security-policy
    contentSecurityPolicy: {
      'script-src': "'self' 'unsafe-eval' apis.google.com",
      'frame-src': "'self' https://*.firebaseapp.com",
      'connect-src': "'self' wss://*.firebaseio.com https://*.googleapis.com"
    },
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
     ENV.APP.LOG_ACTIVE_GENERATION = true;
     ENV.APP.LOG_TRANSITIONS = true;
     ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
     ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {

  }

  return ENV;
};
