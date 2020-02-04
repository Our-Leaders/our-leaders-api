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
        partyBackground: body.partyBackground,
        partyDescription: {
          founded: body.yearEstablished,
          partyChairman: body.partyLeader
        }
      });

      ['facebook', 'twitter', 'instagram'].forEach((socialUrl) => {
        if (body[socialUrl]) {
          party.socials[socialUrl] = body[socialUrl];
        }
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
    const skip = +req.query.skip || 0;
    const limit = +req.query.limit || 18; // determined by the mockups
    const {name, acronym, partyBackground, partyDescription} = req.query;
    let findByQuery = {};
    let orQuery = [];

    if (name) {
      orQuery.push({name: {$regex: name, $options: 'i'}});
    }

    if (acronym) {
      orQuery.push({acronym: {$regex: acronym, $options: 'i'}});
    }

    if (partyBackground) {
      orQuery.push({partyBackground: {$regex: partyBackground, $options: 'i'}});
    }

    if (partyDescription) {
      orQuery.push({partyDescription: {$regex: partyDescription, $options: 'i'}});
    }

    if (orQuery.length) {
      findByQuery = {$or: orQuery};
    }

    try {
      const politicalParties = await db.PoliticalParty
        .find(findByQuery)
        .skip(skip)
        .limit(limit);

      const total = await db.PoliticalParty.count(findByQuery);
      const serializedPoliticalParties = politicalParties.map(party => {
        return OutputFormatters.formatPoliticalParty(party);
      });

      res.status(200).send({
        politicalParties: serializedPoliticalParties,
        total
      });
    } catch (error) {
      next(new ErrorHandler(500, error.message));
    }
  }

  static async edit(req, res, next) {
    const {body, params} = req;
    const {id} = params;

    try {
      const politicalParty = await db.PoliticalParty.findById(id);

      if (!politicalParty) {
        next(new ErrorHandler(404, 'Political Party doesn\'t exist'));
        return;
      }

      ['name', 'acronym', 'ideology', 'partyBackground'].forEach((property) => {
        if (body[property]) {
          politicalParty[property] = body[property];
        }
      });

      if (body.yearEstablished) {
        politicalParty.partyDescription.founded = body.yearEstablished;
      }

      if (body.partyLeader) {
        politicalParty.partyDescription.partyChairman = body.partyLeader;
      }

      if (body.logo) {
        politicalParty.logo = body.logo;
      }

      ['facebook', 'twitter', 'instagram'].forEach((socialUrl) => {
        if (body[socialUrl]) {
          politicalParty.socials[socialUrl] = body[socialUrl] || '';
        }
      });

      await politicalParty.save();

      res.status(200).send({
        politicalParty: OutputFormatters.formatPoliticalParty(politicalParty)
      });
    } catch (error) {
      next(new ErrorHandler(500, error.message));
    }
  }
}

module.exports = PoliticalParties;
