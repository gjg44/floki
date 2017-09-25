var express = require('express');
var app  = express();
var mongoose = require('mongoose');
var assert = require('assert');
var config = require('./config');
var setupController = require('./controllers/setupController');
var apiController = require('./controllers/apiController');
var apiQB = require('./controllers/apiQB');
var apiTSheets = require('./controllers/apiTSheets');
var QuickBooks = require('node-quickbooks-oauth2');
var path = require('path');

var port = process.env.PORT || 3000;

// to eliminate node warning 9856
var mongoOptions = {
  useMongoClient: true
};
// Use native promises to avoide Mongoose warning. Consider other
// promise libraries?  This just uses the native ES6 promises (could use bluebird)
mongoose.Promise = global.Promise;
//assert.equal(query.exec().constructor, global.Promise);

app.use('/', express.static(__dirname + '/public/Node-Todo'));

app.set('view engine', 'ejs');

// connect to the database.
mongoose.connect(config.getDbConnectionString(), mongoOptions);

// seed the database
setupController(app);

// establish API ENDPOINTs
apiController(app);

// establish QB-related API endpoints
apiQB(app);

// establish TSheets-related API endpoints
apiTSheets(app);

app.get('/', (req,res) => {
  res.sendFile(path.join(__dirname+'/homepage.html'));
});

app.listen(port, function() {
  console.log(`Floki is listening on port ${port}, with axe in hand...`);
});
