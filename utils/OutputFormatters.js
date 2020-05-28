/**
 * Created by bolorundurowb on 11/11/2019
 */

class OutputFormatters {
  static formatUser(user) {
    if (!user) {
      return {};
    }
    let joinedBy;
    if (user.facebookId) {
      joinedBy = 'facebook';
    } else if (user.googleId) {
      joinedBy = 'google';
    }

    return {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      gender: user.gender,
      phoneNumber: user.phoneNumber,
      email: user.email,
      ageRange: user.ageRange,
      isEmailVerified: user.isEmailVerified,
      isPhoneVerified: user.isPhoneVerified,
      profileImage: user.profileImage ? user.profileImage.url : null,
      role: user.role,
      joinedAt: user.createdAt,
      joinedBy,
      isBlocked: user.isBlocked,
      isUsingDefaultPassword: user.isUsingDefaultPassword,
      lastLoginAt: user.lastLoginAt
    };
  }

  static formatAdmin(admin) {
    if (!admin) {
      return {};
    }

    return {
      id: admin._id,
      firstName: admin.firstName,
      lastName: admin.lastName,
      phoneNumber: admin.phoneNumber,
      email: admin.email,
      role: admin.role,
      joinedAt: admin.createdAt,
      permissions: admin.permissions,
      isBlocked: admin.isBlocked,
      isDeleted: admin.isDeleted,
      isUsingDefaultPassword: admin.isUsingDefaultPassword
    };
  }

  static formatPhoneNumber(phoneNumber) {
    if (!phoneNumber) {
      return '';
    }

    return phoneNumber.charAt(0) === '0' ? phoneNumber.replace('0', '+234') : `+234${phoneNumber}`
  }

  static formatPolitician(politician) {
    if (!politician) {
      return {};
    }

    return {
      id: politician._id,
      name: politician.name,
      dob: politician.dob,
      country: politician.country,
      manifesto: politician.manifesto,
      stateOfOrigin: politician.stateOfOrigin,
      politicalParty: politician.politicalParty,
      profileImage: politician.profileImage ? politician.profileImage.url : null,
      status: politician.status,
      vote: politician.vote,
      voters: politician.voters,
      educationalBackground: politician.educationalBackground,
      politicalBackground: politician.politicalBackground,
      professionalBackground: politician.professionalBackground,
      socials: politician.socials,
      accomplishments: politician.accomplishments,
      numberOfViews: politician.numberOfViews
    };
  }

  static formatPoliticalParty(party) {
    if (!party) {
      return {};
    }

    return {
      id: party._id,
      name: party.name,
      country: party.country,
      acronym: party.acronym,
      logo: party.logo.url,
      ideology: party.ideology,
      socials: party.socials,
      partyBackground: party.partyBackground,
      partyDescription: party.partyDescription,
      createdAt: party.createdAt,
      votes: {
        up: party.votes.up.length,
        down: party.votes.down.length
      },
      voters: {
        up: party.votes.up,
        down: party.votes.down
      }
    };
  }

  static formatFeed(feed) {
    if (!feed) {
      return {};
    }

    const response = {
      id: feed._id,
      title: feed.title,
      summary: feed.summary,
      feedUrl: feed.feedUrl,
      publishedAt: feed.publishedAt,
      addedAt: feed.createdAt
    };

    if (feed.politicians) {
      response.politicians = feed.politicians.map(x => {
        // if the politician is populated then format its response
        if (typeof x === 'object') {
          return OutputFormatters.formatPolitician(x);
        }

        return x;
      });
    }

    return response;
  }

  static formatJob(job) {
    if (!job) {
      return {};
    }

    return {
      id: job._id,
      title: job.title,
      description: job.description,
      type: job.type,
      location: job.location,
      category: job.category,
      applicationLink: job.applicationLink,
      image: job.image,
      isArchived: job.isArchived
    };
  }

  static formatSubscription(subscription) {
    if (!subscription) {
      return {};
    }

    const response = {
      id: subscription._id,
      email: subscription.email,
      type: subscription.type,
      createdAt: subscription.createdAt
    };

    if (subscription.politician) {
      response.politician = OutputFormatters.formatPolitician(subscription.politician);
    }

    return response;
  }

  static formatTrend(trend) {
    if (!trend) {
      return {};
    }

    return {
      id: trend._id,
      order: trend.order,
      politician: OutputFormatters.formatPolitician(trend.politician)
    };
  }

  static formatNotification(notification) {
    if (!notification) {
      return {};
    }

    const response = {
      id: notification._id,
      url: notification.url,
      message: notification.message,
      entityId: notification.entityId,
      entityType: notification.entityType
    };

    if (notification.addedBy) {
      response.addedBy = OutputFormatters.formatAdmin(notification.addedBy);
    }

    return response;
  }

  static formatSignup(signUp) {
    if (!signUp) {
      return {};
    }

    return {
      id: signUp._id,
      email: signUp.email,
      createdAt: signUp.createdAt,
      lastActiveAt: signUp.lastActiveAt
    };
  }

  static formatVisitStats(stats) {
    if (!stats) {
      return {};
    }

    return {
      // Doing this because months are zero indexed on the date constructor
      // so new Date(2020, 5, 26) will send back 26th of June 2020 instead
      // of 26 of May 2020. See this link for more https://mzl.la/2XATweS
      date: new Date(Date.UTC(stats._id.year, stats._id.month - 1, stats._id.day)),
      visits: stats.visits
    };
  }

  static formatSignupStats(stats) {
    if (!stats) {
      return {};
    }

    return {
      date: new Date(Date.UTC(stats._id.year, stats._id.month - 1, stats._id.day)),
      signUps: stats.signUps
    };
  }
}

module.exports = OutputFormatters;
