/**
 * Created by bolorundurowb on 19/12/2019
 */

const db = require('./../models');
const Config = require('./Config');
const Logger = require('./Logger');

(async () => {
  try {
    let superAdmin = await db.User.findOne({
      email: Config.superAdmin.email,
      role: 'superadmin'
    });

    if (superAdmin) {
      Logger.log('Super admin already exists.');
    } else {
      superAdmin = new db.User(Config.superAdmin);
      superAdmin.role = 'superadmin';
      await superAdmin;
      Logger.log('Super admin has been seeded successfully.')
    }

    process.exit(0);
  } catch (err) {
    Logger.error(err);
    process.exit(1);
  }
})();
