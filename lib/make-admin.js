require('dotenv').config();
const connect = require('../lib/connect');
require('../lib/models/register-plugins');
const User = require('../lib/models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

connect(process.env.MONGODB_URI);

User.create({
  email: 'admin@admin.com',
  hash: bcrypt.hashSync('password', 8),
  roles: []
}).then(user => {
  User.updateById(
    user._id,
    { 
      $addToSet: { 
        roles: 'admin'
      }
    }
  )
  .then(result => {
    console.log(result)
  })
  .catch()
  .finally(() => mongoose.connection.close());
})