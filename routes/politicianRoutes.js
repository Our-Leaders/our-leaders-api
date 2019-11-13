const PoliticianCtrl = require('./../controllers/Politician');

module.exports = (router) => {
  router.route('/politicians').get(PoliticianCtrl.find);

  router.route('/politicians/:id')
    .get(PoliticianCtrl.get)
};
