/**
 * Created by bolorundurowb on 13/11/2019
 */

const cloudinary = require('cloudinary');
const Config = require('./../config/Config');
const Logger = require('./../config/Logger');

cloudinary.config({
  cloud_name: Config.cloudinary.cloudName,
  api_key: Config.cloudinary.apiKey,
  api_secret: Config.cloudinary.secret
});


class ImageUtil {
  static async uploadFiles(files, sizeParams) {
    const uploadInfo = [];

    if (!files || files.length === 0) {
      return uploadInfo;
    }

    try {
      for (let i = 0; i < files.length; i++) {
        uploadInfo.push(await ImageUtil.uploadFile(files[i], sizeParams));
      }
    } catch (err) {
      Logger.error(err);
      return uploadInfo;
    }
  }

  static async uploadFile(file, sizeParams) {
    if (!file) {
      return {};
    }

    const options = {
      folder: Config.isProduction ? 'production' : 'development',
      eager_options: {
        width: sizeParams.width,
        height: sizeParams.height,
        crop: 'scale',
        format: 'jpg'
      }
    };

    try {
      const uploadResult = await cloudinary.v2.uploader.upload(file.path, options);
      return {
        publicId: uploadResult.public_id,
        url: uploadResult.url.replace('http:', 'https:')
      };
    } catch (err) {
      Logger.error(err);
      return {};
    }
  }

  static async deleteFile(publicId) {
    try {
      await cloudinary.v2.uploader.destroy(publicId, {invalidate: true});
    } catch (err) {
      Logger.error(err);
    }
  }
}

module.exports = ImageUtil;
