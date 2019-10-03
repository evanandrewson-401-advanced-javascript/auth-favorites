const router = require('express').Router();
const User = require('../models/user');

router
  .put('/favorites/:crystalId', (req, res, next) => {
    User.updateById(req.user.id, {
      $addToSet: {
        favorites: req.params.crystalId
      }
    })
    .then(({ favorites }) => res.json(favorites))
    .catch(next);
  })

  .delete('/favorites/:crystalId', (req, res, next) => {
    User.updateById(req.user.id, {
      $pull: {
        favorites: req.params.crystalId
      }
    })
    .then(({ favorites }) => res.json(favorites))
    .catch(next);
  })

  .get('/favorites', (req, res, next) => {
    User.findById(req.user.id)
      .populate('favorites', '_id')
      .then(({ favorites }) => res.json(favorites))
      .catch(next);
  });

  module.exports = router;