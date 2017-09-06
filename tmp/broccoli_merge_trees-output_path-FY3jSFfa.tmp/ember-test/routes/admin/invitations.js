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
      deleteLibrary: function deleteLibrary(invitation) {
        var confirmation = confirm('Are you sure?');

        if (confirmation) {
          invitation.destroyRecord();
        }
      }
    }
  });
});