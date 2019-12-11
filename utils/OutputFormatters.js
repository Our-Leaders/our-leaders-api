/**
 * Created by bolorundurowb on 11/11/2019
 */

class OutputFormatters {
  static formatUser(user) {
    if (!user) {
      return {};
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
      role: user.role,
      joinedAt: user.createdAt,
      isBlocked: user.isBlocked
    };
  }

  static formatPhoneNumber(phoneNumber) {
    if (!phoneNumber) {
      return '';
    }

    return phoneNumber.charAt(0) === '0' ? phoneNumber.replace('0', '234') : `234${phoneNumber}`
  }

  static formatPolitician(politician) {
    if (!politician) {
      return {};
    }

    return {
      id: politician._id,
      name: politician.name,
      dob: politician.dob,
      religion: politician.religion,
      manifesto: politician.manifesto,
      stateOfOrigin: politician.stateOfOrigin,
      politicalParty: politician.politicalParty,
      profileImage: politician.profileImage,
      status: politician.status,
      vote: politician.vote,
      educationalBackground: politician.educationalBackground,
      politicalBackground: politician.politicalBackground,
      professionalBackground: politician.professionalBackground,
      socials: politician.socials,
      accomplishments: politician.accomplishments
    };
  }

  static formatPoliticalParty(party) {
    if (!party) {
      return {};
    }

    return {
      id: party._id,
      name: party.name,
      acronym: party.acronym,
      logo: party.logo.url,
      ideology: party.ideology,
      socials: party.socials,
      partyBackground: party.partyBackground,
      partyDescription: party.partyDescription,
      createdAt: party.createdAt
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

    response.politicians = feed.politicians.map(x => {
      // if the politician is populated then format its response
      if (typeof x === 'object') {
        return OutputFormatters.formatPolitician(x);
      }

      return x;
    });

    return response;
  }
}

module.exports = OutputFormatters;
