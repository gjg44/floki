var express = require('express');
var app  = express();
var mongoose = require('mongoose');
var config = require('./config');
var setupController = require('./controllers/setupController');
var apiController = require('./controllers/apiController');
var apiQB = require('./controllers/apiQB');
var QuickBooks = require('node-quickbooks-oauth2');
var path = require('path');

var port = process.env.PORT || 3000;

// to eliminate node warning 9856
var mongoOptions = {
  useMongoClient: true
};

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

app.get('/', (req,res) => {
  res.sendFile(path.join(__dirname+'/homepage.html'));
});

app.listen(port, function() {
  console.log(`Floki is listening on port ${port}, with axe in hand...`);
});
