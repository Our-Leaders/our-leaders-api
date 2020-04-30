/**
 * Created by bolorundurowb on 08/11/2019
 */

const shortId = require('shortid');
const bcryptJs = require('bcryptjs');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserModel = mongoose.model('User', new Schema({
  _id: {
    type: String,
    default: shortId.generate
  },
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  email: {
    type: String
  },
  phoneNumber: {
    type: String
  },
  password: {
    type: String,
    required: true,
    set: function (val) {
      const salt = bcryptJs.genSaltSync(10);
      return bcryptJs.hashSync(val, salt);
    }
  },
  googleId: {
    type: String
  },
  facebookId: {
    type: String
  },
  profileImage: {
    publicId: {
      type: String
    },
    url: {
      type: String,
    }
  },
  gender: {
    type: String,
    enum: ['other', 'female', 'male'],
    default: 'other'
  },
  ageRange: {
    type: String
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  isUsingDefaultPassword: {
    type: Boolean,
    default: false
  },
  isPhoneVerified: {
    type: Boolean,
    default: false
  },
  verificationCode: {
    type: String
  },
  role: {
    type: String,
    required: true,
    enum: ['user', 'admin', 'superadmin'],
    default: 'user'
  },
  notificationsLastRetrievedAt: {
    type: Date
  },
  permissions: {
    politician: {
      create: {
        type: Boolean,
        default: false
      },
      update: {
        type: Boolean,
        default: false
      },
      delete: {
        type: Boolean,
        default: false
      },
    },
    politicianBackground: {
      create: {
        type: Boolean,
        default: false
      },
      update: {
        type: Boolean,
        default: false
      },
      delete: {
        type: Boolean,
        default: false
      },
    },
    accomplishments: {
      create: {
        type: Boolean,
        default: false
      },
      update: {
        type: Boolean,
        default: false
      },
      delete: {
        type: Boolean,
        default: false
      },
    },
    users: {
      update: {
        type: Boolean,
        default: false
      },
      delete: {
        type: Boolean,
        default: false
      }
    },
    jobs: {
      create: {
        type: Boolean,
        default: false
      },
      update: {
        type: Boolean,
        default: false
      }
    },
    pages: {
      update: {
        type: Boolean,
        default: false
      }
    },
    trends: {
      create: {
        type: Boolean,
        default: false
      },
      update: {
        type: Boolean,
        default: false
      },
      delete: {
        type: Boolean,
        default: false
      },
    },
    notifications: {
      create: {
        type: Boolean,
        default: false
      },
    },
  },
}, {
  timestamps: true
}));

module.exports = UserModel;
