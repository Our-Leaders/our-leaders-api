/**
 * Created by bolorundurowb on 13/11/2019
 */

const ImageUtil = require('./../utils/ImageUtil');

class ImageMiddleware {
  static async uploadLogo(req, res, next) {
    const file = req.file;
    req.body.logo = await ImageUtil.uploadFile(file);
    next();
  }
}

module.exports = ImageMiddleware;
