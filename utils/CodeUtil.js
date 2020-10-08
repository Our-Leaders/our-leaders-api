class CodeUtil {
  static generatePhoneVerificationCode() {
    return CodeUtil.generateCode(4);
  }

  static generateEmailVerificationCode() {
    return CodeUtil.generateCode(4);
  }

  static generateCode(length) {
    let code = '';

    for (let x = 0; x < length; x++) {
      let nextDigit = Math.floor(Math.random() * 10);
      nextDigit = code.length === 0 && nextDigit === 0 ? nextDigit + 1 : nextDigit;
      code += nextDigit;
    }

    return code;
  }
}

module.exports = CodeUtil;
