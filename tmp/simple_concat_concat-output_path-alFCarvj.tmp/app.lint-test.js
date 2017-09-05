QUnit.module('ESLint | app');

QUnit.test('adapters/application.js', function(assert) {
  assert.expect(1);
  assert.ok(true, 'adapters/application.js should pass ESLint\n\n');
});

QUnit.test('app.js', function(assert) {
  assert.expect(1);
  assert.ok(true, 'app.js should pass ESLint\n\n');
});

QUnit.test('controllers/contact.js', function(assert) {
  assert.expect(1);
  assert.ok(false, 'controllers/contact.js should pass ESLint\n\n8:2 - Mixed spaces and tabs. (no-mixed-spaces-and-tabs)\n9:2 - Mixed spaces and tabs. (no-mixed-spaces-and-tabs)\n11:2 - Mixed spaces and tabs. (no-mixed-spaces-and-tabs)\n12:2 - Mixed spaces and tabs. (no-mixed-spaces-and-tabs)\n13:2 - Mixed spaces and tabs. (no-mixed-spaces-and-tabs)\n15:2 - Mixed spaces and tabs. (no-mixed-spaces-and-tabs)\n17:2 - Mixed spaces and tabs. (no-mixed-spaces-and-tabs)\n18:2 - Mixed spaces and tabs. (no-mixed-spaces-and-tabs)\n19:2 - Mixed spaces and tabs. (no-mixed-spaces-and-tabs)\n21:2 - Mixed spaces and tabs. (no-mixed-spaces-and-tabs)\n22:2 - Mixed spaces and tabs. (no-mixed-spaces-and-tabs)\n23:2 - Mixed spaces and tabs. (no-mixed-spaces-and-tabs)\n24:2 - Mixed spaces and tabs. (no-mixed-spaces-and-tabs)\n26:2 - Mixed spaces and tabs. (no-mixed-spaces-and-tabs)\n26:31 - \'response\' is defined but never used. (no-unused-vars)\n27:2 - Mixed spaces and tabs. (no-mixed-spaces-and-tabs)\n28:2 - Mixed spaces and tabs. (no-mixed-spaces-and-tabs)\n29:2 - Mixed spaces and tabs. (no-mixed-spaces-and-tabs)\n30:2 - Mixed spaces and tabs. (no-mixed-spaces-and-tabs)\n31:2 - Mixed spaces and tabs. (no-mixed-spaces-and-tabs)\n32:2 - Mixed spaces and tabs. (no-mixed-spaces-and-tabs)');
});

QUnit.test('controllers/index.js', function(assert) {
  assert.expect(1);
  assert.ok(true, 'controllers/index.js should pass ESLint\n\n');
});

QUnit.test('models/invitation.js', function(assert) {
  assert.expect(1);
  assert.ok(true, 'models/invitation.js should pass ESLint\n\n');
});

QUnit.test('models/library.js', function(assert) {
  assert.expect(1);
  assert.ok(true, 'models/library.js should pass ESLint\n\n');
});

QUnit.test('models/mensagem.js', function(assert) {
  assert.expect(1);
  assert.ok(true, 'models/mensagem.js should pass ESLint\n\n');
});

QUnit.test('resolver.js', function(assert) {
  assert.expect(1);
  assert.ok(true, 'resolver.js should pass ESLint\n\n');
});

QUnit.test('router.js', function(assert) {
  assert.expect(1);
  assert.ok(true, 'router.js should pass ESLint\n\n');
});

QUnit.test('routes/about.js', function(assert) {
  assert.expect(1);
  assert.ok(true, 'routes/about.js should pass ESLint\n\n');
});

QUnit.test('routes/admin/contact.js', function(assert) {
  assert.expect(1);
  assert.ok(true, 'routes/admin/contact.js should pass ESLint\n\n');
});

QUnit.test('routes/admin/invitations.js', function(assert) {
  assert.expect(1);
  assert.ok(true, 'routes/admin/invitations.js should pass ESLint\n\n');
});

QUnit.test('routes/contact.js', function(assert) {
  assert.expect(1);
  assert.ok(true, 'routes/contact.js should pass ESLint\n\n');
});

QUnit.test('routes/libraries/edit.js', function(assert) {
  assert.expect(1);
  assert.ok(true, 'routes/libraries/edit.js should pass ESLint\n\n');
});

QUnit.test('routes/libraries/index.js', function(assert) {
  assert.expect(1);
  assert.ok(true, 'routes/libraries/index.js should pass ESLint\n\n');
});

QUnit.test('routes/libraries/new.js', function(assert) {
  assert.expect(1);
  assert.ok(true, 'routes/libraries/new.js should pass ESLint\n\n');
});

