const router = require('express').Router();
const Crystal = require('../models/crystal');
const ensureAuth = require('../middleware/ensure-auth');

router
  .post('/', (req, res, next) => {
    console.log(req.user);
    req.body.owner = req.user.id;
    console.log(req.body);
    Crystal.create(req.body)
      .then(crystal => res.json(crystal))
      .catch(next);
  })

  module.exports = router;