var express = require('express');
var app  = express();
var mongoose = require('mongoose');
var config = require('./config');
var setupController = require('./controllers/setupController');
var apiController = require('./controllers/apiController');

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

app.listen(port, function() {
  console.log(`Server listening on port: ${port}`);
});
