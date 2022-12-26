const path            = require('path');
const express         = require('express');

require('./db');
const initMiddleware = require('./middleware');
const initRoutes      = require('./routes');

const app = express();

app.use(express.static(path.join(__dirname, '/public')));

initMiddleware(app);
initRoutes(app);

module.exports = app;
