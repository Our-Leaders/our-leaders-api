/**
 * Created by bolorundurowb on 03/12/2019
 */

const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');
const Config = require('./../config/Config');

class EmailUtil {
  static getApplicationEmail(jobTitle, jobDescription, firstName, lastName, email, address, cv, portfolio, interested, strengths) {
    const templateName = 'jobApplication';

    return {
      from: 'Our Leaders <no-reply@our-leaders.org>',
      to: ['thepeople@ourleaders.africa'],
      subject: `New Application for ${jobTitle}`,
      html: EmailUtil.generateHtml(templateName, {jobTitle, jobDescription, firstName, lastName, email, address, cv, portfolio, interested, strengths})
    };
  }

  static getApplicationReceivedEmail(jobTitle, firstName, email) {
    const templateName = 'jobApplicationReceived';

    return {
      from: 'Our Leaders <no-reply@our-leaders.org>',
      to: [email],
      subject: `Application Received for ${jobTitle}`,
      html: EmailUtil.generateHtml(templateName, {jobTitle, firstName})
    };
  }

  static getSubscriptionEmail(email, firstName, feeds) {
    const templateName = 'subscriptionFeed';

    return {
      from: 'Our Leaders <no-reply@our-leaders.org>',
      to: [email],
      subject: `Feeds from your subscriptions`,
      html: EmailUtil.generateHtml(templateName, {firstName, feeds})
    };
  }

  static getNewAdminEmail(email, firstName, defaultPassword) {
    const templateName = 'adminInvite';

    return {
      from: 'Our Leaders <no-reply@our-leaders.org>',
      to: [email],
      subject: `You have been added as an admin`,
      html: EmailUtil.generateHtml(templateName, {firstName, defaultPassword})
    };
  }

  static getPasswordResetRequestEmail(email, resetToken) {
    const templateName = 'resetRequest';

    return {
      from: 'Our Leaders <no-reply@our-leaders.org>',
      to: [email],
      subject: `Here is your password reset link`,
      html: EmailUtil.generateHtml(templateName, {
        resetLink: `${Config.frontEndUrl}/auth/reset-password?token=${resetToken}`
      })
    }
  }

  static getPasswordResetEmail(email, firstName) {
    const templateName = 'passwordReset';

    return {
      from: 'Our Leaders <no-reply@our-leaders.org>',
      to: [email],
      subject: `Your password has been reset successfully`,
      html: EmailUtil.generateHtml(templateName, {
        firstName
      })
    }
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
