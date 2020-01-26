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
        name,
        email,
        isAnonymous,
        amount: Math.abs(amount),
        transactionReference: StringUtil.generateTransactionReference()
      });

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
    try {

    } catch (error) {
      Logger.error(error);
    }

    res.status(200).send();
  }
}

module.exports = Transactions;
