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
      joinedAt: user.createdAt
    };
  }

  static formatPoliticalParty(party) {
    if (!party) {
      return {};
    }

    return {
      id: party._id,
      name: party.name,
      logo: party.logo.url,
      yearEstablished: party.yearEstablished,
      partyLeader: party.partyLeader,
      ideology: party.ideology,
      numOfPartyMembers: party.numOfPartyMembers,
      joinedAt: party.createdAt
    };
  }
}

module.exports = OutputFormatters;
