/**
 * Created by bolorundurowb on 03/12/2019
 */

const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

const Config = require('./../config/Config');

class EmailUtil {
  static getSubscriptionEmail(email, firstName, feeds) {
    const templateName = 'subscriptionFeed';

    return {
      from: 'Our Leaders <no-reply@our-leaders.org>',
      to: [email],
      subject: `Feeds from your subscriptions`,
      html: EmailUtil.generateHtml(templateName, {firstName, feeds})
    };
  }

  static generateHtml(templateName, payload) {
    const baseEmailTemplateString = fs.readFileSync(path.join(path.dirname(__dirname), 'communications', 'templates', 'baseEmailTemplate.hbs'), 'utf8');
    const baseEmailTemplate = handlebars.compile(baseEmailTemplateString);

    const templateString = fs.readFileSync(path.join(path.dirname(__dirname), 'communications', 'templates', `${templateName}.hbs`), 'utf8');
    const template = handlebars.compile(templateString);

    const body = template(payload);
    return baseEmailTemplate({body});
  }
}

module.exports = EmailUtil;