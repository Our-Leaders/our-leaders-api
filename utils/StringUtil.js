class StringUtil {
  static isOnlyDigits(value) {
    return /^\d+$/.test(value);
  }

  static isValidEmail(email) {
    return /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(email);
  }
}

module.exports = StringUtil;