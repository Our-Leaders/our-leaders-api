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
      superAdmin.permissions = {
        politician: {
          create: true,
          update: true,
          delete: true
        },
        politicianBackground: {
          create: true,
          update: true,
          delete: true
        },
        accomplishments: {
          create: true,
          update: true,
          delete: true
        },
        users: {
          update: true,
          delete: true
        },
        jobs: {
          create: true,
          update: true
        },
        pages: {
          update: true
        },
        trends: {
          create: true,
          update: true,
          delete: true
        }
      };
      await superAdmin.save();
      Logger.log('Super admin has been seeded successfully.')
    }

    // seed the web page info
    let page = await db.Page.findOne({});

    if (page) {
      Logger.log('Web pages info already exists.');
    } else {
      page = new db.Page({
        aboutUs: `We aim to educate The People on how to properly get involved with policies and decisions being made on their behalf and how these decisions may affect The People. We also aim to create a platform where The Leaders can learn directly from The People. Their perspectives, opinions, and ideas, and utilize this information when making decisions on behalf of The People.`,
        contact: {
          address: '8, Lawal Street, Off Oweh street, Jibowu, Yaba Lagos, Nigeria',
          phoneNumber: '(234) 817 543 9754',
          email: 'hello@ourleaders.africa'
        }
      });
      await page.save();
      Logger.log('Web pages info seeded successfully.');
    }

    process.exit(0);
  } catch (err) {
    Logger.error(err);
    process.exit(1);
  }
})();
