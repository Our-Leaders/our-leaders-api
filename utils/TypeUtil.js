class TypeUtil {
  static isBoolean(x) {
    return typeof x === 'boolean';
  }

  static isNumber(x) {
    return typeof x === 'number';
  }
};

module.exports = TypeUtil;