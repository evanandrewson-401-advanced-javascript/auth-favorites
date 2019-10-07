const router = require('express').Router();
const Pirate = require('../models/pirate');
const ensureAuth = require('../middleware/ensure-auth');
const ensureRole = require('../middleware/ensure-role');

router
  .post('/', ensureAuth(), ensureRole(), (req, res, next) => {
    Pirate.create(req.body)
      .then(pirate => res.json(pirate))
      .catch(next);
  })

  .put('/:id', ensureAuth(), ensureRole(), (req, res, next) => {
    Pirate.updateById(req.params.id, req.body)
      .then(pirate => res.json(pirate))
      .catch(next);
  })

  .delete('/:id', ensureAuth(), ensureRole(), (req, res, next) => {
    Pirate.findByIdAndRemove(req.params.id)
      .then(pirate => res.json(pirate))
      .catch(next);
  })

  .get('/', ensureAuth(), (req, res, next) => {
    Pirate.find()
      .then(pirates => res.json(pirates))
      .catch(next);
  });


  module.exports = router;