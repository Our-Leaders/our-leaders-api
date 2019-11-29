/**
 * Created by bolorundurowb on 13/11/2019
 */

const db = require('./../models');
const Logger = require('./../config/Logger');
const OutputFormatters = require('./../utils/OutputFormatters');
const {ErrorHandler} = require('../utils/ErrorUtil');

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
        acronym: body.acronym,
        logo: body.logo,
        ideology: body.ideology,
        socials: body.socials,
        partyBackground: body.partyBackground,
        partyDescription: body.partyDescription
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

  static async find(req, res, next) {
    const {query} = req;
    let findByQuery = {};
    let orQuery = [];

    if (query.name) {
      orQuery.push({name: {$regex: query.name, $options: 'i'}});
    }

    if (query.acronym) {
      orQuery.push({acronym: {$regex: query.acronym, $options: 'i'}});
    }

    if (query.partyBackground) {
      orQuery.push({partyBackground: {$regex: query.partyBackground, $options: 'i'}});
    }

    if (query.partyDescription) {
      orQuery.push({partyDescription: {$regex: query.partyDescription, $options: 'i'}});
    }

    if (orQuery.length) {
      findByQuery = {$or: orQuery};
    }

    try {
      const politicalParties = await db.PoliticalParty.find(findByQuery);
      const serializedPoliticalParties = politicalParties.map(party => {
        return OutputFormatters.formatPoliticalParty(party);
      });

      res.status(200).send({
        politicalParties: serializedPoliticalParties
      });
    } catch (error) {
      next(new ErrorHandler(500, error.message));
    }
  }
}

module.exports = PoliticalParties;
