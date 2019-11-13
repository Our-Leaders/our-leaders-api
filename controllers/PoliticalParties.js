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

  static async find(req, res) {
    const { query } = req;
    let findByQuery = {};
    let orQuery = [];

    if (query.name) {
      orQuery.push({ name: { $regex: query.name, $options: 'i' } });
    }

    if (query.partyLeader) {
      orQuery.push({ partyLeader: { $regex: query.partyLeader, $options: 'i' } });
    }

    if (query.acronym) {
      orQuery.push({ acronym: { $regex: query.acronym, $options: 'i' } });
    }

    if (orQuery.length) {
      findByQuery = { $or: orQuery };
    }

    try {
      const politicalParties = await db.PoliticalParty.find(findByQuery);
      const serializedPoliticalParties = politicalParties.map(party => {
        return OutputFormatters.formatPoliticalParty(party);
      })
      res.status(200).send({
        politicalParties: serializedPoliticalParties
      });
    } catch (error) {
      next(new ErrorHandler(500, error.message));
    }
  }
}

module.exports = PoliticalParties;
