/**
 * Created by bolorundurowb on 06/11/2019
 */

module.exports = (router) => {
  router.get('/', function (req, res) {
    res.send('Home page works');
  });

  return router;
};
