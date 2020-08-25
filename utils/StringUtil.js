class StringUtil {
  static isDefinedString(value) {
    return typeof value === 'string' && value.length > 0;
  }

  static isOnlyDigits(value) {
    return /^\d+$/.test(value);
  }

  static isValidEmail(email) {
    return /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(email);
  }

  static generateTransactionReference() {
    const prefix = 'OLA';
    const suffix = Math.random().toString().slice(2, 12);
    return `${prefix}-${suffix}`
  }

  static generatePassword() {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXZY';
    let response = '';

    for(let i = 0; i < 8; i++) {
      const index = Math.floor(Math.random() * 26);
      response += alphabet[index];
    }

    return response;
  }

  static btoa(data) {
    return Buffer.from(data).toString('base64');
  }

  static atob(data) {
    return Buffer.from(data, 'base64').toString('ascii');
  }
}

module.exports = StringUtil;
