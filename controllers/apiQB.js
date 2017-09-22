'use strict';

const simpleOauthModule = require('simple-oauth2');

var bodyParser = require('body-parser');

const oa2 = require('./../config/qbConfig.js');
var QuickBooks = require('node-quickbooks-oauth2');

// Configure QB OAuth2 settings
const qbAuth = oa2.oa2ServerSettings();

const listenPort = process.env.PORT || 3000;
const qbListenPort = listenPort;

var qbApp = oa2.oa2AppSettings(qbListenPort);
//const qbCreds = qbApp.userCreds;
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
  app.get('/authQB', (req, res) => {
    console.log('entering /authQB endpoint');
    res.redirect(qbAuthURI);
    if (res.statusMessage === 'Found') {
      console.log(`Redirecting to QBO Auth Page: ${qbAuthURI}`);
    } else {
      console.log(res.error);
    }

    console.log('existing /authQB endpoint');
  });

  // go to QB auth page
  app.get('/populateQB', (req, res) => {
    console.log('entering /populateQB endpoint');
    console.log(qbApp);
    var qbo = new QuickBooks(
      qbApp.clientID,
      qbApp.clientSecret,
      qbApp.qbAuthResponse.access_token,
      qbApp.qbAuthResponse.refresh_token,
      qbApp.qbAuthResponse.access_token,
      qbApp.companyID,
      true,
      true
    );
/*
function QuickBooks(consumerKey, consumerSecret, token, tokenSecret, oauth2AccessToken, realmId, useSandbox, debug) {
  var prefix           = _.isObject(consumerKey) ? 'consumerKey.' : ''
  this.consumerKey     = eval(prefix + 'consumerKey')
  this.consumerSecret  = eval(prefix + 'consumerSecret')
  this.token           = eval(prefix + 'token')
  this.tokenSecret     = eval(prefix + 'tokenSecret')
  this.realmId         = eval(prefix + 'realmId')
  this.useSandbox      = eval(prefix + 'useSandbox')
  this.debug           = eval(prefix + 'debug')
  this.oauth2AccessToken = eval(prefix + 'oauth2AccessToken')
  this.endpoint        = this.useSandbox ? QuickBooks.V3_ENDPOINT_BASE_URL : QuickBooks.V3_ENDPOINT_BASE_URL.replace('sandbox-', '')
}


*/

    console.log('existing /authQB endpoint');
  });

  // Callback service parsing the QB authorization token and asking for the access token
  app.get('/QBcallback', async (req, res) => {
    try {
      if (req.query.error) {
        throw `authorization response error: ${req.query.error}`;
      } else if (req.query.state === qbApp.initState) {
        qbApp.qbAuthResponse = await qbOA2.authorizationCode
        .getToken({
          code: req.query.code,
          redirect_uri: qbApp.redirect_uri
        });
        console.log(`Token recieved from QBO/Intuit OAuth2 Server.  It expires in ${qbApp.qbAuthResponse.expires_in/3600} hour(s)`);
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