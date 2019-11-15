const shortId = require('shortid');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PoliticianModel = mongoose.model('Politician', new Schema({
  _id: {
    type: String,
    default: shortId.generate
  },
  name: {
    type: String,
    required: true
  },
  dob: {
    type: Date,
    required: true
  },
  religious: {
    type: String,
    required: true
  },
  manifesto: {
    type: String
  },
  stateOfOrigin: {
    type: String,
    required: true
  },
  politicalParty: {
    type: String,
    ref: 'PoliticalParty'
  },
  profileImage: {
    publicId: {
      type: String
    },
    url: {
      type: String,
    }
  },
  status: {
    type: String,
    enum: ['upcoming', 'current', 'past']
  },
  vote: {
    down: {
      type: Number
    },
    up: {
      type: Number
    }
  },
  voters: [{
    id: {
      type: String,
      ref: 'User'
    },
    isUpvote: {
      type: Boolean
    }
  }],
  educationalBackground: [{
    degree: {
      type: String
    },
    institution: {
      type: String
    },
    startDate: {
      type: Date
    }
  }],
  politicalBackground: [{
    position: {
      type: String
    },
    description: {
      type: String
    },
    inOffice: {
      type: Boolean,
      default: false
    },
    state: {
      type: String
    },
    startDate: {
      type: Date
    },
    endDate: {
      type: Date
    }
  }],
  professionalBackground: [{
    title: {
      type: String
    },
    description: {
      type: String
    },
    startDate: {
      type: Date
    },
    endDate: {
      type: Date
    }
  }],
  socials: {
    facebook: {
      type: String
    },
    instagram: {
      type: String
    },
    twitter: {
      type: String
    }
  },
  accomplishments: [{
    title: {
      type: String
    },
    description: {
      type: String
    },
    year: {
      type: Number
    },
    quarter: {
      type: String,
      enum: ['q1', 'q2', 'q3', 'q4']
    },
    image: {
      publicId: {
        type: String
      },
      url: {
        type: String,
      }
    },
    tags: [{
      type: String,
      ref: 'Tag'
    }],
    createdOn: {
      type: Date,
      default: new Date
    }
  }]
}, {
  timestamps: true
}));

module.exports = PoliticianModel;
