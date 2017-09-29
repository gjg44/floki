'use strict';


// Database model schema (or schema models?)
var TSEmployee = require('../models/tsEmployeeModel');
var TimeSheet = require('../models/tsTimeSheetModel');

const TSheetsApi = require('tsheetsapi');

var bodyParser = require('body-parser');

// Configure TSheets Authentication Settings
const tsConfig = require('./../config/tsConfig.js');
const tsApp = tsConfig.oa2AppSettings();

// Initialize the OAuth2 Libary
const oauth2 = require('simple-oauth2').create(tsApp.userCreds);

const tsAuthURI = oauth2.authorizationCode.authorizeURL({
  client_id: tsApp.client_id,
  redirect_uri: tsApp.redirect_uri,
  state: tsApp.initState
});

// create empty object. Will be set to be the TSheets API object that will be passed for calls to the API.
var tapi = {};

// Token object expiry, refresh, revoke,etc.  Will be created after valid token is received.
var tsToken = {};

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
      // Read users from TSheets database
      let tsUserPage = await tapi.users().list();
      var tsActiveUserList = tsUserPage.data;
      while (tsUserPage.next) {
        tsUserPage = await tsUserPage.next;
        tsActiveUserList = tsActiveUserList.concat(tsUserPage.data);
      }
      console.log(`${tsActiveUserList.length} active TSheets Users were found.`)

      // Write these users to FUCD
      console.log('Active TSheets Users now being updated/added to FUCD:');
      tsActiveUserList.forEach(function(user) {
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
      console.log(`Total number of active users: ${tsActiveUserList.length}`);  
    } catch(e) {
      return res.json(e);
    }
    console.log('exiting /tsGetUsers endpoint');
    res.redirect('/');
    });

  // get timesheets from TSheets database
  app.get('/tsGetTimeSheets', async (req, res) => {
    console.log('entering /tsGetTimeSheets endpoint');
    try {
      // Read users from TSheets database
      var tsFilters = {
        on_the_clock: 'both',
        start_date: '2017-09-25'
      }
      let tsTimeSheetPage = await tapi.timesheets().list(tsFilters);
      var tsTimeSheetList = tsTimeSheetPage.data;
      while (tsTimeSheetPage.next) {
        tsTimeSheetPage = await tsTimeSheetPage.next;
        tsTimeSheetList = tsTimeSheetList.concat(tsTimeSheetPage.data);
      }
      console.log(`${tsTimeSheetList.length} timesheets collected were found.`)

      // Write these users to FUCD
      console.log('TimeSheets now being updated/added to FUCD:');
      tsTimeSheetList.forEach(function(ts) {
        var query = {'id': ts.id};
        TimeSheet.findOneAndUpdate(query,ts,{upsert:true}, function(err,doc) {
          if(err) throw `findOneAndUpdate error: ${err}`;
          if(doc) {
            console.log(`Updated Existing TimeSheet: Date: ${ts.date}, Start Time: ${ts.start}, End Time: ${ts.end}`);
          } else {
            console.log(`New TimeSheet Added: Date: ${ts.date}, Start Time: ${ts.start}, End Time: ${ts.end}`);
          }
        });
      });
      console.log(`Finished writing timesheet information to FUCD.  Thank Floki!`);
     
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
        const tokenConfig = {
          code: req.query.code,
          redirect_uri: tsApp.redirect_uri
        };
        tsApp.AuthResponse = await oauth2.authorizationCode
        .getToken(tokenConfig);
        tsToken= await oauth2.accessToken.create(tsApp.AuthResponse);
        console.log(tsToken);
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



/*  Tried for a day to get refresh and revoke working.  Have a feeling the http headers and/or options are slightly off in the simple-oauth2 implementation, vs what TS expects.  Next step would be trying to make raw http calls, but giving up for now.
  // Callback service parsing the TSheets authorization token and asking for the access token
  app.get('/tsRevokeToken', async (req, res) => {
    console.log('entering tsRevokeToken "endpoint" ');
    const tsTokenCheck = await oauth2.accessToken.create(tsApp.AuthResponse);
    console.log(tsTokenCheck);
    try {
      if (tsTokenCheck.expired()) {
        console.log('token expired!  Refreshing....');
        tsToken = await tsTokenCheck.refresh(result);
        console.log(tsToken);
      } else {
        console.log('token has not expired, but let us try to refresh anyway...');
        let joeBlow = await tsTokenCheck.refresh();
        tsToken = joeBlow;
        console.log(joeBlow);
      }
    } catch (e) {
        console.error('caught error during TSheets callback: ',e);
        return res.json(e);
    }
  console.log('exiting tsRevokeToken "endpoint" ');
  return res.json(joeBlow);
  //  res.redirect('/');
});
*/


}