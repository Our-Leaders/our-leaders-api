/**
 * Created by bolorundurowb on 10/03/2020
 */

const countries = require('./../config/static/countries.json');
 
class Countries {
  static getAll(req, res) {
    res.status(200).send({
      countries
    });
  }
}

module.exports = Countries;
