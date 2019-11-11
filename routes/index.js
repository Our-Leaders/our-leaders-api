/**
 * Created by bolorundurowb on 06/11/2019
 */

const AuthRoutes = require('./AuthRoutes');

module.exports = (router) => {
  AuthRoutes.route(router);

  return router;
};
