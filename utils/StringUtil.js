class StringUtil {
  static isOnlyDigits(value) {
    return /^\d+$/.test(value);
  }

  static isValidEmail(email) {
    return /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(email);
  }

  static generateTransactionReference() {
    const prefix = 'OLA';
    const suffix = Math.random().toString().slice(0, 10);
    return `${prefix}-${suffix}`
  }
}

module.exports = StringUtil;
