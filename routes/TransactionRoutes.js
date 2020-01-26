const TransactionsCtrl = require('./../controllers/Transactions');

module.exports = (router) => {
  router.route('transactions/initialize')
    .post(TransactionsCtrl.initialize);

  router.route('transactions/webhook')
    .post(TransactionsCtrl.webhook);
};
