/**
 * Created by bolorundurowb on 13/11/2019
 */

const ImageUtil = require('./../utils/ImageUtil');

class ImageMiddleware {
  static async uploadImage(req, res, next) {
    const file = req.file;
    if (file) {
      req.body.image = await ImageUtil.uploadFile(file, {
        width: req.body.width,
        height: req.body.height
      });
      next();
    }

    next();
  }

  static async uploadLogo(req, res, next) {
    const file = req.file;
    if (file) {
      req.body.logo = await ImageUtil.uploadFile(file, {
        width: 200,
        height: 200
      });
    }

    next();
  }
}

module.exports = ImageMiddleware;
