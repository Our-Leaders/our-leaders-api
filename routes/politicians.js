const express = require('express');
const router = express.Router();

const { Politician: PoliticianService } = require('../services');
const { ErrorHandler } = require('../utils/error');

router.get('/', (req, res, next) => {
  PoliticianService.findAll()
    .then(politicians => {
      res.json(politicians);
    })
    .catch(error => {
      next(new ErrorHandler(500, error.message));
    });
})

module.exports = router