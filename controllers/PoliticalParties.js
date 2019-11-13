/**
 * Created by bolorundurowb on 13/11/2019
 */

const db = require('./../models');
const Logger = require('./../config/Logger');
const OutputFormatters = require('./../utils/OutputFormatters');

class PoliticalParties {
  static async create(req, res) {
    const body = req.body;

    try {
      let party = await db.PoliticalParty.findOne({
        name: body.name
      });

      if (party) {
        return res.status(409).send({
          message: 'A party with the same name exists.'
        });
      }

      party = new db.PoliticalParty({
        name: body.name,
        logo: body.logo,
        yearEstablished: body.yearEstablished,
        partyLeader: body.partyLeader,
        ideology: body.ideology,
        numOfPartyMembers: body.numOfPartyMembers
      });
      await party.save();

      res.status(201).send({
        politicalParty: OutputFormatters.formatPoliticalParty(party)
      });
    } catch (err) {
      Logger.error(err);
      res.status(500).send({
        message: 'An error occurred.'
      });
    }
  }
}

module.exports = PoliticalParties;
