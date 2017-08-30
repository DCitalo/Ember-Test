define('lodash/function/wrap', ['exports', 'lodash/internal/createWrapper', 'lodash/utility/identity'], function (exports, _lodashInternalCreateWrapper, _lodashUtilityIdentity) {

  /** Used to compose bitmasks for wrapper metadata. */
  var PARTIAL_FLAG = 32;

  /**
   * Creates a function that provides `value` to the wrapper function as its
   * first argument. Any additional arguments provided to the function are
   * appended to those provided to the wrapper function. The wrapper is invoked
   * with the `this` binding of the created function.
   *
   * @static
   * @memberOf _
   * @category Function
   * @param {*} value The value to wrap.
   * @param {Function} wrapper The wrapper function.
   * @returns {Function} Returns the new function.
   * @example
   *
   * var p = _.wrap(_.escape, function(func, text) {
   *   return '<p>' + func(text) + '</p>';
   * });
   *
   * p('fred, barney, & pebbles');
   * // => '<p>fred, barney, &amp; pebbles</p>'
   */
  function wrap(value, wrapper) {
    wrapper = wrapper == null ? _lodashUtilityIdentity['default'] : wrapper;
    return (0, _lodashInternalCreateWrapper['default'])(wrapper, PARTIAL_FLAG, undefined, [value], []);
  }

  exports['default'] = wrap;
});