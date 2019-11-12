const { Politician } = require('../models');

const PoliticianService = {
  create: async(attributes) => {
    const politicianRecord = new Politician(attributes);
    return politicianRecord.save();
  },

  findAll: async() => {
    const politicians = await Politician.find();
    return politicians;
  },

  queryBy: async(politician) => {
    return null;
  }
}

module.exports = PoliticianService;