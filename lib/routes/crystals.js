const router = require('express').Router();
const Crystal = require('../models/crystal');
const ensureAuth = require('../middleware/ensure-auth');

router
  .post('/', (req, res, next) => {
    req.body.owner = req.user.id;
    Crystal.create(req.body)
      .then(crystal => res.json(crystal))
      .catch(next);
  })

  .put('/:id', (req, res, next) => {
    Crystal.updateById(req.params.id, req.body)
      .then(crystal => res.json(crystal))
      .catch(next);
  })

  .delete('/:id', (req, res, next) => {
    Crystal.findByIdAndDelete(req.params.id)
      .then(crystal => res.json(crystal))
      .catch(next);
  })

  module.exports = router;