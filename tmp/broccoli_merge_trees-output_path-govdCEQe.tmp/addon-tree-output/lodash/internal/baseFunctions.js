define('lodash/internal/baseFunctions', ['exports', 'lodash/lang/isFunction'], function (exports, _lodashLangIsFunction) {

  /**
   * The base implementation of `_.functions` which creates an array of
   * `object` function property names filtered from those provided.
   *
   * @private
   * @param {Object} object The object to inspect.
   * @param {Array} props The property names to filter.
   * @returns {Array} Returns the new array of filtered property names.
   */
  function baseFunctions(object, props) {
    var index = -1,
        length = props.length,
        resIndex = -1,
        result = [];

    while (++index < length) {
      var key = props[index];
      if ((0, _lodashLangIsFunction['default'])(object[key])) {
        result[++resIndex] = key;
      }
    }
    return result;
  }

  exports['default'] = baseFunctions;
});