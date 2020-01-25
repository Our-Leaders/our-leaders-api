const TransactionsCtrl = require('./../controllers/Transactions');

module.exports = (router) => {
  router.route('transactions/initialize')
    .post(TransactionsCtrl.initialize);
};
