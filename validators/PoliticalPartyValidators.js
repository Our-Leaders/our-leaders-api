/**
 * Created by bolorundurowb on 13/11/2019
 */

class PoliticalPartyValidators {
  static validateCreation(req, res, next) {
    const body = req.body;
    let message = '';

    if (!body.name) {
      message = 'The political party name is required.'
    } else if (!body.yearEstablished || body.yearEstablished <= 0) {
      message = 'The year established is required and must be positive.';
    } else if (!body.partyLeader) {
      message = 'The party leaders name is required.';
    }

    if (message) {
      return res.status(400).send({
        message
      });
    } else {
      next();
    }
  }
}

module.exports = PoliticalPartyValidators;
