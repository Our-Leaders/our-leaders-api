const crypto = require('crypto');

const db = require('./../models');
const Config = require('./../config/Config');
const Logger = require('./../config/Logger');
const {ErrorHandler} = require('../utils/ErrorUtil');
const StringUtil = require('./../utils/StringUtil');

class Transactions {
  static async initialize(req, res, next) {
    const {name, email, isAnonymous, currency, amount} = req.body;

    try {
      const donation = new db.Donation({
        email,
        isAnonymous,
        amount: Math.abs(amount),
        transactionReference: StringUtil.generateTransactionReference()
      });

      // only save the name if the user doesnt want anonymity
      if (!isAnonymous) {
        donation.name = name;
      }

      if (currency) {
        donation.currency = currency;
      }

      await donation.save();

      res.status(200).send({
        transaction: {
          key: Config.paystack.publicKey,
          email: donation.email,
          amount: donation.amount,
          currency: donation.currency,
          ref: donation.transactionReference
        }
      });
    } catch (error) {
      next(new ErrorHandler(500, error.message));
    }
  }

  static async webhook(req, res) {
    const {headers, body} = req;

    try {
      const hash = crypto.createHmac('sha512', Config.secret).update(JSON.stringify(body)).digest('hex');
      // verify the paystack payload
      if (hash === headers['x-paystack-signature']) {
        // check if event is a transaction verification
        const {event, data} = body;
        if (event === 'charge.success') {
          const donation = await db.Donation({
            transactionReference: data.reference
          });

          if (donation) {
            donation.currency = data.currency;
            donation.status = 'verified';
            donation.amount = data.data.amount;
            donation.card = {
              cardType: data.authorization.card_type,
              expMonth: data.authorization.exp_month,
              expYear: data.authorization.exp_year,
              country: data.authorization.country_code,
              lastFour: data.authorization.last4
            };
            await donation.save();
          }
        }
      }

      res.status(200).send();
    } catch (error) {
      Logger.error(error);
      res.status(400).send();
    }
  }
}

module.exports = Transactions;
