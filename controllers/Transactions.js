const db = require('./../models');
const Config = require('./../config/Config');
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
}

module.exports = Transactions;
