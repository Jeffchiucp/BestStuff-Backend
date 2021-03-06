const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// SEQUELIZE
const Sequelize = require('sequelize');
const sequelize = new Sequelize('beststuff', 'postgres', null, { dialect: 'postgres' });
const sync = () => {
  return sequelize.sync({ force: true })
}

// ALLOW CORS
var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
}

//MIDDLEWARE
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(allowCrossDomain);

// RESOURCES
require('./controllers/contests')(app);
require('./controllers/items')(app);
require('./controllers/users')(app);

// SERVER
var port = process.env.PORT || 8000;
app.listen(port, function () {
  console.log('BestStuff Server listening on port 8000!');
  sync()
    .then(() => console.log('... and Database synced!'))
    .catch( e => console.log(e))
});
