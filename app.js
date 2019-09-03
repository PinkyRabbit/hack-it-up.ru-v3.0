const path            = require('path');
const express         = require('express');

require('./db');
const initMiddlewares = require('./middlewares');
const initRoutes      = require('./routes');

const app = express();

app.use(express.static(path.join(__dirname, '/public')));

initMiddlewares(app);
initRoutes(app);

module.exports = app;
