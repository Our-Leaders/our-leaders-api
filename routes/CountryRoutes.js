/**
 * Created by bolorundurowb on 10/03/2020
 */

const CountriesCtrl = require('./../controllers/Countries');

module.exports = (router) => {
  router.route('/countries')
    .get(
      CountriesCtrl.getAll
    );
};
