var cfgVals = require('./config');

const tsClientID = cfgVals.tsClientID;
const tsClientSecret = cfgVals.tsClientSecret;

const TSheetsApi = require('tsheetsapi');


var tsAuth = {
  client_id: '',
  redirect_uri: '',
  response_type: 'code',
  grant_type: 'authorization_code',
  initState: 'tsInitState',
  userCreds: {
    client: {
      id: '',
      secret: '',
    },
    auth: {
      tokenHost: 'https://rest.tsheets.com',
      tokenPath: '/api/v1/grant',
      authorizePath: '/api/v1/authorize',
      revokePath: '/api/v1/revoke'
    },
    options: {
      useBodyAuth: true,
      useBasicAuthorizationHeader: false
    }
  },
  AuthResponse: {
    access_token: '',
    expires_in: '',
    token_type: '',
    scope: '',
    refresh_token: '',
    user_id: '',
    company_id: '',
    client_url: '',
    expires_at: ''
  }
}


function setTSRedirectURI(port) {
  if (port === 3000) {
    return cfgVals.localhost+cfgVals.port+cfgVals.tsCallback;
  } else {
    return cfgVals.herokuAppLink+cfgVals.tsCallback;
  }
}

module.exports.oa2AppSettings = function() {
  const port = process.env.PORT || 3000;
  tsAuth.redirect_uri = setTSRedirectURI(port);
  if (port === 3000) {
    tsAuth.clientID = cfgVals.tsClientID;
    tsAuth.userCreds.client.id = cfgVals.tsClientID;
    tsAuth.userCreds.client.secret = cfgVals.tsClientSecret;
  } else {
    tsAuth.clientID = cfgVals.tsHerokuClientID;
    tsAuth.userCreds.client.id = cfgVals.tsHerokuClientID;
    tsAuth.userCreds.client.secret = cfgVals.tsHerokuClientSecret;
  }
  return tsAuth;
}

module.exports.tsApi = function(AuthResponse) {
  const tapi = new TSheetsApi({
    bearerToken: AuthResponse.access_token
  });

  return tapi;
}

