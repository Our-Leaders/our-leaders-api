class TrendValidators {
  static validateCreation(req, res, next) {
    const body = req.body;
    let message = '';

    if (!body.politicianId) {
      message = 'A politicians id is required.';
    }

    if (message) {
      return res.status(400).send({
        message
      });
    } else {
      next();
    }
  }

  static validateUpdate(req, res, next) {
    const body = req.body;
    let message = '';

    if (!body.order) {
      message = 'An order is required.';
    }

    if (message) {
      return res.status(400).send({
        message
      });
    } else {
      next();
    }
  }
}

module.exports = TrendValidators;
