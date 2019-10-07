const router = require('express').Router();
const Crystal = require('../models/crystal');

router
  .post('/', (req, res, next) => {
    req.body.owner = req.user.id;
    Crystal.create(req.body)
      .then(crystal => res.json(crystal))
      .catch(next);
  })

  .put('/:id', (req, res, next) => {
    Crystal.findById(req.params.id)
      .then((crystal) => {
        if(crystal.owner == req.user.id) {
          Crystal.updateById(req.params.id, req.body)
            .then(crystal => res.json(crystal))
        } else {
          throw new Error({
            statusCode: 401,
            error: 'You can only update your crystals'
          })
          }
        })
        .catch(next);
  })

  .delete('/:id', (req, res, next) => {
    Crystal.findById(req.params.id)
      .then((crystal) => {
        if(crystal.owner == req.user.id) {
          Crystal.findByIdAndDelete(req.params.id)
            .then(crystal => res.json(crystal))
        } else {
          throw new Error({
            statusCode: 401,
            error: 'You can only update your crystals'
          })
          }
        })
      .catch(next);
  })

  .get('/', (req, res, next) => {
    Crystal.find()
      .then(crystals => res.json(crystals))
      .catch(next);
  });

  module.exports = router;