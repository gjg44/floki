'use strict';

var TSEmployee = require('../models/tsEmployeeModel');

const simpleOauthModule = require('simple-oauth2');
const TSheetsApi = require('tsheetsapi');

var bodyParser = require('body-parser');

const TSoa2 = require('./../config/tsConfig.js');
const listenPort = process.env.PORT || 3000;
const tsListenPort = listenPort;

// Configure TSheets Authentication Settings
const tsApp = TSoa2.oa2AppSettings(tsListenPort);
const tsCreds = tsApp.userCreds;
const tsOA2 = simpleOauthModule.create(tsCreds);
const tsAuthURI = tsOA2.authorizationCode.authorizeURL({
  client_id: tsApp.client_id,
  redirect_uri: tsApp.redirect_uri,
  state: tsApp.initState
});

// create empty object. Will be set to be the TSheets API object that will be passed for calls to the API.
var tapi = {};

//TSheets stuff
const await = require('awaiting');

module.exports = function(app) {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true}));
   
  // go to TSheets auth page
  app.get('/authTS', async (req, res) => {
    console.log('entering /authTS endpoint');
    try {
      res.redirect(tsAuthURI);
      if (res.statusMessage === 'Found') {
        console.log(`Redirecting to TSheets Authentication Server`);
      } else {
        throw `Error communicating with TSheets' oAuth2 Server: ${res.error}`;
      }
    } catch(e) {
      return res.json(e);
    }
    console.log('exiting /authTS endpoint');
  });

  // get list of TSheets users
  app.get('/tsGetUsers', async (req, res) => {
    console.log('entering /tsGetUsers endpoint');
    try {
      let tsUserList = await tapi.users().list();
      console.log('TSheets Users being updated/added to FUCD:');
      tsUserList.data.forEach(function(user) {
        var query = {'id': user.id};
        TSEmployee.findOneAndUpdate(query,user,{upsert:true}, function(err,doc) {
          if(err) throw `findOneAndUpdate error: ${err}`;
          if(doc) {
            console.log(`${user.first_name} ${user.last_name}'s employee record updated with new information.`);
          } else {
            console.log(`${user.first_name} ${user.last_name}'s employee record not found. Adding to database.`);
          }
        });
      });  
    } catch(e) {
      return res.json(e);
    }
    console.log('exiting /tsGetUsers endpoint');
    res.redirect('/');
    });


  // Callback service parsing the TSheets authorization token and asking for the access token
  app.get('/TScallback', async (req, res) => {
    console.log('entering TSCallback "endpoint" ');
    try {
      if (req.query.error) {
        throw `TSheets authorization response error: ${req.query.error}`;
      } else if (req.query.state === tsApp.initState) {
        tsApp.AuthResponse = await tsOA2.authorizationCode
        .getToken({
          code: req.query.code,
          redirect_uri: tsApp.redirect_uri
        });
        console.log(`Token recieved from TSheets oAuth2 Server. Expires in ${tsApp.AuthResponse.expires_in/(24*3600)} days(s)`);
        tapi = new TSheetsApi({
          bearerToken: tsApp.AuthResponse.access_token
        });
      } else {
          throw `error: TSheets returned wrong state. returned initState: ${req.query.error}`;
      }
    } catch (e) {
        console.error('caught error during TSheets callback: ',e);
        return res.json(e);
    }
  console.log('exiting TSCallback "endpooint" ');
  res.redirect('/');
});
}