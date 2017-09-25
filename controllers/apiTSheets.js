'use strict';
const simpleOauthModule = require('simple-oauth2');

var bodyParser = require('body-parser');

const TSoa2 = require('./../config/tsConfig.js');
const listenPort = process.env.PORT || 3000;
const tsListenPort = listenPort;

// Configure TSheets Authentication Settings
const tsApp = TSoa2.oa2AppSettings('ts',tsListenPort);
const tsCreds = tsApp.userCreds;
const tsOA2 = simpleOauthModule.create(tsCreds);
const tsAppURI = tsOA2.authorizationCode.authorizeURL({
  client_id: tsApp.client_id,
  redirect_uri: tsApp.redirect_uri,
  state: tsApp.initState
});


module.exports = function(app) {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true}));
   
  // go to QB auth page
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

  // Callback service parsing the TSheets authorization token and asking for the access token
  app.get('/TScallback', async (req, res) => {
    console.log('entering TSCallback "endpoint" ');
    try {
      if (req.query.error) {
        throw `TSheets authorization response error: ${req.query.error}`;
      } else if (req.query.state === tsApp.initState) {
        tsApp.AuthResponse = await simpleOauth2ModuleObject.authorizationCode
        .getToken({
          code: req.query.code,
          redirect_uri: tsApp.redirect_uri
        });
        console.log(`Token ${tsApp.AuthResponse.access_token} recieved from TSheets oAuth2 Server.\n  It expires in ${qbApp.qbAuthResponse.expires_in/3600} hour(s)`);
        return res.redirect('/');
      } else {
          throw `error: TSheets returned wrong state. returned initState: ${req.query.error}`;
      }
    } catch (e) {
        console.error('caught error during TSheets callback: ',e);
        return res.json(e);
    }
  console.log('exiting TSCallback "endpooint" ');
  });
}