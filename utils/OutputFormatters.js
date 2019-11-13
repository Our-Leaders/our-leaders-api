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

  static formatPolitician(politician) {
    if (!politician) {
      return {};
    }

    return {
      id: politician._id,
      name: politician.name,
      dob: politician.dob,
      religious: politician.religious,
      stateOfOrigin: politician.stateOfOrigin,
      educationalBackground: politician.educationalBackground,
      politicalBackground: politician.politicalBackground,
      professionalBackground: politician.professionalBackground,
      accomplishments: politician.accomplishments,
    };
  }
}

module.exports = OutputFormatters;
