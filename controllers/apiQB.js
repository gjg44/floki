'use strict';
var QBEmployee = require('../models/qbEmployeeModel');
const simpleOauthModule = require('simple-oauth2');

var bodyParser = require('body-parser');

const QBoa2 = require('./../config/qbConfig.js');
var QuickBooks = require('node-quickbooks-oauth2');


const listenPort = process.env.PORT || 3000;
const qbListenPort = listenPort;

var qbApp = QBoa2.oa2AppSettings(qbListenPort);
var nodeQBObj = QBoa2.createNodeQBObject(
  qbApp.clientID,
  qbApp.clientSecret,
  qbApp.AuthResponse.access_token,  // starts empty
  qbApp.companyID,
  false,         // debugFlag
  true);        // sandboxFlag

const qbOA2 = simpleOauthModule.create(qbApp.userCreds);

const qbAuthURI = qbOA2.authorizationCode.authorizeURL({
  scope: qbApp.scope,
  redirect_uri: qbApp.redirect_uri,
  state: qbApp.initState
});

module.exports = function(app) {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true}));
   
  // go to QB auth page
  app.get('/authQB', async (req, res) => {
    console.log('entering /authQB endpoint');
    try {
      res.redirect(qbAuthURI);
      if (res.statusMessage === 'Found') {
        console.log(`Redirecting to QBO Auth Page`);
      } else {
        throw `Error communicating with Intuit's oAuth2 Server: ${res.error}`;
      }
    } catch(e) {
      return res.json(e);
    }
    console.log('exiting /authQB endpoint');
  });

  // test account access
  app.get('/testChartofAccountsAccess', async (req,res) => {
    console.log('entering /testChartofAccountsAccess endpoint');
    try {
      var qbo = new QuickBooks(nodeQBObj);
      await qbo.findAccounts(function(_, accounts) {
        res.json(accounts.QueryResponse);
      });
    } catch (e) {
      return res.json(e);
    }
    console.log('exiting /testChartofAccountsAccess endpoint');
  });

  // Get employees from QBO company file and write/update FUCD
  app.get('/writeEmployeesToDatabase', async (req,res) => {
    console.log('entering /writeEmployeesToDatabase endpoint');
    try {
      var qbo = new QuickBooks(nodeQBObj);
      await qbo.findEmployees(function(_, employees) {
        employees.QueryResponse.Employee.forEach(function(employee) {
          var query = {'DisplayName': employee.DisplayName};
          QBEmployee.findOneAndUpdate(query,employee,{upsert:true}, function(err,doc) {
            if(err) throw `findOneAndUpdate error: ${err}`;
            if(doc) {
              console.log(`${employee.DisplayName}'s employee record updated with new information.`);
            } else {
              console.log(`${employee.DisplayName}'s employee record not found. Adding to database.`);
            }
          });      
        });
      return res.redirect('/');
      });
    } catch (e) {
      return res.json(e);
    }
    console.log('exiting /writeEmployeesToDatabase endpoint');
  });

  // Callback service parsing the QB authorization token and asking for the access token
  app.get('/QBcallback', async (req, res) => {
    try {
      if (req.query.error) {
        throw `authorization response error: ${req.query.error}`;
      } else if (req.query.state === qbApp.initState) {
        qbApp.AuthResponse = await qbOA2.authorizationCode
        .getToken({
          code: req.query.code,
          redirect_uri: qbApp.redirect_uri
        });
        nodeQBObj.oauth2AccessToken = qbApp.AuthResponse.access_token;
        console.log(`Token recieved from QBO/Intuit OAuth2 Server.  It expires in ${qbApp.AuthResponse.expires_in/3600} hour(s)`);
        return res.redirect('/');
      } else {
          throw `error: QB/Intuit returned wrong returned state. returned initState: ${req.query.error}`;
      }
    } catch (e) {
        console.error('caught error: ',e);
        return res.json(e);
    }
  });
}