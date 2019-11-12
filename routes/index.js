/**
 * Created by bolorundurowb on 06/11/2019
 */

const politicians = require('./politicians');

module.exports = (router) => {
  router.get('/', function (req, res) {
    res.send('Home page works');
  });

  router.use('/politicians', politicians);

  return router;
};
