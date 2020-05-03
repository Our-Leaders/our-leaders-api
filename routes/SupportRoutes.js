const SupportCtrl = require('./../controllers/Support');

module.exports = (router) => {
  router.route('/support/message')
    .post(SupportCtrl.sendMessage);
};
