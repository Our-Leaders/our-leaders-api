/**
 * Created by bolorundurowb on 13/11/2019
 */

const {ErrorHandler} = require('../utils/ErrorUtil');

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

  static async validateUpdate(req, res, next) {
    const {body} = req;
    let message = '';

    if (body.name !== undefined && body.name.trim().length < 1) {
      message = 'Please enter a valid name for the political party name';
    } else if (body.yearEstablished !== undefined && body.yearEstablished <= 0) {
      message = 'Please enter a valid value for the political party year established';
    } else if (body.partyLeader !== undefined && body.partyLeader.trim().length < 1) {
      message = 'Please enter a valid value for party leader';
    } else if (body.partyBackground !== undefined && body.partyBackground.trim().length < 1) {
      message = 'Please enter a valid value for party background';
    } else if (body.ideology !== undefined && body.ideology.trim().length < 1) {
      message = 'Please enter a valid value for party ideology';
    } else if (body.acronym !== undefined && body.acronym.trim().length < 1) {
      message = 'Please enter a valid value for party acronym';
    }

    if (!message) {
      next();
    } else {
      next(new ErrorHandler(400, message));
    }
  }
}

module.exports = PoliticalPartyValidators;
