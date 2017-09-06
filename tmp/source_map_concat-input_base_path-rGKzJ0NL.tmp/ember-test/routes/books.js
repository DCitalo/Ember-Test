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