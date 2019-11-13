/**
 * Created by bolorundurowb on 06/11/2019
 */

const AuthRoutes = require('./AuthRoutes');
const politicianRoutes = require('./politicianRoutes');

module.exports = (router) => {
  AuthRoutes(router);
  politicianRoutes(router);

  return router;
};
