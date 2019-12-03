/**
 * Created by bolorundurowb on 03/12/2019
 */

const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

const Config = require('./../config/Config');

class EmailUtil {
  static generateHtml(templateName, payload) {
    const baseEmailTemplateString = fs.readFileSync(path.join(path.dirname(__dirname), 'templates', 'baseEmailTemplate.hbs'), 'utf8');
    const baseEmailTemplate = handlebars.compile(baseEmailTemplateString);

    const templateString = fs.readFileSync(path.join(path.dirname(__dirname), 'templates', `${templateName}.hbs`), 'utf8');
    const template = handlebars.compile(templateString);

    const body = template(payload);
    return baseEmailTemplate({body});
  }
}

module.exports = EmailUtil;
