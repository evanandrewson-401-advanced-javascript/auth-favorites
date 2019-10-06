const express = require('express');
const app = express();
// Load model plugins
require('./models/register-plugins');

// MIDDLEWARE
const morgan = require('morgan');
const ensureAuth = require('./middleware/ensure-auth');
const checkConnection = require('./middleware/check-connection');
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static('public'));
app.use(checkConnection);

// IS ALIVE TEST
app.get('/hello', (req, res) => res.send('world'));

// API ROUTES
const auth = require('./routes/auth');
const crystals = require('./routes/crystals');
const me = require('./routes/me');
const pirates = require('./routes/pirates');
app.use('/api/auth', auth);
app.use('/api/crystals', ensureAuth(), crystals);
app.use('/api/me', ensureAuth(), me);
app.use('/api/pirates', pirates)


// NOT FOUND
const api404 = require('./middleware/api-404');
app.use('/api', api404);
// using express default 404 for non-api routes

// ERRORS
const errorHandler = require('./middleware/error-handler');
app.use(errorHandler);

module.exports = app;