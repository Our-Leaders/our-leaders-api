/**
 * Created by bolorundurowb on 19/12/2019
 */

const db = require('./../models');
const Config = require('./Config');
const Logger = require('./Logger');

(async () => {
  try {
    // seed the super admin
    let superAdmin = await db.User.findOne({
      email: Config.superAdmin.email,
      role: 'superadmin'
    });

    if (superAdmin) {
      Logger.log('Super admin already exists.');
    } else {
      superAdmin = new db.User(Config.superAdmin);
      superAdmin.role = 'superadmin';
      await superAdmin.save();
      Logger.log('Super admin has been seeded successfully.')
    }

    // seed the settings
    let setting = await db.Setting.findOne({});

    if (setting) {
      Logger.log('Site wide settings seeded.');
    } else {
      setting = new db.Setting({
        contact: {
          address: '8, Lawal Street, Off Oweh street, Jibowu, Yaba Lagos, Nigeria',
          phoneNumber: '234) 817 543 9754',
          email: 'hello@ourleaders.africa'
        }
      });
      await setting.save();
      Logger.log('Site settings seeded successfully.');
    }

    process.exit(0);
  } catch (err) {
    Logger.error(err);
    process.exit(1);
  }
})();
